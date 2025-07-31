// src/components/LoadingSpinner.tsx
import '../styles/LoadingSpinner.css'; // Mantenemos los estilos CSS
import pokeballSVG from '../assets/pokeball.svg'; // ¡Importa tu SVG!

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      {/* Usamos el SVG directamente como una imagen */}
      <img src={pokeballSVG} alt="Cargando Pokebola" className="pokeball-spinner-svg" />
      <p className="loading-text">Cargando Pokémon...</p>
    </div>
  );
};

export default LoadingSpinner;