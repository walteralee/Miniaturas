import { useEffect, useState } from "react";

import { obtenerMiniaturas } from "../servicios/miniaturas.servicio";

export function useMiniaturas() {
  const [miniaturas, setMiniaturas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState(null);

  async function recargarMiniaturas() {
    try {
      const datos = await obtenerMiniaturas();

      setMiniaturas(datos);

      setError(null);
    } catch (err) {
      console.error(err);

      setError(err);
    }
  }

  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await obtenerMiniaturas();

        setMiniaturas(datos);

        setError(null);
      } catch (err) {
        console.error(err);

        setError(err);
      } finally {
        setCargando(false);
      }
    }

    iniciar();
  }, []);

  return {
    miniaturas,
    cargando,
    error,
    recargarMiniaturas,
  };
}
