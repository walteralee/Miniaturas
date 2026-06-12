function BarraSuperior({ onAbrirModalAnnadir }) {
  return (
    <header className="barra-superior">
      <h1>MINIATURAS</h1>

      <button onClick={onAbrirModalAnnadir}>AÑADIR MINIATURA</button>
    </header>
  );
}

export default BarraSuperior;
