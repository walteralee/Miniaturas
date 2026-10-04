// src/hooks/useCategorias.js

import { useCallback, useEffect, useState } from "react";

import { obtenerCategorias } from "../servicios/categorias.servicio";

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState(null);

  const recargarCategorias = useCallback(async () => {
    try {
      const datos = await obtenerCategorias();

      setCategorias(datos);

      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial (ignora la respuesta si el componente ya se desmontó)
  useEffect(() => {
    let activo = true;

    obtenerCategorias()
      .then((datos) => activo && setCategorias(datos))
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  return {
    categorias,
    cargando,
    error,
    recargarCategorias,
  };
}
