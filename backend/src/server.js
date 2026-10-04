import app from "./app.js";

import { PUERTO, HOST } from "./configuracion/entorno.config.js";

import { abrirConexion } from "./utilidades/sqlite.utilidades.js";

abrirConexion();

app.listen(PUERTO, HOST, () => {
  console.log(`Servidor ejecutándose en http://${HOST}:${PUERTO}`);
});
