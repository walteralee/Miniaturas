// backend/src/repositorios/miniaturas.repositorio.js

import { leerJSON, guardarJSON } from "../utilidades/json.utilidades.js";

import { obtenerRutaJSON } from "../utilidades/rutas.utilidades.js";

const RUTA_JSON = obtenerRutaJSON();

export function obtenerMiniaturasRepositorio() {
  const datos = leerJSON(RUTA_JSON);

  return datos.miniaturas;
}

export function obtenerMiniaturaPorIdRepositorio(id) {
  const datos = leerJSON(RUTA_JSON);

  return datos.miniaturas.find(
    (miniatura) => String(miniatura.id) === String(id),
  );
}

export function guardarMiniaturasRepositorio(miniaturas) {
  const datos = leerJSON(RUTA_JSON);

  datos.miniaturas = miniaturas;

  guardarJSON(RUTA_JSON, datos);
}

export function crearMiniaturaRepositorio(miniaturaNueva) {
  const datos = leerJSON(RUTA_JSON);

  datos.miniaturas.push(miniaturaNueva);

  guardarJSON(RUTA_JSON, datos);

  return miniaturaNueva;
}

export function moverMiniaturaCategoriaRepositorio(id, categoriaId) {
  const datos = leerJSON(RUTA_JSON);

  const miniatura = datos.miniaturas.find(
    (miniatura) => String(miniatura.id) === String(id),
  );

  if (!miniatura) {
    return null;
  }

  miniatura.categoriaId = Number(categoriaId);

  guardarJSON(RUTA_JSON, datos);

  return miniatura;
}
