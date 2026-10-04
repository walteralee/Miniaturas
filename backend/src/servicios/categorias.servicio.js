// backend/src/servicios/categorias.servicio.js

import {
  obtenerCategoriasRepositorio,
  obtenerCategoriaPorIdRepositorio,
  crearCategoriaRepositorio,
  renombrarCategoriaRepositorio,
  eliminarCategoriaRepositorio,
} from "../repositorios/categorias.repositorio.js";

import { validarNombreCategoria } from "../validadores/categorias.validador.js";

import { validarId } from "../validadores/miniaturas.validador.js";

import { ID_SIN_CATEGORIA } from "../constantes/categorias.constantes.js";

import { ValidacionError } from "../errores/validacion.error.js";

import { NoEncontradoError } from "../errores/no-encontrado.error.js";

function normalizar(nombre) {
  return nombre.trim().toLocaleLowerCase("es");
}

function comprobarNombreLibre(nombre, idIgnorado = null) {
  const existe = obtenerCategoriasRepositorio().some(
    (categoria) =>
      categoria.id !== idIgnorado &&
      normalizar(categoria.nombre) === normalizar(nombre),
  );

  if (existe) {
    throw new ValidacionError("Ya existe una categoría con ese nombre");
  }
}

// "Sin categoría" es fija: no se puede renombrar ni borrar
function obtenerCategoriaEditable(id) {
  const idCategoria = validarId(id, "id de categoría");

  if (idCategoria === ID_SIN_CATEGORIA) {
    throw new ValidacionError(
      "La categoría 'Sin categoría' no se puede modificar",
    );
  }

  const categoria = obtenerCategoriaPorIdRepositorio(idCategoria);

  if (!categoria) {
    throw new NoEncontradoError("Categoría no encontrada");
  }

  return categoria;
}

export function obtenerCategoriasServicio() {
  return obtenerCategoriasRepositorio();
}

export function crearCategoriaServicio(nombre) {
  const nombreLimpio = validarNombreCategoria(nombre);

  comprobarNombreLibre(nombreLimpio);

  return crearCategoriaRepositorio(nombreLimpio);
}

export function renombrarCategoriaServicio(id, nombre) {
  const categoria = obtenerCategoriaEditable(id);

  const nombreLimpio = validarNombreCategoria(nombre);

  comprobarNombreLibre(nombreLimpio, categoria.id);

  return renombrarCategoriaRepositorio(categoria.id, nombreLimpio);
}

export function eliminarCategoriaServicio(id) {
  const categoria = obtenerCategoriaEditable(id);

  eliminarCategoriaRepositorio(categoria.id);
}
