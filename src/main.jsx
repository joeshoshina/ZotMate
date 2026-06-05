import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import uciFavicon from "./assets/uci.png";

const favicon = document.querySelector('link[rel="icon"]');
if (favicon) {
  favicon.href = uciFavicon;
} else {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = uciFavicon;
  document.head.appendChild(link);
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
