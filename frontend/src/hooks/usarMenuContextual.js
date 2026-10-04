import { useCallback, useState } from "react";

// Tamaño aproximado del menú, para que nunca se salga de la pantalla
const ANCHO_MENU = 190;

const ALTO_MENU = 160;

const MARGEN = 8;

function limitar(valor, maximo) {
  return Math.max(MARGEN, Math.min(valor, maximo - MARGEN));
}

export function useMenuContextual() {
  const [menu, setMenu] = useState(null);

  // Sirve tanto para clic derecho como para el botón "⋯" de cada tarjeta
  const abrir = useCallback((evento, miniatura) => {
    evento.preventDefault();

    evento.stopPropagation();

    let x = evento.clientX;

    let y = evento.clientY;

    // Abierto con el botón (o con el teclado): se coloca bajo el botón
    if (evento.type === "click") {
      const caja = evento.currentTarget.getBoundingClientRect();

      x = caja.right - ANCHO_MENU;

      y = caja.bottom + 6;
    }

    setMenu({
      x: limitar(x, window.innerWidth - ANCHO_MENU),
      y: limitar(y, window.innerHeight - ALTO_MENU),
      miniatura,
    });
  }, []);

  const cerrar = useCallback(() => {
    setMenu(null);
  }, []);

  return {
    menu,
    abrir,
    cerrar,
  };
}
