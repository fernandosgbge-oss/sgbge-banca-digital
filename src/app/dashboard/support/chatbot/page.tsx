'use client';

import { FloatingChat } from '@/features/support/components/FloatingChat';

export default function ChatbotPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-center space-y-2 py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-sg-blue to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl mb-4">
                    <span className="text-4xl">🤖</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Asistente Virtual SGBGE</h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Estoy aquí para ayudarte 24/7. Pregúntame sobre saldos, tarjetas, transferencias o reportar incidencias.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Visual Representation (Just a stylized container for the "idea") */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                    <span className="text-4xl bg-blue-50 p-4 rounded-2xl">💳</span>
                    <h3 className="font-bold text-lg">Consultas de Tarjeta</h3>
                    <p className="text-sm text-gray-500">"¿Cómo activo mi tarjeta?"</p>
                    <p className="text-sm text-gray-500">"He olvidado mi PIN"</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                    <span className="text-4xl bg-green-50 p-4 rounded-2xl">💸</span>
                    <h3 className="font-bold text-lg">Préstamos y Créditos</h3>
                    <p className="text-sm text-gray-500">"Quiero un adelanto de nómina"</p>
                    <p className="text-sm text-gray-500">"Calcular cuota de préstamo"</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                    <span className="text-4xl bg-red-50 p-4 rounded-2xl">🚨</span>
                    <h3 className="font-bold text-lg">Seguridad y Emergencias</h3>
                    <p className="text-sm text-gray-500">"Bloquear tarjeta por robo"</p>
                    <p className="text-sm text-gray-500">"He visto un cargo extraño"</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                    <span className="text-4xl bg-purple-50 p-4 rounded-2xl">🌍</span>
                    <h3 className="font-bold text-lg">Operativa Internacional</h3>
                    <p className="text-sm text-gray-500">"Hacer transferencia SWIFT"</p>
                    <p className="text-sm text-gray-500">"Comisiones por cambio de divisa"</p>
                </div>
            </div>

            {/* Note: The actual Chat UI is the FloatingChat component which is global, 
                but here we layout "suggested topics" */}

            <div className="text-center pt-8">
                <p className="text-sm text-gray-400">
                    💡 Haz clic en el icono del robot en la esquina inferior derecha para empezar a chatear.
                </p>
            </div>
        </div>
    );
}
