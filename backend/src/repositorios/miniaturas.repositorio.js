// backend/src/repositorios/miniaturas.repositorio.js

import { leerJSON, guardarJSON } from "../utilidades/json.utilidades.js";

import { obtenerRutaJSON } from "../utilidades/rutas.utilidades.js";

const RUTA_JSON = obtenerRutaJSON();

export function obtenerMiniaturasRepositorio() {
  return leerJSON(RUTA_JSON);
}

export function guardarMiniaturasRepositorio(miniaturas) {
  guardarJSON(RUTA_JSON, miniaturas);
}

export function crearMiniaturaRepositorio(miniaturaNueva) {
  const miniaturas = leerJSON(RUTA_JSON);

  miniaturas.push(miniaturaNueva);

  guardarJSON(RUTA_JSON, miniaturas);

  return miniaturaNueva;
}
