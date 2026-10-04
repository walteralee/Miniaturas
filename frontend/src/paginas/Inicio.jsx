import { useCallback, useMemo, useState } from "react";

import { useMiniaturas } from "../hooks/useMiniaturas";
import { useCategorias } from "../hooks/useCategorias";
import { useMenuContextual } from "../hooks/useMenuContextual";

import {
  crearCategoria,
  renombrarCategoria,
  eliminarCategoria,
} from "../servicios/categorias.servicio";

import {
  eliminarMiniatura,
  moverMiniaturaCategoria,
} from "../servicios/miniaturas.servicio";

import { TODAS_LAS_CATEGORIAS } from "../constantes/api.constantes";

import { obtenerDominio } from "../utilidades/validacion.utilidades";

import BarraSuperior from "../componentes/layout/BarraSuperior";
import Galeria from "../componentes/galeria/Galeria";
import MenuContextual from "../componentes/galeria/MenuContextual";

import ModalAnnadir from "../componentes/modales/ModalAnnadir";
import ModalActualizar from "../componentes/modales/ModalActualizar";
import ModalCategorias from "../componentes/modales/ModalCategorias";
import ModalMoverCategoria from "../componentes/modales/ModalMoverCategoria";
import ModalConfirmar from "../componentes/modales/ModalConfirmar";

import Cargador from "../componentes/comunes/Cargador";

const CLAVE_CATEGORIA = "miniaturas.categoria";

const MODALES = {
  ANNADIR: "annadir",
  ACTUALIZAR: "actualizar",
  CATEGORIAS: "categorias",
  MOVER: "mover",
  BORRAR: "borrar",
};

// Recuerda la última categoría elegida entre visitas
function leerCategoriaGuardada() {
  try {
    const valor = localStorage.getItem(CLAVE_CATEGORIA);

    return valor === null ? TODAS_LAS_CATEGORIAS : Number(valor);
  } catch {
    return TODAS_LAS_CATEGORIAS;
  }
}

function guardarCategoria(id) {
  try {
    localStorage.setItem(CLAVE_CATEGORIA, String(id));
  } catch {
    // Sin almacenamiento disponible: simplemente no se recuerda
  }
}

