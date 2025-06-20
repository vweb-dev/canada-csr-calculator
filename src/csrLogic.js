export function calculateCSR({ familySize, province, annualIncome, loanAmount }) {
  const family = parseInt(familySize, 10);
  const income = parseFloat(annualIncome);
  const loan = parseFloat(loanAmount);

  // Example logic: threshold increases by $7,500 per family member
  const baseThreshold = 25000 + (family - 1) * 7500;
  const rapEligible = income < baseThreshold;

  // Example: payment is 10% of income above threshold divided over 12 months
  let monthlyPayment = 0;
  if (!rapEligible) {
    monthlyPayment = ((income - baseThreshold) * 0.10) / 12;
    if (monthlyPayment > loan / 12) monthlyPayment = loan / 12;
  }
  monthlyPayment = Math.max(0, Math.round(monthlyPayment));

  return {
    rapEligible,
    monthlyPayment
  };
}
