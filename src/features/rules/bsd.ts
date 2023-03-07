// Purchase price/Market value	Rates for residential properties	Rates for non-residential properties
// First $180,000	1%	1%
// Next $180,000	2%	2%
// Next $640,000	3%	3%
// Next $500,000	4%	4%
// Next $1.5 million	5%	5%
// In excess of $3 million	6%	5%
export const getBsd = ({ propertyValue }: { propertyValue: number }) => {
  let bsd = 0;
  let leftOverValue = propertyValue;

  const tierAndRatePairs: { amount: number; rate: number }[] = [
    { amount: 180_000, rate: 0.01 },
    { amount: 180_000, rate: 0.02 },
    { amount: 640_000, rate: 0.03 },
    { amount: 500_000, rate: 0.04 },
    { amount: 1_500_000, rate: 0.05 },
  ];

  tierAndRatePairs.forEach(({ amount, rate }) => {
    bsd += Math.min(amount, leftOverValue) * rate;
    leftOverValue = Math.max(leftOverValue - amount, 0);
  });

  bsd += leftOverValue * 0.06;

  return bsd;
};
