'use client';

import React, { createContext, useContext, useState } from 'react';

interface PlayerContextType {
  currentSong: string | null;
  setCurrentSong: (id: string | null) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  currentSong: null,
  setCurrentSong: () => {},
});

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </PlayerContext.Provider>
  );
};
