import app from "./app.js";

import { PUERTO } from "./configuracion/entorno.config.js";

app.listen(PUERTO, "0.0.0.0", () => {
  console.log(`Servidor ejecutándose en puerto ${PUERTO}`);
});
