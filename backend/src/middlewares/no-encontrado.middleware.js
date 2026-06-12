export function noEncontradoMiddleware(req, res) {
  res.status(404).json({
    error: true,

    mensaje: "Ruta no encontrada",
  });
}
