'use server';

import { db } from '@/lib/mock-db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schemas
export const TransferSchema = z.object({
    sourceAccountId: z.string(),
    destinationIban: z.string().min(20, "IBAN debe tener al menos 20 caracteres"),
    amount: z.number().min(500, "El monto mínimo es 500 XAF"),
    reason: z.string(),
    sourceDeclaration: z.string().optional() // AML for > 5M
});

export const ServicePaymentSchema = z.object({
    serviceType: z.enum(['SEGESA', 'CANAL+']),
    reference: z.string().min(3, "La referencia es requerida"),
    amount: z.number().min(1, "Monto inválido"),
    packageId: z.string().optional()
});

// Helper: Simulate DB Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Actions ---

export async function checkSegesaDebt(meterNumber: string) {
    await delay(500);
    // Even number simulates debt
    const lastDigit = parseInt(meterNumber.slice(-1));
    if (!isNaN(lastDigit) && lastDigit % 2 === 0) {
        return { hasDebt: true, amount: 15000 };
    }
    return { hasDebt: false, amount: 0 };
}

export async function transferFunds(data: z.infer<typeof TransferSchema>) {
    await delay(1000); // Simulate network latency

    const result = TransferSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.message };
    }

    const { sourceAccountId, destinationIban, amount, reason, sourceDeclaration } = result.data;

    // AML Check
    if (amount > 5000000 && !sourceDeclaration) {
        return { success: false, error: "AML: Se requiere Declaración de Origen de Fondos para montos superiores a 5,000,000 XAF" };
    }

    const account = db.getAccount(sourceAccountId);
    if (!account) return { success: false, error: "Cuenta origen no encontrada" };

    // Calculate Fees (COBAC Transparency)
    const commission = amount * 0.005; // 0.5%
    const iva = commission * 0.18; // 18% of commission
    const totalDebit = amount + commission + iva;

    if (account.balance < totalDebit) {
        return { success: false, error: `Saldo insuficiente. Requiere: ${totalDebit.toLocaleString('es-GQ')} XAF (incluye comisiones)` };
    }

    // Perform Atomic Update (Simulated)
    const newBalance = account.balance - totalDebit;
    db.updateAccountBalance(sourceAccountId, newBalance);

    // Record Transaction
    db.addTransaction({
        id: `tx-${Date.now()}`,
        date: new Date().toISOString(),
        description: `TRANSF. A ${destinationIban} (${reason})`,
        amount: totalDebit,
        currency: account.currency,
        type: 'DEBIT'
    });

    revalidatePath('/dashboard');
    return {
        success: true,
        receipt: {
            id: `REC-${Date.now()}`,
            amount: amount,
            fees: commission + iva,
            date: new Date().toISOString(),
            destination: destinationIban
        }
    };
}

export async function payService(data: z.infer<typeof ServicePaymentSchema>) {
    await delay(1000);

    // For this mock, we assume always paying from the first account (Corriente) or pass it in. 
    // To keep it simple based on prompt, let's just debit the 'CORRIENTE' account 'acc-1'
    const sourceAccountId = 'acc-1';
    const account = db.getAccount(sourceAccountId);
    if (!account) return { success: false, error: "Cuenta principal no encontrada" };

    const { serviceType, reference, amount } = data;

    if (account.balance < amount) {
        return { success: false, error: "Saldo insuficiente" };
    }

    // Debit
    db.updateAccountBalance(sourceAccountId, account.balance - amount);

    // Transaction
    db.addTransaction({
        id: `svc-${Date.now()}`,
        date: new Date().toISOString(),
        description: `PAGO SERVICIO: ${serviceType} (${reference})`,
        amount: amount,
        currency: 'XAF',
        type: 'DEBIT'
    });

    revalidatePath('/dashboard');
    return { success: true };
}

export async function depositFunds(accountId: string, amount: number) {
    try {
        await delay(500);
        console.log(`[Deposit] Request for ${accountId}, Amount: ${amount}`);

        const account = db.getAccount(accountId);
        if (!account) return { success: false, error: "Cuenta no encontrada" };

        db.updateAccountBalance(accountId, account.balance + amount);

        db.addTransaction({
            id: `dep-${Date.now()}`,
            date: new Date().toISOString(),
            description: 'RECARGA SALDO (Simulación)',
            amount: amount,
            currency: account.currency,
            type: 'CREDIT'
        });

        revalidatePath('/dashboard');
        return { success: true, newBalance: account.balance + amount };
    } catch (error) {
        console.error('[Deposit Error]', error);
        return { success: false, error: "Error interno procesando la recarga" };
    }
}
