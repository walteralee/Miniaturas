import { useState } from "react";

import Modal from "../comunes/Modal";
import MensajeError from "../comunes/MensajeError";

function ModalConfirmar({ titulo, mensaje, textoConfirmar, alConfirmar, alCerrar }) {
  const [ocupado, setOcupado] = useState(false);

  const [error, setError] = useState("");

  async function confirmar() {
    try {
      setOcupado(true);

      setError("");

      await alConfirmar();
    } catch (err) {
      setError(err.message);

      setOcupado(false);
    }
  }

  return (
    <Modal titulo={titulo} className="modal-estrecho" alCerrar={alCerrar}>
      <p className="modal-texto">{mensaje}</p>

      <MensajeError mensaje={error} />

      <div className="modal-acciones">
        <button type="button" className="boton boton-secundario" onClick={alCerrar}>
          CANCELAR
        </button>

        <button
          type="button"
          className="boton boton-peligro"
          disabled={ocupado}
          autoFocus
          onClick={confirmar}
        >
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}

export default ModalConfirmar;
