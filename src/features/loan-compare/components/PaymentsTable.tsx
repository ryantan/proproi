import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

import { numberFormatter } from '@common/utils';

import { MonthlyInfo } from '../simulate-loan-package';
import { InputValues, SimulationResults } from '../types';
import styles from './PaymentsTable.module.scss';

// Renders a single currency value.
const basicRender = (value: number) => numberFormatter.format(value);

export const percentageFormatter = new Intl.NumberFormat('en-US', {
  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 3, // (causes 2500.99 to be printed as $2,501)
});
const basicPercentageRender = (value: number) =>
  percentageFormatter.format(value * 100) + '%';

const getColumns = (input: InputValues): ColumnsType<MonthlyInfo> => {
  return [
    {
      title: 'Period',
      fixed: 'left',
      children: [
        {
          title: 'Nth year',
          width: 72,
          dataIndex: 'yearIndex',
          key: 'yearIndex',
          fixed: 'left',
        },
        {
          title: 'Year',
          width: 72,
          dataIndex: 'year',
          key: 'year',
          fixed: 'left',
        },
        {
          title: 'Month',
          width: 80,
          dataIndex: 'month',
          key: 'month',
          fixed: 'left',
        },
        {
          title: 'Stage',
          width: 80,
          dataIndex: 'stage',
          key: 'stage',
          fixed: 'left',
        },
      ],
    },
    {
      title: 'Common',
      children: [
        {
          title: 'Sora',
          dataIndex: ['sora'],
          key: 'sora',
          className: styles['amount-cell'],
          render: basicPercentageRender,
        },
        {
          title: 'Disbursed amount',
          dataIndex: ['disbursedLoan'],
          key: 'disbursedLoan',
          className: styles['amount-cell'],
          render: basicRender,
        },
      ],
    },
    {
      title: input.loanPackages[0].label,
      children: [
        {
          title: 'Rates',
          children: [
            {
              title: 'Spread',
              dataIndex: ['loanPackages', '0', 'spread'],
              key: 'spread',
              className: styles['amount-cell'],
              render: basicPercentageRender,
            },
            {
              title: 'Interest rate',
              dataIndex: ['loanPackages', '0', 'interestRate'],
              key: 'interestRate',
              className: styles['amount-cell'],
              render: basicPercentageRender,
            },
          ],
        },
        {
          title: 'Payment',
          children: [
            {
              title: 'Payment',
              dataIndex: ['loanPackages', '0', 'totalPayment'],
              key: 'totalPayment',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Cash',
              dataIndex: ['loanPackages', '0', 'totalPaymentWithCash'],
              key: 'totalPaymentWithCash',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Cash (Accum)',
              dataIndex: ['loanPackages', '0', 'totalPaymentWithCashAccum'],
              key: 'totalPaymentWithCashAccum',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'CPF',
              dataIndex: ['loanPackages', '0', 'totalPaymentWithCPF'],
              key: 'totalPaymentWithCPF',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'CPF (Accum)',
              dataIndex: ['loanPackages', '0', 'totalPaymentWithCPFAccum'],
              key: 'totalPaymentWithCPFAccum',
              className: styles['amount-cell'],
              render: basicRender,
            },
          ],
        },
        {
          title: 'Mortgage',
          children: [
            {
              title: 'Accum. payment',
              dataIndex: ['loanPackages', '0', 'accumulatedPayment'],
              key: 'accumulatedPayment',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Interest',
              dataIndex: ['loanPackages', '0', 'interest'],
              key: 'interest',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Accum. interest',
              dataIndex: ['loanPackages', '0', 'accumulatedInterest'],
              key: 'accumulatedInterest',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Principal',
              dataIndex: ['loanPackages', '0', 'principal'],
              key: 'principal',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Accum. principal',
              dataIndex: ['loanPackages', '0', 'accumulatedPrincipal'],
              key: 'accumulatedPrincipal',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Balance',
              dataIndex: ['loanPackages', '0', 'balance'],
              key: 'balance',
              className: styles['amount-cell'],
              render: basicRender,
            },
          ],
        },
      ],
    },
    {
      title: input.loanPackages[1].label,
      children: [
        {
          title: 'Rates',
          children: [
            {
              title: 'Spread',
              dataIndex: ['loanPackages', '1', 'spread'],
              key: 'spread',
              className: styles['amount-cell'],
              render: basicPercentageRender,
            },
            {
              title: 'Interest rate',
              dataIndex: ['loanPackages', '1', 'interestRate'],
              key: 'interestRate',
              className: styles['amount-cell'],
              render: basicPercentageRender,
            },
          ],
        },
        {
          title: 'Payment',
          children: [
            {
              title: 'Payment',
              dataIndex: ['loanPackages', '1', 'totalPayment'],
              key: 'totalPayment',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Cash',
              dataIndex: ['loanPackages', '1', 'totalPaymentWithCash'],
              key: 'totalPaymentWithCash',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Cash (Accum)',
              dataIndex: ['loanPackages', '1', 'totalPaymentWithCashAccum'],
              key: 'totalPaymentWithCashAccum',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'CPF',
              dataIndex: ['loanPackages', '1', 'totalPaymentWithCPF'],
              key: 'totalPaymentWithCPF',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'CPF (Accum)',
              dataIndex: ['loanPackages', '1', 'totalPaymentWithCPFAccum'],
              key: 'totalPaymentWithCPFAccum',
              className: styles['amount-cell'],
              render: basicRender,
            },
          ],
        },
        {
          title: 'Mortgage',
          children: [
            {
              title: 'Accum. payment',
              dataIndex: ['loanPackages', '1', 'accumulatedPayment'],
              key: 'accumulatedPayment',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Interest',
              dataIndex: ['loanPackages', '1', 'interest'],
              key: 'interest',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Accum. interest',
              dataIndex: ['loanPackages', '1', 'accumulatedInterest'],
              key: 'accumulatedInterest',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Principal',
              dataIndex: ['loanPackages', '1', 'principal'],
              key: 'principal',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Accum. principal',
              dataIndex: ['loanPackages', '1', 'accumulatedPrincipal'],
              key: 'accumulatedPrincipal',
              className: styles['amount-cell'],
              render: basicRender,
            },
            {
              title: 'Balance',
              dataIndex: ['loanPackages', '1', 'balance'],
              key: 'balance',
              className: styles['amount-cell'],
              render: basicRender,
            },
          ],
        },
      ],
    },
  ];
};

export const PaymentsTable = ({
  input,
  results,
}: {
  input: InputValues;
  results: SimulationResults;
}) => {
  const { monthlyInfo } = results;
  const columns = useMemo(() => getColumns(input), [input]);

  return (
    <div>
      <Table
        rowKey="monthIndex"
        columns={columns}
        dataSource={monthlyInfo}
        scroll={{ x: 1800, y: 600 }}
        pagination={false}
        bordered
      />
    </div>
  );
};
