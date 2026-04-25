import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Global error handler for debugging white screen
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;">
      <h1 style="color: #ff4444;">Runtime Error</h1>
      <pre style="background: #222; padding: 15px; border-radius: 8px; overflow: auto;">${message}\nat ${source}:${lineno}:${colno}</pre>
    </div>`;
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
