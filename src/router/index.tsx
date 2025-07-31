// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import WelcomePage from '../pages/WelcomePage';
import PokedexPage from '../pages/PokedexPage';
import PokemonDetailPage from '../pages/PokemonDetailPage';
import ProtectedRoute from './ProtectedRoute'; // Crearemos este componente
import App from '../App'; // App será nuestro layout base

// Definimos nuestras rutas
export const router = createBrowserRouter([
  {
    path: '/', // Ruta Raíz (Pública)
    element: <App />, // App será el layout general
    children: [
      {
        index: true, // Esto significa que es la ruta por defecto cuando el path es '/'
        element: <WelcomePage />,
      },
      {
        path: 'pokedex', // Ruta Pokédex (Protegida)
        element: <ProtectedRoute> <PokedexPage /> </ProtectedRoute>, // Envuelto en la ruta protegida
      },
      {
        path: 'pokedex/:name', // Ruta de Detalle de Pokémon
        element: <ProtectedRoute> <PokemonDetailPage /> </ProtectedRoute>, // También protegida
      },
      {
        path: '*',
        element: <div>404 Not Found</div>
      }
    ],
  },
]);