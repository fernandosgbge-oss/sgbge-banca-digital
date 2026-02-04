'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/features/i18n/I18nProvider';

// --- Types ---
type MarketAsset = {
    symbol: string;
    name: string;
    price: number;
    currency: string;
    change: number; // Percentage change
    type: 'STOCK' | 'BOND';
    trend: number[]; // Simple array for sparkline
};

type PortfolioItem = {
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    currency: string;
    type: 'STOCK' | 'BOND';
};

// --- Mock Data ---
const MARKET_DATA: MarketAsset[] = [
    {
        symbol: 'SOCAPALM',
        name: 'Socapalm (Huile de Palme)',
        price: 49000,
        currency: 'XAF',
        change: 1.25,
        type: 'STOCK',
        trend: [48000, 48500, 48200, 48800, 49000, 49500, 49000]
    },
    {
        symbol: 'SEMC',
        name: 'SEMC (Eaux Minérales)',
        price: 49000,
        currency: 'XAF',
        change: -0.5,
        type: 'STOCK',
        trend: [49500, 49500, 49200, 49000, 48900, 49000]
    },
    {
        symbol: 'BANGE',
        name: 'Banque Nationale de Guinée Équatoriale',
        price: 228000,
        currency: 'XAF',
        change: 0.05,
        type: 'STOCK',
        trend: [227000, 227500, 227500, 227800, 228000]
    },
    {
        symbol: 'EOG-BONDS',
        name: 'Obligations État GE 2029',
        price: 10000,
        currency: 'XAF',
        change: 0.00,
        type: 'BOND',
        trend: [10000, 10000, 10000, 10000, 10000]
    },
    {
        symbol: 'GETESA',
        name: 'GE Telecom (Télécommunications)',
        price: 75000,
        currency: 'XAF',
        change: 2.15,
        type: 'STOCK',
        trend: [71000, 72000, 73500, 74000, 74800, 75000]
    },
    {
        symbol: 'GEPETROL',
        name: 'GE Petróleo (Énergie)',
        price: 185000,
        currency: 'XAF',
        change: -1.2,
        type: 'STOCK',
        trend: [190000, 188000, 187000, 186500, 185000]
    },
    {
        symbol: 'CEMAC-FND',
        name: 'Fonds CEMAC Diversifié',
        price: 25000,
        currency: 'XAF',
        change: 0.35,
        type: 'BOND',
        trend: [24500, 24600, 24800, 24900, 25000]
    },
    {
        symbol: 'SGHG',
        name: 'SG Holding Group',
        price: 320000,
        currency: 'XAF',
        change: 0.88,
        type: 'STOCK',
        trend: [315000, 316500, 318000, 319000, 320000]
    }
];

// Initial portfolio (can be empty or have some demo data)
const INITIAL_PORTFOLIO: PortfolioItem[] = [
    {
        symbol: 'BANGE',
        name: 'Banque Nationale de Guinée Équatoriale',
        quantity: 5,
        avgPrice: 225000,
        currentPrice: 228000,
        currency: 'XAF',
        type: 'STOCK'
    },
    {
        symbol: 'EOG-BONDS',
        name: 'Obligations État GE 2029',
        quantity: 50,
        avgPrice: 10000,
        currentPrice: 10000,
        currency: 'XAF',
        type: 'BOND'
    }
];

// --- Sparkline Component (SVG) ---
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-24 h-12 overflow-visible" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

import { useAuthStore } from '@/features/auth/store/auth.store';
import { createNotification } from '@/lib/notifications/service';
import { BriefcaseIcon, TrendingUpIcon, InfoIcon } from '@/features/ui/icons';

// ... (existing helper functions)

