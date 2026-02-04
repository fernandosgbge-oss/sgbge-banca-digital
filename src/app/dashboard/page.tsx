'use client';

import useSWR from 'swr';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useBiometrics } from '@/features/auth/hooks/useBiometrics';
import { AccountCard } from '@/features/banking/components/AccountCard';
import { TransactionList } from '@/features/banking/components/TransactionList';
import { PWAInstallButton } from '@/features/pwa/components/PWAInstallButton';
import { Account, Transaction } from '@/types/banking';
import { useI18n } from '@/features/i18n/I18nProvider';

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage() {
    const { user, auditLog, isAuthenticated } = useAuthStore();
    const { register } = useBiometrics();
    const { t } = useI18n();

    // Fetch data using SWR for auto-revalidation
    const { data: accounts, error: accError } = useSWR<Account[]>('/api/accounts', fetcher, { refreshInterval: 5000 });
    const { data: transactions, error: txError } = useSWR<Transaction[]>('/api/transactions', fetcher, { refreshInterval: 5000 });

    const handleRegister = async () => {
        try {
            const registered = await register();
            if (registered) alert(t('dashboard.biometricsActive'));
        } catch (error) {
            alert(t('common.error') + ": " + error);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">

            {/* Header / Saludo */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    {t('dashboard.greeting')}, <span className="text-sg-blue">{user?.name || t('dashboard.client')}</span>
                </h1>
                <p className="text-gray-500 text-sm">{t('dashboard.globalPosition')}</p>
            </header>

            {/* Security Section (Moved to top as requested) */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
                            <span>🛡️</span> {t('dashboard.security')}
                        </h2>
                        <p className="text-sm text-gray-500">Gestiona tu acceso seguro</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between gap-4 w-full md:w-auto">
                        <div>
                            <p className="font-medium text-sg-blue text-sm">{t('dashboard.biometrics')}</p>
                            <p className="text-xs text-gray-500">
                                {user?.biometricsRegistered ? t('dashboard.biometricsActive') : t('dashboard.biometricsNotConfigured')}
                            </p>
                        </div>
                        {!user?.biometricsRegistered && (
                            <button
                                onClick={handleRegister}
                                className="bg-sg-blue text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                                {t('dashboard.activate')}
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Cuentas Section */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Loading/Error States */}
                {!accounts && !accError && (
                    <div className="bg-gray-200 animate-pulse h-48 rounded-2xl md:col-span-2 lg:col-span-3"></div>
                )}

                {accounts?.map(acc => (
                    <AccountCard key={acc.id} account={acc} />
                ))}
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Movimientos (2/3 width on desktop) */}
                <section className="lg:col-span-2">
                    {!transactions && !txError && (
                        <div className="bg-white p-6 rounded-2xl h-96 animate-pulse"></div>
                    )}
                    {transactions && <TransactionList transactions={transactions} />}
                </section>

                {/* Sidebar (Security & Audit) */}
                <aside className="space-y-6">
                    {/* Security Card Moved to Top */}

                    {/* Audit Log (Compact) */}

                    {/* Audit Log (Compact) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-h-96 overflow-y-auto">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>📜</span> {t('dashboard.recentAudit')}
                        </h2>
                        <div className="space-y-3">
                            {auditLog.slice().reverse().slice(0, 5).map((log, idx) => (
                                <div key={idx} className="text-xs border-l-2 border-sg-blue pl-3 py-1">
                                    <p className="text-gray-400 mb-0.5">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </p>
                                    <p className="font-medium text-gray-700">{log.event}</p>
                                    <p className="text-gray-500 truncate">{log.details}</p>
                                </div>
                            ))}
                            {auditLog.length === 0 && <p className="text-gray-400 text-xs">{t('dashboard.noActivity')}</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
