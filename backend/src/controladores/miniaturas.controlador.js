// backend/src/controladores/miniaturas.controlador.js

import {
  obtenerMiniaturasServicio,
  crearMiniaturaServicio,
  eliminarMiniaturaServicio,
  actualizarMiniaturaServicio,
  moverMiniaturaCategoriaServicio,
} from "../servicios/miniaturas.servicio.js";

export function obtenerMiniaturas(req, res, next) {
  try {
    res.json(obtenerMiniaturasServicio());
  } catch (error) {
    next(error);
  }
}

export async function crearMiniatura(req, res, next) {
  try {
    const nuevaMiniatura = await crearMiniaturaServicio({
      url: req.body?.url,

      archivo: req.file,

      categoriaId: req.body?.categoriaId,
    });

    res.status(201).json(nuevaMiniatura);
  } catch (error) {
    next(error);
  }
}

export async function actualizarMiniatura(req, res, next) {
  try {
    const miniaturaActualizada = await actualizarMiniaturaServicio(
      req.params.id,
      {
        url: req.body?.url,

        archivo: req.file,
      },
    );

    res.json(miniaturaActualizada);
  } catch (error) {
    next(error);
  }
}

export function moverMiniaturaCategoria(req, res, next) {
  try {
    const miniatura = moverMiniaturaCategoriaServicio(
      req.params.id,
      req.body?.categoriaId,
    );

    res.json(miniatura);
  } catch (error) {
    next(error);
  }
}

export function eliminarMiniatura(req, res, next) {
  try {
    eliminarMiniaturaServicio(req.params.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