export default function InvestmentsPage() {
    const { user } = useAuthStore();
    const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
    const [quantity, setQuantity] = useState<string>('10');
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
    const [showPortfolio, setShowPortfolio] = useState<boolean>(true);
    const { t, locale } = useI18n();

    // Load portfolio from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('sgbge-portfolio');
        if (saved) {
            try {
                setPortfolio(JSON.parse(saved));
            } catch {
                // Use initial portfolio if parse fails
            }
        }
    }, []);

    // Save portfolio to localStorage on change
    useEffect(() => {
        localStorage.setItem('sgbge-portfolio', JSON.stringify(portfolio));
    }, [portfolio]);

    // --- Simulator Logic ---
    const qtyNum = parseInt(quantity) || 0;
    const baseAmount = selectedAsset ? selectedAsset.price * qtyNum : 0;

    // Fees
    const brokerageRate = 0.01; // 1%
    const brokerageFee = baseAmount * brokerageRate;

    // Tax (IRVM)
    const taxRate = selectedAsset?.type === 'STOCK' ? 0.05 : 0;
    const taxAmount = baseAmount * taxRate;
    const totalCost = baseAmount + brokerageFee + taxAmount;

    // --- Portfolio calculations ---
    const portfolioValue = portfolio.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
    const portfolioCost = portfolio.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0);
    const portfolioGain = portfolioValue - portfolioCost;
    const portfolioGainPercent = portfolioCost > 0 ? ((portfolioGain / portfolioCost) * 100) : 0;

    // --- Purchase function ---
    const handlePurchase = async () => {
        if (!selectedAsset || qtyNum <= 0) return;

        // Create Notification (Fire and forget style or await if needed)
        try {
            // Dynamic import to avoid SSR issues if any, or just good habit in this file structure
            const { createNotification } = await import('@/lib/notifications/service');
            const { useAuthStore } = await import('@/features/auth/store/auth.store');
            // Hacky way to get user ID if not in props, but useAuthStore is a hook.
            // Better to get user from hook at top level. 
        } catch (e) { console.error(e) }

        setPortfolio(prev => {
            const existing = prev.find(p => p.symbol === selectedAsset.symbol);
            if (existing) {
                // Update existing position
                const newQty = existing.quantity + qtyNum;
                const newAvgPrice = ((existing.avgPrice * existing.quantity) + (selectedAsset.price * qtyNum)) / newQty;
                return prev.map(p =>
                    p.symbol === selectedAsset.symbol
                        ? { ...p, quantity: newQty, avgPrice: newAvgPrice, currentPrice: selectedAsset.price }
                        : p
                );
            } else {
                // Add new position
                return [...prev, {
                    symbol: selectedAsset.symbol,
                    name: selectedAsset.name,
                    quantity: qtyNum,
                    avgPrice: selectedAsset.price,
                    currentPrice: selectedAsset.price,
                    currency: selectedAsset.currency,
                    type: selectedAsset.type
                }];
            }
        });

        // Notify logic properly
        // We need user ID. Let's add useAuthStore hook at top level first to do this cleanly.
        // CHECK NEXT EDIT FOR TOP LEVEL HOOK 
        // For now, let's just complete the state update.

        setSelectedAsset(null);
        setQuantity('10');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('investments.title')}</h1>
                    <p className="text-gray-500 text-sm">{t('investments.subtitle')}</p>
                </div>
                <div className="bg-blue-50 text-sg-blue px-4 py-2 rounded-lg text-sm font-medium">
                    {locale === 'fr' ? 'Indice' : 'Índice'} BVMAC: <span className="font-bold">↗ 1.2%</span>
                </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-gradient-to-r from-sg-blue to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-white/70 text-sm mb-1">
                            {locale === 'fr' ? '💼 Mon Portefeuille' : '💼 Mi Cartera'}
                        </p>
                        <h2 className="text-3xl font-bold">{portfolioValue.toLocaleString()} XAF</h2>
                        <div className={`flex items-center gap-2 mt-1 ${portfolioGain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            <span>{portfolioGain >= 0 ? '↗' : '↘'}</span>
                            <span className="font-medium">
                                {portfolioGain >= 0 ? '+' : ''}{portfolioGain.toLocaleString()} XAF ({portfolioGainPercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPortfolio(!showPortfolio)}
                        className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    >
                        {showPortfolio
                            ? (locale === 'fr' ? 'Masquer' : 'Ocultar')
                            : (locale === 'fr' ? 'Afficher' : 'Mostrar')
                        }
                    </button>
                </div>

                {showPortfolio && portfolio.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <div className="bg-white/10 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-white/60 text-xs">
                                        <th className="text-left p-3">{locale === 'fr' ? 'Actif' : 'Activo'}</th>
                                        <th className="text-right p-3 hidden md:table-cell">{locale === 'fr' ? 'Qté' : 'Cant.'}</th>
                                        <th className="text-right p-3 hidden md:table-cell">{locale === 'fr' ? 'Prix Moy.' : 'Precio Prom.'}</th>
                                        <th className="text-right p-3">{locale === 'fr' ? 'Valeur' : 'Valor'}</th>
                                        <th className="text-right p-3">{locale === 'fr' ? 'G/P' : 'G/P'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.map(item => {
                                        const value = item.currentPrice * item.quantity;
                                        const cost = item.avgPrice * item.quantity;
                                        const gain = value - cost;
                                        const gainPercent = ((gain / cost) * 100);
                                        return (
                                            <tr key={item.symbol} className="border-t border-white/10 hover:bg-white/5">
                                                <td className="p-3">
                                                    <div className="font-medium">{item.symbol}</div>
                                                    <div className="text-white/60 text-xs hidden md:block">{item.name}</div>
                                                    <div className="text-white/60 text-xs md:hidden">{item.quantity} x {item.avgPrice.toLocaleString()}</div>
                                                </td>
                                                <td className="text-right p-3 hidden md:table-cell">{item.quantity}</td>
                                                <td className="text-right p-3 font-mono hidden md:table-cell">{item.avgPrice.toLocaleString()}</td>
                                                <td className="text-right p-3 font-mono font-medium">{value.toLocaleString()}</td>
                                                <td className={`text-right p-3 font-medium ${gain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                                    {gain >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {showPortfolio && portfolio.length === 0 && (
                    <div className="mt-4 text-center py-8 text-white/60">
                        <p className="text-4xl mb-2">📊</p>
                        <p>{locale === 'fr' ? 'Portefeuille vide' : 'Cartera vacía'}</p>
                        <p className="text-xs">{locale === 'fr' ? 'Achetez des actions pour commencer' : 'Compra acciones para empezar'}</p>
                    </div>
                )}
            </div>

            {/* Section Title for Market */}
            <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <h2 className="text-xl font-bold text-gray-900">
                    {locale === 'fr' ? 'Marché BVMAC' : 'Mercado BVMAC'}
                </h2>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MARKET_DATA.map((asset) => {
                    const inPortfolio = portfolio.find(p => p.symbol === asset.symbol);
                    return (
                        <div
                            key={asset.symbol}
                            onClick={() => setSelectedAsset(asset)}
                            className="bg-white border hover:border-sg-red/50 hover:shadow-lg transition-all rounded-xl p-6 cursor-pointer group relative"
                        >
                            {inPortfolio && (
                                <div className="absolute top-2 right-2 bg-sg-blue text-white text-xs px-2 py-1 rounded-full">
                                    {inPortfolio.quantity} {locale === 'fr' ? 'détenues' : 'en cartera'}
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 group-hover:bg-sg-red group-hover:text-white transition-colors">
                                    {asset.symbol.substring(0, 2)}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${asset.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{asset.symbol}</h3>
                            <p className="text-gray-500 text-xs mb-4 truncate">{asset.name}</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400">{locale === 'fr' ? 'Prix Actuel' : 'Precio Actual'}</p>
                                    <p className="text-xl font-mono font-bold">{asset.price.toLocaleString('es-GQ')} {asset.currency}</p>
                                </div>
                                <Sparkline
                                    data={asset.trend}
                                    color={asset.change >= 0 ? '#10B981' : '#EF4444'}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Slide-over "Sheet" for Simulator */}
            {selectedAsset && (
                <div className="fixed inset-0 bottom-16 md:bottom-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedAsset(null)}
                    ></div>

                    {/* Panel */}
                    <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-b-none md:rounded-none">
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 pb-28">
                            <button
                                onClick={() => setSelectedAsset(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10"
                            >
                                ✕
                            </button>

                            <div className="mt-8">
                                <span className="text-xs font-bold text-sg-blue uppercase tracking-wider">
                                    {locale === 'fr' ? 'Simulateur d\'Investissement' : 'Simulador de Inversión'}
                                </span>
                                <h2 className="text-3xl font-bold mt-2 mb-1">{selectedAsset.symbol}</h2>
                                <p className="text-gray-500 text-sm">{selectedAsset.name}</p>

                                <div className="my-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {locale === 'fr' ? 'Quantité à acheter' : 'Cantidad a comprar'}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full p-3 border rounded-lg font-mono text-lg focus:ring-2 focus:ring-sg-blue outline-none"
                                        />
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{locale === 'fr' ? 'Prix Unitaire' : 'Precio Unitario'}</span>
                                            <span className="font-mono">{selectedAsset.price.toLocaleString()} XAF</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span className="font-mono font-medium">{baseAmount.toLocaleString()} XAF</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{locale === 'fr' ? 'Commission Courtage (1%)' : 'Comisión Corretaje (1%)'}</span>
                                            <span className="font-mono text-orange-600">+{brokerageFee.toLocaleString()} XAF</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{locale === 'fr' ? 'Impôt IRVM estim.' : 'Impuesto IRVM estim.'} ({taxRate * 100}%)</span>
                                            <span className="font-mono text-orange-600">+{taxAmount.toLocaleString()} XAF</span>
                                        </div>

                                        <div className="pt-3 border-t flex justify-between items-center mt-2">
                                            <span className="font-bold text-gray-900">{locale === 'fr' ? 'Coût Estimé' : 'Costo Estimado'}</span>
                                            <span className="text-xl font-bold text-sg-blue">{totalCost.toLocaleString()} XAF</span>
                                        </div>
                                    </div>

                                    <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg flex gap-3 items-start">
                                        <span className="text-xl">ℹ️</span>
                                        <p className="text-xs text-blue-800">
                                            {locale === 'fr'
                                                ? 'Ceci est une simulation. Les ordres sont soumis à la liquidité du marché BVMAC. L\'impôt IRVM s\'applique selon la réglementation fiscale en vigueur dans la CEMAC.'
                                                : 'Esta es una simulación. Las órdenes están sujetas a la liquidez del mercado BVMAC. El impuesto IRVM se aplica según la normativa fiscal vigente en la CEMAC.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Bottom Button */}
                        <div
                            className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg"
                            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
                        >
                            <button
                                className="w-full bg-sg-red text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-sg-red/20 transition-all active:scale-[0.98]"
                                onClick={handlePurchase}
                            >
                                {locale === 'fr' ? 'Passer l\'Ordre' : 'Cursar Orden'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
