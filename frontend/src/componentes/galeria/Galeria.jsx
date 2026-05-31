import TarjetaImagen from "./TarjetaImagen";

function Galeria({ miniaturas, onMenuContextual }) {
  return (
    <div className="galeria">
      {miniaturas.map((miniatura) => (
        <TarjetaImagen
          key={miniatura.id}
          miniatura={miniatura}
          onMenuContextual={onMenuContextual}
        />
      ))}
    </div>
  );
}

export default Galeria;
