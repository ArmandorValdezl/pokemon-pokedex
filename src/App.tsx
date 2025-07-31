// src/App.tsx
import './index.css'; // Nuestros estilos globales
import './styles/pages.css'; // ¡Importamos los estilos de página!
import './styles/PokemonCard.css'; // Asegúrate que este ya está
import './styles/PokemonDetail.css'; // ¡Importa los estilos de detalle!
import { Outlet } from 'react-router-dom'; // Importa Outlet

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Outlet renderizará el componente de la ruta actual (WelcomePage, PokedexPage, etc.) */}
      <Outlet /> 
    </div>
  );
}

export default App;