// backend/src/servicios/miniaturas.servicio.js

import {
  obtenerMiniaturasRepositorio,
  obtenerMiniaturaPorIdRepositorio,
  crearMiniaturaRepositorio,
  actualizarMiniaturaRepositorio,
  moverMiniaturaCategoriaRepositorio,
  eliminarMiniaturaRepositorio,
} from "../repositorios/miniaturas.repositorio.js";

import { obtenerCategoriaPorIdRepositorio } from "../repositorios/categorias.repositorio.js";

import { guardarImagen, eliminarImagen } from "./archivos.servicio.js";

import { descargarMiniaturaScraping } from "./scraping.servicio.js";

import { validarUrl, validarId } from "../validadores/miniaturas.validador.js";

import { ID_SIN_CATEGORIA } from "../constantes/categorias.constantes.js";

import { MINIATURA_POR_DEFECTO } from "../constantes/miniaturas.constantes.js";

import { ValidacionError } from "../errores/validacion.error.js";

import { NoEncontradoError } from "../errores/no-encontrado.error.js";

function obtenerMiniaturaExistente(id) {
  const miniatura = obtenerMiniaturaPorIdRepositorio(validarId(id));

  if (!miniatura) {
    throw new NoEncontradoError("Miniatura no encontrada");
  }

  return miniatura;
}

function validarCategoriaExistente(categoriaId) {
  const id = validarId(categoriaId ?? ID_SIN_CATEGORIA, "id de categoría");

  if (!obtenerCategoriaPorIdRepositorio(id)) {
    throw new ValidacionError("Categoría no encontrada");
  }

  return id;
}

// Sin imagen subida: se busca automáticamente en la página del enlace
async function descargarImagenAutomatica(id) {
  await descargarMiniaturaScraping(id);

  return obtenerMiniaturaPorIdRepositorio(id);
}

export function obtenerMiniaturasServicio() {
  return obtenerMiniaturasRepositorio();
}

export async function crearMiniaturaServicio({ url, archivo, categoriaId }) {
  const urlLimpia = validarUrl(url);

  const idCategoria = validarCategoriaExistente(categoriaId);

  const miniatura = crearMiniaturaRepositorio({
    url: urlLimpia,

    miniatura: MINIATURA_POR_DEFECTO,

    categoriaId: idCategoria,
  });

  if (!archivo) {
    return descargarImagenAutomatica(miniatura.id);
  }

  try {
    return actualizarMiniaturaRepositorio(miniatura.id, {
      url: urlLimpia,

      miniatura: guardarImagen(miniatura.id, archivo),
    });
  } catch (error) {
    eliminarMiniaturaRepositorio(miniatura.id);

    throw error;
  }
}

export async function actualizarMiniaturaServicio(id, { url, archivo }) {
  const actual = obtenerMiniaturaExistente(id);

  const urlLimpia = validarUrl(url);

  if (archivo) {
    return actualizarMiniaturaRepositorio(actual.id, {
      url: urlLimpia,

      miniatura: guardarImagen(actual.id, archivo),
    });
  }

  if (urlLimpia === actual.url) {
    return actual;
  }

  // Enlace nuevo sin imagen nueva: la imagen antigua ya no corresponde
  eliminarImagen(actual.miniatura);

  actualizarMiniaturaRepositorio(actual.id, {
    url: urlLimpia,

    miniatura: MINIATURA_POR_DEFECTO,
  });

  return descargarImagenAutomatica(actual.id);
}

export function moverMiniaturaCategoriaServicio(id, categoriaId) {
  const miniatura = obtenerMiniaturaExistente(id);

  const idCategoria = validarCategoriaExistente(categoriaId);

  return moverMiniaturaCategoriaRepositorio(miniatura.id, idCategoria);
}

export function eliminarMiniaturaServicio(id) {
  const miniatura = obtenerMiniaturaExistente(id);

  eliminarMiniaturaRepositorio(miniatura.id);

  eliminarImagen(miniatura.miniatura);
}
