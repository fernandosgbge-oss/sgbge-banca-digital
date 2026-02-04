'use client';

import { useState } from 'react';
import { useI18n } from '@/features/i18n/I18nProvider';

import { CurrencyConverter } from '@/features/services/components/CurrencyConverter';
import { TransferForm } from '@/features/services/components/TransferForm';
import { SubscriptionList } from '@/features/services/components/SubscriptionList';
import { NationalPayments } from '@/features/services/components/NationalPayments';
import { GlobeIcon, MapPinIcon, CalendarIcon } from '@/features/ui/icons';

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState<'transfers' | 'subscriptions' | 'national'>('transfers');
    const { t } = useI18n();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{t('services.title')}</h1>
                <p className="text-gray-500 text-sm">{t('services.subtitle')}</p>
            </header>

            {/* Navigation Tabs - Vertical on mobile, horizontal on desktop */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:border-b md:border-gray-200">
                    <button
                        onClick={() => setActiveTab('transfers')}
                        className={`p-3 md:pb-3 md:pt-0 text-sm font-medium transition-colors rounded-lg md:rounded-none md:border-b-2 text-left flex items-center gap-2 ${activeTab === 'transfers'
                            ? 'bg-sg-blue/10 md:bg-transparent md:border-sg-blue text-sg-blue'
                            : 'bg-gray-50 md:bg-transparent md:border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hover:bg-transparent'
                            }`}
                    >
                        <GlobeIcon className="w-5 h-5 flex-shrink-0" />
                        {t('services.transfersTab')}
                    </button>
                    <button
                        onClick={() => setActiveTab('national')}
                        className={`p-3 md:pb-3 md:pt-0 text-sm font-medium transition-colors rounded-lg md:rounded-none md:border-b-2 text-left flex items-center gap-2 ${activeTab === 'national'
                            ? 'bg-sg-blue/10 md:bg-transparent md:border-sg-blue text-sg-blue'
                            : 'bg-gray-50 md:bg-transparent md:border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hover:bg-transparent'
                            }`}
                    >
                        <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                        {t('services.nationalTab')}
                    </button>
                    <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`p-3 md:pb-3 md:pt-0 text-sm font-medium transition-colors rounded-lg md:rounded-none md:border-b-2 text-left flex items-center gap-2 ${activeTab === 'subscriptions'
                            ? 'bg-sg-blue/10 md:bg-transparent md:border-sg-blue text-sg-blue'
                            : 'bg-gray-50 md:bg-transparent md:border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hover:bg-transparent'
                            }`}
                    >
                        <CalendarIcon className="w-5 h-5 flex-shrink-0" />
                        {t('services.subscriptionsTab')}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'transfers' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">{t('services.cfaZone')}</h2>
                            <p className="text-xs text-gray-500">{t('services.cfaZoneDesc')}</p>
                            <TransferForm />
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">{t('services.currencyConverter')}</h2>
                            <CurrencyConverter />
                        </section>
                    </div>
                )}

                {activeTab === 'national' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">{t('services.nationalPayments')}</h2>
                        <p className="text-xs text-gray-500">{t('services.nationalPaymentsDesc')}</p>
                        <NationalPayments />
                    </div>
                )}

                {activeTab === 'subscriptions' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{t('services.activeSubscriptions')}</h2>
                                <p className="text-xs text-gray-500">{t('services.subscriptionsDesc')}</p>
                            </div>
                        </div>
                        <SubscriptionList />
                    </div>
                )}
            </div>
        </div>
    );
}
