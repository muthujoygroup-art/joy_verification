import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Vite dynamic import / preload error handler
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  console.warn('Vite preload error detected. Reloading page to fetch latest deployment chunks...');
  window.location.reload();
});

const rootElement = document.getElementById('root') || (() => {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
  return el;
})();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

