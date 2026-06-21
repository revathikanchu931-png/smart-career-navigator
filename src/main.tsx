import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg = reason?.message || String(reason || "");
    if (msg.includes("WebSocket") || msg.includes("websocket") || msg.includes("vite")) {
      event.preventDefault();
    }
  });

  window.addEventListener("error", (event) => {
    const msg = event.message || "";
    if (msg.includes("WebSocket") || msg.includes("websocket") || msg.includes("vite")) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
