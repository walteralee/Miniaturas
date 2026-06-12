export function generarID(miniaturas) {
  if (miniaturas.length === 0) {
    return 1;
  }

  const ids = miniaturas.map((miniatura) => Number(miniatura.id));

  return Math.max(...ids) + 1;
}
