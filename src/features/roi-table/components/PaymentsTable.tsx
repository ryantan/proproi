import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

import { numberFormatter } from '@common/utils';

import { SimulationResults } from '@features/roi-table/types';
import { MonthlyInfo } from '@features/rules';

import styles from './PaymentsTable.module.scss';

// Renders a single currency value.
const basicRender = (value: number) => numberFormatter.format(value);

const getColumns = (): ColumnsType<MonthlyInfo> => [
  {
    title: 'Period',
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
    ],
  },
  {
    title: 'Payment',
    children: [
      {
        title: 'Payment',
        // width: 64,
        dataIndex: 'totalPayment',
        key: 'totalPayment',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Cash',
        dataIndex: 'totalPaymentWithCash',
        key: 'totalPaymentWithCash',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Cash (Accum)',
        dataIndex: 'totalPaymentWithCashAccum',
        key: 'totalPaymentWithCashAccum',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'CPF',
        dataIndex: 'totalPaymentWithCPF',
        key: 'totalPaymentWithCPF',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'CPF (Accum)',
        dataIndex: 'totalPaymentWithCPFAccum',
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
        // width: 64,
        dataIndex: 'accumulatedPayment',
        key: 'accumulatedPayment',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Interest',
        // width: 64,
        dataIndex: 'interest',
        key: 'interest',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Accum. interest',
        // width: 64,
        dataIndex: 'accumulatedInterest',
        key: 'accumulatedInterest',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Principal',
        // width: 64,
        dataIndex: 'principal',
        key: 'principal',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Accum. principal',
        // width: 64,
        dataIndex: 'accumulatedPrincipal',
        key: 'accumulatedPrincipal',
        className: styles['amount-cell'],
        render: basicRender,
      },
      {
        title: 'Balance',
        // width: 64,
        dataIndex: 'balance',
        key: 'balance',
        className: styles['amount-cell'],
        render: basicRender,
      },
    ],
  },
  {
    title: 'Valuation',
    dataIndex: 'valuation',
    key: 'valuation',
    className: styles['amount-cell'],
    render: basicRender,
  },
  // {
  //   title: 'Return (HL)',
  //   width: 128,
  //   fixed: 'right',
  //   dataIndex: 'profitLing',
  //   key: 'profitLing',
  //   className: styles['amount-cell'],
  //   render: basicRender,
  // },
  {
    title: 'Return',
    width: 128,
    fixed: 'right',
    dataIndex: 'profit',
    key: 'profit',
    className: styles['amount-cell'],
    render: basicRender,
  },
  {
    title: 'ROI',
    width: 64,
    fixed: 'right',
    dataIndex: 'roi',
    key: 'roi',
  },
];

export const PaymentsTable = ({ results }: { results: SimulationResults }) => {
  const { monthlyInfo } = results;

  const columns = useMemo(() => getColumns(), []);

  return (
    <div>
      <Table
        rowKey="monthIndex"
        columns={columns}
        dataSource={monthlyInfo}
        scroll={{ x: 1400, y: 600 }}
        pagination={false}
        bordered
      />
    </div>
  );
};
