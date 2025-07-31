// src/main.tsx
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { TrainerProvider } from './context/TrainerContext';

// Obtener el elemento 'root' del DOM
const rootElement = document.getElementById('root');

// Asegúrate de que el elemento exista antes de intentar renderizar
if (rootElement) {
  // Verificamos si ya existe una raíz de React en este elemento
  // Esto es una solución común para el problema de "doble createRoot" en desarrollo con HMR
  const root = ReactDOM.createRoot(rootElement);

root.render(
    <StrictMode>
      {/* ¡AQUÍ ESTÁ EL CAMBIO CLAVE! Envolvemos RouterProvider con TrainerProvider */}
      <TrainerProvider>
        <RouterProvider router={router} />
      </TrainerProvider>
    </StrictMode>,
  );
} else {
  console.error("No se encontró el elemento con id 'root' en el DOM.");
}