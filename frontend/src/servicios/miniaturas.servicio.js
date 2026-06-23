import { API_MINIATURAS } from "../constantes/api.constantes";

import { get, post, put, del } from "./api.cliente";

export async function obtenerMiniaturas() {
  return get(API_MINIATURAS);
}

export async function crearMiniatura(formData) {
  return post(API_MINIATURAS, formData);
}

export async function actualizarMiniatura(id, formData) {
  return put(`${API_MINIATURAS}/${id}`, formData);
}

export async function eliminarMiniatura(id) {
  return del(`${API_MINIATURAS}/${id}`);
}

export async function moverMiniaturaCategoria(id, categoriaId) {
  return put(
    `${API_MINIATURAS}/${id}/categoria`,

    JSON.stringify({
      categoriaId,
    }),
  );
}
