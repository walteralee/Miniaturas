export function esURLValida(url) {
  try {
    const { protocol } = new URL(url.trim());

    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function obtenerDominio(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
