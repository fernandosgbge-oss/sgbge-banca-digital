import { Account, Transaction } from '@/types/banking';

// Initial Data
const initialAccounts: Account[] = [
    {
        id: 'acc-1',
        type: 'CORRIENTE',
        iban: 'SGGEGQGQ 0010 0123 4567 8901',
        balance: 1500000,
        currency: 'XAF'
    },
    {
        id: 'acc-2',
        type: 'AHORRO',
        iban: 'SGGEGQGQ 0020 9876 5432 1098',
        balance: 5000000,
        currency: 'XAF'
    },
    {
        id: 'acc-3',
        type: 'DAT',
        iban: 'SGGEGQGQ 0030 1122 3344 5566',
        balance: 10000000,
        currency: 'XAF'
    }
];

const initialTransactions: Transaction[] = [
    { id: 'tx-1', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), description: 'VIREMENT REÇU / TRANSFERENCIA RECIBIDA', amount: 150000, currency: 'XAF', type: 'CREDIT' },
    { id: 'tx-2', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), description: 'PAIEMENT SEGESA / PAGO SEGESA', amount: 25000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-3', date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), description: 'ACHAT SUPERMARCHÉ MARTÍNEZ', amount: 45000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-4', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), description: 'RETRAIT DAB / RETIRO CAJERO', amount: 100000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-5', date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), description: 'SALAIRE GEPETROL / NÓMINA GEPETROL', amount: 850000, currency: 'XAF', type: 'CREDIT' },
    { id: 'tx-6', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), description: 'PAIEMENT CANAL SOL TV', amount: 15000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-7', date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), description: 'VIREMENT ENVOYÉ JEAN OBIANG', amount: 50000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-8', date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), description: 'RECHARGE MOBILE ORANGE', amount: 5000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-9', date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), description: 'ACHAT PHARMACIE CENTRALE', amount: 18500, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-10', date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), description: 'VIREMENT REÇU MAMAN', amount: 200000, currency: 'XAF', type: 'CREDIT' },
    { id: 'tx-11', date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), description: 'PAIEMENT RESTAURANT LA PIROGUE', amount: 35000, currency: 'XAF', type: 'DEBIT' },
    { id: 'tx-12', date: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(), description: 'LOYER APPARTEMENT', amount: 350000, currency: 'XAF', type: 'DEBIT' },
];

// Singleton Mock Store
class MockDB {
    private accounts: Account[] = initialAccounts;
    private transactions: Transaction[] = initialTransactions;

    // Accounts
    getAccounts() {
        return this.accounts;
    }

    getAccount(id: string) {
        return this.accounts.find(a => a.id === id);
    }

    updateAccountBalance(id: string, newBalance: number) {
        const account = this.accounts.find(a => a.id === id);
        if (account) {
            account.balance = newBalance;
            return true;
        }
        return false;
    }

    // Transactions
    getTransactions() {
        // Sort by date desc
        return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    addTransaction(transaction: Transaction) {
        this.transactions.unshift(transaction);
    }
}

// Global instance to persist across HMR in dev (roughly)
// In Next.js dev server, globalThis is useful to prevent clearing on rebuilds if not using external DB
const globalForMockDB = globalThis as unknown as { mockDB: MockDB };

export const db = globalForMockDB.mockDB || new MockDB();

if (process.env.NODE_ENV !== 'production') globalForMockDB.mockDB = db;
