import { ValidacionError } from "../errores/validacion.error.js";

export function validarMiniatura(datos) {
  if (!datos.url) {
    throw new ValidacionError("La URL es obligatoria");
  }

  if (typeof datos.url !== "string") {
    throw new ValidacionError("La URL no es válida");
  }
}
