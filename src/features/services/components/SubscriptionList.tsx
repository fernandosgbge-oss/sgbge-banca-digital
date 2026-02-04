'use client';

import { useState } from 'react';
import { useToast } from '@/features/ui/ToastProvider';
import { useI18n } from '@/features/i18n/I18nProvider';

interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    logo: string;
    frequency: 'monthly' | 'annual';
    status: 'ACTIVE' | 'BLOCKED';
    nextPayment: string;
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
    { id: '1', name: 'Netflix Premium', amount: 11000, currency: 'XAF', logo: '🎥', frequency: 'monthly', status: 'ACTIVE', nextPayment: '15 Feb' },
    { id: '2', name: 'Spotify Duo', amount: 6500, currency: 'XAF', logo: '🎵', frequency: 'monthly', status: 'ACTIVE', nextPayment: '22 Feb' },
    { id: '3', name: 'Amazon Prime', amount: 45000, currency: 'XAF', logo: '📦', frequency: 'annual', status: 'ACTIVE', nextPayment: '10 Nov' },
    { id: '4', name: 'Shein', amount: 0, currency: 'XAF', logo: '👗', frequency: 'monthly', status: 'BLOCKED', nextPayment: 'N/A' },
];

export function SubscriptionList() {
    const { showToast } = useToast();
    const { t } = useI18n();
    const [subs, setSubs] = useState(MOCK_SUBSCRIPTIONS);

    const toggleBlock = (id: string, currentStatus: string) => {
        const isBlocking = currentStatus === 'ACTIVE';

        // Optimistic update
        setSubs(prev => prev.map(s =>
            s.id === id ? { ...s, status: isBlocking ? 'BLOCKED' : 'ACTIVE' } : s
        ));

        toastFeedback(isBlocking);
    };

    const toastFeedback = (blocked: boolean) => {
        if (blocked) {
            showToast(t('subs.blockedMsg'), 'info');
        } else {
            showToast(t('subs.reactivatedMsg'), 'success');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                        <tr>
                            <th className="p-4">{t('subs.service')}</th>
                            <th className="p-4">{t('subs.cost')}</th>
                            <th className="p-4">{t('subs.frequency')}</th>
                            <th className="p-4">{t('subs.nextPayment')}</th>
                            <th className="p-4 text-center">{t('subs.status')}</th>
                            <th className="p-4 text-right">{t('subs.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {subs.map(sub => (
                            <tr key={sub.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                                    <span className="text-xl bg-gray-100 p-2 rounded-lg">{sub.logo}</span>
                                    {sub.name}
                                </td>
                                <td className="p-4 text-gray-600">
                                    {sub.amount > 0 ? `${sub.amount.toLocaleString()} ${sub.currency}` : 'Variable'}
                                </td>
                                <td className="p-4 text-gray-500">{sub.frequency === 'monthly' ? t('subs.monthly') : t('subs.annual')}</td>
                                <td className="p-4 text-gray-500">{sub.nextPayment}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${sub.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {sub.status === 'ACTIVE' ? t('subs.active') : t('subs.blocked')}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleBlock(sub.id, sub.status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${sub.status === 'ACTIVE'
                                            ? 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                                            : 'bg-white border-green-200 text-green-600 hover:bg-green-50'
                                            }`}
                                    >
                                        {sub.status === 'ACTIVE' ? t('subs.block') : t('subs.reactivate')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {subs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    {t('subs.none')}
                </div>
            )}
        </div>
    );
}
