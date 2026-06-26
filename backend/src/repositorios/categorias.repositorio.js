// backend/src/repositorios/categorias.repositorio.js

import { abrirConexion } from "../utilidades/sqlite.utilidades.js";

const db = abrirConexion();

export function obtenerCategoriasRepositorio() {
  return db
    .prepare(
      `
      SELECT
        id,
        nombre
      FROM categorias
      ORDER BY id
    `,
    )
    .all();
}

export function obtenerCategoriaPorIdRepositorio(id) {
  return db
    .prepare(
      `
      SELECT
        id,
        nombre
      FROM categorias
      WHERE id = ?
    `,
    )
    .get(id);
}

export function crearCategoriaRepositorio(categoriaNueva) {
  db.prepare(
    `
    INSERT INTO categorias (
      id,
      nombre
    )
    VALUES (?, ?)
  `,
  ).run(categoriaNueva.id, categoriaNueva.nombre);

  return categoriaNueva;
}

export function renombrarCategoriaRepositorio(id, nombre) {
  const resultado = db
    .prepare(
      `
    UPDATE categorias
    SET nombre = ?
    WHERE id = ?
  `,
    )
    .run(nombre, id);

  if (resultado.changes === 0) {
    return null;
  }

  return obtenerCategoriaPorIdRepositorio(id);
}

export function eliminarCategoriaRepositorio(id) {
  db.prepare(
    `
    DELETE FROM categorias
    WHERE id = ?
  `,
  ).run(id);
}

export function moverMiniaturasASinCategoriaRepositorio(idCategoria) {
  db.prepare(
    `
    UPDATE miniaturas
    SET categoriaId = 0
    WHERE categoriaId = ?
  `,
  ).run(idCategoria);
}
