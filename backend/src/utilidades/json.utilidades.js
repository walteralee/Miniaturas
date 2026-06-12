import fs from "fs";

export function leerJSON(ruta) {
  const contenido = fs.readFileSync(ruta, "utf-8");

  return JSON.parse(contenido);
}

export function guardarJSON(ruta, datos) {
  fs.writeFileSync(
    ruta,

    JSON.stringify(datos, null, 2),

    "utf-8",
  );
}
