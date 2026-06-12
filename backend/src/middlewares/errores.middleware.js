export function erroresMiddleware(error, req, res, next) {
  console.error(error);

  const codigo = error.codigo || 500;

  const mensaje = error.message || "Error interno";

  res.status(codigo).json({
    error: true,

    mensaje,
  });
}
