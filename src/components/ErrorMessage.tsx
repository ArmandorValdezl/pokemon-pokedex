// src/components/ErrorMessage.tsx
import '../styles/ErrorMessage.css'; // Crearemos este archivo CSS
import { Link } from 'react-router-dom'; // Para el botón de "Volver"

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void; // Función opcional para reintentar
  backToPokedex?: boolean; // Booleano para mostrar el botón "Volver a Pokédex"
}

const ErrorMessage = ({ message, onRetry, backToPokedex }: ErrorMessageProps) => {
  return (
    <div className="error-message-container">
      <div className="error-icon">❌</div> {/* Puedes reemplazar con un SVG de error si quieres */}
      <h2 className="error-title">¡Oops! Algo salió mal.</h2>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-button">
          Intentar de nuevo
        </button>
      )}
      {backToPokedex && (
        <Link to="/pokedex" className="error-back-button">
          Volver a la Pokédex
        </Link>
      )}
    </div>
  );
};

export default ErrorMessage;