import { useState } from "react";

import Modal from "../comunes/Modal";
import SelectorImagen from "../comunes/SelectorImagen";
import MensajeError from "../comunes/MensajeError";

import { crearMiniatura } from "../../servicios/miniaturas.servicio";

import { esURLValida } from "../../utilidades/validacion.utilidades";

import {
  ID_SIN_CATEGORIA,
  TODAS_LAS_CATEGORIAS,
} from "../../constantes/api.constantes";

function ModalAnnadir({ categorias, categoriaSeleccionada, alCerrar, alGuardar }) {
  const [url, setUrl] = useState("");

  const [archivo, setArchivo] = useState(null);

  const [categoriaId, setCategoriaId] = useState(
    categoriaSeleccionada === TODAS_LAS_CATEGORIAS
      ? ID_SIN_CATEGORIA
      : categoriaSeleccionada,
  );

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (!esURLValida(url)) {
      setError("Introduce un enlace válido (debe empezar por http:// o https://)");

      return;
    }

    const formData = new FormData();

    formData.append("url", url.trim());

    formData.append("categoriaId", categoriaId);

    if (archivo) {
      formData.append("miniatura", archivo);
    }

    try {
      setGuardando(true);

      setError("");

      alGuardar(await crearMiniatura(formData));
    } catch (err) {
      setError(err.message);

      setGuardando(false);
    }
  }

  return (
    <Modal titulo="AÑADIR" alCerrar={alCerrar}>
      <form className="formulario" onSubmit={manejarEnvio}>
        <input
          type="url"
          placeholder="https://..."
          aria-label="Enlace"
          value={url}
          autoFocus
          onChange={(evento) => setUrl(evento.target.value)}
        />

        <select
          aria-label="Categoría"
          value={categoriaId}
          onChange={(evento) => setCategoriaId(Number(evento.target.value))}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <SelectorImagen
          archivo={archivo}
          texto="Elegir miniatura (opcional)"
          alCambiar={setArchivo}
        />

        {!archivo && (
          <p className="ayuda">
            Si no eliges imagen, se descargará automáticamente de la página.
          </p>
        )}

        <MensajeError mensaje={error} />

        <button type="submit" className="boton boton-primario" disabled={guardando}>
          {guardando
            ? archivo
              ? "SUBIENDO..."
              : "BUSCANDO MINIATURA..."
            : "AÑADIR"}
        </button>
      </form>
    </Modal>
  );
}

export default ModalAnnadir;
