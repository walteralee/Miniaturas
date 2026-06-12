import { useState } from "react";

import { actualizarMiniatura } from "../../servicios/miniaturas.servicio";

function ModalActualizar({ abierto, miniatura, alCerrar }) {
  const [archivo, setArchivo] = useState(null);

  async function manejarEnvio(e) {
    e.preventDefault();

    if (!e.target.url.value.trim()) {
      alert("LA URL ES OBLIGATORIA");

      return;
    }

    try {
      const formData = new FormData();

      formData.append("url", e.target.url.value);

      if (archivo) {
        formData.append("miniatura", archivo);
      }

      await actualizarMiniatura(miniatura.id, formData);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  if (!abierto || !miniatura) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="update-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={alCerrar}>
          ✕
        </button>

        <h2>ACTUALIZAR</h2>

        <form onSubmit={manejarEnvio}>
          <input name="url" type="text" defaultValue={miniatura.url} />

          <label className="file-label">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setArchivo(e.target.files[0])}
            />
            📁 Cambiar miniatura
          </label>

          {archivo && <p className="file-name">{archivo.name}</p>}

          <button type="submit">ACTUALIZAR</button>
        </form>
      </div>
    </div>
  );
}

export default ModalActualizar;
