// https://www.cpf.gov.sg/member/infohub/educational-resources/changes-to-cpf-in-2023-and-how-it-benefits-you
// https://www.cpf.gov.sg/employer/infohub/news/cpf-related-announcements/increase-in-cpf-contribution-rates-from-1-january-2023
export const getCpfContributionRate = (
  year: number,
  month: number,
  age: number,
): number => {
  const yearMonth = year * 100 + month;
  if (yearMonth >= 202401) {
    if (age > 70) {
      return 0.125;
    }
    if (age > 65) {
      return 0.165;
    }
    if (age > 60) {
      return 0.22;
    }
    if (age > 55) {
      return 0.31;
    }

    return 0.37;
  }

  if (age > 70) {
    return 0.125;
  }
  if (age > 65) {
    return 0.155;
  }
  if (age > 60) {
    return 0.205;
  }
  if (age > 55) {
    return 0.295;
  }

  return 0.37;
};

// https://www.cpf.gov.sg/content/dam/web/employer/employer-obligations/documents/CPF%20allocation%20rates%20from%201%20January%202023.pdf
export const getOARate = (year: number, month: number, age: number): number => {
  if (age <= 35) {
    return 0.6217;
  }
  if (age <= 45) {
    return 0.5677;
  }
  if (age <= 50) {
    return 0.5136;
  }
  if (age <= 55) {
    return 0.4055;
  }
  if (age <= 60) {
    return 0.4069;
  }
  if (age <= 65) {
    return 0.1709;
  }
  if (age <= 70) {
    return 0.0646;
  }
  return 0.08;

  // TODO: Fill in the rest of age bands.
};

// Get a date-dependant CPF monthly salary ceiling.
// +------------------------+-----------------------------+---------------------------+
// |        Period          | CPF monthly salary ceiling  | CPF annual salary ceiling |
// +------------------------+-----------------------------+---------------------------+
// | Current                | $6,000                      | $102,000                  |
// | From 1 September 2023  | $6,300 (+$300)              |                           |
// | From 1 January 2024    | $6,800 (+$500)              |                           |
// | From 1 January 2025    | $7,400 (+$600)              |                           |
// | From 1 January 2026    | $8,000 (+$600)              |                           |
// +------------------------+-----------------------------+---------------------------+
// Data from https://www.cpf.gov.sg/member/infohub/educational-resources/changes-to-cpf-in-2023-and-how-it-benefits-you
export const getSalaryCeiling = (year: number, month: number, age: number) => {
  const yearMonth = year * 100 + month;
  if (yearMonth >= 202601) {
    return 8000;
  }
  if (yearMonth >= 202501) {
    return 7400;
  }
  if (yearMonth >= 202401) {
    return 6800;
  }
  if (yearMonth >= 202309) {
    return 6300;
  }
  return 6000;
};

export const getOAMonthlyAmount = (
  year: number,
  month: number,
  birthYear: number,
  salary: number,
) => {
  const age = year - birthYear;
  const maxSalaryForCpf = getSalaryCeiling(year, month, age);
  const salaryForCPF = Math.min(maxSalaryForCpf, salary);
  const cpfContribution =
    salaryForCPF * getCpfContributionRate(year, month, age);
  const oaContribution = cpfContribution * getOARate(year, month, age);
  return Math.floor(oaContribution);
};
