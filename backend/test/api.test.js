// Tests de la API REST con el runner nativo de Node (node --test).
// Cada ejecución usa una carpeta de datos temporal con el contenido de ejemplo
// y no necesita conexión a internet.

import { describe, test, before, after } from "node:test";

import assert from "node:assert/strict";

import { once } from "node:events";

import fs from "node:fs";

import os from "node:os";

import path from "node:path";

const CARPETA_DATOS = fs.mkdtempSync(path.join(os.tmpdir(), "miniaturas-test-"));

process.env.ALMACENAMIENTO_DIR = CARPETA_DATOS;

// Sin Python disponible, la descarga automática falla de forma controlada
process.env.PYTHON = "python-no-disponible-en-tests";

// Se importan después de configurar el entorno, porque lo leen al cargarse
const { default: app } = await import("../src/app.js");

const { cerrarConexion } = await import("../src/utilidades/sqlite.utilidades.js");

const { RUTAS } = await import("../src/utilidades/rutas.utilidades.js");

const IMAGEN_PNG = fs.readFileSync(path.join(RUTAS.recursos, "default.png"));

const IMAGEN_JPG = fs.readFileSync(path.join(RUTAS.recursos, "demo", "4.jpg"));

let servidor;

let base;

before(async () => {
  servidor = app.listen(0, "127.0.0.1");

  await once(servidor, "listening");

  base = `http://127.0.0.1:${servidor.address().port}`;
});

after(() => {
  servidor.close();

  cerrarConexion();

  fs.rmSync(CARPETA_DATOS, { recursive: true, force: true });
});

// ================================================
// AYUDAS
// ================================================

async function peticion(metodo, ruta, cuerpo) {
  const opciones = { method: metodo };

  if (cuerpo instanceof FormData) {
    opciones.body = cuerpo;
  } else if (cuerpo !== undefined) {
    opciones.body = typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo);

    opciones.headers = { "Content-Type": "application/json" };
  }

  const respuesta = await fetch(base + ruta, opciones);

  const texto = await respuesta.text();

  return {
    estado: respuesta.status,
    datos: texto ? JSON.parse(texto) : null,
  };
}

function formulario({ url, categoriaId, imagen, tipo = "image/png", nombre = "imagen.png" }) {
  const datos = new FormData();

  if (url !== undefined) {
    datos.append("url", url);
  }

  if (categoriaId !== undefined) {
    datos.append("categoriaId", String(categoriaId));
  }

  if (imagen) {
    datos.append("miniatura", new Blob([imagen], { type: tipo }), nombre);
  }

  return datos;
}

function existeImagen(rutaPublica) {
  return fs.existsSync(path.join(RUTAS.miniaturas, path.basename(rutaPublica)));
}

async function crearMiniaturaConImagen(categoriaId = 0) {
  const { estado, datos } = await peticion(
    "POST",
    "/api/miniaturas",
    formulario({ url: "https://example.com", categoriaId, imagen: IMAGEN_PNG }),
  );

  assert.equal(estado, 201);

  return datos;
}

// ================================================
// MINIATURAS
// ================================================

