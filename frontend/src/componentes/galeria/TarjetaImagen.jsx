import { MINIATURA_POR_DEFECTO } from "../../constantes/api.constantes";

import { obtenerDominio } from "../../utilidades/validacion.utilidades";

function TarjetaImagen({ miniatura, version, onMenuContextual }) {
  const dominio = obtenerDominio(miniatura.url);

  // "version" cambia al actualizar la imagen y obliga a recargarla
  const src = version
    ? `${miniatura.miniatura}?v=${version}`
    : miniatura.miniatura;

  return (
    <div
      className="tarjeta"
      onContextMenu={(evento) => onMenuContextual(evento, miniatura)}
    >
      <a
        href={miniatura.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tarjeta-enlace"
        title={miniatura.url}
      >
        <img
          className="tarjeta-imagen"
          src={src}
          alt={`Miniatura de ${dominio}`}
          loading="lazy"
          decoding="async"
          onError={(evento) => {
            // Imagen perdida: se muestra la de por defecto (una sola vez)
            if (!evento.currentTarget.src.endsWith(MINIATURA_POR_DEFECTO)) {
              evento.currentTarget.src = MINIATURA_POR_DEFECTO;
            }
          }}
        />

        <span className="tarjeta-dominio">{dominio}</span>
      </a>

      <button
        type="button"
        className="tarjeta-opciones"
        aria-label={`Opciones de ${dominio}`}
        onClick={(evento) => onMenuContextual(evento, miniatura)}
      >
        ⋯
      </button>
    </div>
  );
}

export default TarjetaImagen;
