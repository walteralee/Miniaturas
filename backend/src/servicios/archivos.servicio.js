export function obtenerNombreArchivo(archivo) {
  if (!archivo) {
    return null;
  }

  return `/miniaturas/${archivo.filename}`;
}
