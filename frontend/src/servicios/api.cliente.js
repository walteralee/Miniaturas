export async function get(url) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}

export async function post(url, body) {
  const configuracion = {
    method: "POST",
    body,
  };

  if (!(body instanceof FormData)) {
    configuracion.headers = {
      "Content-Type": "application/json",
    };
  }

  const respuesta = await fetch(url, configuracion);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}

export async function put(url, body) {
  const configuracion = {
    method: "PUT",
    body,
  };

  if (!(body instanceof FormData)) {
    configuracion.headers = {
      "Content-Type": "application/json",
    };
  }

  const respuesta = await fetch(url, configuracion);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}

export async function del(url) {
  const respuesta = await fetch(url, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}
