import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

import { numberFormatter } from '@common/utils';

import { MonthlyInfo } from '../simulate-loan-package';
import { InputValues, SimulationResults } from '../types';
import styles from './PaymentsTableCompact.module.scss';

// Renders a single currency value.
const basicRender = (value: number) => numberFormatter.format(value);

export const percentageFormatter = new Intl.NumberFormat('en-US', {
  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 3, // (causes 2500.99 to be printed as $2,501)
});

// const basicPercentageRender = (value: number) =>
//   percentageFormatter.format(value * 100) + '%';
const basicPercentageRender = (value: number) =>
  percentageFormatter.format(value * 100);

const CellWithAccum = ({
  value,
  accumulatedValue,
}: {
  value: number;
  accumulatedValue: number;
}) => (
  <CellWithSubtitle
    value={numberFormatter.format(value)}
    subtitle={numberFormatter.format(accumulatedValue)}
  />
);

const CellWithSubtitle = ({
  value,
  subtitle,
}: {
  value: string;
  subtitle: string;
}) => {
  return (
    <div>
      <div>{value}</div>
      <div className={styles.accumulatedValue}>({subtitle})</div>
    </div>
  );
};

const getColumns = (input: InputValues): ColumnsType<MonthlyInfo> => {
  return [
    {
      title: 'Period',
      // width: 192,
      fixed: 'left',
      children: [
        {
          title: 'Nth year',
          width: 48,
          dataIndex: 'yearIndex',
          key: 'yearIndex',
          className: styles['text-cell'],
          fixed: 'left',
        },
        {
          title: 'Year / month',
          width: 72,
          dataIndex: 'year',
          key: 'year',
          className: styles['text-cell'],
          fixed: 'left',
          render: (_, { year, month }) => (
            <span>
              {year}/{month}
            </span>
          ),
        },
        // {
        //   title: 'Month',
        //   width: 80,
        //   dataIndex: 'month',
        //   key: 'month',
        //   className: styles['text-cell'],
        //   fixed: 'left',
        // },
        {
          title: 'Stage',
          width: 72,
          dataIndex: 'stage',
          key: 'stage',
          className: styles['text-cell'],
          fixed: 'left',
        },
      ],
    },
    {
      title: input.loanPackages[0].label,
      children: [
        {
          title: 'Rates',
          children: [
            // {
            //   title: 'Spread (%)',
            //   width: 64,
            //   dataIndex: ['loanPackages', '0', 'spread'],
            //   key: 'spread',
            //   className: styles['amount-cell'],
            //   render: basicPercentageRender,
            // },
            // {
            //   title: 'Interest rate (%)',
            //   width: 64,
            //   dataIndex: ['loanPackages', '0', 'interestRate'],
            //   key: 'interestRate',
            //   className: styles['amount-cell'],
            //   render: basicPercentageRender,
            // },
            {
              title: (
                <span>
                  (%)
                  <br />
                  Int. rate
                  <br />
                  (Spread)
                </span>
              ),
              width: 80,
              dataIndex: ['loanPackages', '0', 'interestRate'],
              key: 'interestRate',
              className: styles['amount-cell'],
              // render: basicPercentageRender,
              render: (value: number, { loanPackages }) => (
                <CellWithSubtitle
                  value={basicPercentageRender(value)}
                  subtitle={basicPercentageRender(loanPackages[0].spread)}
                />
              ),
            },
          ],
        },
        {
          title: 'Payment',
          children: [
            {
              title: "Payment\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '0', 'totalPayment'],
              key: 'totalPayment',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[0].accumulatedPayment}
                />
              ),
            },
            // {
            //   title: 'Accum. payment',
            //   dataIndex: ['loanPackages', '0', 'accumulatedPayment'],
            //   key: 'accumulatedPayment',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: "Cash\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '0', 'totalPaymentWithCash'],
              key: 'totalPaymentWithCash',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[0].totalPaymentWithCashAccum}
                />
              ),
            },
            // {
            //   title: 'Cash (Accum)',
            //   dataIndex: ['loanPackages', '0', 'totalPaymentWithCashAccum'],
            //   key: 'totalPaymentWithCashAccum',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: "CPF\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '0', 'totalPaymentWithCPF'],
              key: 'totalPaymentWithCPF',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[0].totalPaymentWithCPFAccum}
                />
              ),
            },
            // {
            //   title: 'CPF (Accum)',
            //   dataIndex: ['loanPackages', '0', 'totalPaymentWithCPFAccum'],
            //   key: 'totalPaymentWithCPFAccum',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
          ],
        },
        {
          title: 'Mortgage',
          children: [
            {
              title: "Interest\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '0', 'interest'],
              key: 'interest',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[0].accumulatedInterest}
                />
              ),
            },
            // {
            //   title: 'Accum. interest',
            //   dataIndex: ['loanPackages', '0', 'accumulatedInterest'],
            //   key: 'accumulatedInterest',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: "Principal\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '0', 'principal'],
              key: 'principal',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[0].accumulatedPrincipal}
                />
              ),
            },
            // {
            //   title: 'Accum. principal',
            //   dataIndex: ['loanPackages', '0', 'accumulatedPrincipal'],
            //   key: 'accumulatedPrincipal',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: 'Balance',
              width: 96,
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
            // {
            //   title: 'Spread (%)',
            //   dataIndex: ['loanPackages', '1', 'spread'],
            //   key: 'spread',
            //   className: styles['amount-cell'],
            //   render: basicPercentageRender,
            // },
            // {
            //   title: 'Interest rate (%)',
            //   dataIndex: ['loanPackages', '1', 'interestRate'],
            //   key: 'interestRate',
            //   className: styles['amount-cell'],
            //   render: basicPercentageRender,
            // },
            {
              title: (
                <span>
                  (%)
                  <br />
                  Int. rate
                  <br />
                  (Spread)
                </span>
              ),
              width: 80,
              dataIndex: ['loanPackages', '1', 'interestRate'],
              key: 'interestRate',
              className: styles['amount-cell'],
              // render: basicPercentageRender,
              render: (value: number, { loanPackages }) => (
                <CellWithSubtitle
                  value={basicPercentageRender(value)}
                  subtitle={basicPercentageRender(loanPackages[1].spread)}
                />
              ),
            },
          ],
        },
        {
          title: 'Payment',
          children: [
            {
              title: "Payment\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '1', 'totalPayment'],
              key: 'totalPayment',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[1].accumulatedPayment}
                />
              ),
            },
            // {
            //   title: 'Accum. payment',
            //   dataIndex: ['loanPackages', '1', 'accumulatedPayment'],
            //   key: 'accumulatedPayment',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: "Cash\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '1', 'totalPaymentWithCash'],
              key: 'totalPaymentWithCash',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[1].totalPaymentWithCashAccum}
                />
              ),
            },
            // {
            //   title: 'Cash (Accum)',
            //   dataIndex: ['loanPackages', '1', 'totalPaymentWithCashAccum'],
            //   key: 'totalPaymentWithCashAccum',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: "CPF\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '1', 'totalPaymentWithCPF'],
              key: 'totalPaymentWithCPF',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[1].totalPaymentWithCPFAccum}
                />
              ),
            },
            // {
            //   title: 'CPF (Accum)',
            //   dataIndex: ['loanPackages', '1', 'totalPaymentWithCPFAccum'],
            //   key: 'totalPaymentWithCPFAccum',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
          ],
        },
        {
          title: 'Mortgage',
          children: [
            {
              title: "Interest\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '1', 'interest'],
              key: 'interest',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[1].accumulatedInterest}
                />
              ),
            },
            // {
            //   title: 'Accum. interest',
            //   dataIndex: ['loanPackages', '1', 'accumulatedInterest'],
            //   key: 'accumulatedInterest',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: "Principal\n('accum)",
              width: 80,
              dataIndex: ['loanPackages', '1', 'principal'],
              key: 'principal',
              className: styles['amount-cell'],
              // render: basicRender,
              render: (value: number, { loanPackages }) => (
                <CellWithAccum
                  value={value}
                  accumulatedValue={loanPackages[1].accumulatedPrincipal}
                />
              ),
            },
            // {
            //   title: 'Accum. principal',
            //   dataIndex: ['loanPackages', '1', 'accumulatedPrincipal'],
            //   key: 'accumulatedPrincipal',
            //   className: styles['amount-cell'],
            //   render: basicRender,
            // },
            {
              title: 'Balance',
              width: 96,
              dataIndex: ['loanPackages', '1', 'balance'],
              key: 'balance',
              className: styles['amount-cell'],
              render: basicRender,
            },
          ],
        },
      ],
    },
    {
      title: 'Common',
      children: [
        {
          title: 'Sora (%)',
          width: 72,
          dataIndex: ['sora'],
          key: 'sora',
          className: styles['amount-cell'],
          render: basicPercentageRender,
        },
        {
          title: 'Disbursed amount',
          width: 96,
          dataIndex: ['disbursedLoan'],
          key: 'disbursedLoan',
          className: styles['amount-cell'],
          render: basicRender,
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
      <Typography.Title level={3}>Payments illustration</Typography.Title>
      <Table
        rowKey="monthIndex"
        columns={columns}
        dataSource={monthlyInfo}
        scroll={{ x: 1400, y: 600 }}
        pagination={false}
        bordered
        size="small"
      />
    </div>
  );
};
