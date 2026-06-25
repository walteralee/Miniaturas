import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./estilos/variables.css";
import "./estilos/global.css";
import "./estilos/layout.css";
import "./estilos/galeria.css";
import "./estilos/modal.css";
import "./estilos/carga.css";

import App from "./App.jsx";

alert(import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
