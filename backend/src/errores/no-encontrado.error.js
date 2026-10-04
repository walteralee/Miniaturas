import { AplicacionError } from "./aplicacion.error.js";

export class NoEncontradoError extends AplicacionError {
  constructor(mensaje = "Recurso no encontrado") {
    super(mensaje, 404);

    this.name = "NoEncontradoError";
  }
}
