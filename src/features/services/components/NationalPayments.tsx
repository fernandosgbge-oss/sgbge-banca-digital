'use client';

import { useState } from 'react';
import { useToast } from '@/features/ui/ToastProvider';
import { useI18n } from '@/features/i18n/I18nProvider';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { createNotification } from '@/lib/notifications/service';
import { LightbulbIcon, TvIcon, SmartphoneIcon } from '@/features/ui/icons';

export function NationalPayments() {
    const { user } = useAuthStore();
    const { showToast } = useToast();
    const { t, locale } = useI18n();
    const [activeTab, setActiveTab] = useState<'segesa' | 'canalsol' | 'mobile'>('segesa');
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [segesa, setSegesa] = useState({ code: '', amount: '', period: '', concept: '' });
    const [canal, setCanal] = useState({ cardNum: '', holder: '', months: 1, amount: 15000 });
    const [mobile, setMobile] = useState({ phone: '', amount: '' });

    const simulateProcessing = async (service: string, details: string) => {
        setIsLoading(true);

        // Notify
        if (user) {
            await createNotification(
                user.id,
                'balance_alert',
                `Pago de Servicio: ${service}`,
                details
            );
        }

        setTimeout(() => {
            setIsLoading(false);
            const successMsg = locale === 'fr'
                ? `✅ Paiement à ${service} effectué avec succès. ${details}`
                : `✅ Pago a ${service} realizado con éxito. ${details}`;
            showToast(successMsg, 'success');
            // Reset forms
            setSegesa({ code: '', amount: '', period: '', concept: '' });
            setMobile({ phone: '', amount: '' });
            // Keep Canal defaults somewhat
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Service Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('segesa')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeTab === 'segesa'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <LightbulbIcon className="w-8 h-8" />
                    <span className="font-semibold text-sm">SEGESA</span>
                </button>
                <button
                    onClick={() => setActiveTab('canalsol')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeTab === 'canalsol'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <TvIcon className="w-8 h-8" />
                    <span className="font-semibold text-sm">Canal Sol</span>
                </button>
                <button
                    onClick={() => setActiveTab('mobile')}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeTab === 'mobile'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <SmartphoneIcon className="w-8 h-8" />
                    <span className="font-semibold text-sm">Recarga</span>
                </button>
            </div>

            <div className="p-6">
                {/* SEGESA FORM */}
                {activeTab === 'segesa' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.invoiceCode')}</label>
                                <input
                                    value={segesa.code}
                                    onChange={e => setSegesa(p => ({ ...p, code: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                    placeholder="Ej: SEG-2024-..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.period')}</label>
                                <input
                                    value={segesa.period}
                                    onChange={e => setSegesa(p => ({ ...p, period: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                    placeholder="Ej: 02/2026"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.concept')}</label>
                            <input
                                value={segesa.concept}
                                onChange={e => setSegesa(p => ({ ...p, concept: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                placeholder={locale === 'fr' ? 'Ex: Consommation Domestique' : 'Ej: Consumo Doméstico'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.amount')}</label>
                            <input
                                type="number"
                                value={segesa.amount}
                                onChange={e => setSegesa(p => ({ ...p, amount: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                placeholder="0"
                            />
                        </div>
                        <button
                            disabled={isLoading || !segesa.code || !segesa.amount}
                            onClick={() => simulateProcessing('SEGESA', locale === 'fr' ? 'Reçu généré et envoyé à votre email.' : 'Recibo generado y enviado a tu email.')}
                            className="w-full bg-sg-blue text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? t('payments.processing') : t('payments.payBill')}
                        </button>
                    </div>
                )}

                {/* CANAL SOL FORM */}
                {activeTab === 'canalsol' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-200">
                            ℹ️ {t('payments.cardNote')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.decoderCard')}</label>
                            <input
                                value={canal.cardNum}
                                onChange={e => setCanal(p => ({ ...p, cardNum: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                placeholder="0000 0000 0000 0000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.holder')}</label>
                            <input
                                value={canal.holder}
                                onChange={e => setCanal(p => ({ ...p, holder: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                placeholder={locale === 'fr' ? 'Nom Prénom' : 'Nombre Apellidos'}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.months')}</label>
                                <select
                                    value={canal.months}
                                    onChange={e => setCanal(p => ({ ...p, months: Number(e.target.value) }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                >
                                    {[1, 3, 6, 12].map(m => <option key={m} value={m}>{m} {locale === 'fr' ? 'Mois' : (m > 1 ? 'Meses' : 'Mes')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.totalPay')}</label>
                                <div className="w-full p-2 bg-gray-100 rounded-lg text-gray-700 font-mono">
                                    {(canal.amount * canal.months).toLocaleString()} XAF
                                </div>
                            </div>
                        </div>
                        <button
                            disabled={isLoading || !canal.cardNum || !canal.holder}
                            onClick={() => simulateProcessing('CANAL SOL', locale === 'fr' ? `Service réactivé pour ${canal.months} mois.` : `Servicio reactivado por ${canal.months} mes(es).`)}
                            className="w-full bg-sg-blue text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? t('payments.reloadTV') : t('payments.paySub')}
                        </button>
                    </div>
                )}

                {/* MOBILE RECHARGE FORM */}
                {activeTab === 'mobile' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.phoneNumber')}</label>
                            <input
                                type="tel"
                                value={mobile.phone}
                                onChange={e => setMobile(p => ({ ...p, phone: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                placeholder="+240 222..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('payments.rechargeAmount')}</label>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {[1000, 2000, 5000].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setMobile(p => ({ ...p, amount: amt.toString() }))}
                                        className={`py-1 text-xs rounded border ${mobile.amount === amt.toString()
                                            ? 'bg-blue-50 border-sg-blue text-sg-blue'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {amt} XAF
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                value={mobile.amount}
                                onChange={e => setMobile(p => ({ ...p, amount: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue focus:outline-none"
                                placeholder={t('payments.otherAmount')}
                            />
                        </div>
                        <button
                            disabled={isLoading || !mobile.phone || !mobile.amount}
                            onClick={() => simulateProcessing(locale === 'fr' ? 'Mobile' : 'Móvil', locale === 'fr' ? `Recharge de ${mobile.amount} XAF envoyée à ${mobile.phone}.` : `Recarga de ${mobile.amount} XAF enviada a ${mobile.phone}.`)}
                            className="w-full bg-sg-blue text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? t('payments.recharging') : t('payments.confirmRecharge')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
