import { MonthlyInfo } from '@features/loan-compare/simulate-loan-package';
import { BuyerDerivedInput, BuyerInput } from '@features/roi-table/types';

import { YearMonth } from '@/common/types/yearMonth';

export interface LoanPackage {
  label: string;
  // Spread in decimal (e.g. 0.0055 fpr 0.55%)
  spreadOverYears: number[];

  // TODO: Add prepayment fee ETC? Or too small to matter.
}

export interface Stage extends YearMonth {
  label: string;
}

export interface InputValues {
  // Sora in decimal (e.g. 0.036 fpr 3.6%)
  soraOverYears: number[];

  loanPackages: LoanPackage[];

  year: number;
  month: number;
  stages: Stage[];

  propertyValue: number;
  loanAmount: number;
  loanYears: number;
  buyer1: BuyerInput;
  buyer2: BuyerInput;
}

export interface DerivedInput extends Omit<InputValues, 'buyer1' | 'buyer2'> {
  buyer1: BuyerDerivedInput;
  buyer2: BuyerDerivedInput;
}

export interface SimulatedInfo {
  months: number;
  loanPackages: {
    maxMonthlyRepayment: number;
    totalInterest: number;
    totalCash: number;
    totalCpf: number;
  }[];
}

export interface SimulationResults {
  input: InputValues;
  derivedInput: DerivedInput;
  monthlyInfo: MonthlyInfo[];
  simulation: SimulatedInfo;
}
