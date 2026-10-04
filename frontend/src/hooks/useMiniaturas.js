import { useCallback, useEffect, useState } from "react";

import { obtenerMiniaturas } from "../servicios/miniaturas.servicio";

export function useMiniaturas() {
  const [miniaturas, setMiniaturas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState(null);

  const recargarMiniaturas = useCallback(async () => {
    try {
      const datos = await obtenerMiniaturas();

      setMiniaturas(datos);

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

    obtenerMiniaturas()
      .then((datos) => activo && setMiniaturas(datos))
      .catch((err) => activo && setError(err))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  return {
    miniaturas,
    cargando,
    error,
    recargarMiniaturas,
  };
}
