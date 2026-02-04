'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { SettingsIcon, UserIcon, BellIcon, ShieldIcon } from '@/features/ui/icons';

export default function ProfilePage() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <SettingsIcon className="w-8 h-8 text-sg-blue" />
                    Configuración
                </h1>
                <p className="text-gray-500">Gestiona tu perfil y preferencias</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-sg-blue">
                        {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-12 h-12" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <button className="mt-2 text-sm text-sg-blue hover:underline font-medium">
                            Cambiar foto de perfil
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            Información Personal
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name || ''}
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-sg-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="+240 222..."
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-sg-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <BellIcon className="w-5 h-5 text-gray-400" />
                            Notificaciones
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <span className="text-sm text-gray-700">Recibir alertas por email</span>
                                <input type="checkbox" defaultChecked className="accent-sg-blue w-4 h-4" />
                            </label>
                            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <span className="text-sm text-gray-700">Alertas de movimientos</span>
                                <input type="checkbox" defaultChecked className="accent-sg-blue w-4 h-4" />
                            </label>
                            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <span className="text-sm text-gray-700">Novedades y promociones</span>
                                <input type="checkbox" className="accent-sg-blue w-4 h-4" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button className="bg-sg-blue text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
