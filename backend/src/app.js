// backend/src/app.js

import express from "express";

import cors from "cors";

import path from "path";

import miniaturasRutas from "./rutas/miniaturas.rutas.js";

import categoriasRutas from "./rutas/categorias.rutas.js";

import { erroresMiddleware } from "./middlewares/errores.middleware.js";

import { noEncontradoMiddleware } from "./middlewares/no-encontrado.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/miniaturas",

  express.static(
    path.join(process.cwd(), "..", "almacenamiento", "miniaturas"),
  ),
);

app.use("/api/miniaturas", miniaturasRutas);

app.use("/api/categorias", categoriasRutas);

app.use(noEncontradoMiddleware);

app.use(erroresMiddleware);

export default app;
