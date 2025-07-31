// src/hooks/usePokemonDetails.ts
import { useState, useEffect } from 'react';
import { getPokemonDetails } from '../api/pokemonApi'; // Importamos la función de la API

// Definir una interfaz más completa para los detalles del Pokémon
export interface PokemonDetail {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
      dream_world?: {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string }; version_group_details: any[] }[]; // Los movimientos son complejos, simplificamos
}

interface UsePokemonDetailsResult {
  pokemon: PokemonDetail | null;
  isLoading: boolean;
  error: string | null;
}

const usePokemonDetails = (nameOrId: string | number | undefined): UsePokemonDetailsResult => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!nameOrId) {
        setPokemon(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await getPokemonDetails(nameOrId);
        setPokemon(data);
      } catch (err: any) {
        console.error(`Error fetching Pokémon details for ${nameOrId}:`, err);
        if (err.response && err.response.status === 404) {
          setError(`Pokémon '${nameOrId}' no encontrado.`);
        } else {
          setError("No se pudieron cargar los detalles del Pokémon. Intenta de nuevo.");
        }
        setPokemon(null); // Limpiar Pokémon si hay error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [nameOrId]); // Se re-ejecuta cada vez que nameOrId cambia

  return { pokemon, isLoading, error };
};

export default usePokemonDetails;