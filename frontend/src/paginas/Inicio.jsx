import { useState } from "react";

import { useMiniaturas } from "../hooks/useMiniaturas";
import { useCategorias } from "../hooks/useCategorias";

import { useMenuContextual } from "../hooks/usarMenuContextual";

import {
  crearCategoria,
  renombrarCategoria,
  eliminarCategoria,
} from "../servicios/categorias.servicio";

import { moverMiniaturaCategoria } from "../servicios/miniaturas.servicio";

import BarraSuperior from "../componentes/layout/BarraSuperior";
import Galeria from "../componentes/galeria/Galeria";
import MenuContextual from "../componentes/galeria/MenuContextual";

import ModalAnnadir from "../componentes/modales/ModalAnnadir";
import ModalActualizar from "../componentes/modales/ModalActualizar";
import ModalCategorias from "../componentes/modales/ModalCategorias";
import ModalMoverCategoria from "../componentes/modales/ModalMoverCategoria";

import Cargador from "../componentes/comunes/Cargador";

function Inicio() {
  const { miniaturas, cargando, recargarMiniaturas } = useMiniaturas();

  const { categorias, recargarCategorias } = useCategorias();

  const { menu, abrir, cerrar } = useMenuContextual();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(-1);

  const [modalAnnadirAbierto, setModalAnnadirAbierto] = useState(false);

  const [modalActualizarAbierto, setModalActualizarAbierto] = useState(false);

  const [modalCategoriasAbierto, setModalCategoriasAbierto] = useState(false);

  const [modalMoverCategoriaAbierto, setModalMoverCategoriaAbierto] =
    useState(false);

  const [miniaturaSeleccionada, setMiniaturaSeleccionada] = useState(null);

  function abrirModalActualizar(miniatura) {
    setMiniaturaSeleccionada(miniatura);

    setModalActualizarAbierto(true);
  }

  function cerrarModalActualizar() {
    setModalActualizarAbierto(false);

    setMiniaturaSeleccionada(null);
  }

  function abrirModalMoverCategoria(miniatura) {
    setMiniaturaSeleccionada(miniatura);

    setModalMoverCategoriaAbierto(true);
  }

  async function manejarCrearCategoria(nombre) {
    try {
      await crearCategoria(nombre);

      await recargarCategorias();
    } catch {
      alert("Ya existe una categoría con ese nombre.");
    }
  }

  async function manejarRenombrarCategoria(id, nombre) {
    try {
      await renombrarCategoria(id, nombre);

      await recargarCategorias();
    } catch {
      alert("Ya existe una categoría con ese nombre.");
    }
  }

  async function manejarEliminarCategoria(id) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta categoría?",
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarCategoria(id);

      setCategoriaSeleccionada(-1);

      await recargarCategorias();

      await recargarMiniaturas();
    } catch (error) {
      console.error(error);
    }
  }

  async function manejarMoverCategoria(miniaturaId, categoriaId) {
    try {
      await moverMiniaturaCategoria(miniaturaId, categoriaId);

      await recargarMiniaturas();

      setModalMoverCategoriaAbierto(false);
    } catch (error) {
      console.error(error);
    }
  }

  const miniaturasFiltradas =
    categoriaSeleccionada === -1
      ? miniaturas
      : miniaturas.filter(
          (miniatura) =>
            Number(miniatura.categoriaId) === Number(categoriaSeleccionada),
        );

  if (cargando) {
    return <Cargador />;
  }

  return (
    <>
      <BarraSuperior
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        onCambiarCategoria={setCategoriaSeleccionada}
        onAbrirModalCategorias={() => setModalCategoriasAbierto(true)}
        onAbrirModalAnnadir={() => setModalAnnadirAbierto(true)}
      />

      <ModalAnnadir
        abierto={modalAnnadirAbierto}
        categoriaSeleccionada={categoriaSeleccionada}
        alCerrar={() => setModalAnnadirAbierto(false)}
      />

      <ModalActualizar
        abierto={modalActualizarAbierto}
        miniatura={miniaturaSeleccionada}
        alCerrar={cerrarModalActualizar}
      />

      <ModalCategorias
        abierto={modalCategoriasAbierto}
        categorias={categorias}
        alCerrar={() => setModalCategoriasAbierto(false)}
        alCrearCategoria={manejarCrearCategoria}
        alRenombrarCategoria={manejarRenombrarCategoria}
        alEliminarCategoria={manejarEliminarCategoria}
      />

      <ModalMoverCategoria
        abierto={modalMoverCategoriaAbierto}
        categorias={categorias}
        miniatura={miniaturaSeleccionada}
        alCerrar={() => setModalMoverCategoriaAbierto(false)}
        alMoverCategoria={manejarMoverCategoria}
      />

      <Galeria miniaturas={miniaturasFiltradas} onMenuContextual={abrir} />

      {menu && (
        <MenuContextual
          x={menu.x}
          y={menu.y}
          miniatura={menu.miniatura}
          categorias={categorias}
          recargarMiniaturas={recargarMiniaturas}
          alCerrar={cerrar}
          alActualizar={abrirModalActualizar}
          alMoverCategoria={abrirModalMoverCategoria}
        />
      )}
    </>
  );
}

export default Inicio;
