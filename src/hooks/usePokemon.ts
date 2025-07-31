// src/hooks/usePokemon.ts
import { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getPokemonDetails, getPokemonTypes, pokeApi } from '../api/pokemonApi'; // Importa pokeApi para el filtro por tipo

// Interfaz para un elemento de la lista de Pokémon
export interface PokemonListItem {
  name: string;
  url: string;
  id?: number;
  imageUrl?: string;
  types?: { type: { name: string } }[];
}

// Interfaz para un tipo de Pokémon (como los que devuelve la API /type)
interface PokemonType {
  name: string;
  url: string;
}

// Interfaz para el resultado del custom hook usePokemon
interface UsePokemonResult {
  pokemonList: PokemonListItem[];
  isLoading: boolean;
  error: string | null;
  fetchInitialPokemon: () => Promise<void>; // Función para recargar la lista inicial (ej. al limpiar búsqueda)
  fetchNextPage: () => Promise<void>; // Para la paginación
  fetchPokemonByName: (name: string) => Promise<PokemonListItem | undefined>; // Para búsqueda
  pokemonTypes: PokemonType[]; // Lista de todos los tipos de Pokémon
  filterByType: (type: string | null) => Promise<void>; // Para filtrar por tipo
  currentFilterType: string | null; // El tipo por el que se está filtrando actualmente
  nextUrl: string | null; // URL para la siguiente página de la API (para el botón Cargar Más)
}

const ITEMS_PER_PAGE = 9; // Cantidad de Pokémon a mostrar por página

