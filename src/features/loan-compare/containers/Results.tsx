import { Space } from 'antd';
import { useMemo } from 'react';

import { PaymentsChart } from '@features/loan-compare/components/PaymentsChart';
import { PaymentsChartByYear } from '@features/loan-compare/components/PaymentsChartByYear';
import { PaymentsTable } from '@features/loan-compare/components/PaymentsTableCompact';
import { getLoanPackageSimulation } from '@features/loan-compare/simulate-loan-package';

import { InputValues } from '../types';

export const useResults = (input: InputValues) => {
  console.log('[useResults] input:', input);
  return useMemo(() => getLoanPackageSimulation(input, 72), [input]);
};

export const Results = ({ input }: { input: InputValues }) => {
  const results = useResults(input);
  return (
    <div>
      <Space direction="vertical">
        <PaymentsChartByYear input={input} results={results} />
        <PaymentsChart input={input} results={results} />
        <PaymentsTable input={input} results={results} />
      </Space>
    </div>
  );
};
