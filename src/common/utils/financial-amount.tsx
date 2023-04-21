export const financialAmountParser = (value: string | undefined) => {
  if (typeof value !== 'string') {
    return 0;
  }
  return parseInt(value!.replace(/\$\s?|(,*)/g, ''));
};

export const financialAmountFormatter = (value: number | undefined) =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
