'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCardsStore } from '@/features/cards/store/cards.store';
import { CreditCard } from '@/features/cards/components/CreditCard';
import { DynamicCVV } from '@/features/cards/components/DynamicCVV';
import { useI18n } from '@/features/i18n/I18nProvider';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { SnowflakeIcon, GlobeIcon } from '@/features/ui/icons';

export default function CardsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const { cards, toggleFreeze, toggleOnline, setLimit } = useCardsStore();
    const { t } = useI18n();
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [cardRequests, setCardRequests] = useState<any[]>([]);

    const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

    // Load requests (Mock or Real)
    // For this didactic step, we'll just keep them in local state or mock fetch
    // Real implementation would use onSnapshot from 'card_requests' collection

    const handleRequestCard = async (type: 'Classic' | 'Gold' | 'Platinum') => {
        if (!user) return;
        setRequestLoading(true);
        try {
            // Simulate API Call / Firestore Write
            await import('firebase/firestore').then(async ({ addDoc, collection }) => {
                const { db } = await import('@/lib/firebase/client');
                const { createNotification } = await import('@/lib/notifications/service');

                await addDoc(collection(db, 'cardRequests'), {
                    uid: user.id,
                    type,
                    status: 'pending',
                    createdAt: Date.now()
                });

                await createNotification(
                    user.id,
                    'security', // Using security icon/type for card actions
                    'Solicitud de Tarjeta Recibida',
                    `Hemos recibido tu solicitud para la tarjeta ${type}. El banco valorará su petición y pronto recibirá una respuesta.`
                );
            });

            // Optimistic Update
            setCardRequests(prev => [...prev, { id: Date.now(), type, status: 'pending', createdAt: Date.now() }]);
            alert(`Solicitud de tarjeta ${type} enviada correctamente.`);

        } catch (error) {
            console.error(error);
            alert("Error al solicitar tarjeta");
        } finally {
            setRequestLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col gap-2">
                <button
                    onClick={() => router.back()}
                    className="self-start text-sm text-gray-500 hover:text-sg-blue flex items-center gap-1 transition-colors"
                >
                    {t('cards.back')}
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('cards.title')}</h1>
                    <p className="text-gray-500 text-sm">{t('cards.subtitle')}</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* Left Column: My Cards & Config */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-800">Mis Tarjetas Activas</h2>
                    {/* Cards Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8">
                        {cards.map(card => (
                            <div
                                key={card.id}
                                onClick={() => setSelectedCardId(card.id)}
                                className={`cursor-pointer transition-all hover:scale-[1.02] ${selectedCard.id === card.id ? 'ring-2 ring-offset-4 ring-sg-blue rounded-2xl shadow-lg' : 'opacity-90 hover:opacity-100'}`}
                            >
                                <CreditCard card={card} />
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    {selectedCard && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50">
                                <h2 className="font-bold text-gray-900">{t('cards.config')}</h2>
                                <p className="text-xs text-gray-500">{selectedCard.type} • {selectedCard.number}</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Freeze Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                            <SnowflakeIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{t('cards.freeze')}</p>
                                            <p className="text-xs text-gray-500">{t('cards.freezeDesc')}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFreeze(selectedCard.id)}
                                        className={`px-3 py-2 rounded-lg border-2 transition-all flex items-center gap-1.5 ${selectedCard.isFrozen
                                            ? 'border-red-500 bg-red-50 text-red-600'
                                            : 'border-gray-200 hover:border-sg-blue hover:bg-blue-50 text-gray-600'
                                            }`}
                                    >
                                        <SnowflakeIcon className="w-4 h-4" />
                                        <span className="text-xs font-semibold">{selectedCard.isFrozen ? t('cards.unfreeze') : t('cards.freeze')}</span>
                                    </button>
                                </div>

                                {/* Online Payments */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                            🌍
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{t('cards.online')}</p>
                                            <p className="text-xs text-gray-500">{t('cards.onlineDesc')}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCard.onlinePayments}
                                            onChange={() => toggleOnline(selectedCard.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                {/* Limit Slider */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{t('cards.limit')}</span>
                                        <span className="font-mono font-bold text-sg-blue">{selectedCard.limit.toLocaleString()} XAF</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="10000000"
                                        step="100000"
                                        value={selectedCard.limit}
                                        onChange={(e) => setLimit(selectedCard.id, Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sg-blue"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dynamic CVV Component */}
                    <DynamicCVV />

                    {/* Statement Download Mock */}
                    <button
                        onClick={async () => {
                            const { generateStatement } = await import('@/lib/pdf-generator');
                            generateStatement(
                                { ...selectedCard, iban: 'ES98 0000 0000 0000 0000', type: selectedCard.type },
                                [],
                                'Febrero_2026'
                            );
                        }}
                        className="w-full flex items-center justify-center gap-2 text-sg-blue font-semibold hover:bg-gray-50 py-4 rounded-2xl border border-dashed border-gray-300 transition-colors"
                    >
                        {t('cards.downloadStatement')}
                    </button>
                </div>

                {/* Right Column: Request New Cards & Pending */}
                <div className="space-y-8">

                    {/* Available Cards Section */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Solicitar Nueva Tarjeta</h2>
                        <div className="space-y-4">
                            {/* Classic Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex gap-4">
                                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-sg-red via-red-600 to-red-800 shadow-md flex-shrink-0 relative overflow-hidden p-2 flex flex-col justify-between">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="text-[6px] text-white/80 font-mono tracking-wider">CLASSIC</div>
                                        <div className="text-[8px] text-white font-bold">SGBGE</div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[6px] text-white/70 font-mono">**** ****</div>
                                        <div className="w-4 h-3 bg-white/90 rounded-sm mt-0.5"></div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">SGBGE Clásica</h3>
                                    <p className="text-xs text-gray-500 mb-2">La tarjeta esencial para tu día a día.</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                                        <span>• Sin cuota anual</span>
                                        <span>• Débito inmediato</span>
                                    </div>
                                    <button
                                        onClick={() => handleRequestCard('Classic')}
                                        disabled={requestLoading}
                                        className="text-xs bg-sg-red text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Solicitar
                                    </button>
                                </div>
                            </div>

                            {/* Gold Card */}
                            <div className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-all flex gap-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full"></div>
                                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-md flex-shrink-0 relative overflow-hidden p-2 flex flex-col justify-between">
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="text-[6px] text-white/80 font-mono tracking-wider">GOLD</div>
                                        <div className="text-[8px] text-white font-bold">SGBGE</div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[6px] text-white/70 font-mono">**** ****</div>
                                        <div className="w-4 h-3 bg-white/90 rounded-sm mt-0.5"></div>
                                    </div>
                                </div>
                                <div className="flex-1 z-10">
                                    <h3 className="font-bold text-gray-900">SGBGE Gold</h3>
                                    <p className="text-xs text-gray-500 mb-2">Beneficios exclusivos y seguro de viaje.</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                                        <span>• Límites altos</span>
                                        <span>• Seguros Premium</span>
                                    </div>
                                    <button
                                        onClick={() => handleRequestCard('Gold')}
                                        disabled={requestLoading}
                                        className="text-xs bg-yellow-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50"
                                    >
                                        Solicitar
                                    </button>
                                </div>
                            </div>

                            {/* Platinum Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex gap-4">
                                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-slate-700 via-slate-900 to-black shadow-md flex-shrink-0 relative overflow-hidden p-2 flex flex-col justify-between">
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <div className="text-[6px] text-white/80 font-mono tracking-wider">PLATINUM</div>
                                        <div className="text-[8px] text-white font-bold">SGBGE</div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[6px] text-white/70 font-mono">**** ****</div>
                                        <div className="w-4 h-3 bg-white/90 rounded-sm mt-0.5"></div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">SGBGE Platinum</h3>
                                    <p className="text-xs text-gray-500 mb-2">Máxima distinción y servicio concierge.</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                                        <span>• Acceso VIP</span>
                                        <span>• Sin comisiones ext.</span>
                                    </div>
                                    <button
                                        onClick={() => handleRequestCard('Platinum')}
                                        disabled={requestLoading}
                                        className="text-xs bg-slate-700 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        Solicitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Requests Section */}
                    {cardRequests.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Solicitudes Pendientes</h2>
                            <div className="space-y-3">
                                {cardRequests.map((req, i) => (
                                    <div key={i} className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sg-blue text-sm">Tarjeta {req.type}</p>
                                            <p className="text-xs text-blue-600">En revisión por el banco</p>
                                        </div>
                                        <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded-full font-medium shadow-sm">
                                            Pendiente
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
