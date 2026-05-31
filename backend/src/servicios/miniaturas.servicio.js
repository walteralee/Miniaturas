// backend/src/servicios/miniaturas.servicio.js

import fs from "fs";

import path from "path";

import {
  obtenerMiniaturasRepositorio,
  crearMiniaturaRepositorio,
  guardarMiniaturasRepositorio,
} from "../repositorios/miniaturas.repositorio.js";

import { generarID } from "../utilidades/identificadores.utilidades.js";

import { eliminarArchivo } from "../utilidades/archivos.utilidades.js";

import { validarMiniatura } from "../validadores/miniaturas.validador.js";

import { ValidacionError } from "../errores/validacion.error.js";

export function obtenerMiniaturasServicio() {
  return obtenerMiniaturasRepositorio();
}

export function crearMiniaturaServicio(datos) {
  validarMiniatura(datos);

  const miniaturas = obtenerMiniaturasRepositorio();

  const id = generarID(miniaturas);

  const extension = path.extname(datos.miniatura);

  const nombreFinal = `${id}${extension}`;

  const rutaTemporal = path.join(
    process.cwd(),
    "..",
    "almacenamiento",
    "miniaturas",

    path.basename(datos.miniatura),
  );

  const rutaFinal = path.join(
    process.cwd(),
    "..",
    "almacenamiento",
    "miniaturas",

    nombreFinal,
  );

  fs.renameSync(rutaTemporal, rutaFinal);

  const nuevaMiniatura = {
    id,

    url: datos.url,

    miniatura: `/miniaturas/${nombreFinal}`,
  };

  return crearMiniaturaRepositorio(nuevaMiniatura);
}

export function eliminarMiniaturaServicio(id) {
  const miniaturas = obtenerMiniaturasRepositorio();

  const miniatura = miniaturas.find(
    (miniatura) => String(miniatura.id) === String(id),
  );

  if (!miniatura) {
    throw new ValidacionError("Miniatura no encontrada");
  }

  if (miniatura.miniatura) {
    const rutaArchivo = path.join(
      process.cwd(),
      "..",
      "almacenamiento",
      "miniaturas",

      path.basename(miniatura.miniatura),
    );

    eliminarArchivo(rutaArchivo);
  }

  const nuevasMiniaturas = miniaturas.filter(
    (miniatura) => String(miniatura.id) !== String(id),
  );

  guardarMiniaturasRepositorio(nuevasMiniaturas);
}

export function actualizarMiniaturaServicio(id, datos) {
  validarMiniatura(datos);

  const miniaturas = obtenerMiniaturasRepositorio();

  const indice = miniaturas.findIndex(
    (miniatura) => String(miniatura.id) === String(id),
  );

  if (indice === -1) {
    throw new ValidacionError("Miniatura no encontrada");
  }

  let nuevaRutaMiniatura = miniaturas[indice].miniatura;

  if (datos.miniatura) {
    const rutaAnterior = path.join(
      process.cwd(),
      "..",
      "almacenamiento",
      "miniaturas",

      path.basename(miniaturas[indice].miniatura),
    );

    eliminarArchivo(rutaAnterior);

    const extension = path.extname(datos.miniatura);

    const nombreFinal = `${id}${extension}`;

    const rutaTemporal = path.join(
      process.cwd(),
      "..",
      "almacenamiento",
      "miniaturas",

      path.basename(datos.miniatura),
    );

    const rutaFinal = path.join(
      process.cwd(),
      "..",
      "almacenamiento",
      "miniaturas",

      nombreFinal,
    );

    fs.renameSync(rutaTemporal, rutaFinal);

    nuevaRutaMiniatura = `/miniaturas/${nombreFinal}`;
  }

  miniaturas[indice] = {
    ...miniaturas[indice],

    url: datos.url,

    miniatura: nuevaRutaMiniatura,
  };

  guardarMiniaturasRepositorio(miniaturas);

  return miniaturas[indice];
}
