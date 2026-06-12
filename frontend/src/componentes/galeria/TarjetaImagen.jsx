import { API_BASE_URL } from "../../constantes/api.constantes";

function TarjetaImagen({ miniatura, onMenuContextual }) {
  return (
    <a
      href={miniatura.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      onContextMenu={(evento) => onMenuContextual(evento, miniatura)}
    >
      <img className="thumb" src={API_BASE_URL + miniatura.miniatura} alt="" />
    </a>
  );
}

export default TarjetaImagen;
