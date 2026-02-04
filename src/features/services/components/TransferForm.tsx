'use client';

import { useState } from 'react';
import { useToast } from '@/features/ui/ToastProvider';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { createNotification } from '@/lib/notifications/service';

export function TransferForm() {
    const { user } = useAuthStore();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        recipient: '',
        account: '',
        amount: '',
        type: 'cemac' // cemac | swift
    });

    const isCEMAC = formData.type === 'cemac';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Notify
        if (user) {
            await createNotification(
                user.id,
                'balance_alert',
                `Transferencia ${isCEMAC ? 'Regional' : 'Internacional'} Enviada`,
                `Has enviado ${formData.amount} XAF a ${formData.recipient}.`
            );
        }

        // Simulate Validation & Processing
        setTimeout(() => {
            // Validation Logic: CEMAC accounts usually start with code. Simple mock check.
            if (isCEMAC && !formData.account.startsWith('GQ')) {
                showToast('❌ Error: Cuenta CEMAC inválida (Debe iniciar con código país ej. GQ)', 'error');
                setIsLoading(false);
                return;
            }

            showToast(`✅ Transferencia ${isCEMAC ? 'Regional' : 'Internacional'} Enviada`, 'success');
            setIsLoading(false);
            setFormData(prev => ({ ...prev, amount: '', recipient: '', account: '' }));
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">

            {/* Type Selector */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'cemac' }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isCEMAC ? 'bg-white shadow text-sg-blue' : 'text-gray-500'
                        }`}
                >
                    🌍 Zona CEMAC (Regional)
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'swift' }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isCEMAC ? 'bg-white shadow text-sg-blue' : 'text-gray-500'
                        }`}
                >
                    🌐 SWIFT (Global)
                </button>
            </div>

            {/* Fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiario</label>
                    <input
                        required
                        value={formData.recipient}
                        onChange={e => setFormData(p => ({ ...p, recipient: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                        placeholder="Nombre Completo"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isCEMAC ? 'Número de Cuenta / IBAN Regional' : 'IBAN / SWIFT Code'}
                    </label>
                    <input
                        required
                        value={formData.account}
                        onChange={e => setFormData(p => ({ ...p, account: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                        placeholder={isCEMAC ? 'Ej: GQ99 1234...' : 'Ej: DE45...'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto (XAF)</label>
                    <input
                        required
                        type="number"
                        value={formData.amount}
                        onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                        placeholder="0"
                    />
                </div>
            </div>

            <button
                type="button" // Change to submit in real logic, but button click works too inside form if Type Submit
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-sg-blue hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center"
            >
                {isLoading ? 'Procesando...' : 'Realizar Transferencia'}
            </button>
        </form>
    );
}
