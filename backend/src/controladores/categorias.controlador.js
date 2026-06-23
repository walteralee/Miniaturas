// backend/src/controladores/categorias.controlador.js

import {
  obtenerCategoriasServicio,
  crearCategoriaServicio,
  renombrarCategoriaServicio,
  eliminarCategoriaServicio,
} from "../servicios/categorias.servicio.js";

export function obtenerCategorias(req, res, next) {
  try {
    const categorias = obtenerCategoriasServicio();

    res.json(categorias);
  } catch (error) {
    next(error);
  }
}

export function crearCategoria(req, res, next) {
  try {
    const categoria = crearCategoriaServicio(req.body.nombre);

    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
}

export function renombrarCategoria(req, res, next) {
  try {
    const categoria = renombrarCategoriaServicio(
      req.params.id,
      req.body.nombre,
    );

    res.json(categoria);
  } catch (error) {
    next(error);
  }
}

export function eliminarCategoria(req, res, next) {
  try {
    eliminarCategoriaServicio(req.params.id);

    res.json({
      mensaje: "Categoría eliminada",
    });
  } catch (error) {
    next(error);
  }
}
