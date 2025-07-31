// src/context/TrainerContext.tsx
import { createContext, useReducer, type ReactNode, useEffect, useContext } from 'react';

// 1. Definir Tipos
// Tipos para el estado del entrenador
interface TrainerState {
  name: string | null;
}

// Tipos para las acciones que el reducer puede manejar
type TrainerAction =
  | { type: 'SET_TRAINER_NAME'; payload: string }
  | { type: 'CLEAR_TRAINER_NAME' };

// Tipos para el contexto (lo que proveeremos a los componentes)
interface TrainerContextType {
  state: TrainerState;
  setTrainerName: (name: string) => void;
  clearTrainerName: () => void;
}

// 2. Estado Inicial
const initialState: TrainerState = {
  name: localStorage.getItem('trainerName') || null, // Intentamos cargar el nombre del localStorage al inicio
};

// 3. Reducer
// Una función pura que toma el estado actual y una acción, y devuelve un nuevo estado.
const trainerReducer = (state: TrainerState, action: TrainerAction): TrainerState => {
  switch (action.type) {
    case 'SET_TRAINER_NAME':
      return { ...state, name: action.payload };
    case 'CLEAR_TRAINER_NAME':
      return { ...state, name: null };
    default:
      return state;
  }
};

// 4. Crear el Contexto
// Creamos el contexto con un valor inicial por defecto (que se sobrescribirá por el Provider)
export const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

// 5. Crear el Provider
// Este componente envolverá a otros componentes y proveerá el contexto.
interface TrainerProviderProps {
  children: ReactNode;
}

export const TrainerProvider = ({ children }: TrainerProviderProps) => {
  const [state, dispatch] = useReducer(trainerReducer, initialState);

  // Efecto para sincronizar el nombre del entrenador con localStorage
  useEffect(() => {
    if (state.name) {
      localStorage.setItem('trainerName', state.name);
    } else {
      localStorage.removeItem('trainerName');
    }
  }, [state.name]); // Se ejecuta cada vez que el nombre del estado cambia

  // Funciones para actualizar el estado a través del dispatch
  const setTrainerName = (name: string) => {
    dispatch({ type: 'SET_TRAINER_NAME', payload: name });
  };

  const clearTrainerName = () => {
    dispatch({ type: 'CLEAR_TRAINER_NAME' });
  };

  // El valor que se proveerá a todos los componentes que usen este contexto
  const contextValue: TrainerContextType = {
    state,
    setTrainerName,
    clearTrainerName,
  };

  return (
    <TrainerContext.Provider value={contextValue}>
      {children}
    </TrainerContext.Provider>
  );
};

// 6. Custom Hook para usar el Contexto (opcional, pero buena práctica)
// Facilita el uso del contexto en otros componentes y añade una verificación.
export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (context === undefined) {
    throw new Error('useTrainer must be used within a TrainerProvider');
  }
  return context;
};