import { useEffect } from "react";

import { eliminarMiniatura } from "../../servicios/miniaturas.servicio";

function MenuContextual({
  x,
  y,
  miniatura,
  recargarMiniaturas,
  alCerrar,
  alActualizar,
}) {
  useEffect(() => {
    function cerrarMenu() {
      alCerrar();
    }

    document.addEventListener("click", cerrarMenu);

    window.addEventListener("scroll", cerrarMenu);

    return () => {
      document.removeEventListener("click", cerrarMenu);

      window.removeEventListener("scroll", cerrarMenu);
    };
  }, [alCerrar]);

  async function manejarEliminar() {
    alCerrar();

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta miniatura?",
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarMiniatura(miniatura.id);

      await recargarMiniaturas();
    } catch (error) {
      console.error(error);
    }
  }

  function manejarActualizar() {
    alCerrar();

    alActualizar(miniatura);
  }

  return (
    <div
      className="menu-contextual"
      style={{
        position: "fixed",
        left: x,
        top: y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={manejarActualizar}>ACTUALIZAR</button>

      <button onClick={manejarEliminar}>BORRAR</button>
    </div>
  );
}

export default MenuContextual;
