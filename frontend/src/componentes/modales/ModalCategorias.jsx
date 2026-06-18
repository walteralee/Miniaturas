// src/componentes/modales/ModalCategorias.jsx

import { useState } from "react";

import Entrada from "../comunes/Entrada";
import Boton from "../comunes/Boton";

function ModalCategorias({
  abierto,
  categorias,
  alCerrar,
  alCrearCategoria,
  alRenombrarCategoria,
  alEliminarCategoria,
}) {
  const [nombreNueva, setNombreNueva] = useState("");

  if (!abierto) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div
        className="update-modal categorias-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={alCerrar}>
          ✕
        </button>

        <h2>GESTIONAR CATEGORÍAS</h2>

        <div className="categorias-lista">
          {categorias
            .filter((categoria) => categoria.id !== 0)
            .map((categoria) => (
              <div key={categoria.id} className="categoria-item">
                <span>{categoria.nombre}</span>

                <div className="categoria-acciones">
                  <Boton
                    onClick={() => {
                      const nombre = prompt("Nuevo nombre:", categoria.nombre);

                      if (nombre && nombre.trim()) {
                        alRenombrarCategoria(categoria.id, nombre);
                      }
                    }}
                  >
                    RENOMBRAR
                  </Boton>

                  <Boton onClick={() => alEliminarCategoria(categoria.id)}>
                    ELIMINAR
                  </Boton>
                </div>
              </div>
            ))}
        </div>

        <hr />

        <div className="categoria-crear">
          <Entrada
            className="categoria-input"
            placeholder="Nombre de la nueva categoría"
            value={nombreNueva}
            onChange={(evento) => setNombreNueva(evento.target.value)}
          />
        </div>

        <Boton
          onClick={() => {
            const nombre = nombreNueva.trim();

            if (!nombre) {
              return;
            }

            alCrearCategoria(nombre);

            setNombreNueva("");
          }}
        >
          CREAR CATEGORÍA
        </Boton>
      </div>
    </div>
  );
}

export default ModalCategorias;
