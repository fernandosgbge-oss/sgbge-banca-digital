'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { format } from 'date-fns';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'manager';
    timestamp: number;
    read: boolean;
};

// Mock initial chat history
const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        text: 'Buenos días, soy Carlos, su gestor personal. He notado un movimiento inusual en su tarjeta. ¿Ha realizado usted una compra en "Electro World" por 500.000 FCFA?',
        sender: 'manager',
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        read: true
    },
    {
        id: '2',
        text: 'Hola Carlos. Sí, fui yo. Estaba comprando electrodomésticos.',
        sender: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 23,
        read: true
    },
    {
        id: '3',
        text: 'Perfecto, gracias por confirmar. Procedo a desbloquear la operación de seguridad. ¿Necesita algo más?',
        sender: 'manager',
        timestamp: Date.now() - 1000 * 60 * 60 * 22,
        read: true
    }
];

export default function ManagerChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: Date.now(),
            read: false
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate Manager Reply
        setTimeout(() => {
            setIsTyping(false);
            const replyMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Gracias por su mensaje. Revisaré su consulta y le responderé lo antes posible dentro del horario laboral (08:00 - 16:00).',
                sender: 'manager',
                timestamp: Date.now(),
                read: false
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Carlos+Gestor&background=0D8ABC&color=fff" alt="Manager" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Carlos (Gestor Personal)</h2>
                        <p className="text-xs text-gray-500">SGBGE Banca Privada • En línea</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">📞</button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">📅</button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50" ref={scrollRef}>
                <div className="flex justify-center">
                    <span className="text-xs text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">
                        Inicio de la conversación encriptada
                    </span>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[70%] p-4 rounded-2xl shadow-sm relative group
                            ${msg.sender === 'user'
                                ? 'bg-sg-blue text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}
                        `}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                {format(msg.timestamp, 'HH:mm')}
                                {msg.sender === 'user' && (
                                    <span>{msg.read ? '✓✓' : '✓'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-4 items-center">
                <button type="button" className="p-2 text-gray-400 hover:text-sg-blue transition-colors">
                    📎
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escriba un mensaje para su gestor..."
                    className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sg-blue focus:bg-white transition-all"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-sg-blue text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
                >
                    ➤
                </button>
            </form>
        </div>
    );
}
