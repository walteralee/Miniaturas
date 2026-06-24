import path from "path";

export function obtenerRutaMiniaturas() {
  return path.join(process.cwd(), "..", "almacenamiento", "miniaturas");
}

export function obtenerRutaDB() {
  return path.join(
    process.cwd(),
    "..",
    "almacenamiento",
    "datos",
    "miniaturas.db",
  );
}
