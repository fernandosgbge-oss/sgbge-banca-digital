'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Account } from '@/types/banking';
import { transferFunds } from '@/features/banking/actions';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ReceiptModal } from '@/features/banking/components/ReceiptModal';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TransfersPage() {
    const { isAuthenticated } = useAuthStore();
    const { data: accounts } = useSWR<Account[]>('/api/accounts', fetcher);

    // Form State
    const [sourceAccount, setSourceAccount] = useState('');
    const [destinationIban, setDestinationIban] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('Ayuda Familiar');
    const [sourceDeclaration, setSourceDeclaration] = useState('');

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [receipt, setReceipt] = useState<any>(null);

    if (!isAuthenticated) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmTransfer = async () => {
        setIsLoading(true);
        setShowConfirm(false);
        try {
            const result = await transferFunds({
                sourceAccountId: sourceAccount,
                destinationIban,
                amount: Number(amount),
                reason,
                sourceDeclaration: Number(amount) > 5000000 ? sourceDeclaration : undefined
            });

            if (result.success) {
                setReceipt(result.receipt);
                // Reset form
                setAmount('');
                setDestinationIban('');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert('Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculations for Modal
    const parsedAmount = Number(amount) || 0;
    const commission = parsedAmount * 0.005;
    const iva = commission * 0.18;
    const totalDebit = parsedAmount + commission + iva;

    return (
        <main className="p-6 max-w-2xl mx-auto min-h-screen">
            <header className="mb-8 flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-400 hover:text-sg-blue text-xl">←</Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Realizar Transferencia</h1>
                    <p className="text-gray-500 text-sm">Envía dinero de forma segura</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">

                {/* Source Account */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta Origen</label>
                    <select
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sg-blue outline-none"
                        value={sourceAccount}
                        onChange={(e) => setSourceAccount(e.target.value)}
                    >
                        <option value="">Selecciona una cuenta</option>
                        {accounts?.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.type} - {acc.iban.slice(-4)} ({acc.balance.toLocaleString()} XAF)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Destination */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IBAN Destinatario</label>
                    <input
                        type="text"
                        required
                        placeholder="SGGEGQGQ..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sg-blue outline-none font-mono"
                        value={destinationIban}
                        onChange={(e) => setDestinationIban(e.target.value.toUpperCase())}
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monto (XAF)</label>
                    <input
                        type="number"
                        required
                        min="500"
                        placeholder="0.00"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sg-blue outline-none text-lg font-bold"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                {/* AML Source Declaration (Conditional) */}
                {parsedAmount > 5000000 && (
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 animate-in slide-in-from-top-2">
                        <label className="block text-xs font-bold text-orange-800 mb-2 uppercase">⚠️ Requisito AML: Declaración de Origen</label>
                        <select
                            required
                            className="w-full p-3 bg-white border border-orange-200 rounded-lg text-sm"
                            value={sourceDeclaration}
                            onChange={(e) => setSourceDeclaration(e.target.value)}
                        >
                            <option value="">Seleccione origen de fondos...</option>
                            <option value="AHORRO_PERSONAL">Ahorro Personal</option>
                            <option value="VENTA_PROPIEDAD">Venta de Propiedad</option>
                            <option value="HERENCIA">Herencia</option>
                            <option value="OTRO">Otro Licito</option>
                        </select>
                    </div>
                )}

                {/* Reason */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Motivo Económico</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Ayuda Familiar', 'Pago Factura', 'Compra', 'Ahorro'].map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setReason(r)}
                                className={`p-3 rounded-lg text-sm font-medium border transition-colors ${reason === r ? 'bg-blue-50 border-sg-blue text-sg-blue' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !sourceAccount}
                    className="w-full py-4 bg-sg-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                    {isLoading ? 'Procesando...' : 'Revisar Transferencia'}
                </button>
            </form>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
                        <div className="bg-gray-100 p-4 border-b">
                            <h3 className="font-bold text-gray-900">Confirmar Operación</h3>
                        </div>
                        <div className="p-6 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Monto a Enviar:</span>
                                <span>{parsedAmount.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Comisión (0.5%):</span>
                                <span>{commission.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>IVA (18% Com.):</span>
                                <span>{iva.toLocaleString()} XAF</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg text-sg-red">
                                <span>Total a Debitar:</span>
                                <span>{totalDebit.toLocaleString()} XAF</span>
                            </div>

                            <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 mt-4">
                                ℹ️ Transparencia COBAC: Las comisiones incluyen impuestos aplicables por la ley CEMAC.
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 text-gray-600 font-medium">Cancelar</button>
                            <button onClick={confirmTransfer} className="flex-1 py-2 bg-sg-blue text-white rounded-lg font-bold hover:bg-blue-800">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            <ReceiptModal data={receipt} onClose={() => setReceipt(null)} />
        </main>
    );
}
