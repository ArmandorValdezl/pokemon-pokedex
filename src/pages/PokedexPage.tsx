// src/pages/PokedexPage.tsx
import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { useTrainer } from '../context/TrainerContext';
import { useNavigate } from 'react-router-dom';
import  usePokemon, { type PokemonListItem } from "../hooks/usePokemon"; // Importamos el hook de Pokémon
import PokemonCard from '../components/PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner'; // ¡Importa!
import ErrorMessage from '../components/ErrorMessage';     // ¡Importa!
import '../styles/PokemonCard.css';
import '../styles/PokedexPage.css';
import '../styles/LoadingSpinner.css'; 
import '../styles/ErrorMessage.css';   
import { getTypeIconUrl } from '../utils/typeIcons'; // ¡Importa la función de iconos para los filtros!

const PokedexPage = () => {
  const { state, clearTrainerName  } = useTrainer();
  const { name: trainerName } = state;
  const navigate = useNavigate();
 // Desestructuramos las funciones del hook usePokemon
  const { 
    pokemonList, 
    isLoading, 
    error, 
    fetchInitialPokemon, 
    fetchPokemonByName, 
    fetchNextPage,
    pokemonTypes, 
    filterByType,
    nextUrl, 
    currentFilterType 
    } = usePokemon();

  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonListItem | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Función para manejar la búsqueda al enviar el formulario
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedPokemon(null); // Limpiar el Pokémon buscado previamente
    setSearchError(null);     // Limpiar errores de búsqueda

       if (searchTerm.trim() === '') {
      // Si el campo de búsqueda está vacío, volvemos a mostrar la lista inicial
      fetchInitialPokemon();
      return;
    }

    try {
      const result = await fetchPokemonByName(searchTerm);
      if (result) {
        setSearchedPokemon(result);
      } else {
        setSearchError(`No se encontró el Pokémon "${searchTerm}".`);
      }
    } catch (err: any) {
      setSearchError(`Error al buscar Pokémon: ${err.message || 'Intenta de nuevo.'}`);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    clearTrainerName(); // Limpia el nombre del entrenador del contexto y localStorage
    navigate('/'); // Redirige a la página de bienvenida
  };

  // Efecto para recargar la lista inicial si el campo de búsqueda se vacía
  useEffect(() => {
    if (searchTerm.trim() === '' && searchedPokemon) {
      setSearchedPokemon(null); // Limpia el pokemon buscado
      fetchInitialPokemon(); // Recarga la lista paginada normal
    }
  }, [searchTerm, searchedPokemon, fetchInitialPokemon]);

  // Función para manejar el clic en un badge de tipo
  const handleTypeBadgeClick = (type: string | null) => {
    // Si ya estamos filtrando por este tipo, lo desactivamos (volvemos a "Todos")
    if (currentFilterType === type) {
      filterByType(null);
    } else {
      filterByType(type); // Aplicar el filtro por el tipo seleccionado
    }
    setSearchTerm(''); // Limpiar la búsqueda al filtrar por tipo
    setSearchedPokemon(null); // Limpiar el Pokémon buscado al filtrar
  };

  return (
    
    <div className="page-container pokedex-page-container">
      {/* ¡NUEVO! Botón de cerrar sesión en la esquina superior derecha */}
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>

      {trainerName ? (
        <h1 className="pokedex-title">¡Hola, Entrenador {trainerName}!</h1>
      ) : (
        <h1 className="pokedex-title">Bienvenido a la Pokédex</h1>
      )}
      
      <p>¡Aquí verás todos los Pokémon!</p>

      {/* Barra de Búsqueda Flotante */}
      <form onSubmit={handleSearchSubmit} className="search-bar-container">
        <input
          type="text"
          placeholder="Busca un Pokémon por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pokemon-search-input"
        />
        <button type="submit" className="search-button">Buscar</button>
      </form>

      {/* Sección de Filtros de Tipo como Badges */}
        <div className="type-filters-grid">
          {/* Badge para "Todos los tipos" */}
          <span 
            className={`pokemon-type-badge pokemon-type-all ${currentFilterType === null ? 'active' : ''}`}
            onClick={() => handleTypeBadgeClick(null)}
          >
            Todos
          </span>
          {pokemonTypes.map(type => (
            <span 
              key={type.name} 
              className={`pokemon-type-badge pokemon-type-${type.name} ${currentFilterType === type.name ? 'active' : ''}`}
              onClick={() => handleTypeBadgeClick(type.name)}
            >
              {/* Icono del tipo */}
              {getTypeIconUrl(type.name) && (
                <img src={getTypeIconUrl(type.name)} alt={type.name} className="pokemon-type-icon" />
              )}
              {type.name.toUpperCase()}
            </span>
          ))}
        </div>
      
      {/* Mensajes de error de búsqueda (aparecen si la búsqueda falla) */}
      {searchError && <ErrorMessage message={searchError} />}

      {/* RENDERIZADO CONDICIONAL: CARGA / ERROR GENERAL / LISTA DE POKÉMON */}
      {/* Si está cargando, muestra el spinner */}
      {isLoading && <LoadingSpinner />} 

      {/* Si hay un error general (de carga inicial o filtro), muestra el mensaje de error */}
      {!isLoading && error && <ErrorMessage message={error} onRetry={fetchInitialPokemon} />}
      
      {/* Si NO está cargando, NO hay error general, y NO hay un Pokémon buscado... */}
      {!isLoading && !error && !searchedPokemon && (
        <> {/* Fragmento para agrupar elementos sin añadir un div extra */}
          {/* Muestra la cuadrícula de Pokémon si hay elementos en la lista */}
          {pokemonList.length > 0 ? (
            <div className="pokemon-grid">
              {pokemonList.map((pokemon: PokemonListItem) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          ) : (
            // Mensaje si no se encontraron Pokémon para el filtro actual
            <p className="no-pokemon-found-message">No se encontraron Pokémon para el tipo seleccionado.</p>
          )}

          {/* Controles de paginación (solo si no hay búsqueda y hay más páginas) */}
          {pokemonList.length > 0 && nextUrl !== null && ( 
            <div className="pagination-controls">
              <button onClick={fetchNextPage} className="load-more-button">
                Cargar más Pokémon
              </button>
            </div>
          )}
        </>
      )}

      {/* Renderiza el Pokémon buscado si existe, sin paginación ni filtros */}
      {!isLoading && !error && searchedPokemon && (
        <div className="pokemon-grid">
          <PokemonCard key={searchedPokemon.id} pokemon={searchedPokemon} />
        </div>
      )}
    </div>
  );
};

export default PokedexPage;