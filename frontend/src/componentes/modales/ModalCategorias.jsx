// src/componentes/modales/ModalCategorias.jsx

import { useState } from "react";

import Modal from "../comunes/Modal";
import MensajeError from "../comunes/MensajeError";

import {
  ID_SIN_CATEGORIA,
  LONGITUD_MAXIMA_NOMBRE_CATEGORIA,
} from "../../constantes/api.constantes";

function ModalCategorias({
  categorias,
  conteo,
  alCerrar,
  alCrearCategoria,
  alRenombrarCategoria,
  alEliminarCategoria,
}) {
  const [nombreNueva, setNombreNueva] = useState("");

  // { id, nombre } de la categoría que se está renombrando
  const [edicion, setEdicion] = useState(null);

  // id de la categoría pendiente de confirmar su borrado
  const [borrando, setBorrando] = useState(null);

  const [ocupado, setOcupado] = useState(false);

  const [error, setError] = useState("");

  async function ejecutar(accion) {
    try {
      setOcupado(true);

      setError("");

      await accion();

      return true;
    } catch (err) {
      setError(err.message);

      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function crear(evento) {
    evento.preventDefault();

    const nombre = nombreNueva.trim();

    if (!nombre) {
      return;
    }

    if (await ejecutar(() => alCrearCategoria(nombre))) {
      setNombreNueva("");
    }
  }

  async function guardarEdicion(evento) {
    evento.preventDefault();

    const nombre = edicion.nombre.trim();

    if (!nombre) {
      return;
    }

    if (await ejecutar(() => alRenombrarCategoria(edicion.id, nombre))) {
      setEdicion(null);
    }
  }

  async function eliminar(id) {
    if (await ejecutar(() => alEliminarCategoria(id))) {
      setBorrando(null);
    }
  }

  const editables = categorias.filter(
    (categoria) => categoria.id !== ID_SIN_CATEGORIA,
  );

  return (
    <Modal titulo="GESTIONAR CATEGORÍAS" className="modal-ancho" alCerrar={alCerrar}>
      <div className="categorias-lista">
        {editables.length === 0 && (
          <p className="ayuda">Todavía no has creado ninguna categoría.</p>
        )}

        {editables.map((categoria) => {
          if (edicion?.id === categoria.id) {
            return (
              <form
                key={categoria.id}
                className="categoria-item"
                onSubmit={guardarEdicion}
              >
                <input
                  type="text"
                  aria-label="Nuevo nombre"
                  value={edicion.nombre}
                  maxLength={LONGITUD_MAXIMA_NOMBRE_CATEGORIA}
                  autoFocus
                  onChange={(evento) =>
                    setEdicion({ ...edicion, nombre: evento.target.value })
                  }
                />

                <div className="categoria-acciones">
                  <button type="submit" className="boton boton-primario" disabled={ocupado}>
                    GUARDAR
                  </button>

                  <button
                    type="button"
                    className="boton boton-secundario"
                    onClick={() => setEdicion(null)}
                  >
                    CANCELAR
                  </button>
                </div>
              </form>
            );
          }

          if (borrando === categoria.id) {
            const cantidad = conteo[categoria.id] ?? 0;

            return (
              <div key={categoria.id} className="categoria-item categoria-item-peligro">
                <span>
                  ¿Eliminar «{categoria.nombre}»?
                  {cantidad > 0 &&
                    ` Sus ${cantidad} miniaturas pasarán a "Sin categoría".`}
                </span>

                <div className="categoria-acciones">
                  <button
                    type="button"
                    className="boton boton-peligro"
                    disabled={ocupado}
                    onClick={() => eliminar(categoria.id)}
                  >
                    ELIMINAR
                  </button>

                  <button
                    type="button"
                    className="boton boton-secundario"
                    onClick={() => setBorrando(null)}
                  >
                    CANCELAR
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={categoria.id} className="categoria-item">
              <span>
                {categoria.nombre}
                <small> · {conteo[categoria.id] ?? 0}</small>
              </span>

              <div className="categoria-acciones">
                <button
                  type="button"
                  className="boton boton-secundario"
                  onClick={() => {
                    setBorrando(null);

                    setEdicion({ id: categoria.id, nombre: categoria.nombre });
                  }}
                >
                  RENOMBRAR
                </button>

                <button
                  type="button"
                  className="boton boton-peligro"
                  onClick={() => {
                    setEdicion(null);

                    setBorrando(categoria.id);
                  }}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <hr />

      <form className="formulario" onSubmit={crear}>
        <input
          type="text"
          placeholder="Nombre de la nueva categoría"
          aria-label="Nombre de la nueva categoría"
          value={nombreNueva}
          maxLength={LONGITUD_MAXIMA_NOMBRE_CATEGORIA}
          onChange={(evento) => setNombreNueva(evento.target.value)}
        />

        <MensajeError mensaje={error} />

        <button
          type="submit"
          className="boton boton-primario"
          disabled={ocupado || !nombreNueva.trim()}
        >
          CREAR CATEGORÍA
        </button>
      </form>
    </Modal>
  );
}

export default ModalCategorias;
