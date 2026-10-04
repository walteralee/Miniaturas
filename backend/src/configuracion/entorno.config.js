import dotenv from "dotenv";

import { RUTAS } from "../utilidades/rutas.utilidades.js";

// Toda la configuración vive en config.env (raíz del proyecto)
dotenv.config({ path: RUTAS.config, quiet: true });

export const PUERTO = Number(process.env.BACKEND_PORT) || 3000;

// Solo escucha en local: el frontend (Vite) le reenvía las peticiones,
// así que nunca hace falta exponerlo a la red
export const HOST = "127.0.0.1";

export const PYTHON =
  process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
