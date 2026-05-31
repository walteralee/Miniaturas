import { useState } from "react";

import { useMiniaturas } from "../hooks/useMiniaturas";
import { useMenuContextual } from "../hooks/usarMenuContextual";

import BarraSuperior from "../componentes/layout/BarraSuperior";
import Galeria from "../componentes/galeria/Galeria";
import MenuContextual from "../componentes/galeria/MenuContextual";

import ModalAnnadir from "../componentes/modales/ModalAnnadir";
import ModalActualizar from "../componentes/modales/ModalActualizar";

import Cargador from "../componentes/comunes/Cargador";

function Inicio() {
  const { miniaturas, cargando, recargarMiniaturas } = useMiniaturas();

  const { menu, abrir, cerrar } = useMenuContextual();

  const [modalAnnadirAbierto, setModalAnnadirAbierto] = useState(false);

  const [modalActualizarAbierto, setModalActualizarAbierto] = useState(false);

  const [miniaturaSeleccionada, setMiniaturaSeleccionada] = useState(null);

  function abrirModalActualizar(miniatura) {
    setMiniaturaSeleccionada(miniatura);

    setModalActualizarAbierto(true);
  }

  function cerrarModalActualizar() {
    setModalActualizarAbierto(false);

    setMiniaturaSeleccionada(null);
  }

  if (cargando) {
    return <Cargador />;
  }

  return (
    <>
      <BarraSuperior onAbrirModalAnnadir={() => setModalAnnadirAbierto(true)} />

      <ModalAnnadir
        abierto={modalAnnadirAbierto}
        alCerrar={() => setModalAnnadirAbierto(false)}
      />

      <ModalActualizar
        abierto={modalActualizarAbierto}
        miniatura={miniaturaSeleccionada}
        alCerrar={cerrarModalActualizar}
      />

      <Galeria miniaturas={miniaturas} onMenuContextual={abrir} />

      {menu && (
        <MenuContextual
          x={menu.x}
          y={menu.y}
          miniatura={menu.miniatura}
          recargarMiniaturas={recargarMiniaturas}
          alCerrar={cerrar}
          alActualizar={abrirModalActualizar}
        />
      )}
    </>
  );
}

export default Inicio;
