// src/servicios/categorias.servicio.js

import { get, post, put, del } from "./api.cliente";

import { API_CATEGORIAS } from "../constantes/api.constantes";

export async function obtenerCategorias() {
  return get(API_CATEGORIAS);
}

export async function crearCategoria(nombre) {
  return post(
    API_CATEGORIAS,
    JSON.stringify({
      nombre,
    }),
  );
}

export async function renombrarCategoria(id, nombre) {
  return put(
    `${API_CATEGORIAS}/${id}`,
    JSON.stringify({
      nombre,
    }),
  );
}

export async function eliminarCategoria(id) {
  return del(`${API_CATEGORIAS}/${id}`);
}
