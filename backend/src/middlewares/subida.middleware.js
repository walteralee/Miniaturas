import multer from "multer";

import {
  EXTENSIONES_IMAGEN,
  TAMANNO_MAXIMO_IMAGEN,
} from "../constantes/miniaturas.constantes.js";

import { ValidacionError } from "../errores/validacion.error.js";

// En memoria: el servicio decide el nombre final y lo escribe en disco,
// así no quedan archivos temporales huérfanos si algo falla
export const subirMiniatura = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: TAMANNO_MAXIMO_IMAGEN,

    files: 1,
  },

  fileFilter(req, file, cb) {
    if (!EXTENSIONES_IMAGEN[file.mimetype]) {
      cb(
        new ValidacionError(
          "Formato de imagen no soportado (usa JPG, PNG, WEBP, GIF o AVIF)",
        ),
      );

      return;
    }

    cb(null, true);
  },
});
