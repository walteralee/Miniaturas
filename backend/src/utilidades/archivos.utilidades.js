import fs from "fs";

export function eliminarArchivo(ruta) {
  if (fs.existsSync(ruta)) {
    fs.unlinkSync(ruta);
  }
}
