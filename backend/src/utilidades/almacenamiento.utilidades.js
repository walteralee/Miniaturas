import fs from "fs";

import path from "path";

import { RUTAS } from "./rutas.utilidades.js";

import { CATEGORIAS_DEMO, MINIATURAS_DEMO } from "../datos/demo.datos.js";

// Crea las carpetas de datos y repone la imagen por defecto si falta
export function prepararAlmacenamiento() {
  fs.mkdirSync(path.dirname(RUTAS.baseDatos), { recursive: true });

  fs.mkdirSync(RUTAS.miniaturas, { recursive: true });

  const imagenPorDefecto = path.join(RUTAS.miniaturas, "default.png");

  if (!fs.existsSync(imagenPorDefecto)) {
    fs.copyFileSync(path.join(RUTAS.recursos, "default.png"), imagenPorDefecto);
  }
}

// Rellena una base de datos recién creada con el contenido de ejemplo
export function cargarDatosDemo(db) {
  const insertarCategoria = db.prepare(
    "INSERT INTO categorias (id, nombre) VALUES (?, ?)",
  );

  const insertarMiniatura = db.prepare(
    "INSERT INTO miniaturas (id, url, miniatura, categoriaId) VALUES (?, ?, ?, ?)",
  );

  db.transaction(() => {
    for (const categoria of CATEGORIAS_DEMO) {
      insertarCategoria.run(categoria.id, categoria.nombre);
    }

    for (const miniatura of MINIATURAS_DEMO) {
      fs.copyFileSync(
        path.join(RUTAS.recursos, "demo", miniatura.imagen),
        path.join(RUTAS.miniaturas, miniatura.imagen),
      );

      insertarMiniatura.run(
        miniatura.id,
        miniatura.url,
        `/miniaturas/${miniatura.imagen}`,
        miniatura.categoriaId,
      );
    }
  })();
}
