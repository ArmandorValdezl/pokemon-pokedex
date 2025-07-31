// src/pages/WelcomePage.tsx
import React, { useState } from 'react'; // Necesitas React aquí para useState
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../context/TrainerContext';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const [inputTrainerName, setInputTrainerName] = useState<string>('');
  const { setTrainerName } = useTrainer();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ¡Esta línea es CRÍTICA para evitar el refresh!

    if (inputTrainerName.trim() === '') {
      alert('¡El nombre de entrenador no puede estar vacío!');
      return;
    }

    setTrainerName(inputTrainerName); // Guarda el nombre en el contexto global
    
    // Aquí podrías mostrar un mensaje de bienvenida y/o carga
    // Por ahora, solo navegamos, pero podemos añadir un modal más tarde.
    navigate('/pokedex'); // Redirige a la Pokédex
  };

  return (
    <div className="page-container welcome-page-container">
      <h1>¡Bienvenido, Entrenador!</h1>
      <p>Por favor, ingresa tu nombre para acceder a la Pokédex.</p>
      <form onSubmit={handleSubmit} className="welcome-form">
        <input
          type="text"
          placeholder="Tu nombre de entrenador"
          value={inputTrainerName}
          onChange={(e) => setInputTrainerName(e.target.value)}
        />
        <button type="submit" className='welcome-form button'>
          Acceder
        </button>
      </form>
    </div>
  );
};

export default WelcomePage;