// Hace la petición y, si falla, lanza un Error con el mensaje del backend
async function peticion(url, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error("No se puede conectar con el servidor");
  }

  if (respuesta.status === 204) {
    return null;
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(datos?.mensaje || `Error HTTP ${respuesta.status}`);
  }

  return datos;
}

function conCuerpo(metodo, body) {
  const opciones = {
    method: metodo,
    body,
  };

  if (!(body instanceof FormData)) {
    opciones.headers = {
      "Content-Type": "application/json",
    };
  }

  return opciones;
}

export function get(url) {
  return peticion(url);
}

export function post(url, body) {
  return peticion(url, conCuerpo("POST", body));
}

export function put(url, body) {
  return peticion(url, conCuerpo("PUT", body));
}

export function del(url) {
  return peticion(url, { method: "DELETE" });
}
