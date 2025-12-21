'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ConfigForm } from './types';

type Props = {
  children: React.ReactNode;
};

const DEFAULT_COURT_COUNT = 6;
const PLAYERS = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' },
];

export default function PickleballContextProvider({ children }: Props) {
  const form = useForm<ConfigForm>({
    defaultValues: {
      players: PLAYERS,
      courts: DEFAULT_COURT_COUNT,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
