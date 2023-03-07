import { Line, Scatter } from '@ant-design/plots';

import { InputValues, SimulatedInfo } from '@features/roi-table/types';
import { getSimulation } from '@features/rules';

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

export const ProfitByInterestRates = ({ input }: { input: InputValues }) => {
  const {
    annualAppreciation: annualAppreciationBase,
    interestRate: interestRateBase,
    propertyValue: propertyValueBase,
  } = input;
  const data: SimulatedInfo[] = [];
  // const annualAppreciationStep = 0.001;
  const interestRateStep = 0.001;
  const propertyValueStep = 100_000;

  // const propertyValue = propertyValueBase;
  const annualAppreciation = annualAppreciationBase;

  for (let valueI = -2; valueI <= 5; valueI++) {
    const propertyValue = Math.round(
      propertyValueBase + valueI * propertyValueStep,
    );

    for (let interestRateI = -3; interestRateI <= 5; interestRateI++) {
      const interestRate =
        Math.round(
          (interestRateBase + interestRateI * interestRateStep) * 10000,
        ) / 10000;

      // for (
      //   let annualAppreciationI = -3;
      //   annualAppreciationI <= 5;
      //   annualAppreciationI++
      // ) {
      //   const annualAppreciation =
      //     Math.round(
      //       (annualAppreciationBase +
      //         annualAppreciationI * annualAppreciationStep) *
      //         10000,
      //     ) / 10000;
      const { simulation } = getSimulation(input, 60, {
        annualAppreciation,
        interestRate,
        propertyValue,
      });
      data.push(simulation);
      // }
    }
  }
  console.log('[ProfitByInterestRates] data:', data);

  const config = {
    appendPadding: 30,
    data,
    // xField: 'annualAppreciation',
    xField: 'breakEvenMonths',
    // yField: 'interestRate',
    // yField: 'roi',
    yField: 'profit',
    // sizeField: 'profit',
    sizeField: 'roi',
    // colorField: 'maxMonths',
    // colorField: 'annualAppreciation',
    colorField: 'propertyValue',
    color: ['#ffd500', '#82cab2', '#193442', '#d18768', '#7e827a'],
    size: [4, 30] as [number, number],
    shape: 'circle',
    pointStyle: {
      fillOpacity: 0.8,
      stroke: '#bbb',
    },
    tooltip: {
      showTitle: true,
      fields: [
        'propertyValue',
        'annualAppreciation',
        'interestRate',
        'profit',
        'breakEvenMonths',
        'roi',
      ],
      // customContent: (title, items) => {
      //
      // }
    },
    xAxis: {
      title: { text: 'Months to break even' },
      // min: 0,
      // max: 0.1,
      // max: 60,
      grid: {
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
    },
    yAxis: {
      title: { text: 'ROI %' },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
    },
    // quadrant: {
    //   xBaseline: 0,
    //   yBaseline: 0,
    //   labels: [
    //     {
    //       content: 'Male decrease,\nfemale increase',
    //     },
    //     {
    //       content: 'Female decrease,\nmale increase',
    //     },
    //     {
    //       content: 'Female & male decrease',
    //     },
    //     {
    //       content: 'Female &\n male increase',
    //     },
    //   ],
    // },
  };

  return (
    <div>
      <Line
        data={data}
        xField="interestRate"
        yField="profit"
        seriesField="propertyValue"
        xAxis={{
          label: {
            formatter: (v: string) =>
              `${Math.round(parseFloat(v) * 10000) / 100}%`,
          },
        }}
        yAxis={{
          label: {
            // 数值格式化为千分位
            formatter: (v: string) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        }}
        color={COLOR_PLATE_10}
      />
      <Scatter {...config} />
    </div>
  );
};
