'use client';

import { BotIcon, SendIcon, XCircleIcon } from '@/features/ui/icons';

import { useState, useRef, useEffect } from 'react';

type Message = { id: string; text: string; sender: 'user' | 'bot'; isTicket?: boolean };

const INTENTS: Record<string, string> = {
    'PIN': 'Para recuperar o cambiar tu PIN, ve a la sección "Tarjetas" > "Configuración de Tarjeta". También puedes hacerlo en cualquier cajero SGBGE.',
    'SALDO': 'Puedes consultar tu saldo en tiempo real en el Dashboard principal. Si ves discrepancias, por favor verifica tus "Extractos".',
    'ROBO': '⚠️ Si has sufrido un robo, por favor congela tu tarjeta INMEDIATAMENTE desde la sección "Tarjetas". Generaré un ticket de alta prioridad para ti.',
    'CLAVE': 'Nunca compartas tu Clave de Operaciones. Si la has olvidado, debes acudir presencialmente a una sucursal por seguridad.',
    'TRANSFERENCIA': 'Puedes realizar transferencias nacionales e internacionales en la sección "Servicios". Recuerda que los envíos CEMAC requieren validación adicional.'
};

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', text: 'Hola 👋 Soy tu asistente SGBGE. ¿En qué puedo ayudarte hoy?', sender: 'bot' }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Process Intent
        setTimeout(() => {
            const upperInput = userMsg.text.toUpperCase();
            let responseText = "Entiendo tu consulta. Un agente humano revisará tu caso en breve.";
            let isTicket = false;

            // Simple Keyword Matching
            for (const key in INTENTS) {
                if (upperInput.includes(key)) {
                    responseText = INTENTS[key];
                    if (key === 'ROBO') isTicket = true;
                    break;
                }
            }

            if (isTicket) {
                const ticketId = `TKT-${Math.floor(Math.random() * 10000)}`;
                responseText += ` Hemos abierto el Ticket #${ticketId}.`;
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), text: responseText, sender: 'bot', isTicket }]);
        }, 800);
    };

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
                    <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded p-1">
                        <XCircleIcon className="w-5 h-5" />
                    </button>
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
