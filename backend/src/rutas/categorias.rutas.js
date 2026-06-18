import { Router } from "express";

import {
  obtenerCategorias,
  crearCategoria,
  renombrarCategoria,
  eliminarCategoria,
} from "../controladores/categorias.controlador.js";

const router = Router();

router.get(
  "/",

  obtenerCategorias,
);

router.post(
  "/",

  crearCategoria,
);

router.put(
  "/:id",

  renombrarCategoria,
);

router.delete(
  "/:id",

  eliminarCategoria,
);

export default router;
