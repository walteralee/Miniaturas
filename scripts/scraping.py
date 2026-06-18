import os
import json
import requests

from bs4 import BeautifulSoup
from urllib.parse import urlparse

# =========================================================
# CONFIGURACION
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

JSON_FILE = os.path.join(
    BASE_DIR,
    "..",
    "almacenamiento",
    "datos",
    "miniaturas.json"
)

MINIATURAS_DIR = os.path.join(
    BASE_DIR,
    "..",
    "almacenamiento",
    "miniaturas"
)

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

EXTENSIONES = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "gif"
]

# =========================================================
# OBTENER HTML
# =========================================================

def obtener_html(url):

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=TIMEOUT
    )

    response.raise_for_status()

    return response.text

# =========================================================
# OBTENER MINIATURA
# =========================================================

def obtener_miniatura(html):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    meta = soup.find(
        "meta",
        property="og:image"
    )

    if not meta:
        return None

    return meta.get("content")

# =========================================================
# OBTENER EXTENSION
# =========================================================

def obtener_extension(url):

    parsed = urlparse(url)

    path = parsed.path.lower()

    for ext in EXTENSIONES:

        if path.endswith(ext):

            return ext

    return "jpg"

# =========================================================
# DESCARGAR IMAGEN
# =========================================================

def descargar_imagen(url, destino):

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=TIMEOUT,
        stream=True
    )

    response.raise_for_status()

    with open(destino, "wb") as archivo:

        for chunk in response.iter_content(8192):

            archivo.write(chunk)

# =========================================================
# EXISTE MINIATURA
# =========================================================

def existe_miniatura(id_miniatura):

    for archivo in os.listdir(MINIATURAS_DIR):

        nombre, _ = os.path.splitext(archivo)

        if nombre == id_miniatura:

            return True

    return False

# =========================================================
# CREAR CARPETA
# =========================================================

if not os.path.exists(MINIATURAS_DIR):

    os.makedirs(MINIATURAS_DIR)

# =========================================================
# CARGAR JSON
# =========================================================

if not os.path.exists(JSON_FILE):

    print(f"No existe: {JSON_FILE}")

    exit()

try:

    with open(JSON_FILE, "r", encoding="utf-8") as archivo:

        datos = json.load(archivo)

except Exception as e:

    print(f"ERROR JSON: {e}")

    exit()

# =========================================================
# VALIDAR JSON
# =========================================================

if not isinstance(datos, dict):

    print("JSON INVALIDO")

    exit()

if "miniaturas" not in datos:

    print("JSON INVALIDO")

    exit()

miniaturas = datos["miniaturas"]

if not isinstance(miniaturas, list):

    print("JSON INVALIDO")

    exit()

# =========================================================
# DESCARGAR MINIATURAS
# =========================================================

errores = []

ids_usados = set()

for miniatura in miniaturas:

    try:

        # =================================================
        # VALIDAR
        # =================================================

        if not isinstance(miniatura, dict):

            continue

        if "id" not in miniatura:

            continue

        if "url" not in miniatura:

            continue

        id_miniatura = str(
            miniatura["id"]
        ).strip()

        url = str(
            miniatura["url"]
        ).strip()

        if id_miniatura == "":

            continue

        # =================================================
        # ID DUPLICADA
        # =================================================

        if id_miniatura in ids_usados:

            print(f"[{id_miniatura}] ID DUPLICADA")

            continue

        ids_usados.add(id_miniatura)

        # =================================================
        # IGNORAR X/TWITTER
        # =================================================

        if (
            "x.com/" in url
            or
            "twitter.com/" in url
        ):

            continue

        # =================================================
        # YA EXISTE
        # =================================================

        if existe_miniatura(id_miniatura):

            print(f"[{id_miniatura}] YA EXISTE")

            continue

        # =================================================
        # DESCARGAR HTML
        # =================================================

        print(f"[{id_miniatura}] DESCARGANDO...")

        html = obtener_html(url)

        # =================================================
        # EXTRAER MINIATURA
        # =================================================

        url_miniatura = obtener_miniatura(html)

        if not url_miniatura:

            print(f"[{id_miniatura}] SIN MINIATURA")

            errores.append(id_miniatura)

            continue

        # =================================================
        # EXTENSION
        # =================================================

        extension = obtener_extension(
            url_miniatura
        )

        # =================================================
        # DESTINO
        # =================================================

        destino = os.path.join(
            MINIATURAS_DIR,
            f"{id_miniatura}.{extension}"
        )

        # =================================================
        # DESCARGAR
        # =================================================

        descargar_imagen(
            url_miniatura,
            destino
        )

        miniatura["miniatura"] = (
            f"/miniaturas/{id_miniatura}.{extension}"
        )

        print(f"[{id_miniatura}] OK")

    except Exception as e:

        print(f"[{id_miniatura}] ERROR: {e}")

        errores.append(id_miniatura)

# =========================================================
# GUARDAR JSON ACTUALIZADO
# =========================================================

try:

    with open(
        JSON_FILE,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            datos,
            archivo,
            ensure_ascii=False,
            indent=2
        )

except Exception as e:

    print(f"ERROR GUARDANDO JSON: {e}")

# =========================================================
# RESUMEN
# =========================================================

print("\n===================================")
print("FINALIZADO")
print("===================================")

if errores:

    print("\nERRORES:\n")

    for error in errores:

        print(f"- {error}")

else:

    print("\nSIN ERRORES")