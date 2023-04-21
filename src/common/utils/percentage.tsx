export const getDecimalPercentage = (percentage: number) => percentage / 100;

export const percentageParser = (value: string | undefined) =>
  parseFloat((value || '').replace('%', ''));

export const percentageFormatter = (value: number | undefined) =>
  `${value || 0}%`;
