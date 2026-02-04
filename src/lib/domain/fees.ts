export const calculateSalaryAdvanceFee = (amount: number, months: number): { fee: number; total: number } => {
    // Base commission: 2%
    const BASE_RATE = 0.02;
    // Monthly rate: 0.3% per month
    const MONTHLY_RATE = 0.003;

    const baseFee = amount * BASE_RATE;
    const timeFee = amount * (MONTHLY_RATE * months);

    const fee = baseFee + timeFee;
    const total = amount + fee;

    return { fee, total };
};

export const calculateLoan = (amount: number, months: number, interestRate: number) => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - amount;

    return {
        monthlyPayment,
        totalPayment,
        totalInterest
    };
};
