import multer from "multer";

const MENSAJES_SUBIDA = {
  LIMIT_FILE_SIZE: "La imagen supera el tamaño máximo de 10 MB",

  LIMIT_FILE_COUNT: "Solo se puede subir una imagen",

  LIMIT_UNEXPECTED_FILE: "Campo de imagen no válido",
};

// eslint-disable-next-line no-unused-vars
export function erroresMiddleware(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    res.status(400).json({
      error: true,

      mensaje: MENSAJES_SUBIDA[error.code] || "Error al subir la imagen",
    });

    return;
  }

  if (error.type === "entity.parse.failed") {
    res.status(400).json({
      error: true,

      mensaje: "El cuerpo de la petición no es un JSON válido",
    });

    return;
  }

  // AplicacionError usa "codigo"; otros errores de Express usan "status"
  const codigo = error.codigo || error.status || 500;

  if (codigo >= 500) {
    console.error(error);
  }

  res.status(codigo).json({
    error: true,

    mensaje: codigo >= 500 ? "Error interno del servidor" : error.message,
  });
}
