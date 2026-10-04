import { useEffect, useId } from "react";

// Ventana modal común: se cierra con ✕, con Escape o pulsando fuera
function Modal({ titulo, className = "", alCerrar, children }) {
  const idTitulo = useId();

  useEffect(() => {
    function alPulsarTecla(evento) {
      if (evento.key === "Escape") {
        alCerrar();
      }
    }

    document.addEventListener("keydown", alPulsarTecla);

    // Evita que la galería se desplace por detrás
    document.body.classList.add("sin-scroll");

    return () => {
      document.removeEventListener("keydown", alPulsarTecla);

      document.body.classList.remove("sin-scroll");
    };
  }, [alCerrar]);

  return (
    <div
      className="modal-fondo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          alCerrar();
        }
      }}
    >
      <div
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
      >
        <button
          type="button"
          className="modal-cerrar"
          onClick={alCerrar}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 id={idTitulo}>{titulo}</h2>

        {children}
      </div>
    </div>
  );
}

export default Modal;
