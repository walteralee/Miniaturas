import { useEffect } from "react";

import { eliminarMiniatura } from "../../servicios/miniaturas.servicio";

function MenuContextual({
  x,
  y,
  miniatura,
  categorias,
  recargarMiniaturas,
  alCerrar,
  alActualizar,
  alMoverCategoria,
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

  function manejarMoverCategoria() {
    alCerrar();

    alMoverCategoria(miniatura);
  }

  const mostrarMoverCategoria =
    categorias.filter((categoria) => categoria.id !== 0).length > 0;

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

      {mostrarMoverCategoria && (
        <button onClick={manejarMoverCategoria}>MOVER A</button>
      )}

      <button onClick={manejarEliminar}>BORRAR</button>
    </div>
  );
}

export default MenuContextual;
