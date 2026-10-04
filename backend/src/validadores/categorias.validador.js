import { ValidacionError } from "../errores/validacion.error.js";

import { LONGITUD_MAXIMA_NOMBRE_CATEGORIA } from "../constantes/categorias.constantes.js";

export function validarNombreCategoria(nombre) {
  const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";

  if (!nombreLimpio) {
    throw new ValidacionError("El nombre de la categoría es obligatorio");
  }

  if (nombreLimpio.length > LONGITUD_MAXIMA_NOMBRE_CATEGORIA) {
    throw new ValidacionError(
      `El nombre no puede superar ${LONGITUD_MAXIMA_NOMBRE_CATEGORIA} caracteres`,
    );
  }

  return nombreLimpio;
}
