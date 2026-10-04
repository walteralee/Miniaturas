import { TODAS_LAS_CATEGORIAS } from "../../constantes/api.constantes";

function BarraSuperior({
  categorias,
  conteo,
  total,
  categoriaSeleccionada,
  onCambiarCategoria,
  onAbrirModalCategorias,
  onAbrirModalAnnadir,
}) {
  return (
    <header className="barra-superior">
      <div className="barra-superior-izquierda">
        <h1>
          <img src="/logo.png" alt="" className="barra-logo" />
          MINIATURAS
        </h1>

        <select
          className="selector-categorias"
          aria-label="Filtrar por categoría"
          value={categoriaSeleccionada}
          onChange={(evento) => onCambiarCategoria(Number(evento.target.value))}
        >
          <option value={TODAS_LAS_CATEGORIAS}>Todas ({total})</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre} ({conteo[categoria.id] ?? 0})
            </option>
          ))}
        </select>
      </div>

      <div className="barra-superior-derecha">
        <button
          type="button"
          className="boton boton-aviso"
          onClick={onAbrirModalCategorias}
        >
          GESTIONAR CATEGORÍAS
        </button>

        <button
          type="button"
          className="boton boton-primario"
          onClick={onAbrirModalAnnadir}
        >
          AÑADIR MINIATURA
        </button>
      </div>
    </header>
  );
}

export default BarraSuperior;
