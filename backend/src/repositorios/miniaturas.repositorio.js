// backend/src/repositorios/miniaturas.repositorio.js

import { abrirConexion } from "../utilidades/sqlite.utilidades.js";

const db = abrirConexion();

const consultas = {
  todas: db.prepare(`
    SELECT
      id,
      url,
      miniatura,
      categoriaId
    FROM miniaturas
    ORDER BY id
  `),

  porId: db.prepare(`
    SELECT
      id,
      url,
      miniatura,
      categoriaId
    FROM miniaturas
    WHERE id = ?
  `),

  crear: db.prepare(`
    INSERT INTO miniaturas (
      url,
      miniatura,
      categoriaId
    )
    VALUES (?, ?, ?)
  `),

  actualizar: db.prepare(`
    UPDATE miniaturas
    SET
      url = ?,
      miniatura = ?
    WHERE id = ?
  `),

  mover: db.prepare(`
    UPDATE miniaturas
    SET categoriaId = ?
    WHERE id = ?
  `),

  eliminar: db.prepare(`
    DELETE FROM miniaturas
    WHERE id = ?
  `),
};

export function obtenerMiniaturasRepositorio() {
  return consultas.todas.all();
}

export function obtenerMiniaturaPorIdRepositorio(id) {
  return consultas.porId.get(id);
}

export function crearMiniaturaRepositorio({ url, miniatura, categoriaId }) {
  const resultado = consultas.crear.run(url, miniatura, categoriaId);

  return obtenerMiniaturaPorIdRepositorio(resultado.lastInsertRowid);
}

export function actualizarMiniaturaRepositorio(id, { url, miniatura }) {
  consultas.actualizar.run(url, miniatura, id);

  return obtenerMiniaturaPorIdRepositorio(id);
}

export function moverMiniaturaCategoriaRepositorio(id, categoriaId) {
  consultas.mover.run(categoriaId, id);

  return obtenerMiniaturaPorIdRepositorio(id);
}

export function eliminarMiniaturaRepositorio(id) {
  return consultas.eliminar.run(id).changes > 0;
}
