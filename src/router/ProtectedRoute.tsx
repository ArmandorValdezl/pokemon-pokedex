// src/router/ProtectedRoute.tsx
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Por ahora, simulamos que no hay un nombre de entrenador.
  // Más adelante, esto vendrá de nuestro contexto global.
  const trainerName = localStorage.getItem('trainerName'); // Una forma simple de simular

  if (!trainerName) {
    // Si no hay nombre de entrenador, redirige a la página de bienvenida
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // Si hay nombre, renderiza el contenido de la ruta protegida
};

export default ProtectedRoute;