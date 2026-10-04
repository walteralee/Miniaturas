import path from "path";

import { fileURLToPath } from "url";

// Raíz del proyecto (carpeta que contiene backend/, frontend/, scripts/...)
const RAIZ = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

// ALMACENAMIENTO_DIR permite apuntar a otra carpeta de datos (p. ej. pruebas)
const ALMACENAMIENTO =
  process.env.ALMACENAMIENTO_DIR || path.join(RAIZ, "almacenamiento");

export const RUTAS = {
  raiz: RAIZ,

  config: path.join(RAIZ, "config.env"),

  baseDatos: path.join(ALMACENAMIENTO, "datos", "miniaturas.db"),

  miniaturas: path.join(ALMACENAMIENTO, "miniaturas"),

  // Archivos incluidos en el repositorio: imagen por defecto y contenido de ejemplo
  recursos: path.join(RAIZ, "almacenamiento", "recursos"),

  scraping: path.join(RAIZ, "scripts", "scraping.py"),
};
