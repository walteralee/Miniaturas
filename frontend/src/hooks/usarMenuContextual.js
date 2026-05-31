import { useState } from "react";

export function useMenuContextual() {
  const [menu, setMenu] = useState(null);

  function abrir(evento, miniatura) {
    evento.preventDefault();

    setMenu({
      x: evento.clientX,
      y: evento.clientY,
      miniatura,
    });
  }

  function cerrar() {
    setMenu(null);
  }

  return {
    menu,
    abrir,
    cerrar,
  };
}
