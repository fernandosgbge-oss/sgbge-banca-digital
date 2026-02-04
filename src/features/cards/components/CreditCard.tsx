'use client';

import Image from 'next/image';
import { Card } from '../store/cards.store';

interface CreditCardProps {
    card: Card;
}

export const CreditCard = ({ card }: CreditCardProps) => {
    // Styles based on card type
    const getStyles = () => {
        switch (card.type) {
            case 'PLATINUM':
                return 'bg-gradient-to-br from-slate-700 via-slate-900 to-black text-white border-slate-600';
            case 'GOLD':
                return 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 text-white shadow-yellow-200';
            default: // CLASSIC
                return 'bg-gradient-to-br from-sg-red via-red-600 to-red-800 text-white';
        }
    };

    return (
        <div className={`relative w-full aspect-[1.586/1] rounded-2xl p-4 shadow-xl overflow-hidden transition-all hover:scale-[1.02] ${getStyles()} ${card.isFrozen ? 'grayscale opacity-90' : ''}`}>
            {/* Background Texture/Effects */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="block text-[9px] opacity-80 tracking-widest mb-0.5 font-mono">{card.type}</span>
                        <div className="font-bold text-sm tracking-wider">SGBGE</div>
                    </div>
                    {/* Chip */}
                    <div className="w-10 h-7 bg-yellow-200/80 rounded-md border border-yellow-400/50 flex flex-col justify-center gap-[2px] px-1 shadow-inner">
                        <div className="h-[1px] bg-black/20 w-full"></div>
                        <div className="h-[1px] bg-black/20 w-full"></div>
                        <div className="h-[1px] bg-black/20 w-full"></div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-4">
                        {card.isFrozen && (
                            <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-md">
                                ❄️ CONGELADA
                            </span>
                        )}
                    </div>

                    <div className="font-mono text-lg leading-tight tracking-[0.14em] drop-shadow-md">
                        {card.number}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="text-[9px] uppercase tracking-wide opacity-90">
                            <div className="text-[8px] opacity-75">Titular</div>
                            <div className="font-bold text-[10px] leading-none truncate max-w-[95px]">{card.holder}</div>
                        </div>
                        <div className="text-[9px] uppercase tracking-wide opacity-90">
                            <div className="text-[8px] opacity-75">Expira</div>
                            <div className="font-bold text-[10px] leading-none">{card.expiry}</div>
                        </div>
                        <div className="relative w-9 h-9 rounded-md overflow-hidden bg-white/90 shadow-sm ml-2">
                            <Image
                                src="/logo.jpeg"
                                alt="Logo SGBGE"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
