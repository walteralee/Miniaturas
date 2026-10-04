import { execFile } from "child_process";

import { promisify } from "util";

import { PYTHON } from "../configuracion/entorno.config.js";

import { RUTAS } from "../utilidades/rutas.utilidades.js";

const ejecutar = promisify(execFile);

const TIEMPO_MAXIMO = 45 * 1000;

// Lanza scripts/scraping.py para una sola miniatura: descarga la imagen de
// vista previa de su página y actualiza la base de datos.
// Si falla, la miniatura se queda con la imagen por defecto.
export async function descargarMiniaturaScraping(id) {
  try {
    await ejecutar(PYTHON, [RUTAS.scraping, "--id", String(id)], {
      timeout: TIEMPO_MAXIMO,

      windowsHide: true,
    });

    return true;
  } catch (error) {
    console.error(
      `No se pudo descargar la miniatura ${id}:`,
      error.stdout || error.message,
    );

    return false;
  }
}
