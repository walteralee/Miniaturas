import { AplicacionError } from "./aplicacion.error.js";

export class ValidacionError extends AplicacionError {
  constructor(mensaje = "Error de validación") {
    super(mensaje, 400);

    this.name = "ValidacionError";
  }
}
