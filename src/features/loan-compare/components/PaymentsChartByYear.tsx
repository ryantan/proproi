import { Line } from '@ant-design/plots';
import { Typography } from 'antd';
import { useMemo } from 'react';

import { InputValues, SimulationResults } from '../types';

const COLOR_PLATE_10 = [
  '#5B8FF9',
  '#5AD8A6',
  '#5D7092',
  '#F6BD16',
  '#E8684A',
  '#6DC8EC',
  '#9270CA',
  '#FF9D4D',
  '#269A99',
  '#FF99C3',
];

interface DataPoint {
  year: number;
  value: number;
  loanPackage: string;
}

export const PaymentsChartByYear = ({
  input,
  results,
  maxMonths = 60,
}: {
  input: InputValues;
  results: SimulationResults;
  maxMonths?: number;
}) => {
  const data = useMemo(() => {
    const data: DataPoint[] = [];
    results.monthlyInfo.forEach((item, i) => {
      // console.log('item:', item);
      if (i > maxMonths) {
        return;
      }
      if (item.month != results.monthlyInfo[0].month) {
        return;
      }

      const year = item.year;
      data.push({
        year,
        // value: item.loanPackages[0].totalPaymentWithCashAccum,
        value: item.loanPackages[0].accumulatedPayment,
        loanPackage: input.loanPackages[0].label,
      });
      data.push({
        year,
        // value: item.loanPackages[1].totalPaymentWithCashAccum,
        value: item.loanPackages[1].accumulatedPayment,
        loanPackage: input.loanPackages[1].label,
      });
    });
    return data;
  }, [input.loanPackages, results, maxMonths]);

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'loanPackage',
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v: string) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    color: COLOR_PLATE_10,
  };
  return (
    <div id="container">
      <Typography.Title level={3}>
        Accumulated payments by year
      </Typography.Title>
      <Line {...config} />
    </div>
  );
};
