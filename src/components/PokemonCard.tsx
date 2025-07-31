// src/components/PokemonCard.tsx
import { useNavigate } from 'react-router-dom';
import { type PokemonListItem } from '../hooks/usePokemon';
import { getTypeIconUrl } from '../utils/typeIcons'; // ¡Importa la función de iconos!

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pokedex/${pokemon.name}`);
  };

  return (
    <div className="pokemon-card" onClick={handleClick}>
      <div className="pokemon-card-image-container">
        {pokemon.imageUrl && (
          <img src={pokemon.imageUrl} alt={pokemon.name} className="pokemon-card-image" />
        )}
      </div>
      <div className="pokemon-card-info">
        <p className="pokemon-card-id">#{pokemon.id?.toString().padStart(3, '0')}</p>
        <h2 className="pokemon-card-name">{pokemon.name.toUpperCase()}</h2>
        <div className="pokemon-card-types">
          {pokemon.types && pokemon.types.map(typeInfo => (
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
    </div>
  );
};

export default PokemonCard;