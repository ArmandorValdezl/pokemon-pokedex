// src/pages/PokemonDetailPage.tsx
import { useParams, Link } from 'react-router-dom';
import usePokemonDetails from '../hooks/usePokemonDetails';
import { useTrainer } from '../context/TrainerContext';
import { getTypeIconUrl } from '../utils/typeIcons'; // ¡Importa la función de iconos!
import '../styles/PokemonDetail.css';

const PokemonDetailPage = () => {
  const { name } = useParams<{ name: string }>(); // Captura el nombre del Pokémon de la URL
  const { pokemon, isLoading, error } = usePokemonDetails(name); // Usa nuestro nuevo hook
  const { state } = useTrainer();
  const { name: trainerName } = state;

  if (isLoading) {
    return (
      <div className="page-container pokemon-detail-container loading">
        <p>Cargando detalles de {name || 'Pokémon'}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container pokemon-detail-container error">
        <p>Error: {error}</p>
        <Link to="/pokedex" className="back-to-pokedex-btn">Volver a la Pokédex</Link>
      </div>
    );
  }

  if (!pokemon) {
    // Esto podría pasar si el nombre no existe y no hubo un error 404 explícito
    return (
      <div className="page-container pokemon-detail-container not-found">
        <p>Pokémon no encontrado.</p>
        <Link to="/pokedex" className="back-to-pokedex-btn">Volver a la Pokédex</Link>
      </div>
    );
  }

  // Helper para formatear peso y altura (de decímetros/hectogramos a metros/kg)
  const formatHeight = (height: number) => `${(height / 10).toFixed(1)} m`;
  const formatWeight = (weight: number) => `${(weight / 10).toFixed(1)} kg`;

  // Mover solo los primeros 5-10 movimientos por nivel (ajusta el número si quieres)
  const displayedMoves = pokemon.moves.slice(0, 10); 

  return (
    <div className="page-container pokemon-detail-container">
      {/* Encabezado personalizado */}
      <header className="detail-header">
        <Link to="/pokedex" className="back-arrow">←</Link>
        <h1 className="detail-title">
          {trainerName ? `Pokédex de ${trainerName}` : 'Pokédex'}
        </h1>
        <div style={{width: '30px'}}></div> {/* Espacio para alinear el título */}
      </header>

      <div className="pokemon-detail-card">
        <div className="pokemon-detail-header">
          <h2 className="pokemon-detail-name">
            {pokemon.name.toUpperCase()} <span className="pokemon-detail-id">#{pokemon.id.toString().padStart(3, '0')}</span>
          </h2>
                <div className="pokemon-detail-types">
                    {pokemon.types.map(typeInfo => (
                    <span key={typeInfo.type.name} className={`pokemon-type-badge pokemon-type-${typeInfo.type.name}`}>
                        {/* ¡Añade el icono aquí! */}
                        {getTypeIconUrl(typeInfo.type.name) && (
                        <img src={getTypeIconUrl(typeInfo.type.name)} alt={typeInfo.type.name} className="pokemon-type-icon" />
                        )}
                        {typeInfo.type.name.toUpperCase()}
                    </span>
                    ))}
                </div>
        </div>

        <div className="pokemon-detail-main">
          <div className="pokemon-detail-image-container">
            <img 
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
              alt={pokemon.name} 
              className="pokemon-detail-image" 
            />
          </div>
          <div className="pokemon-detail-info">
            <div className="detail-stats-grid">
              <p><strong>Altura:</strong> {formatHeight(pokemon.height)}</p>
              <p><strong>Peso:</strong> {formatWeight(pokemon.weight)}</p>
              <p className="full-width"><strong>Habilidades:</strong></p>
              <ul className="abilities-list">
                {pokemon.abilities.map(abilityInfo => (
                  <li key={abilityInfo.ability.name}>{abilityInfo.ability.name.replace(/-/g, ' ').toUpperCase()}</li>
                ))}
              </ul>
            </div>

            <h3>Estadísticas Base</h3>
            <div className="stats-chart">
              {pokemon.stats.map(statInfo => (
                <div key={statInfo.stat.name} className="stat-item">
                  <span className="stat-name">{statInfo.stat.name.replace(/-/g, ' ').toUpperCase()}:</span>
                  <span className="stat-value">{statInfo.base_stat}</span>
                  <div className="stat-bar-container">
                    <div className="stat-bar" style={{ width: `${(statInfo.base_stat / 255) * 100}%` }}></div> {/* Max stat is 255 */}
                  </div>
                </div>
              ))}
            </div>

            <h3>Primeros Movimientos</h3>
            <ul className="moves-list">
              {displayedMoves.length > 0 ? (
                displayedMoves.map(moveInfo => (
                  <li key={moveInfo.move.name}>{moveInfo.move.name.replace(/-/g, ' ').toUpperCase()}</li>
                ))
              ) : (
                <li>No hay movimientos disponibles.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;