import { Descriptions } from 'antd';

import { SimulationResults } from '@features/roi-table/types';

export const SummaryTable = ({ results }: { results: SimulationResults }) => {
  const {
    derivedInput: { bsd, loan, downPayment, initialInvestment },
    simulation: { monthlyRepayment },
  } = results;

  return (
    <div>
      <Descriptions title="User Info" bordered>
        <Descriptions.Item label="BSD">{bsd}</Descriptions.Item>
        <Descriptions.Item label="Max loan">{loan}</Descriptions.Item>
        <Descriptions.Item label="Down-payment">
          {downPayment}
        </Descriptions.Item>
        <Descriptions.Item label="Initial investment">
          {initialInvestment}
        </Descriptions.Item>
        <Descriptions.Item label="Monthly payment">
          {monthlyRepayment}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
