'use client';

import { BotIcon, SendIcon, XCircleIcon, HomeIcon } from '@/features/ui/icons';
import { useRouter, usePathname } from 'next/navigation';

import { useState, useRef, useEffect, useCallback } from 'react';

type Message = { id: string; text: string; sender: 'user' | 'bot'; isTicket?: boolean };

const INTENTS: Record<string, string> = {
    'PIN': 'Para recuperar o cambiar tu PIN, ve a la sección "Tarjetas" > "Configuración de Tarjeta". También puedes hacerlo en cualquier cajero SGBGE.',
    'SALDO': 'Puedes consultar tu saldo en tiempo real en el Dashboard principal. Si ves discrepancias, por favor verifica tus "Extractos".',
    'ROBO': '⚠️ Si has sufrido un robo, por favor congela tu tarjeta INMEDIATAMENTE desde la sección "Tarjetas". Generaré un ticket de alta prioridad para ti.',
    'CLAVE': 'Nunca compartas tu Clave de Operaciones. Si la has olvidado, debes acudir presencialmente a una sucursal por seguridad.',
    'TRANSFERENCIA': 'Puedes realizar transferencias nacionales e internacionales en la sección "Servicios". Recuerda que los envíos CEMAC requieren validación adicional.',
    'TARJETA': 'Para activar tu tarjeta, ve a la sección "Tarjetas" y sigue el proceso de activación. Necesitarás el código que recibiste por SMS.',
    'PRÉSTAMO': 'Puedes solicitar un adelanto de nómina o préstamo personal en "Servicios" > "Préstamos". La aprobación es en minutos.',
    'CUOTA': 'El simulador de cuotas está disponible en "Servicios" > "Préstamos" > "Calcular cuota". Podrás ver diferentes escenarios de pago.',
    'BLOQUEAR': '⚠️ Para bloquear tu tarjeta, ve inmediatamente a "Tarjetas" > "Seguridad" > "Bloquear tarjeta". Es instantáneo.',
    'CARGO': 'Si ves un cargo sospechoso, puedes disputarlo en "Tarjetas" > "Movimientos" > "Disputar cargo". Investigaremos en 48h.',
    'SWIFT': 'Las transferencias SWIFT se realizan en "Servicios" > "Transferencias Internacionales". Necesitarás el código SWIFT del banco destino.',
    'DIVISA': 'Puedes consultar las tasas de cambio actualizadas en "Servicios" > "Cambio de Divisas". Las comisiones varían según el monto.'
};

const SUGGESTED_QUESTIONS = [
    { emoji: '💳', text: '¿Cómo activo mi tarjeta?' },
    { emoji: '🔐', text: 'He olvidado mi PIN' },
    { emoji: '💰', text: '¿Cuál es mi saldo?' },
    { emoji: '🚨', text: 'Bloquear tarjeta por robo' },
];

export function FloatingChat() {
    const router = useRouter();
    const pathname = usePathname();
    
    // Only show on chatbot page
    if (pathname !== '/dashboard/support/chatbot') {
        return null;
    }
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', text: 'Hola 👋 Soy tu asistente SGBGE. ¿En qué puedo ayudarte hoy?', sender: 'bot' }
    ]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const processMessage = useCallback((text: string) => {
        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setShowSuggestions(false);

        // Process Intent
        setTimeout(() => {
            const upperInput = text.toUpperCase();
            let responseText = "Entiendo tu consulta. Un agente humano revisará tu caso en breve.";
            let isTicket = false;

            // Simple Keyword Matching
            for (const key in INTENTS) {
                if (upperInput.includes(key)) {
                    responseText = INTENTS[key];
                    if (key === 'ROBO' || key === 'BLOQUEAR') isTicket = true;
                    break;
                }
            }

            if (isTicket) {
                const ticketId = `TKT-${Math.floor(Math.random() * 10000)}`;
                responseText += ` Hemos abierto el Ticket #${ticketId}.`;
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), text: responseText, sender: 'bot', isTicket }]);
        }, 800);
    }, []);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        processMessage(input);
        setInput('');
    };

    const handleSuggestionClick = (question: string) => {
        processMessage(question);
    };

    // Listen for external chat open events
    useEffect(() => {
        const handleOpenChat = (event: CustomEvent<{ question?: string }>) => {
            setIsOpen(true);
            if (event.detail?.question) {
                setTimeout(() => processMessage(event.detail.question!), 300);
            }
        };

        window.addEventListener('openChat', handleOpenChat as EventListener);
        return () => window.removeEventListener('openChat', handleOpenChat as EventListener);
    }, [processMessage]);

    return (
        <div className="fixed top-24 right-4 z-40 flex flex-col items-end">

            {/* Floating Toggle Button - Robot Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110
                    ${isOpen ? 'bg-gray-200 rotate-12 text-gray-600' : 'bg-gradient-to-br from-sg-blue to-blue-600 text-white'}
                `}
                title="Asistente Virtual"
            >
                {isOpen ? <XCircleIcon className="w-6 h-6" /> : <BotIcon className="w-7 h-7" />}
            </button>

            {/* Chat Interface */}
            <div className={`
                bg-white rounded-2xl shadow-2xl border border-gray-200 mt-3 overflow-hidden flex flex-col
                transition-all duration-300 origin-top-right
                ${isOpen ? 'w-80 h-96 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-90'}
            `}>
                <div className="bg-sg-blue text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BotIcon className="w-6 h-6" />
                        <div>
                            <h3 className="font-bold text-sm">Asistente SGBGE</h3>
                            <p className="text-xs opacity-80">Virtual 24/7</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="text-white hover:bg-white/20 rounded p-1"
                            title="Volver al Dashboard"
                        >
                            <HomeIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded p-1">
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" ref={scrollRef}>
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[85%] p-3 rounded-2xl text-sm shadow-sm flex gap-2
                                ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}
                            `}>
                                {msg.sender === 'bot' && <BotIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                                {msg.sender === 'user' && <span className="hidden"></span>}
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    
                    {/* Suggested Questions */}
                    {showSuggestions && messages.length === 1 && (
                        <div className="space-y-2 pt-2">
                            <p className="text-xs text-gray-500 text-center">Preguntas frecuentes:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {SUGGESTED_QUESTIONS.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(q.text)}
                                        className="text-xs bg-white border border-gray-200 hover:border-sg-blue hover:bg-blue-50 px-3 py-2 rounded-full transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        <span>{q.emoji}</span>
                                        <span>{q.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        className="flex-1 text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sg-blue"
                        placeholder="Escribe tu duda..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-sg-blue text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <SendIcon className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
