function BarraSuperior({
  categorias,
  categoriaSeleccionada,
  onCambiarCategoria,
  onAbrirModalCategorias,
  onAbrirModalAnnadir,
}) {
  return (
    <header className="barra-superior">
      <div className="barra-superior-izquierda">
        <h1>MINIATURAS</h1>

        <select
          className="selector-categorias"
          value={categoriaSeleccionada}
          onChange={(evento) => onCambiarCategoria(Number(evento.target.value))}
        >
          <option value={-1}>Todas</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="barra-superior-derecha">
        <button className="boton-categorias" onClick={onAbrirModalCategorias}>
          GESTIONAR CATEGORÍAS
        </button>

        <button className="boton-annadir" onClick={onAbrirModalAnnadir}>
          AÑADIR MINIATURA
        </button>
      </div>
    </header>
  );
}

export default BarraSuperior;
