'use client';

import { useState } from 'react';
import { useI18n } from '@/features/i18n/I18nProvider';

export function CurrencyConverter() {
    const [amount, setAmount] = useState<number>(0);
    const [targetCurrency, setTargetCurrency] = useState<'EUR' | 'USD'>('EUR');
    const { t } = useI18n();

    // Mock Rates
    const RATE_XAF_EUR = 0.00152; // Fixed Peg
    const RATE_XAF_USD = 0.00165;
    const FEE = 0.02; // 2%

    const rate = targetCurrency === 'EUR' ? RATE_XAF_EUR : RATE_XAF_USD;
    const grossAmount = amount * rate;
    const feeAmount = grossAmount * FEE;
    const netAmount = grossAmount - feeAmount;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('converter.amount')}</label>
                <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-lg p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sg-blue focus:outline-none"
                    placeholder="0 FCFA"
                />
            </div>

            <div className="flex justify-center">
                <div className="bg-gray-100 p-2 rounded-full">⬇️</div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('converter.target')}</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTargetCurrency('EUR')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${targetCurrency === 'EUR' ? 'bg-sg-blue text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        🇪🇺 Euro (EUR)
                    </button>
                    <button
                        onClick={() => setTargetCurrency('USD')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${targetCurrency === 'USD' ? 'bg-sg-blue text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        🇺🇸 Dollar (USD)
                    </button>
                </div>
            </div>

            {amount > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('converter.rate')}:</span>
                        <span className="font-mono">1 XAF = {rate} {targetCurrency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('converter.fee')}:</span>
                        <span className="text-red-500 font-mono">-{feeAmount.toFixed(2)} {targetCurrency}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 flex justify-between items-end">
                        <span className="font-semibold text-sg-blue">{t('converter.receive')}:</span>
                        <span className="text-2xl font-bold text-sg-blue">
                            {netAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {targetCurrency}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
