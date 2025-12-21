'use client';

import React, { useCallback, useState } from 'react';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { ConfigForm } from './types';
import { DEFAULT_COURT_COUNT } from './constants';

type Props = {
  children: React.ReactNode;
};

type PickleballContext = {
  courts: number;
  updateConfig: (data: ConfigForm) => void;
};

const PickleballContext = React.createContext<PickleballContext>({
  courts: DEFAULT_COURT_COUNT,
  updateConfig: () => {},
});

export default function PickleballContextProvider({ children }: Props) {
  const [courts, setCourts] = useState(DEFAULT_COURT_COUNT);

  const updateConfig = useCallback((data: ConfigForm) => {
    setCourts(data.courts);
  }, []);

  return (
    <PickleballContext.Provider value={{ courts, updateConfig }}>
      {children}
    </PickleballContext.Provider>
  );
}

export const usePickleballContext = () => {
  return React.useContext(PickleballContext);
};