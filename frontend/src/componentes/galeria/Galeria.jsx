import TarjetaImagen from "./TarjetaImagen";

function Galeria({ miniaturas, versiones, onMenuContextual, onAnnadir }) {
  if (miniaturas.length === 0) {
    return (
      <div className="galeria-vacia">
        <p>No hay miniaturas aquí todavía.</p>

        <button type="button" className="boton boton-primario" onClick={onAnnadir}>
          AÑADIR MINIATURA
        </button>
      </div>
    );
  }

  return (
    <div className="galeria">
      {miniaturas.map((miniatura) => (
        <TarjetaImagen
          key={miniatura.id}
          miniatura={miniatura}
          version={versiones[miniatura.id]}
          onMenuContextual={onMenuContextual}
        />
      ))}
    </div>
  );
}

export default Galeria;