const usePokemon = (): UsePokemonResult => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
  const [currentFilterType, setCurrentFilterType] = useState<string | null>(null);

  // Helper para procesar los datos brutos de Pokémon de la API
  const processPokemonData = useCallback((data: any): PokemonListItem => {
    const id = data.id || parseInt(data.url.split('/').slice(-2, -1)[0]);
    // Usa el official-artwork si está disponible, si no, el default sprite
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    
    return {
      name: data.name,
      url: data.url,
      id: id,
      imageUrl: imageUrl,
      types: data.types 
    };
  }, []); 

  // Función principal para obtener Pokémon, con lógica para paginación y filtrado por tipo
  const fetchPokemon = useCallback(async (currentOffset: number, typeFilter: string | null = null) => {
    setIsLoading(true);
    setError(null);
    try {
      let data: any;
      let allPokemonForType: any[] = []; // Esto se usará solo si typeFilter no es null

      if (typeFilter) {
        // Si hay un filtro por tipo, obtenemos todos los Pokémon de ese tipo y los paginamos localmente
        const typeResponse = await pokeApi.get(`/type/${typeFilter}`);
        allPokemonForType = typeResponse.data.pokemon.map((p: any) => p.pokemon);
        
        const paginatedTypePokemon = allPokemonForType.slice(currentOffset, currentOffset + ITEMS_PER_PAGE);

        const detailedPromises = paginatedTypePokemon.map((p: { name: string; url: string }) =>
          getPokemonDetails(p.name)
        );
        const detailedPokemon = await Promise.all(detailedPromises);
        data = { results: detailedPokemon };
        
        // Simula la 'next' URL para la paginación local por tipo
        setNextUrl(currentOffset + ITEMS_PER_PAGE < allPokemonForType.length ? 'has_more' : null);

      } else {
        // Comportamiento normal si no hay filtro por tipo (usa la paginación nativa de la API)
        const response = await getPokemonList(ITEMS_PER_PAGE, currentOffset);
        data = response;
        setNextUrl(data.next); 
      }
      
      const processedPokemon = data.results.map(processPokemonData);
      setPokemonList(prevList => currentOffset === 0 ? processedPokemon : [...prevList, ...processedPokemon]);

    } catch (err: any) {
      console.error("Error fetching Pokémon:", err);
      setError("No se pudieron cargar los Pokémon. Intenta de nuevo.");
      setPokemonList([]); 
    } finally {
      setIsLoading(false);
    }
  }, [processPokemonData, getPokemonList, getPokemonDetails, pokeApi]); 

  // fetchInitialPokemon: Carga la primera página de Pokémon (sin filtro)
  const fetchInitialPokemon = useCallback(async () => {
    setOffset(0);
    setCurrentFilterType(null); // Asegura que no haya filtro activo
    await fetchPokemon(0, null);
  }, [fetchPokemon]); 

  // fetchNextPage: Carga la siguiente página de Pokémon (ya sea normal o por tipo)
  const fetchNextPage = useCallback(async () => {
    if (nextUrl && !isLoading) { // Solo si hay una próxima URL y no estamos ya cargando
      if (currentFilterType) {
        // Si hay un filtro por tipo activo, la paginación es local
        const newOffset = offset + ITEMS_PER_PAGE;
        setOffset(newOffset);
        await fetchPokemon(newOffset, currentFilterType);
      } else {
        // Si no hay filtro, usa la nextUrl provista por la API
        const url = new URL(nextUrl);
        const newOffset = parseInt(url.searchParams.get('offset') || '0');
        setOffset(newOffset);
        await fetchPokemon(newOffset);
      }
    }
  }, [nextUrl, isLoading, fetchPokemon, offset, currentFilterType]); 

  // fetchPokemonByName: Busca un Pokémon específico por nombre
  const fetchPokemonByName = useCallback(async (name: string): Promise<PokemonListItem | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPokemonDetails(name.toLowerCase());
      const processedData = processPokemonData(data);
      setPokemonList([processedData]); 
      setOffset(0); 
      setNextUrl(null); 
      setCurrentFilterType(null); // Limpia filtro al buscar por nombre
      return processedData;
    } catch (err: any) {
      setError(`No se encontró el Pokémon: ${name}`);
      setPokemonList([]); 
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [processPokemonData, getPokemonDetails]); 

  // filterByType: Aplica un filtro por tipo de Pokémon
  const filterByType = useCallback(async (type: string | null) => {
    setOffset(0); // Reinicia el offset al aplicar un nuevo filtro
    setCurrentFilterType(type); // Establece el tipo de filtro activo
    await fetchPokemon(0, type); // Carga los Pokémon del tipo seleccionado desde el inicio
  }, [fetchPokemon]); 

  // Efecto principal que se ejecuta una única vez al montar el hook
  useEffect(() => {
    // Lógica para la carga inicial de Pokémon (solo una vez)
    // Se ejecuta directamente aquí para asegurar que solo ocurra al montar el hook
    const initialLoad = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPokemonList(ITEMS_PER_PAGE, 0); 
        const detailedPromises = response.results.map((p: { name: string; url: string }) =>
          getPokemonDetails(p.name)
        );
        const detailedPokemon = await Promise.all(detailedPromises);
        const processedPokemon = detailedPokemon.map(processPokemonData);
        setPokemonList(processedPokemon);
        setNextUrl(response.next);
      } catch (err: any) {
        console.error("Error fetching initial Pokémon:", err);
        setError("No se pudieron cargar los Pokémon. Intenta de nuevo.");
        setPokemonList([]);
      } finally {
        setIsLoading(false);
      }
    };
    initialLoad(); 

    // Lógica para la carga de tipos (solo una vez)
    const loadTypes = async () => {
      try {
        const types = await getPokemonTypes();
        // ¡FILTRADO AQUÍ! Excluye 'stellar' y 'unknown'
        const filteredTypes = types.filter(
         (type: PokemonType) => type.name !== 'stellar' && type.name !== 'unknown'
        );
        setPokemonTypes(filteredTypes); // Guarda los tipos filtrados en el estado
      } catch (err) {
        console.error("Error fetching Pokémon types:", err);
        setError("No se pudieron cargar los tipos de Pokémon.");
      }
    };
    loadTypes();
  }, [processPokemonData, getPokemonList, getPokemonDetails, getPokemonTypes]); // Dependencias estables para este useEffect

  // Retorna los estados y las funciones para que los componentes que usen el hook puedan acceder a ellos
  return {
    pokemonList,
    isLoading,
    error,
    fetchInitialPokemon, 
    fetchNextPage,
    fetchPokemonByName,
    pokemonTypes,
    filterByType,
    currentFilterType,
    nextUrl, 
  };
};

export default usePokemon;