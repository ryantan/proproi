import { Line } from '@ant-design/plots';
import { Datum } from '@antv/g2plot';
import { useMemo } from 'react';

import { SimulationResults } from '@features/roi-table/types';

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
  month: number;
  value: number;
  category: string;
}

const maxMonths = 60;
export const CashflowChart = ({ results }: { results: SimulationResults }) => {
  const data = useMemo(() => {
    const data: DataPoint[] = [];
    results.monthlyInfo.forEach((item, i) => {
      // console.log('item:', item);
      if (i > maxMonths) {
        return;
      }

      const month = item.year * 100 + item.month;

      // data.push({
      //   month,
      //   value: item.totalPaymentWithCPF,
      //   category: 'CPF',
      // });
      data.push({
        month,
        value: item.totalPaymentWithCash,
        category: 'Cash',
      });
    });
    return data;
  }, [results]);

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v: string) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    color: COLOR_PLATE_10,
    point: {
      shape: (data: Datum) => {
        const { category } = data as DataPoint;
        return category === 'Profit' ? 'square' : 'circle';
      },
      style: (data: Datum) => {
        // Draw a dot every 3 months.
        const { month } = data as DataPoint;
        return {
          r: (month % 100) % 4 ? 0 : 3, // 4 个数据示一个点标记
        };
      },
    },
  };
  return (
    <div id="container">
      <Line {...config} />
    </div>
  );
};
