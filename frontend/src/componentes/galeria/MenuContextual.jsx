import { useEffect } from "react";

function MenuContextual({
  x,
  y,
  miniatura,
  puedeMover,
  alCerrar,
  alActualizar,
  alMoverCategoria,
  alEliminar,
}) {
  useEffect(() => {
    function alPulsarTecla(evento) {
      if (evento.key === "Escape") {
        alCerrar();
      }
    }

    document.addEventListener("click", alCerrar);

    document.addEventListener("contextmenu", alCerrar);

    document.addEventListener("keydown", alPulsarTecla);

    window.addEventListener("scroll", alCerrar, true);

    window.addEventListener("resize", alCerrar);

    return () => {
      document.removeEventListener("click", alCerrar);

      document.removeEventListener("contextmenu", alCerrar);

      document.removeEventListener("keydown", alPulsarTecla);

      window.removeEventListener("scroll", alCerrar, true);

      window.removeEventListener("resize", alCerrar);
    };
  }, [alCerrar]);

  function ejecutar(accion) {
    alCerrar();

    accion(miniatura);
  }

  return (
    <div
      className="menu-contextual"
      role="menu"
      style={{ left: x, top: y }}
      onClick={(evento) => evento.stopPropagation()}
    >
      <button
        type="button"
        role="menuitem"
        className="menu-actualizar"
        onClick={() => ejecutar(alActualizar)}
      >
        ACTUALIZAR
      </button>

      {puedeMover && (
        <button
          type="button"
          role="menuitem"
          className="menu-mover"
          onClick={() => ejecutar(alMoverCategoria)}
        >
          MOVER A
        </button>
      )}

      <button
        type="button"
        role="menuitem"
        className="menu-borrar"
        onClick={() => ejecutar(alEliminar)}
      >
        BORRAR
      </button>
    </div>
  );
}

export default MenuContextual;
