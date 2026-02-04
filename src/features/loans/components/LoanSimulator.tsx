'use client';

import { useState } from 'react';
import { useI18n } from '@/features/i18n/I18nProvider';
import { useRouter } from 'next/navigation';

export const LoanSimulator = () => {
    const [amount, setAmount] = useState<number>(1000000);
    const [term, setTerm] = useState<number>(12); // Months
    const [rate, setRate] = useState<number>(5); // Annual %
    const { t, locale } = useI18n();

    // French Amortization Formula
    // A = P * (r * (1+r)^n) / ((1+r)^n - 1)
    // P = Principal (Amount)
    // r = Monthly Interest Rate (Annual / 12 / 100)
    // n = Total Months (Term)
    const calculateMonthlyPayment = () => {
        const principal = amount;
        const monthlyRate = rate / 12 / 100;
        const numberOfPayments = term;

        if (monthlyRate === 0) return principal / numberOfPayments;

        const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
        const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

        return numerator / denominator;
    };

    const monthlyPayment = calculateMonthlyPayment();
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;

    const router = useRouter();

    const handleRequest = () => {
        router.push(`/dashboard/loans/apply?amount=${amount}&months=${term}`);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl bg-green-100 p-2 rounded-lg">🏠</span>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{t('loans.title')}</h2>
                    <p className="text-sm text-gray-500">
                        {locale === 'fr' ? 'Système d\'Amortissement Français' : 'Sistema de Amortización Francés'}
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Sliders / Inputs */}
                <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>{locale === 'fr' ? 'Montant Demandé' : 'Monto Solicitado'}</span>
                        <span className="font-bold text-sg-blue">{amount.toLocaleString()} XAF</span>
                    </label>
                    <input
                        type="range"
                        min="500000"
                        max="50000000"
                        step="100000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sg-blue"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>500k</span>
                        <span>50M</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {locale === 'fr' ? 'Durée (Mois)' : 'Plazo (Meses)'}
                        </label>
                        <select
                            value={term}
                            onChange={(e) => setTerm(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-sg-blue"
                        >
                            {[6, 12, 24, 36, 48, 60, 120, 240].map(m => (
                                <option key={m} value={m}>{m} {t('loans.months')}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {locale === 'fr' ? 'Intérêt T.A.E (%)' : 'Interés T.A.E (%)'}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-sg-blue"
                        />
                    </div>
                </div>

                {/* Results Card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{t('loans.monthlyPayment')}</span>
                        <span className="text-2xl font-bold text-sg-blue">{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} XAF</span>
                    </div>
                    <div className="h-px bg-gray-200 w-full"></div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t('loans.totalInterest')}</span>
                        <span className="font-medium">{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })} XAF</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{locale === 'fr' ? 'Total à Payer' : 'Total a Pagar'}</span>
                        <span className="font-medium">{totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} XAF</span>
                    </div>
                </div>

                <button
                    onClick={handleRequest}
                    className="w-full bg-sg-blue text-white py-4 rounded-xl font-bold hover:shadow-lg hover:bg-blue-800 transition-all active:scale-[0.98]"
                >
                    {t('loans.apply')}
                </button>
            </div>
        </div>
    );
};
