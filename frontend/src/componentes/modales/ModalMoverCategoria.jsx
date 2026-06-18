// src/componentes/modales/ModalMoverCategoria.jsx

import { useState } from "react";

function ModalMoverCategoria({
  abierto,
  categorias,
  miniatura,
  alCerrar,
  alMoverCategoria,
}) {
  const [categoriaId, setCategoriaId] = useState(0);

  if (!abierto || !miniatura) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div
        className="update-modal mover-categoria-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={alCerrar}>
          ✕
        </button>

        <h2>MOVER A</h2>

        <select
          className="mover-categoria-select"
          value={categoriaId}
          onChange={(evento) => setCategoriaId(Number(evento.target.value))}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <button
          className="mover-categoria-boton"
          onClick={() => alMoverCategoria(miniatura.id, categoriaId)}
        >
          MOVER
        </button>
      </div>
    </div>
  );
}

export default ModalMoverCategoria;
