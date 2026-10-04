import { useEffect, useMemo } from "react";

const FORMATOS = "image/jpeg,image/png,image/webp,image/gif,image/avif";

// Botón para elegir imagen con vista previa y opción de quitarla
function SelectorImagen({ archivo, texto, alCambiar }) {
  const vistaPrevia = useMemo(
    () => (archivo ? URL.createObjectURL(archivo) : null),
    [archivo],
  );

  useEffect(
    () => () => {
      if (vistaPrevia) {
        URL.revokeObjectURL(vistaPrevia);
      }
    },
    [vistaPrevia],
  );

  if (archivo) {
    return (
      <div className="selector-imagen-elegida">
        <img src={vistaPrevia} alt="Vista previa" />

        <span title={archivo.name}>{archivo.name}</span>

        <button
          type="button"
          className="boton boton-secundario"
          onClick={() => alCambiar(null)}
        >
          QUITAR
        </button>
      </div>
    );
  }

  return (
    <label className="selector-imagen">
      <input
        type="file"
        accept={FORMATOS}
        hidden
        onChange={(evento) => alCambiar(evento.target.files[0] ?? null)}
      />
      📁 {texto}
    </label>
  );
}

export default SelectorImagen;
