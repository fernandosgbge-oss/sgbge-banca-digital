'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/features/i18n/I18nProvider';

export const DynamicCVV = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [cvv, setCvv] = useState('---');
    const [timeLeft, setTimeLeft] = useState(0);
    const { t } = useI18n();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isVisible && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsVisible(false);
            setCvv('---');
        }
        return () => clearInterval(interval);
    }, [isVisible, timeLeft]);

    const handleGenerate = () => {
        if (!isVisible) {
            // Generate deterministic mock CVV
            const newCvv = Math.floor(Math.random() * (999 - 100 + 1) + 100).toString();
            setCvv(newCvv);
            setTimeLeft(60);
            setIsVisible(true);
        } else {
            // Hide it
            setIsVisible(false);
            setTimeLeft(0);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <h3 className="text-gray-900 font-bold mb-1">{t('cvv.title')}</h3>
                <p className="text-xs text-gray-500 max-w-[200px]">
                    {t('cvv.description')}
                </p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                    {isVisible && (
                        <div className="text-center">
                            <span className="block text-3xl font-mono font-bold tracking-widest text-sg-blue animate-in fade-in zoom-in">
                                {cvv}
                            </span>
                            <span className="text-[10px] text-red-500 font-mono animate-pulse">
                                {t('cvv.expires')} {timeLeft}s
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVisible
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-sg-blue text-white hover:bg-blue-800 shadow-lg shadow-blue-200'
                            }`}
                        title={isVisible ? t('cvv.hide') : t('cvv.show')}
                    >
                        {/* 
                            Logic Check: 
                            "el ojo es para ver lo secreto" -> Show Eye when NOT visible (to click and see).
                            "el candado para no verlo" -> Show Padlock when Visible (to click and hide/lock).
                        */}
                        {isVisible ? (
                            <span className="text-xl">🔒</span> // Padlock to Hide
                        ) : (
                            <span className="text-xl">👁️</span> // Eye to See
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
