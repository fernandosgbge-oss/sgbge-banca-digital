'use client';

import { useState } from 'react';
import { Account } from '@/types/banking';
import Link from 'next/link';
import { useI18n } from '@/features/i18n/I18nProvider';

interface AccountCardProps {
    account: Account;
}

export const AccountCard = ({ account }: AccountCardProps) => {
    const [showBalance, setShowBalance] = useState(false);
    const { t, locale } = useI18n();

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-GQ', { style: 'currency', currency }).format(amount);
    };

    // Account type labels by locale
    const accountTypeLabels: Record<string, Record<string, string>> = {
        'CORRIENTE': { es: 'CORRIENTE', fr: 'COURANT' },
        'AHORRO': { es: 'AHORRO', fr: 'ÉPARGNE' },
        'DAT': { es: 'DAT', fr: 'DAT' }
    };

    const getTypeLabel = (type: string) => {
        return accountTypeLabels[type]?.[locale] || type;
    };

    // Dictionary for card styles
    const cardConfig = {
        'CORRIENTE': {
            gradient: "from-blue-600 to-blue-900",
            icon: "💳", // Credit Card / Daily Use
            labelColor: "text-blue-200",
            buttonHover: "hover:bg-blue-800/30"
        },
        'AHORRO': {
            gradient: "from-emerald-500 to-emerald-900",
            icon: "🐷", // Savings
            labelColor: "text-emerald-200",
            buttonHover: "hover:bg-emerald-800/30"
        },
        'DAT': {
            gradient: "from-purple-600 to-slate-900",
            icon: "📈", // Investment / Term Deposit
            labelColor: "text-purple-200",
            buttonHover: "hover:bg-purple-800/30"
        }
    };

    // Fallback for unknown types
    const config = cardConfig[account.type as keyof typeof cardConfig] || cardConfig['CORRIENTE'];

    return (
        <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02] duration-300`}>
            {/* Decorative Circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className={`${config.labelColor} text-sm font-medium uppercase tracking-wider`}>{getTypeLabel(account.type)}</p>
                        <p className="text-white/80 font-mono mt-1 text-sm tracking-widest">{account.iban}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md shadow-inner">
                        <span className="text-2xl filter drop-shadow-lg">{config.icon}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className={`${config.labelColor} text-xs mb-1`}>{t('account.balance')}</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold tracking-tight">
                            {showBalance ? formatCurrency(account.balance, account.currency) : '**** ' + account.currency}
                        </h3>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className={`p-1 ${config.buttonHover} rounded transition-colors`}
                            aria-label="Toggle balance visibility"
                        >
                            {showBalance ? '👁️' : '🔒'}
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 mt-4 border-t border-white/10 pt-4">
                    <Link href="/dashboard/transfers" className="flex flex-col items-center gap-1 group">
                        <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${config.buttonHover} transition-colors border border-white/5`}>
                            💸
                        </div>
                        <span className="text-[10px] text-white/90 font-medium">{t('account.transfer')}</span>
                    </Link>
                    <Link href="/dashboard/services" className="flex flex-col items-center gap-1 group">
                        <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${config.buttonHover} transition-colors border border-white/5`}>
                            📱
                        </div>
                        <span className="text-[10px] text-white/90 font-medium">{t('account.pay')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
