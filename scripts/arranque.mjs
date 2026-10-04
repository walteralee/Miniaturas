// Utilidades compartidas por run.bat y run.sh.
//
//   node scripts/arranque.mjs version              Falla si Node es menor que 20
//   node scripts/arranque.mjs puerto <puerto>      Falla si el puerto está ocupado
//   node scripts/arranque.mjs esperar <url>...     Espera (máx. 60 s) a que respondan

import net from "net";

const VERSION_MINIMA = 20;

const TIEMPO_ESPERA = 60 * 1000;

function comprobarVersion() {
  const version = Number(process.versions.node.split(".")[0]);

  if (version < VERSION_MINIMA) {
    console.error(
      `Se necesita Node.js ${VERSION_MINIMA} o superior (tienes ${process.versions.node}).`,
    );

    return 1;
  }

  return 0;
}

function aceptaConexiones(puerto, host) {
  return new Promise((resolver) => {
    const conexion = net.connect({ port: Number(puerto), host });

    conexion.setTimeout(1000);

    conexion.once("connect", () => {
      conexion.destroy();

      resolver(true);
    });

    conexion.once("error", () => resolver(false));

    conexion.once("timeout", () => {
      conexion.destroy();

      resolver(false);
    });
  });
}

// Se comprueba conectando (y no escuchando) porque en Windows dos programas
// pueden escuchar en el mismo puerto si usan direcciones distintas
async function comprobarPuerto(puerto) {
  const ocupado = await Promise.all([
    aceptaConexiones(puerto, "127.0.0.1"),
    aceptaConexiones(puerto, "::1"),
  ]);

  return ocupado.some(Boolean) ? 1 : 0;
}

async function responde(url) {
  try {
    await fetch(url);

    return true;
  } catch {
    return false;
  }
}

async function esperar(urls) {
  const limite = Date.now() + TIEMPO_ESPERA;

  while (Date.now() < limite) {
    const resultados = await Promise.all(urls.map(responde));

    if (resultados.every(Boolean)) {
      return 0;
    }

    await new Promise((resolver) => setTimeout(resolver, 500));
  }

  return 1;
}

const [comando, ...argumentos] = process.argv.slice(2);

const comandos = {
  version: () => comprobarVersion(),

  puerto: () => comprobarPuerto(argumentos[0]),

  esperar: () => esperar(argumentos),
};

if (!comandos[comando]) {
  console.error(`Comando desconocido: ${comando ?? "(ninguno)"}`);

  process.exit(2);
}

process.exit(await comandos[comando]());
