function MensajeError({ mensaje }) {
  if (!mensaje) {
    return null;
  }

  return (
    <p className="mensaje-error" role="alert">
      {mensaje}
    </p>
  );
}

export default MensajeError;
