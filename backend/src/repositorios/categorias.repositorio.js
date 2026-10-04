// backend/src/repositorios/categorias.repositorio.js

import { abrirConexion } from "../utilidades/sqlite.utilidades.js";

import { ID_SIN_CATEGORIA } from "../constantes/categorias.constantes.js";

const db = abrirConexion();

const consultas = {
  todas: db.prepare(`
    SELECT
      id,
      nombre
    FROM categorias
    ORDER BY id
  `),

  porId: db.prepare(`
    SELECT
      id,
      nombre
    FROM categorias
    WHERE id = ?
  `),

  crear: db.prepare(`
    INSERT INTO categorias (nombre)
    VALUES (?)
  `),

  renombrar: db.prepare(`
    UPDATE categorias
    SET nombre = ?
    WHERE id = ?
  `),

  vaciar: db.prepare(`
    UPDATE miniaturas
    SET categoriaId = ?
    WHERE categoriaId = ?
  `),

  eliminar: db.prepare(`
    DELETE FROM categorias
    WHERE id = ?
  `),
};

export function obtenerCategoriasRepositorio() {
  return consultas.todas.all();
}

export function obtenerCategoriaPorIdRepositorio(id) {
  return consultas.porId.get(id);
}

export function crearCategoriaRepositorio(nombre) {
  const resultado = consultas.crear.run(nombre);

  return obtenerCategoriaPorIdRepositorio(resultado.lastInsertRowid);
}

export function renombrarCategoriaRepositorio(id, nombre) {
  consultas.renombrar.run(nombre, id);

  return obtenerCategoriaPorIdRepositorio(id);
}

// Pasa sus miniaturas a "Sin categoría" y la borra, todo o nada
export const eliminarCategoriaRepositorio = db.transaction((id) => {
  consultas.vaciar.run(ID_SIN_CATEGORIA, id);

  consultas.eliminar.run(id);
});
