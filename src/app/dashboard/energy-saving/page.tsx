'use client';

import { ZapIcon, LightbulbIcon, TrendingUpIcon } from '@/features/ui/icons';

export default function EnergySavingPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                        <ZapIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tu Ahorro Energético</h1>
                        <p className="text-gray-500">Optimiza tus consumos y ahorra más</p>
                    </div>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
                    <p className="text-white/80 font-medium mb-1">Ahorro Estimado (Mes)</p>
                    <h2 className="text-4xl font-bold mb-4">15.400 XAF</h2>
                    <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <TrendingUpIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">+12% vs mes anterior</span>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Consumo Reciente (SEGESA)</h3>
                    <div className="h-32 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 30, 60].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className="w-full bg-yellow-100 rounded-t-lg transition-all hover:bg-yellow-200 relative group"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h * 100} XAF
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">Día {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-4">Consejos Personalizados</h2>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                        <LightbulbIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900">Iluminación LED</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            Cambiar 5 bombillas a LED podría ahorrarte hasta 5.000 XAF al mes en tu factura de SEGESA.
                        </p>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm flex-shrink-0">
                        <ZapIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-green-900">Desconecta en Standby</h3>
                        <p className="text-sm text-green-700 mt-1">
                            Los aparatos en standby consumen hasta un 10% de tu energía. Desconéctalos cuando no los uses.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
