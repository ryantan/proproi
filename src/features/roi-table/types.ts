import { MonthlyInfo } from '@features/rules/get-simulation';

export interface InputValues {
  propertyValue: number;
  annualAppreciation: number;
  maxApprovedLoan: number;
  interestRate: number;
  year: number;
  month: number;
  loanYears: number;
  buyer1: BuyerInput;
  buyer2: BuyerInput;
}

export interface BuyerInput {
  birthYear: number;
  grossSalary: number;
}

export interface BuyerDerivedInput extends BuyerInput {}

export interface DerivedInput extends Omit<InputValues, 'buyer1' | 'buyer2'> {
  bsd: number;
  loan: number;
  downPayment: number;
  initialInvestment: number;

  buyer1: BuyerDerivedInput;
  buyer2: BuyerDerivedInput;
}

export interface SimulatedInfo {
  propertyValue: number;
  monthlyRepayment: number;
  annualAppreciation: number;
  interestRate: number;
  months: number;
  breakEvenMonths: number;
  profit: number;
  roi: number;
  totalInterest: number;
  totalCash: number;
  totalCpf: number;
}

export interface SimulationResults {
  input: InputValues;
  derivedInput: DerivedInput;
  monthlyInfo: MonthlyInfo[];
  simulation: SimulatedInfo;
}
