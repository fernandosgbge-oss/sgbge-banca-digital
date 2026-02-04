'use client';

import { LockIcon, ShieldIcon, SmartphoneIcon } from '@/features/ui/icons';

export default function SecurityPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ShieldIcon className="w-8 h-8 text-sg-blue" />
                    Seguridad y Privacidad
                </h1>
                <p className="text-gray-500">Protege tu cuenta y datos personales</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LockIcon className="w-5 h-5 text-gray-400" />
                        Contraseña
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Contraseña Actual</label>
                            <input
                                type="password"
                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-sg-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nueva Contraseña</label>
                            <input
                                type="password"
                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-sg-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-sg-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        <button className="w-full bg-sg-blue text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                            Actualizar Contraseña
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <SmartphoneIcon className="w-5 h-5 text-gray-400" />
                            Verificación en 2 Pasos
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Añade una capa extra de seguridad a tu cuenta requiriendo un código de tu móvil para iniciar sesión.
                        </p>
                        <button className="w-full border-2 border-sg-blue text-sg-blue py-2.5 rounded-xl hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2">
                            <SmartphoneIcon className="w-5 h-5" />
                            Activar 2FA
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShieldIcon className="w-5 h-5 text-gray-400" />
                            Dispositivos Conectados
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Chrome en Windows</p>
                                    <p className="text-xs text-green-600 font-medium">Dispositivo Actual</p>
                                </div>
                                <span className="text-xs text-gray-400">Ahora</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">App Móvil SGBGE</p>
                                    <p className="text-xs text-gray-500">Android 12</p>
                                </div>
                                <button className="text-xs text-red-600 hover:underline">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