function Inicio() {
  const {
    miniaturas,
    cargando: cargandoMiniaturas,
    error: errorMiniaturas,
    recargarMiniaturas,
  } = useMiniaturas();

  const {
    categorias,
    cargando: cargandoCategorias,
    error: errorCategorias,
    recargarCategorias,
  } = useCategorias();

  const { menu, abrir: abrirMenu, cerrar: cerrarMenu } = useMenuContextual();

  const [categoriaGuardada, setCategoriaGuardada] = useState(leerCategoriaGuardada);

  // { tipo, miniatura } del modal abierto, o null
  const [modal, setModal] = useState(null);

  // id -> marca de tiempo, para refrescar imágenes que cambian
  const [versiones, setVersiones] = useState({});

  // Si la categoría recordada ya no existe, se muestran todas
  const categoriaSeleccionada = categorias.some(
    (categoria) => categoria.id === categoriaGuardada,
  )
    ? categoriaGuardada
    : TODAS_LAS_CATEGORIAS;

  const conteo = useMemo(() => {
    const resultado = {};

    for (const miniatura of miniaturas) {
      resultado[miniatura.categoriaId] =
        (resultado[miniatura.categoriaId] ?? 0) + 1;
    }

    return resultado;
  }, [miniaturas]);

  const miniaturasFiltradas = useMemo(
    () =>
      categoriaSeleccionada === TODAS_LAS_CATEGORIAS
        ? miniaturas
        : miniaturas.filter(
            (miniatura) => miniatura.categoriaId === categoriaSeleccionada,
          ),
    [miniaturas, categoriaSeleccionada],
  );

  const cerrarModal = useCallback(() => setModal(null), []);

  function abrirModal(tipo, miniatura = null) {
    setModal({ tipo, miniatura });
  }

  function cambiarCategoria(id) {
    setCategoriaGuardada(id);

    guardarCategoria(id);
  }

  async function alGuardarMiniatura(miniatura) {
    setVersiones((actuales) => ({ ...actuales, [miniatura.id]: Date.now() }));

    cerrarModal();

    await recargarMiniaturas();
  }

  async function manejarMoverCategoria(miniaturaId, categoriaId) {
    await moverMiniaturaCategoria(miniaturaId, categoriaId);

    cerrarModal();

    await recargarMiniaturas();
  }

  async function manejarEliminarMiniatura() {
    await eliminarMiniatura(modal.miniatura.id);

    cerrarModal();

    await recargarMiniaturas();
  }

  async function manejarCrearCategoria(nombre) {
    await crearCategoria(nombre);

    await recargarCategorias();
  }

  async function manejarRenombrarCategoria(id, nombre) {
    await renombrarCategoria(id, nombre);

    await recargarCategorias();
  }

  async function manejarEliminarCategoria(id) {
    await eliminarCategoria(id);

    await Promise.all([recargarCategorias(), recargarMiniaturas()]);
  }

  if (cargandoMiniaturas || cargandoCategorias) {
    return <Cargador />;
  }

  const error = errorMiniaturas || errorCategorias;

  if (error) {
    return (
      <div className="pantalla-centrada">
        <h2>No se pudieron cargar las miniaturas</h2>

        <p>{error.message}. Comprueba que el servidor está en marcha.</p>

        <button
          type="button"
          className="boton boton-primario"
          onClick={() => {
            recargarCategorias();

            recargarMiniaturas();
          }}
        >
          REINTENTAR
        </button>
      </div>
    );
  }

  return (
    <>
      <BarraSuperior
        categorias={categorias}
        conteo={conteo}
        total={miniaturas.length}
        categoriaSeleccionada={categoriaSeleccionada}
        onCambiarCategoria={cambiarCategoria}
        onAbrirModalCategorias={() => abrirModal(MODALES.CATEGORIAS)}
        onAbrirModalAnnadir={() => abrirModal(MODALES.ANNADIR)}
      />

      <main>
        <Galeria
          miniaturas={miniaturasFiltradas}
          versiones={versiones}
          onMenuContextual={abrirMenu}
          onAnnadir={() => abrirModal(MODALES.ANNADIR)}
        />
      </main>

      {menu && (
        <MenuContextual
          x={menu.x}
          y={menu.y}
          miniatura={menu.miniatura}
          puedeMover={categorias.length > 1}
          alCerrar={cerrarMenu}
          alActualizar={(miniatura) => abrirModal(MODALES.ACTUALIZAR, miniatura)}
          alMoverCategoria={(miniatura) => abrirModal(MODALES.MOVER, miniatura)}
          alEliminar={(miniatura) => abrirModal(MODALES.BORRAR, miniatura)}
        />
      )}

      {/* Cada modal se monta al abrirse: así empieza siempre limpio */}
      {modal?.tipo === MODALES.ANNADIR && (
        <ModalAnnadir
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          alCerrar={cerrarModal}
          alGuardar={alGuardarMiniatura}
        />
      )}

      {modal?.tipo === MODALES.ACTUALIZAR && (
        <ModalActualizar
          miniatura={modal.miniatura}
          alCerrar={cerrarModal}
          alGuardar={alGuardarMiniatura}
        />
      )}

      {modal?.tipo === MODALES.MOVER && (
        <ModalMoverCategoria
          categorias={categorias}
          miniatura={modal.miniatura}
          alCerrar={cerrarModal}
          alMoverCategoria={manejarMoverCategoria}
        />
      )}

      {modal?.tipo === MODALES.BORRAR && (
        <ModalConfirmar
          titulo="BORRAR"
          mensaje={`¿Seguro que quieres borrar la miniatura de ${obtenerDominio(modal.miniatura.url)}? No se puede deshacer.`}
          textoConfirmar="BORRAR"
          alConfirmar={manejarEliminarMiniatura}
          alCerrar={cerrarModal}
        />
      )}

      {modal?.tipo === MODALES.CATEGORIAS && (
        <ModalCategorias
          categorias={categorias}
          conteo={conteo}
          alCerrar={cerrarModal}
          alCrearCategoria={manejarCrearCategoria}
          alRenombrarCategoria={manejarRenombrarCategoria}
          alEliminarCategoria={manejarEliminarCategoria}
        />
      )}
    </>
  );
}

export default Inicio;