describe("Miniaturas", () => {
  test("GET lista el contenido de ejemplo de la primera ejecución", async () => {
    const { estado, datos } = await peticion("GET", "/api/miniaturas");

    assert.equal(estado, 200);

    assert.equal(datos.length, 7);

    assert.deepEqual(Object.keys(datos[0]).sort(), ["categoriaId", "id", "miniatura", "url"]);
  });

  test("POST con imagen la guarda como <id>.<extensión> y la sirve", async () => {
    const miniatura = await crearMiniaturaConImagen(1);

    assert.equal(miniatura.url, "https://example.com");

    assert.equal(miniatura.categoriaId, 1);

    assert.equal(miniatura.miniatura, `/miniaturas/${miniatura.id}.png`);

    assert.ok(existeImagen(miniatura.miniatura));

    const imagen = await fetch(base + miniatura.miniatura);

    assert.equal(imagen.status, 200);
  });

  test("POST sin imagen usa la imagen por defecto si no se puede descargar", async (t) => {
    // El fallo de la descarga se registra en consola; aquí no interesa verlo
    t.mock.method(console, "error", () => {});

    const { estado, datos } = await peticion(
      "POST",
      "/api/miniaturas",
      formulario({ url: "https://example.org/articulo" }),
    );

    assert.equal(estado, 201);

    assert.equal(datos.miniatura, "/miniaturas/default.png");

    assert.equal(datos.categoriaId, 0);
  });

  test("POST rechaza URLs vacías, mal formadas o que no son http/https", async () => {
    for (const url of ["", "esto no es una url", "ftp://example.com/archivo"]) {
      const { estado, datos } = await peticion(
        "POST",
        "/api/miniaturas",
        formulario({ url, imagen: IMAGEN_PNG }),
      );

      assert.equal(estado, 400, `URL "${url}"`);

      assert.equal(datos.error, true);
    }
  });

  test("POST rechaza una categoría que no existe", async () => {
    const { estado, datos } = await peticion(
      "POST",
      "/api/miniaturas",
      formulario({ url: "https://example.com", categoriaId: 999, imagen: IMAGEN_PNG }),
    );

    assert.equal(estado, 400);

    assert.equal(datos.mensaje, "Categoría no encontrada");
  });

  test("POST rechaza archivos que no son imágenes admitidas (como SVG)", async () => {
    const { estado, datos } = await peticion(
      "POST",
      "/api/miniaturas",
      formulario({
        url: "https://example.com",
        imagen: Buffer.from("<svg></svg>"),
        tipo: "image/svg+xml",
        nombre: "imagen.svg",
      }),
    );

    assert.equal(estado, 400);

    assert.match(datos.mensaje, /Formato de imagen no soportado/);
  });

  test("POST rechaza imágenes de más de 10 MB", async () => {
    const { estado, datos } = await peticion(
      "POST",
      "/api/miniaturas",
      formulario({ url: "https://example.com", imagen: Buffer.alloc(10 * 1024 * 1024 + 1) }),
    );

    assert.equal(estado, 400);

    assert.match(datos.mensaje, /10 MB/);
  });

  test("PUT con otra imagen sustituye el archivo anterior", async () => {
    const miniatura = await crearMiniaturaConImagen();

    const { estado, datos } = await peticion(
      "PUT",
      `/api/miniaturas/${miniatura.id}`,
      formulario({
        url: "https://example.com/nueva",
        imagen: IMAGEN_JPG,
        tipo: "image/jpeg",
        nombre: "imagen.jpg",
      }),
    );

    assert.equal(estado, 200);

    assert.equal(datos.url, "https://example.com/nueva");

    assert.equal(datos.miniatura, `/miniaturas/${miniatura.id}.jpg`);

    assert.ok(existeImagen(datos.miniatura));

    assert.ok(!existeImagen(miniatura.miniatura), "la imagen .png anterior debe borrarse");
  });

  test("PUT sobre una miniatura que no existe devuelve 404", async () => {
    const { estado, datos } = await peticion(
      "PUT",
      "/api/miniaturas/99999",
      formulario({ url: "https://example.com" }),
    );

    assert.equal(estado, 404);

    assert.equal(datos.mensaje, "Miniatura no encontrada");
  });

  test("PUT /categoria mueve la miniatura a otra categoría", async () => {
    const miniatura = await crearMiniaturaConImagen(0);

    const { estado, datos } = await peticion(
      "PUT",
      `/api/miniaturas/${miniatura.id}/categoria`,
      { categoriaId: 2 },
    );

    assert.equal(estado, 200);

    assert.equal(datos.categoriaId, 2);
  });

  test("DELETE borra la miniatura y su imagen", async () => {
    const miniatura = await crearMiniaturaConImagen();

    const { estado } = await peticion("DELETE", `/api/miniaturas/${miniatura.id}`);

    assert.equal(estado, 204);

    assert.ok(!existeImagen(miniatura.miniatura));

    const { datos: lista } = await peticion("GET", "/api/miniaturas");

    assert.ok(!lista.some((actual) => actual.id === miniatura.id));
  });

  test("DELETE nunca borra la imagen por defecto compartida", async (t) => {
    t.mock.method(console, "error", () => {});

    const { datos: miniatura } = await peticion(
      "POST",
      "/api/miniaturas",
      formulario({ url: "https://example.org" }),
    );

    assert.equal(miniatura.miniatura, "/miniaturas/default.png");

    const { estado } = await peticion("DELETE", `/api/miniaturas/${miniatura.id}`);

    assert.equal(estado, 204);

    assert.ok(existeImagen("/miniaturas/default.png"));
  });

  test("DELETE con un id no numérico devuelve 400", async () => {
    const { estado } = await peticion("DELETE", "/api/miniaturas/abc");

    assert.equal(estado, 400);
  });
});

