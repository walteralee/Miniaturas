// src/hooks/useCategorias.js

import { useEffect, useState } from "react";

import { obtenerCategorias } from "../servicios/categorias.servicio";

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState(null);

  async function cargarCategorias() {
    try {
      setCargando(true);

      const datos = await obtenerCategorias();

      setCategorias(datos);

      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    async function inicializar() {
      await cargarCategorias();
    }

    inicializar();
  }, []);

  return {
    categorias,

    cargando,

    error,

    recargarCategorias: cargarCategorias,
  };
}
