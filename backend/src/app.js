// backend/src/app.js

import express from "express";

import miniaturasRutas from "./rutas/miniaturas.rutas.js";

import categoriasRutas from "./rutas/categorias.rutas.js";

import { RUTAS } from "./utilidades/rutas.utilidades.js";

import { erroresMiddleware } from "./middlewares/errores.middleware.js";

import { noEncontradoMiddleware } from "./middlewares/no-encontrado.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use("/miniaturas", express.static(RUTAS.miniaturas));

app.use("/api/miniaturas", miniaturasRutas);

app.use("/api/categorias", categoriasRutas);

app.use(noEncontradoMiddleware);

app.use(erroresMiddleware);

export default app;
