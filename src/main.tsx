import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AIContentProvider } from "./context/AIContentContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AIContentProvider>
      <App />
    </AIContentProvider>
  </React.StrictMode>
);
