// backend/src/controladores/categorias.controlador.js

import {
  obtenerCategoriasServicio,
  crearCategoriaServicio,
  renombrarCategoriaServicio,
  eliminarCategoriaServicio,
} from "../servicios/categorias.servicio.js";

export function obtenerCategorias(req, res, next) {
  try {
    res.json(obtenerCategoriasServicio());
  } catch (error) {
    next(error);
  }
}

export function crearCategoria(req, res, next) {
  try {
    const categoria = crearCategoriaServicio(req.body?.nombre);

    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
}

export function renombrarCategoria(req, res, next) {
  try {
    const categoria = renombrarCategoriaServicio(
      req.params.id,
      req.body?.nombre,
    );

    res.json(categoria);
  } catch (error) {
    next(error);
  }
}

export function eliminarCategoria(req, res, next) {
  try {
    eliminarCategoriaServicio(req.params.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
