import Database from "better-sqlite3";

import { obtenerRutaDB } from "./rutas.utilidades.js";

export function abrirConexion() {
  return new Database(obtenerRutaDB());
}
