import app from "./app.js";

import { PUERTO } from "./configuracion/entorno.config.js";

app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en puerto ${PUERTO}`);
});
    