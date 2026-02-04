'use client';

import { UserPlusIcon, StarIcon, BanknoteIcon } from '@/features/ui/icons';

export default function InvitePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="text-center py-8">
                <div className="w-20 h-20 bg-blue-100 text-sg-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlusIcon className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invita a un amigo</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    Gana recompensas exclusivas invitando a tus amigos a unirse a la banca digital de SGBGE.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Tu código de invitación</h2>

                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 w-full mb-6 relative group cursor-pointer hover:border-sg-blue transition-colors">
                        <span className="text-2xl font-mono font-bold text-sg-blue tracking-wider">FER-2024-SGB</span>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <span className="font-bold text-sm text-gray-900">Copiar Código</span>
                        </div>
                    </div>

                    <button className="w-full bg-sg-blue text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium mb-3">
                        Compartir en WhatsApp
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                        Otros medios
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <BanknoteIcon className="w-5 h-5" />
                            Por cada amigo
                        </h3>
                        <p className="text-white/90 text-sm mb-4">
                            Recibe <span className="font-bold text-xl">5.000 XAF</span> cuando tu amigo realice su primera operación.
                        </p>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-yellow-400 rounded-full" />
                        </div>
                        <p className="text-xs mt-2 text-white/70">2 de 3 invitaciones para el bonus extra</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <StarIcon className="w-5 h-5 text-gray-400" />
                            Tus Invitaciones
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">A</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Ana M.</p>
                                        <p className="text-xs text-green-600 font-medium">Completado</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600">+5.000 XAF</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs">P</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Pedro L.</p>
                                        <p className="text-xs text-yellow-600 font-medium">Pendiente</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">En proceso</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
