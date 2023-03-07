// import { CashflowChart } from '@features/roi-table/components/CashflowChart';
// import { PaymentsChart } from '@features/roi-table/components/PaymentsChart';
import { PaymentsTable } from '@features/roi-table/components/PaymentsTable';
// import { ProfitByInterestRates } from '@features/roi-table/components/ProfitByInterestRates';
import { SummaryTable } from '@features/roi-table/components/SummaryTable';
import { InputValues } from '@features/roi-table/types';
import { useResults } from '@features/rules/use-results';

export const Results = ({ input }: { input: InputValues }) => {
  const results = useResults(input);

  return (
    <div>
      {/*<ProfitByInterestRates input={input} />*/}
      <SummaryTable results={results} />

      {/*<CashflowChart results={results} />*/}
      {/*<PaymentsChart results={results} />*/}

      <PaymentsTable results={results} />
    </div>
  );
};
