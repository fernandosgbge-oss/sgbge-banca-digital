'use client';

import { useState, useEffect, useRef } from 'react';

interface PinPromptProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    title?: string;
}

export function PinPrompt({ isOpen, onClose, onSuccess, title = "Confirmar Operación" }: PinPromptProps) {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '', '', '']);
            setError('');
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto submit on last digit
        if (index === 5 && value) {
            handleVerify(newPin.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (pinValue: string) => {
        // Mock verification - In real app, verify against API/Hash
        if (pinValue === '123456') {
            onSuccess();
            onClose();
        } else {
            setError('PIN Incorrecto');
            setPin(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 animate-in zoom-in-95 duration-200">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        🔐
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <p className="text-gray-500 text-sm mt-1">Introduce tu PIN de seguridad de 6 dígitos</p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {pin.map((digit, i) => (
                        <input
                            key={i}
                            ref={el => inputRefs.current[i] = el}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className={`w-10 h-12 text-center text-xl font-bold border-2 rounded-lg focus:border-sg-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-6 font-medium animate-pulse">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => handleVerify(pin.join(''))}
                        className="py-3 px-4 rounded-xl bg-sg-blue text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
