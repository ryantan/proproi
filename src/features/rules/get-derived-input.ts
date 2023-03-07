import { DerivedInput, InputValues } from '@features/roi-table/types';
import { getMaxLoanAmountForProperty } from '@features/rules/loan-amount';

import { getBsd } from './';

export const getDerivedInput = (input: InputValues): DerivedInput => {
  const {
    propertyValue,
    annualAppreciation,
    maxApprovedLoan,
    interestRate,
    year,
    month,
    loanYears,
    buyer1,
    buyer2,
  } = input;

  const bsd = getBsd({
    propertyValue,
  });

  const { loan, downPayment } = getMaxLoanAmountForProperty(
    propertyValue,
    maxApprovedLoan,
  );

  return {
    propertyValue,
    annualAppreciation,
    maxApprovedLoan,
    interestRate,
    year,
    month,
    loanYears,
    bsd,
    loan,
    downPayment,
    initialInvestment: downPayment + bsd,
    buyer1,
    buyer2,
  };
};
