export async function get(url) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}

export async function post(url, body) {
  const respuesta = await fetch(url, {
    method: "POST",
    body,
  });

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}

export async function put(url, body) {
  const respuesta = await fetch(url, {
    method: "PUT",
    body,
  });

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
