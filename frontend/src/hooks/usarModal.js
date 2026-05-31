import { useState } from "react";

export function useModal() {
  const [abierto, setAbierto] = useState(false);

  function abrir() {
    setAbierto(true);
  }

  function cerrar() {
    setAbierto(false);
  }

  return {
    abierto,
    abrir,
    cerrar,
  };
}
