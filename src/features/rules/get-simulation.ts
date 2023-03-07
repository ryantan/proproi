import { InputValues, SimulationResults } from '@features/roi-table/types';
import { getDerivedInput } from '@features/rules/get-derived-input';

import { getOAMonthlyAmount } from './';

export interface MonthlyInfo {
  monthIndex: number;
  yearIndex: number;
  year: number;
  month: number;
  valuation: number;
  interest: number;
  principal: number;
  balance: number;
  totalPayment: number;
  totalPaymentWithCash: number;
  totalPaymentWithCashAccum: number;
  totalPaymentWithCPF: number;
  totalPaymentWithCPFAccum: number;
  accumulatedInterest: number;
  accumulatedPayment: number;
  accumulatedPrincipal: number;
  profitLing: number;
  profit: number;
  roi: number;
}

// M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1].
//
// Breakdown of each of the variables:
//
// M = Total monthly payment
// P = The total amount of your loan
// I = Your interest rate, as a monthly percentage
// N = The total amount of months in your timeline for paying off your mortgage
//
// interestRate in params should be in 0.045 for 4.5%
export const getSimulation = (
  inputWithoutOverrides: InputValues,
  maxMonths: number,
  overrides: {
    annualAppreciation?: number;
    interestRate?: number;
    propertyValue?: number;
  } = {},
): SimulationResults => {
  const {
    propertyValue: propertyValueBase,
    interestRate: interestRateBase,
    annualAppreciation: annualAppreciationBase,
  } = inputWithoutOverrides;
  const annualAppreciation =
    overrides.annualAppreciation || annualAppreciationBase;
  const interestRate = overrides.interestRate || interestRateBase;
  const propertyValue = overrides.propertyValue || propertyValueBase;

  const input = {
    ...inputWithoutOverrides,
    annualAppreciation,
    interestRate,
    propertyValue,
  };

  const derivedInput = getDerivedInput(input);
  const {
    bsd,
    loan: loanAmount,
    loanYears: years,
    year: startYear,
    month: startMonth,
    initialInvestment,
    buyer1,
    buyer2,
  } = derivedInput;

  const monthlyInterest = interestRate / 12;
  const numberOfMonths = years * 12;
  const monthlyAppreciation = annualAppreciation / 12;

  // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1].
  // month_payment = loan_amount * ((interest_month * (1 + interest_month) ** loan_month) / (((1 + interest_month) ** loan_month) -1))
  let monthlyRepayment =
    (loanAmount *
      (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfMonths))) /
    (Math.pow(1 + monthlyInterest, numberOfMonths) - 1);
  monthlyRepayment = Math.ceil(monthlyRepayment);

  // Calculate interest / principal per month.
  let balance = loanAmount;
  let totalPaymentWithCPFAccum = 0;
  let totalPaymentWithCashAccum = 0;
  let accumulatedInterest = 0;
  let accumulatedPayment = 0;
  let accumulatedPrincipal = 0;
  let year = startYear;
  let month = startMonth;
  let currentValuation = propertyValue;
  let profit = 0;
  let roi = 0;
  let breakEvenMonths = 0;
  const monthlyInfo: MonthlyInfo[] = [];
  for (let monthIndex = 0; monthIndex < maxMonths; monthIndex++) {
    const interest = Math.ceil(balance * monthlyInterest);
    const principal = monthlyRepayment - interest;
    accumulatedInterest += interest;
    accumulatedPayment += monthlyRepayment;
    accumulatedPrincipal += principal;
    balance = Math.max(0, Math.ceil(balance - principal));
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }

    const totalOut = initialInvestment + accumulatedPayment;
    if (monthIndex > 0) {
      currentValuation = Math.floor(
        currentValuation * (1 + monthlyAppreciation),
      );
    }
    const totalIn = currentValuation - balance;
    profit = totalIn - totalOut;
    roi = Math.round((profit * 100) / totalIn) / 100;
    if (profit > 0 && breakEvenMonths === 0) {
      breakEvenMonths = monthIndex;
    }
    if (
      propertyValue === 2_500_000 &&
      monthIndex == 1 &&
      breakEvenMonths === 1
    ) {
      // console.log('currentValuation:', currentValuation);
      // console.log('balance:', balance);
      // console.log('accumulatedPayment:', accumulatedPayment);
      // console.log('totalOut:', totalOut);
      console.log('interestRate:', interestRate);
      console.log('annualAppreciation:', annualAppreciation);
      console.log('loan:', derivedInput.loan);
      console.log('downPayment:', derivedInput.downPayment);
      console.log('bsd:', bsd);
      console.log(
        `profit = (${currentValuation} - ${balance}) - (${initialInvestment} + ${accumulatedPayment}): ${profit}`,
      );
    }

    const salesGain = currentValuation - propertyValue;
    const netProfit = salesGain - accumulatedInterest;
    const profitLing = netProfit + (loanAmount - balance) - bsd;

    const buyer1CpfOAMonthly = getOAMonthlyAmount(
      year,
      month,
      buyer1.birthYear,
      buyer1.grossSalary,
    );
    const buyer2CpfOAMonthly = getOAMonthlyAmount(
      year,
      month,
      buyer2.birthYear,
      buyer2.grossSalary,
    );
    const totalPaymentWithCPF = buyer1CpfOAMonthly + buyer2CpfOAMonthly;
    totalPaymentWithCPFAccum += totalPaymentWithCPF;
    const totalPaymentWithCash = monthlyRepayment - totalPaymentWithCPF;
    totalPaymentWithCashAccum += totalPaymentWithCash;

    monthlyInfo.push({
      yearIndex: (monthIndex - (monthIndex % 12)) / 12 + 1,
      monthIndex,
      year,
      month,
      valuation: currentValuation,
      interest,
      principal,
      balance,
      totalPayment: monthlyRepayment,
      totalPaymentWithCPF,
      totalPaymentWithCPFAccum,
      totalPaymentWithCash: monthlyRepayment - totalPaymentWithCPF,
      totalPaymentWithCashAccum,
      accumulatedInterest,
      accumulatedPayment,
      accumulatedPrincipal,
      profitLing,
      profit,
      roi,
    });
  }

  return {
    input,
    derivedInput,
    monthlyInfo,
    simulation: {
      propertyValue,
      monthlyRepayment,
      annualAppreciation,
      interestRate,
      months: maxMonths,
      breakEvenMonths,
      profit,
      roi,
      totalCash: totalPaymentWithCashAccum,
      totalCpf: totalPaymentWithCPFAccum,
      totalInterest: accumulatedInterest,
    },
  };
};
