import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Fonts are bundled with the app, so no visitor data goes to a font service.
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/400-italic.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
