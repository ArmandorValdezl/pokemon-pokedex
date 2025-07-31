// src/api/pokemonApi.ts
import axios from 'axios';

// 1. Crear una instancia de Axios para la PokéAPI
// Esto nos permite configurar una base URL y otros parámetros por defecto.
export const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000, // 10 segundos de timeout
});

// 2. Función para obtener una lista de Pokémon (con limit y offset)
export const getPokemonList = async (limit: number = 9, offset: number = 0) => {
  try {
    const response = await pokeApi.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data; // Devuelve los datos de la respuesta (results, count, next, previous)
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    throw error;
  }
};

// 3. Función para obtener detalles de un Pokémon específico por nombre o ID
export const getPokemonDetails = async (nameOrId: string | number) => {
  try {
    const response = await pokeApi.get(`/pokemon/${nameOrId}`);
    return response.data; // Devuelve los detalles completos del Pokémon
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${nameOrId}:`, error);
    throw error;
  }
};

// 4. Función para obtener todos los tipos de Pokémon
export const getPokemonTypes = async () => {
  try {
    const response = await pokeApi.get('/type');
    return response.data.results; // Devuelve la lista de tipos
  } catch (error) {
    console.error("Error fetching Pokémon types:", error);
    throw error;
  }
};