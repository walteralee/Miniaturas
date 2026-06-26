// backend/src/repositorios/miniaturas.repositorio.js

import { abrirConexion } from "../utilidades/sqlite.utilidades.js";

const db = abrirConexion();

export function obtenerMiniaturasRepositorio() {
  return db
    .prepare(
      `
      SELECT
        id,
        url,
        miniatura,
        categoriaId
      FROM miniaturas
      ORDER BY id
    `,
    )
    .all();
}

export function obtenerMiniaturaPorIdRepositorio(id) {
  return db
    .prepare(
      `
      SELECT
        id,
        url,
        miniatura,
        categoriaId
      FROM miniaturas
      WHERE id = ?
    `,
    )
    .get(id);
}

export function guardarMiniaturasRepositorio(miniaturas) {
  const actualizar = db.prepare(`
    UPDATE miniaturas
    SET
      url = ?,
      miniatura = ?,
      categoriaId = ?
    WHERE id = ?
  `);

  for (const miniatura of miniaturas) {
    actualizar.run(
      miniatura.url,
      miniatura.miniatura,
      miniatura.categoriaId,
      miniatura.id,
    );
  }
}

export function crearMiniaturaRepositorio(miniaturaNueva) {
  db.prepare(
    `
    INSERT INTO miniaturas (
      id,
      url,
      miniatura,
      categoriaId
    )
    VALUES (?, ?, ?, ?)
  `,
  ).run(
    miniaturaNueva.id,
    miniaturaNueva.url,
    miniaturaNueva.miniatura,
    miniaturaNueva.categoriaId,
  );

  return miniaturaNueva;
}

export function moverMiniaturaCategoriaRepositorio(id, categoriaId) {
  const resultado = db
    .prepare(
      `
    UPDATE miniaturas
    SET categoriaId = ?
    WHERE id = ?
  `,
    )
    .run(categoriaId, id);

  if (resultado.changes === 0) {
    return null;
  }

  return obtenerMiniaturaPorIdRepositorio(id);
}

export function eliminarMiniaturaRepositorio(id) {
  const resultado = db
    .prepare(
      `
      DELETE FROM miniaturas
      WHERE id = ?
    `,
    )
    .run(id);

  return resultado.changes > 0;
}
