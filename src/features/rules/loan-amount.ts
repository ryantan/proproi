export const getMaxLoanAmountForProperty = (
  propertyValue: number,
  maxApprovedLoan: number,
): { loan: number; downPayment: number } => {
  const maxLoan = Math.floor(propertyValue * 0.75);
  const loan = Math.min(maxApprovedLoan, maxLoan);

  return { loan, downPayment: Math.ceil(propertyValue - loan) };
};
