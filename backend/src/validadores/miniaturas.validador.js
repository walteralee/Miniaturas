import { ValidacionError } from "../errores/validacion.error.js";

// Devuelve la URL limpia o lanza un error si no es http/https
export function validarUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    throw new ValidacionError("La URL es obligatoria");
  }

  const urlLimpia = url.trim();

  let urlAnalizada;

  try {
    urlAnalizada = new URL(urlLimpia);
  } catch {
    throw new ValidacionError("La URL no es válida");
  }

  if (!["http:", "https:"].includes(urlAnalizada.protocol)) {
    throw new ValidacionError("La URL debe empezar por http:// o https://");
  }

  return urlLimpia;
}

export function validarId(id, nombre = "identificador") {
  const numero = Number(id);

  if (!Number.isInteger(numero) || numero < 0) {
    throw new ValidacionError(`El ${nombre} no es válido`);
  }

  return numero;
}
