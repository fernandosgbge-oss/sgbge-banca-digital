'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@/features/ui/icons';

const TOPIC_CARDS = [
    {
        emoji: '💳',
        title: 'Consultas de Tarjeta',
        bgColor: 'blue',
        questions: [
            '¿Cómo activo mi tarjeta?',
            'He olvidado mi PIN'
        ]
    },
    {
        emoji: '💸',
        title: 'Préstamos y Créditos',
        bgColor: 'green',
        questions: [
            'Quiero un adelanto de nómina',
            'Calcular cuota de préstamo'
        ]
    },
    {
        emoji: '🚨',
        title: 'Seguridad y Emergencias',
        bgColor: 'red',
        questions: [
            'Bloquear tarjeta por robo',
            'He visto un cargo extraño'
        ]
    },
    {
        emoji: '🌍',
        title: 'Operativa Internacional',
        bgColor: 'purple',
        questions: [
            'Hacer transferencia SWIFT',
            'Comisiones por cambio de divisa'
        ]
    }
];

const colorVariants: Record<string, { bg: string; hover: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-500/5', hover: 'hover:bg-blue-500/10', iconBg: 'bg-blue-50' },
    green: { bg: 'bg-green-500/5', hover: 'hover:bg-green-500/10', iconBg: 'bg-green-50' },
    red: { bg: 'bg-red-500/5', hover: 'hover:bg-red-500/10', iconBg: 'bg-red-50' },
    purple: { bg: 'bg-purple-500/5', hover: 'hover:bg-purple-500/10', iconBg: 'bg-purple-50' },
};

export default function ChatbotPage() {
    const openChatWithQuestion = (question: string) => {
        window.dispatchEvent(new CustomEvent('openChat', { detail: { question } }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Back to Dashboard Button */}
            <div className="flex justify-start">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-sg-blue transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Volver al Dashboard</span>
                </Link>
            </div>

            <header className="text-center space-y-2 py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-sg-blue to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl mb-4">
                    <span className="text-4xl">🤖</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Asistente Virtual SGBGE</h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Estoy aquí para ayudarte 24/7. Haz clic en cualquier pregunta para iniciar una conversación.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {TOPIC_CARDS.map((card, idx) => {
                    const colors = colorVariants[card.bgColor];
                    return (
                        <div 
                            key={idx}
                            className={`bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4 relative overflow-hidden group ${colors.hover} transition-colors`}
                        >
                            <div className={`absolute inset-0 ${colors.bg} group-hover:opacity-100 transition-opacity`}></div>
                            <span className={`text-4xl ${colors.iconBg} p-4 rounded-2xl relative z-10`}>{card.emoji}</span>
                            <h3 className="font-bold text-lg relative z-10">{card.title}</h3>
                            <div className="space-y-2 relative z-10 w-full">
                                {card.questions.map((question, qIdx) => (
                                    <button
                                        key={qIdx}
                                        onClick={() => openChatWithQuestion(question)}
                                        className="w-full text-sm text-gray-600 hover:text-sg-blue hover:bg-white/80 px-4 py-2 rounded-lg transition-all cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
                                    >
                                        "{question}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center pt-4">
                <p className="text-sm text-gray-400">
                    💡 También puedes hacer clic en el icono del robot en la esquina superior derecha para chatear libremente.
                </p>
            </div>
        </div>
    );
}
