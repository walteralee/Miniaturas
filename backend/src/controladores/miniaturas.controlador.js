// backend/src/controladores/miniaturas.controlador.js

import {
  obtenerMiniaturasServicio,
  crearMiniaturaServicio,
  eliminarMiniaturaServicio,
  actualizarMiniaturaServicio,
} from "../servicios/miniaturas.servicio.js";

import { obtenerNombreArchivo } from "../servicios/archivos.servicio.js";

export function obtenerMiniaturas(req, res, next) {
  try {
    const miniaturas = obtenerMiniaturasServicio();

    res.json(miniaturas);
  } catch (error) {
    next(error);
  }
}

export function crearMiniatura(req, res, next) {
  try {
    const nuevaMiniatura = crearMiniaturaServicio({
      url: req.body.url,

      miniatura: obtenerNombreArchivo(req.file),
    });

    res.status(201).json(nuevaMiniatura);
  } catch (error) {
    next(error);
  }
}

export function eliminarMiniatura(req, res, next) {
  try {
    eliminarMiniaturaServicio(req.params.id);

    res.json({
      mensaje: "Miniatura eliminada",
    });
  } catch (error) {
    next(error);
  }
}

export function actualizarMiniatura(req, res, next) {
  try {
    const miniaturaActualizada = actualizarMiniaturaServicio(
      req.params.id,

      {
        url: req.body.url,

        miniatura: req.file ? obtenerNombreArchivo(req.file) : null,
      },
    );

    res.json(miniaturaActualizada);
  } catch (error) {
    next(error);
  }
}
