import { getOAMonthlyAmount } from '@features/rules/cpf';

import { getDerivedInput } from './get-derived-input';
import { InputValues, SimulationResults } from './types';

export interface MonthlyInfo {
  monthIndex: number;
  yearIndex: number;
  year: number;
  month: number;
  stage: string;
  sora: number;
  disbursedLoan: number;
  loanPackages: {
    label: string;
    interestRate: number;
    spread: number;
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
  }[];
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
export const getLoanPackageSimulation = (
  input: InputValues,
  maxMonths: number,
): SimulationResults => {
  const { soraOverYears, loanPackages } = input;
  console.log('[getLoanPackageSimulation] input:', input);

  const derivedInput = getDerivedInput(input);
  console.log('[getLoanPackageSimulation] derivedInput:', derivedInput);
  const {
    propertyValue,
    loanYears: years,
    year: startYear,
    month: startMonth,
    buyer1,
    buyer2,
    stages,
  } = derivedInput;

  // Full term of loan. But note we'll only generate till maxMonths
  const numberOfMonths = years * 12;

  const getMonthlyRepayment = (interestRate: number, loanAmount: number) => {
    // const monthlyInterest = interestRate / 12;
    const monthlyInterest = interestRate;

    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1].
    // month_payment = loan_amount * ((interest_month * (1 + interest_month) ** loan_month) / (((1 + interest_month) ** loan_month) -1))
    const amount =
      (loanAmount *
        (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfMonths))) /
      (Math.pow(1 + monthlyInterest, numberOfMonths) - 1);
    return Math.ceil(amount);
  };

  const getConstructionStage = (monthIndex: number) => {
    let stageIndex = stages.findIndex(({ monthIndex: m }) => monthIndex < m);
    if (stageIndex == -1) {
      stageIndex = stages.length - 1;
    } else {
      stageIndex--;
    }
    return { stageIndex, stageLabel: stages[stageIndex].label };
  };

  const getLoanAmountByStage = (stageIndex: number) => {
    let loanAmount = propertyValue;
    let disbursedLoan = 0;

    if (stageIndex === 0) {
      loanAmount = 0;
      disbursedLoan = 0;
    } else if (stageIndex === 1) {
      loanAmount = propertyValue * 0.05;
      disbursedLoan = propertyValue * 0.05;
    } else if (stageIndex === 2) {
      loanAmount = propertyValue * 0.15;
      disbursedLoan = propertyValue * 0.1;
    } else if (stageIndex === 3) {
      loanAmount = propertyValue * 0.2;
      disbursedLoan = propertyValue * 0.05;
    } else if (stageIndex === 4) {
      loanAmount = propertyValue * 0.25;
      disbursedLoan = propertyValue * 0.05;
    } else if (stageIndex === 5) {
      loanAmount = propertyValue * 0.3;
      disbursedLoan = propertyValue * 0.05;
    } else if (stageIndex === 6) {
      loanAmount = propertyValue * 0.35;
      disbursedLoan = propertyValue * 0.05;
    } else if (stageIndex === 7) {
      loanAmount = propertyValue * 0.6;
      disbursedLoan = propertyValue * 0.25;
    } else if (stageIndex === 8) {
      loanAmount = propertyValue * 0.75;
      disbursedLoan = propertyValue * 0.15;
    } else {
      // console.log('Unknown stage index:', stageIndex);
      // loanAmount = loanAmountBase;
    }
    return { disbursedLoan, loanAmount };
  };

  // Calculate interest / principal per month.

  let year = startYear;
  let month = startMonth;
  let loanYear = 0;
  let loanMonth = 0;
  let sora = soraOverYears[0];
  let disbursedLoan = 0;
  const loanPackageCounters = [
    {
      balance: 0,
      totalPaymentWithCPFAccum: 0,
      totalPaymentWithCashAccum: 0,
      accumulatedInterest: 0,
      accumulatedPayment: 0,
      accumulatedPrincipal: 0,
      spread: loanPackages[0].spreadOverYears[0],
      interestRate: sora + loanPackages[0].spreadOverYears[0],
      maxMonthlyRepayment: 0,
    },
    {
      balance: 0,
      totalPaymentWithCPFAccum: 0,
      totalPaymentWithCashAccum: 0,
      accumulatedInterest: 0,
      accumulatedPayment: 0,
      accumulatedPrincipal: 0,
      spread: loanPackages[1].spreadOverYears[0],
      interestRate: sora + loanPackages[1].spreadOverYears[0],
      maxMonthlyRepayment: 0,
    },
  ];

  // Collect results.
  const monthlyInfo: MonthlyInfo[] = [];

  // Loop by months.
  for (let monthIndex = 0; monthIndex < maxMonths; monthIndex++) {
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }

    loanMonth++;
    if (loanMonth > 12) {
      loanYear++;

      // Update sora and interest rates.
      sora = soraOverYears[loanYear];
      [0, 1].forEach((packageId) => {
        loanPackageCounters[packageId].spread =
          loanPackages[packageId].spreadOverYears[loanYear];
        loanPackageCounters[packageId].interestRate =
          sora + loanPackageCounters[packageId].spread;
      });
      // console.log('[getLoanPackageSimulation] loanPackageCounters:', loanPackageCounters);
      loanMonth = 1;
    }

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

    const { stageIndex, stageLabel } = getConstructionStage(monthIndex);

    // Adjust amount based on progressive payment stage.
    const { loanAmount: newLoanAmount } = getLoanAmountByStage(stageIndex);
    if (newLoanAmount > disbursedLoan) {
      disbursedLoan = newLoanAmount;
    }

    const loanPackagesResults: MonthlyInfo['loanPackages'] = [];
    [0, 1].forEach((packageId) => {
      const {
        interestRate: annualInterestRate,
        spread,
        balance,
      } = loanPackageCounters[packageId];

      const interestRate = annualInterestRate / 12;
      const payment = getMonthlyRepayment(interestRate, disbursedLoan);
      if (loanPackageCounters[packageId].maxMonthlyRepayment < payment) {
        loanPackageCounters[packageId].maxMonthlyRepayment = payment;
      }

      const interest = Math.ceil(balance * interestRate);
      const principal = payment - interest;
      loanPackageCounters[packageId].accumulatedInterest += interest;
      loanPackageCounters[packageId].accumulatedPayment += payment;
      loanPackageCounters[packageId].accumulatedPrincipal += principal;
      loanPackageCounters[packageId].balance = Math.max(
        0,
        Math.ceil(
          disbursedLoan - loanPackageCounters[packageId].accumulatedPrincipal,
        ),
      );
      // console.log('balance:', balance);
      // console.log(
      //   'loanPackageCounters[packageId].balance:',
      //   loanPackageCounters[packageId].balance,
      // );

      const availableCPF = buyer1CpfOAMonthly + buyer2CpfOAMonthly;
      const totalPaymentWithCPF = Math.min(payment, availableCPF);
      loanPackageCounters[packageId].totalPaymentWithCPFAccum +=
        totalPaymentWithCPF;
      const totalPaymentWithCash = payment - totalPaymentWithCPF;
      loanPackageCounters[packageId].totalPaymentWithCashAccum +=
        totalPaymentWithCash;

      loanPackagesResults.push({
        label: loanPackages[packageId].label,
        spread,
        interestRate: annualInterestRate,
        interest,
        principal,
        balance: loanPackageCounters[packageId].balance,
        totalPayment: payment,
        totalPaymentWithCPF,
        totalPaymentWithCPFAccum:
          loanPackageCounters[packageId].totalPaymentWithCPFAccum,
        totalPaymentWithCash: payment - totalPaymentWithCPF,
        totalPaymentWithCashAccum:
          loanPackageCounters[packageId].totalPaymentWithCashAccum,
        accumulatedInterest: loanPackageCounters[packageId].accumulatedInterest,
        accumulatedPayment: loanPackageCounters[packageId].accumulatedPayment,
        accumulatedPrincipal:
          loanPackageCounters[packageId].accumulatedPrincipal,
      });
    });

    const entry = {
      yearIndex: loanYear,
      monthIndex,
      year,
      month,
      stage: stageLabel,
      disbursedLoan,
      sora,
      loanPackages: loanPackagesResults,
    };
    // console.log('[getLoanPackageSimulation] entry:', entry);
    monthlyInfo.push(entry);
  }

  return {
    input,
    derivedInput,
    monthlyInfo,
    simulation: {
      months: maxMonths,
      loanPackages: [0, 1].map((packageId) => ({
        maxMonthlyRepayment: loanPackageCounters[packageId].maxMonthlyRepayment,
        totalCash: loanPackageCounters[packageId].totalPaymentWithCashAccum,
        totalCpf: loanPackageCounters[packageId].totalPaymentWithCPFAccum,
        totalInterest: loanPackageCounters[packageId].accumulatedInterest,
      })),
    },
  };
};
