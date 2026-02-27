// src/context/GameContext.js
import { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [playerWork, setPlayerWork] = useState({}); // stores what player built each level

  function completeLevel(levelId, work) {
    setCompletedLevels(prev => [...prev, levelId]);
    setPlayerWork(prev => ({ ...prev, [levelId]: work }));
  }

  function isLevelComplete(levelId) {
    return completedLevels.includes(levelId);
  }

  return (
    <GameContext.Provider value={{
      selectedDomain,
      setSelectedDomain,
      currentStage,
      setCurrentStage,
      currentLevel,
      setCurrentLevel,
      completedLevels,
      playerWork,
      completeLevel,
      isLevelComplete,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}