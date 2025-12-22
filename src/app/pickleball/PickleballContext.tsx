'use client';

import React, { useCallback, useState } from 'react';
import { ConfigForm, GameType } from './types';
import { DEFAULT_COURT_COUNT, DEFAULT_GAME_TYPE } from './constants';

type Props = {
  children: React.ReactNode;
};

type PickleballContext = {
  courts: number;
  gameType: GameType;
  updateConfig: (data: ConfigForm) => void;
};

const PickleballContext = React.createContext<PickleballContext>({
  courts: DEFAULT_COURT_COUNT,
  gameType: DEFAULT_GAME_TYPE,
  updateConfig: () => {},
});

export default function PickleballContextProvider({ children }: Props) {
  const [courts, setCourts] = useState(DEFAULT_COURT_COUNT);
  const [gameType, setGameType] = useState<GameType>(DEFAULT_GAME_TYPE);

  const updateConfig = useCallback((data: ConfigForm) => {
    setCourts(data.courts);
    setGameType(data.gameType);
  }, []);

  return (
    <PickleballContext.Provider value={{ courts, gameType, updateConfig }}>
      {children}
    </PickleballContext.Provider>
  );
}

export const usePickleballContext = () => {
  return React.useContext(PickleballContext);
};
