import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { withProviders } from "./utils/providers.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{withProviders(<App />)}</React.StrictMode>
);
