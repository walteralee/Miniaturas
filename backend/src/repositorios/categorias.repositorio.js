// backend/src/repositorios/categorias.repositorio.js

import { leerJSON, guardarJSON } from "../utilidades/json.utilidades.js";

import { obtenerRutaJSON } from "../utilidades/rutas.utilidades.js";

const RUTA_JSON = obtenerRutaJSON();

export function obtenerCategoriasRepositorio() {
  const datos = leerJSON(RUTA_JSON);

  return datos.categorias;
}

export function obtenerCategoriaPorIdRepositorio(id) {
  const datos = leerJSON(RUTA_JSON);

  return datos.categorias.find(
    (categoria) => String(categoria.id) === String(id),
  );
}

export function crearCategoriaRepositorio(categoriaNueva) {
  const datos = leerJSON(RUTA_JSON);

  datos.categorias.push(categoriaNueva);

  guardarJSON(RUTA_JSON, datos);

  return categoriaNueva;
}

export function renombrarCategoriaRepositorio(id, nombre) {
  const datos = leerJSON(RUTA_JSON);

  const categoria = datos.categorias.find(
    (categoria) => String(categoria.id) === String(id),
  );

  if (!categoria) {
    return null;
  }

  categoria.nombre = nombre;

  guardarJSON(RUTA_JSON, datos);

  return categoria;
}

export function eliminarCategoriaRepositorio(id) {
  const datos = leerJSON(RUTA_JSON);

  datos.categorias = datos.categorias.filter(
    (categoria) => String(categoria.id) !== String(id),
  );

  guardarJSON(RUTA_JSON, datos);
}

export function moverMiniaturasASinCategoriaRepositorio(idCategoria) {
  const datos = leerJSON(RUTA_JSON);

  datos.miniaturas.forEach((miniatura) => {
    if (String(miniatura.categoriaId) === String(idCategoria)) {
      miniatura.categoriaId = 0;
    }
  });

  guardarJSON(RUTA_JSON, datos);
}
