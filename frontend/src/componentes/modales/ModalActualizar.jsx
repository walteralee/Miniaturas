import { useState } from "react";

import Modal from "../comunes/Modal";
import SelectorImagen from "../comunes/SelectorImagen";
import MensajeError from "../comunes/MensajeError";

import { actualizarMiniatura } from "../../servicios/miniaturas.servicio";

import { esURLValida } from "../../utilidades/validacion.utilidades";

function ModalActualizar({ miniatura, alCerrar, alGuardar }) {
  const [url, setUrl] = useState(miniatura.url);

  const [archivo, setArchivo] = useState(null);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");

  const urlCambiada = url.trim() !== miniatura.url;

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (!esURLValida(url)) {
      setError("Introduce un enlace válido (debe empezar por http:// o https://)");

      return;
    }

    if (!urlCambiada && !archivo) {
      alCerrar();

      return;
    }

    const formData = new FormData();

    formData.append("url", url.trim());

    if (archivo) {
      formData.append("miniatura", archivo);
    }

    try {
      setGuardando(true);

      setError("");

      alGuardar(await actualizarMiniatura(miniatura.id, formData));
    } catch (err) {
      setError(err.message);

      setGuardando(false);
    }
  }

  return (
    <Modal titulo="ACTUALIZAR" alCerrar={alCerrar}>
      <form className="formulario" onSubmit={manejarEnvio}>
        <input
          type="url"
          aria-label="Enlace"
          value={url}
          onChange={(evento) => setUrl(evento.target.value)}
        />

        <SelectorImagen
          archivo={archivo}
          texto="Cambiar miniatura"
          alCambiar={setArchivo}
        />

        {urlCambiada && !archivo && (
          <p className="ayuda">
            Al cambiar el enlace sin elegir imagen, se descargará la nueva
            automáticamente.
          </p>
        )}

        <MensajeError mensaje={error} />

        <button type="submit" className="boton boton-primario" disabled={guardando}>
          {guardando ? "GUARDANDO..." : "ACTUALIZAR"}
        </button>
      </form>
    </Modal>
  );
}

export default ModalActualizar;
