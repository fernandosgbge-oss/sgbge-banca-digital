export interface LoanSimulatorState {
    amount: number;
    months: number;
    monthlyPayment: number;
    totalPayment: number;
    interest: number;
}

export interface SalaryAdvanceRequest {
    id: string;
    uid: string;
    company: string;
    profession: string;
    salary: number;
    amountRequested: number;
    repaymentMonths: number; // 1, 2, 3, 6
    payrollUrl: string; // Storage URL
    fee: number;
    totalToRepay: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: number;
}

export interface LoanRequest {
    id: string;
    uid: string;
    purpose: string;
    amount: number;
    months: number;
    monthlyIncome: number;
    employmentStatus: string;
    observations?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: number;
    monthlyPaymentEstimated: number;
}
