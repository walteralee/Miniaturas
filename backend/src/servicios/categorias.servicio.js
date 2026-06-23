// backend/src/servicios/categorias.servicio.js

import {
  obtenerCategoriasRepositorio,
  obtenerCategoriaPorIdRepositorio,
  crearCategoriaRepositorio,
  renombrarCategoriaRepositorio,
  eliminarCategoriaRepositorio,
  moverMiniaturasASinCategoriaRepositorio,
} from "../repositorios/categorias.repositorio.js";

import { ValidacionError } from "../errores/validacion.error.js";

export function obtenerCategoriasServicio() {
  return obtenerCategoriasRepositorio();
}

export function crearCategoriaServicio(nombre) {
  const nombreLimpio = nombre?.trim();

  if (!nombreLimpio) {
    throw new ValidacionError("Nombre de categoría inválido");
  }

  const categorias = obtenerCategoriasRepositorio();

  const existe = categorias.some(
    (categoria) =>
      categoria.nombre.toLowerCase().trim() ===
      nombreLimpio.toLowerCase().trim(),
  );

  if (existe) {
    throw new ValidacionError("La categoría ya existe");
  }

  const nuevoId =
    categorias.length === 0
      ? 1
      : Math.max(...categorias.map((categoria) => Number(categoria.id))) + 1;

  const categoriaNueva = {
    id: nuevoId,

    nombre: nombreLimpio,
  };

  return crearCategoriaRepositorio(categoriaNueva);
}

export function renombrarCategoriaServicio(id, nombre) {
  const categoria = obtenerCategoriaPorIdRepositorio(id);

  if (!categoria) {
    throw new ValidacionError("Categoría no encontrada");
  }

  if (categoria.nombre === "Sin categoría") {
    throw new ValidacionError(
      "No se puede renombrar la categoría 'Sin categoría'",
    );
  }

  const nombreLimpio = nombre?.trim();

  if (!nombreLimpio) {
    throw new ValidacionError("Nombre de categoría inválido");
  }

  const categorias = obtenerCategoriasRepositorio();

  const existe = categorias.some(
    (categoriaActual) =>
      String(categoriaActual.id) !== String(id) &&
      categoriaActual.nombre.toLowerCase().trim() ===
        nombreLimpio.toLowerCase().trim(),
  );

  if (existe) {
    throw new ValidacionError("La categoría ya existe");
  }

  return renombrarCategoriaRepositorio(id, nombreLimpio);
}

export function eliminarCategoriaServicio(id) {
  const categoria = obtenerCategoriaPorIdRepositorio(id);

  if (!categoria) {
    throw new ValidacionError("Categoría no encontrada");
  }

  if (categoria.nombre === "Sin categoría") {
    throw new ValidacionError(
      "No se puede eliminar la categoría 'Sin categoría'",
    );
  }

  moverMiniaturasASinCategoriaRepositorio(id);

  eliminarCategoriaRepositorio(id);
}
