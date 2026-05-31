export class AplicacionError extends Error {
  constructor(mensaje, codigo = 500) {
    super(mensaje);

    this.name = "AplicacionError";

    this.codigo = codigo;
  }
}
