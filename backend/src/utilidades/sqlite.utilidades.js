import fs from "fs";

import Database from "better-sqlite3";

import { RUTAS } from "./rutas.utilidades.js";

import {
  prepararAlmacenamiento,
  cargarDatosDemo,
} from "./almacenamiento.utilidades.js";

import { ID_SIN_CATEGORIA } from "../constantes/categorias.constantes.js";

let conexion = null;

function crearEsquema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS miniaturas (
      id INTEGER PRIMARY KEY,
      url TEXT NOT NULL,
      miniatura TEXT NOT NULL,
      categoriaId INTEGER NOT NULL,
      FOREIGN KEY (categoriaId)
        REFERENCES categorias(id)
    );

    CREATE INDEX IF NOT EXISTS idx_miniaturas_categoria
      ON miniaturas (categoriaId);
  `);

  db.prepare(
    `
    INSERT OR IGNORE INTO categorias (id, nombre)
    VALUES (?, 'Sin categoría')
  `,
  ).run(ID_SIN_CATEGORIA);
}

// Conexión única compartida por todos los repositorios
export function abrirConexion() {
  if (conexion) {
    return conexion;
  }

  prepararAlmacenamiento();

  const esPrimeraVez = !fs.existsSync(RUTAS.baseDatos);

  conexion = new Database(RUTAS.baseDatos);

  conexion.pragma("foreign_keys = ON");

  // El script de scraping puede escribir a la vez que el servidor
  conexion.pragma("busy_timeout = 5000");

  crearEsquema(conexion);

  if (esPrimeraVez) {
    cargarDatosDemo(conexion);
  }

  return conexion;
}

export function cerrarConexion() {
  conexion?.close();

  conexion = null;
}
