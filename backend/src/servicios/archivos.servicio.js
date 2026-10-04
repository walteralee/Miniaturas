import fs from "fs";

import path from "path";

import { RUTAS } from "../utilidades/rutas.utilidades.js";

import {
  EXTENSIONES_IMAGEN,
  MINIATURA_POR_DEFECTO,
} from "../constantes/miniaturas.constantes.js";

export function esMiniaturaPorDefecto(rutaPublica) {
  return !rutaPublica || rutaPublica === MINIATURA_POR_DEFECTO;
}

// Borra cualquier imagen de esa miniatura (1.png, 1.jpg...)
function eliminarImagenesDeId(id) {
  for (const archivo of fs.readdirSync(RUTAS.miniaturas)) {
    if (path.parse(archivo).name === String(id)) {
      fs.rmSync(path.join(RUTAS.miniaturas, archivo), { force: true });
    }
  }
}

// Guarda la imagen subida como <id>.<ext> y devuelve su ruta pública
export function guardarImagen(id, archivo) {
  eliminarImagenesDeId(id);

  const nombre = `${id}${EXTENSIONES_IMAGEN[archivo.mimetype]}`;

  fs.writeFileSync(path.join(RUTAS.miniaturas, nombre), archivo.buffer);

  return `/miniaturas/${nombre}`;
}

// La imagen por defecto es compartida: nunca se borra
export function eliminarImagen(rutaPublica) {
  if (esMiniaturaPorDefecto(rutaPublica)) {
    return;
  }

  fs.rmSync(path.join(RUTAS.miniaturas, path.basename(rutaPublica)), {
    force: true,
  });
}
