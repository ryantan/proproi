import { useMemo } from 'react';

import { InputValues, SimulationResults } from '@features/roi-table/types';

import { getSimulation } from './';

export const useResults = (input: InputValues): SimulationResults => {
  console.log('[useResults] input:', input);
  return useMemo(() => getSimulation(input, 60), [input]);
};
