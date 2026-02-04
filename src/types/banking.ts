export interface Account {
    id: string;
    type: 'CORRIENTE' | 'AHORRO' | 'DAT';
    iban: string;
    balance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    date: string; // ISO date
    description: string;
    amount: number;
    currency: string;
    type: 'CREDIT' | 'DEBIT';
}
