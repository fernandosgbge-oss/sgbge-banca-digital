'use client';

import { useState } from 'react';
import { useI18n } from '@/features/i18n/I18nProvider';

// Simple mock for notification - in a real app this would use a notification system
const notify = (message: string) => {
    // Check if browser supports notifications
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    } else {
        // Fallback
        alert(message);
    }
};

export const CreateAccountSection = () => {
    const { t } = useI18n();
    const [accountType, setAccountType] = useState('CORRIENTE');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStatus('success');

        // Trigger notification as requested
        const successMessage = "Se remitirá a un gestor, nos pondremos en contacto contigo. Cuenta solicitada visible en dashboard.";
        notify("Solicitud Recibida");

        // Reset after a delay if needed, or keep success state
    };

    if (status === 'success') {
        return (
            <section className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 mb-6">
                <div className="text-center space-y-2">
                    <div className="text-4xl">✅</div>
                    <h3 className="text-lg font-bold text-green-800">Solicitud Enviada</h3>
                    <p className="text-green-700">
                        Se remitirá a un gestor, nos pondremos en contacto contigo y verás una cuenta en la dashboard solicitada.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-4 text-sm text-green-600 hover:text-green-800 underline"
                    >
                        Solicitar otra cuenta
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏦</span> Crear Cuenta Nueva
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/2 space-y-2">
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                        Tipo de Cuenta
                    </label>
                    <select
                        id="accountType"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        disabled={status === 'submitting'}
                    >
                        <option value="CORRIENTE">Cuenta Corriente</option>
                        <option value="AHORRO">Cuenta de Ahorro</option>
                        <option value="DAT">Depósito a Plazo (DAT)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`
                        w-full md:w-auto px-6 py-2.5 rounded-lg text-white font-medium transition-all
                        ${status === 'submitting'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-sg-blue hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        }
                    `}
                >
                    {status === 'submitting' ? 'Confirmando...' : 'Confirmar'}
                </button>
            </form>
        </section>
    );
};
