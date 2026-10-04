"""
Descarga las miniaturas a partir de la imagen de vista previa (og:image)
de cada enlace guardado.

Uso:
    python scripts/scraping.py          Revisa todas y descarga las que faltan
    python scripts/scraping.py --id 5   Fuerza la descarga de una (lo usa el backend)
"""

import argparse
import os
import sqlite3
import sys

from urllib.parse import urljoin, urlparse

import requests

from bs4 import BeautifulSoup

# =========================================================
# CONFIGURACION
# =========================================================

RAIZ = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

# ALMACENAMIENTO_DIR permite apuntar a otra carpeta de datos (igual que el backend)
ALMACENAMIENTO = (
    os.environ.get("ALMACENAMIENTO_DIR")
    or os.path.join(RAIZ, "almacenamiento")
)

DB_FILE = os.path.join(ALMACENAMIENTO, "datos", "miniaturas.db")

MINIATURAS_DIR = os.path.join(ALMACENAMIENTO, "miniaturas")

MINIATURA_POR_DEFECTO = "/miniaturas/default.png"

TIMEOUT = 20

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/138.0 Safari/537.36"
    )
}

EXTENSIONES_POR_TIPO = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
}

EXTENSIONES = ["jpg", "jpeg", "png", "webp", "avif", "gif"]

# Estas webs no ofrecen imagen de vista previa sin iniciar sesion
DOMINIOS_IGNORADOS = ["x.com", "twitter.com"]

# =========================================================
# UTILIDADES
# =========================================================

def es_dominio_ignorado(url):

    host = (urlparse(url).hostname or "").lower()

    return any(
        host == dominio or host.endswith("." + dominio)
        for dominio in DOMINIOS_IGNORADOS
    )


def existe_imagen(ruta_publica):

    if not ruta_publica or ruta_publica == MINIATURA_POR_DEFECTO:

        return False

    return os.path.exists(
        os.path.join(MINIATURAS_DIR, os.path.basename(ruta_publica))
    )


def buscar_imagen_por_id(id_miniatura):

    for archivo in os.listdir(MINIATURAS_DIR):

        nombre, _ = os.path.splitext(archivo)

        if nombre == str(id_miniatura):

            return archivo

    return None


def eliminar_imagenes_de_id(id_miniatura):

    for archivo in os.listdir(MINIATURAS_DIR):

        nombre, _ = os.path.splitext(archivo)

        if nombre == str(id_miniatura):

            os.remove(os.path.join(MINIATURAS_DIR, archivo))

# =========================================================
# SCRAPING
# =========================================================

def obtener_url_miniatura(url):

    response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    etiqueta = (
        soup.find("meta", property="og:image")
        or soup.find("meta", attrs={"name": "twitter:image"})
    )

    if not etiqueta or not etiqueta.get("content"):

        return None

    # Algunas webs usan rutas relativas
    return urljoin(response.url, etiqueta["content"].strip())


def obtener_extension(url_imagen, tipo_contenido):

    tipo = (tipo_contenido or "").split(";")[0].strip().lower()

    if tipo in EXTENSIONES_POR_TIPO:

        return EXTENSIONES_POR_TIPO[tipo]

    ruta = urlparse(url_imagen).path.lower()

    for extension in EXTENSIONES:

        if ruta.endswith("." + extension):

            return "jpg" if extension == "jpeg" else extension

    return "jpg"


def descargar_imagen(id_miniatura, url_imagen):

    response = requests.get(
        url_imagen,
        headers=HEADERS,
        timeout=TIMEOUT,
        stream=True
    )

    response.raise_for_status()

    tipo_contenido = response.headers.get("Content-Type", "")

    if tipo_contenido and not tipo_contenido.startswith("image/"):

        raise ValueError(f"no es una imagen ({tipo_contenido})")

    extension = obtener_extension(url_imagen, tipo_contenido)

    eliminar_imagenes_de_id(id_miniatura)

    nombre = f"{id_miniatura}.{extension}"

    with open(os.path.join(MINIATURAS_DIR, nombre), "wb") as archivo:

        for bloque in response.iter_content(8192):

            archivo.write(bloque)

    return f"/miniaturas/{nombre}"

# =========================================================
# PROCESAR UNA MINIATURA
# =========================================================

def procesar(miniatura, forzar):
    """Devuelve la nueva ruta de la imagen, o None si no cambia."""

    id_miniatura = miniatura["id"]

    ruta_actual = miniatura["miniatura"]

    if not forzar:

        if existe_imagen(ruta_actual):

            print(f"[{id_miniatura}] YA EXISTE")

            return None

        archivo = buscar_imagen_por_id(id_miniatura)

        if archivo:

            print(f"[{id_miniatura}] RUTA CORREGIDA -> {archivo}")

            return f"/miniaturas/{archivo}"

    if es_dominio_ignorado(miniatura["url"]):

        print(f"[{id_miniatura}] IGNORADA (sin vista previa publica)")

        return MINIATURA_POR_DEFECTO

    print(f"[{id_miniatura}] DESCARGANDO...")

    url_imagen = obtener_url_miniatura(miniatura["url"])

    if not url_imagen:

        raise ValueError("la pagina no tiene imagen de vista previa")

    ruta = descargar_imagen(id_miniatura, url_imagen)

    print(f"[{id_miniatura}] OK")

    return ruta

# =========================================================
# PRINCIPAL
# =========================================================

def main():

    # La consola de Windows no siempre usa UTF-8
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    parser = argparse.ArgumentParser(description="Descarga miniaturas")

    parser.add_argument("--id", type=int, help="descargar solo esta miniatura")

    argumentos = parser.parse_args()

    if not os.path.exists(DB_FILE):

        print("Primera ejecucion: la base de datos se creara al iniciar el backend.")

        return 0

    os.makedirs(MINIATURAS_DIR, exist_ok=True)

    conexion = sqlite3.connect(DB_FILE, timeout=10)

    conexion.row_factory = sqlite3.Row

    errores = []

    try:

        if argumentos.id is not None:

            filas = conexion.execute(
                "SELECT id, url, miniatura FROM miniaturas WHERE id = ?",
                (argumentos.id,)
            ).fetchall()

        else:

            filas = conexion.execute(
                "SELECT id, url, miniatura FROM miniaturas ORDER BY id"
            ).fetchall()

        for fila in filas:

            miniatura = dict(fila)

            try:

                nueva_ruta = procesar(miniatura, argumentos.id is not None)

            except Exception as error:

                print(f"[{miniatura['id']}] ERROR: {error}")

                errores.append(miniatura["id"])

                nueva_ruta = (
                    None if existe_imagen(miniatura["miniatura"])
                    else MINIATURA_POR_DEFECTO
                )

            # Solo se escribe lo que cambia
            if nueva_ruta and nueva_ruta != miniatura["miniatura"]:

                conexion.execute(
                    "UPDATE miniaturas SET miniatura = ? WHERE id = ?",
                    (nueva_ruta, miniatura["id"])
                )

                conexion.commit()

    finally:

        conexion.close()

    # =====================================================
    # RESUMEN
    # =====================================================

    print("\n===================================")
    print("FINALIZADO")
    print("===================================")

    if errores:

        print("\nERRORES (se usa la imagen por defecto):\n")

        for error in errores:

            print(f"- {error}")

        return 1

    print("\nSIN ERRORES")

    return 0


if __name__ == "__main__":

    sys.exit(main())
