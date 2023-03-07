export const getOARate = (age: number): number => {
  if (age <= 35) {
    return 0.6217;
  }
  if (age <= 45) {
    return 0.5677;
  }
  // if (age <= 50) {
  return 0.5136;
  // }

  // TODO: Fill in the rest of age bands.
};

export const getOAMonthlyAmount = (
  year: number,
  month: number,
  birthYear: number,
  salary: number,
) => {
  const age = year - birthYear;
  const ordinaryAccountRate = getOARate(age);
  // TODO: Increase to 6300 after 2023 Sep 01
  const maxSalaryForCpf = year * 100 + month > 202308 ? 6300 : 6000;
  const salaryForCPF = Math.min(maxSalaryForCpf, salary);
  return Math.floor(salaryForCPF * 0.37 * ordinaryAccountRate);
};
