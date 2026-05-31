export function esURLValida(url) {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  }
}
