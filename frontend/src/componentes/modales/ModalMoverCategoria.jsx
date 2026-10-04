// src/componentes/modales/ModalMoverCategoria.jsx

import { useState } from "react";

import Modal from "../comunes/Modal";
import MensajeError from "../comunes/MensajeError";

function ModalMoverCategoria({ categorias, miniatura, alCerrar, alMoverCategoria }) {
  const [categoriaId, setCategoriaId] = useState(miniatura.categoriaId);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");

  async function manejarEnvio(evento) {
    evento.preventDefault();

    try {
      setGuardando(true);

      setError("");

      await alMoverCategoria(miniatura.id, categoriaId);
    } catch (err) {
      setError(err.message);

      setGuardando(false);
    }
  }

  return (
    <Modal titulo="MOVER A" className="modal-estrecho" alCerrar={alCerrar}>
      <form className="formulario" onSubmit={manejarEnvio}>
        <select
          aria-label="Categoría de destino"
          value={categoriaId}
          autoFocus
          onChange={(evento) => setCategoriaId(Number(evento.target.value))}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
              {categoria.id === miniatura.categoriaId ? " (actual)" : ""}
            </option>
          ))}
        </select>

        <MensajeError mensaje={error} />

        <button
          type="submit"
          className="boton boton-primario"
          disabled={guardando || categoriaId === miniatura.categoriaId}
        >
          {guardando ? "MOVIENDO..." : "MOVER"}
        </button>
      </form>
    </Modal>
  );
}

export default ModalMoverCategoria;
