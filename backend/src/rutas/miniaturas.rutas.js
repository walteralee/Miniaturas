import { Router } from "express";

import {
  obtenerMiniaturas,
  crearMiniatura,
  actualizarMiniatura,
  eliminarMiniatura,
} from "../controladores/miniaturas.controlador.js";

import { subirMiniatura } from "../middlewares/subida.middleware.js";

const router = Router();

router.get(
  "/",

  obtenerMiniaturas,
);

router.post(
  "/",

  subirMiniatura.single("miniatura"),

  crearMiniatura,
);

router.put(
  "/:id",

  subirMiniatura.single("miniatura"),

  actualizarMiniatura,
);

router.delete(
  "/:id",

  eliminarMiniatura,
);

export default router;
