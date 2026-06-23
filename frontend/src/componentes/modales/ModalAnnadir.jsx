import { useState } from "react";

import { crearMiniatura } from "../../servicios/miniaturas.servicio";

function ModalAnnadir({ abierto, categoriaSeleccionada, alCerrar }) {
  const [url, setUrl] = useState("");

  const [archivo, setArchivo] = useState(null);

  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();

    if (!url || !archivo) {
      alert("FALTAN DATOS");

      return;
    }

    try {
      setCargando(true);

      const formData = new FormData();

      formData.append("url", url);

      formData.append("miniatura", archivo);

      formData.append(
        "categoriaId",

        categoriaSeleccionada === -1 ? 0 : categoriaSeleccionada,
      );

      await crearMiniatura(formData);

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  if (!abierto) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="update-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={alCerrar}>
          ✕
        </button>

        <h2>AÑADIR</h2>

        <form onSubmit={manejarEnvio}>
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <label className="file-label">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setArchivo(e.target.files[0])}
            />
            📁 Seleccionar miniatura
          </label>

          {archivo && <p className="file-name">{archivo.name}</p>}

          <button type="submit">{cargando ? "SUBIENDO..." : "AÑADIR"}</button>
        </form>
      </div>
    </div>
  );
}

export default ModalAnnadir;