// ================================================
// CATEGORÍAS
// ================================================

describe("Categorías", () => {
  test("GET incluye siempre 'Sin categoría' y las de ejemplo", async () => {
    const { estado, datos } = await peticion("GET", "/api/categorias");

    assert.equal(estado, 200);

    assert.deepEqual(
      datos.map((categoria) => categoria.nombre),
      ["Sin categoría", "Cursos de software", "Música"],
    );
  });

  test("POST crea una categoría limpiando los espacios", async () => {
    const { estado, datos } = await peticion("POST", "/api/categorias", {
      nombre: "  Documentales  ",
    });

    assert.equal(estado, 201);

    assert.equal(datos.nombre, "Documentales");

    assert.equal(typeof datos.id, "number");
  });

  test("POST rechaza nombres repetidos sin distinguir mayúsculas", async () => {
    const { estado, datos } = await peticion("POST", "/api/categorias", { nombre: "MÚSICA" });

    assert.equal(estado, 400);

    assert.equal(datos.mensaje, "Ya existe una categoría con ese nombre");
  });

  test("POST rechaza nombres vacíos o de más de 40 caracteres", async () => {
    for (const nombre of ["   ", "x".repeat(41)]) {
      const { estado } = await peticion("POST", "/api/categorias", { nombre });

      assert.equal(estado, 400);
    }
  });

  test("PUT renombra una categoría", async () => {
    const { datos: categoria } = await peticion("POST", "/api/categorias", { nombre: "Podcasts" });

    const { estado, datos } = await peticion("PUT", `/api/categorias/${categoria.id}`, {
      nombre: "Pódcasts",
    });

    assert.equal(estado, 200);

    assert.equal(datos.nombre, "Pódcasts");
  });

  test("'Sin categoría' no se puede renombrar ni eliminar", async () => {
    const renombrar = await peticion("PUT", "/api/categorias/0", { nombre: "Otra" });

    const eliminar = await peticion("DELETE", "/api/categorias/0");

    assert.equal(renombrar.estado, 400);

    assert.equal(eliminar.estado, 400);
  });

  test("DELETE pasa sus miniaturas a 'Sin categoría'", async () => {
    const { datos: categoria } = await peticion("POST", "/api/categorias", { nombre: "Temporal" });

    const miniatura = await crearMiniaturaConImagen(categoria.id);

    const { estado } = await peticion("DELETE", `/api/categorias/${categoria.id}`);

    assert.equal(estado, 204);

    const { datos: lista } = await peticion("GET", "/api/miniaturas");

    assert.equal(lista.find((actual) => actual.id === miniatura.id).categoriaId, 0);
  });

  test("DELETE de una categoría que no existe devuelve 404", async () => {
    const { estado } = await peticion("DELETE", "/api/categorias/99999");

    assert.equal(estado, 404);
  });
});

// ================================================
// ERRORES GENERALES
// ================================================

describe("Errores", () => {
  test("Una ruta inexistente devuelve 404 en JSON", async () => {
    const { estado, datos } = await peticion("GET", "/api/no-existe");

    assert.equal(estado, 404);

    assert.deepEqual(datos, { error: true, mensaje: "Ruta no encontrada" });
  });

  test("Un JSON mal formado devuelve 400 con un mensaje claro", async () => {
    const { estado, datos } = await peticion("POST", "/api/categorias", "{nombre");

    assert.equal(estado, 400);

    assert.equal(datos.mensaje, "El cuerpo de la petición no es un JSON válido");
  });
});
