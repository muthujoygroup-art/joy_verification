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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
