import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Lee .env (raíz del proyecto), el mismo archivo que usa el backend
function leerConfiguracion() {
  try {
    const contenido = fs.readFileSync(path.join(RAIZ, ".env"), "utf-8");

    return Object.fromEntries(
      contenido
        .split(/\r?\n/)
        .map((linea) => linea.trim())
        .filter((linea) => linea && !linea.startsWith("#") && linea.includes("="))
        .map((linea) => {
          const indice = linea.indexOf("=");

          return [linea.slice(0, indice).trim(), linea.slice(indice + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
}

const configuracion = { ...leerConfiguracion(), ...process.env };

const PUERTO = Number(configuracion.FRONTEND_PORT) || 5173;

const BACKEND = `http://127.0.0.1:${Number(configuracion.BACKEND_PORT) || 3000}`;

// El navegador solo habla con Vite; Vite reenvía la API y las imágenes al
// backend. Así funciona igual desde este PC o desde el móvil sin poner IPs.
const proxy = {
  "/api": BACKEND,
  "/miniaturas": BACKEND,
};

export default defineConfig({
  plugins: [react()],

  server: {
    port: PUERTO,
    strictPort: true,
    proxy,
  },

  preview: {
    port: PUERTO,
    strictPort: true,
    proxy,
  },
});
