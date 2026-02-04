'use client';

import { TagIcon, PercentIcon, GiftIcon } from '@/features/ui/icons';

export default function PromotionsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TagIcon className="w-8 h-8 text-sg-blue" />
                    Mis Promociones
                </h1>
                <p className="text-gray-500">Ofertas personalizadas pensadas para ti</p>
            </header>

            <div className="space-y-6">
                {/* Featured Promo */}
                <div className="bg-gradient-to-r from-sg-blue to-blue-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10 max-w-lg">
                        <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                            NUEVO
                        </span>
                        <h2 className="text-3xl font-bold mb-2">Préstamo Personal Premium</h2>
                        <p className="text-blue-100 mb-6">
                            Disfruta de un tipo de interés preferente del 5% TAE hasta el 31 de Diciembre. Pre-aprobado para ti.
                        </p>
                        <button className="bg-white text-sg-blue px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                            Solicitar Ahora
                        </button>
                    </div>
                    {/* Decorative Background Circles */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-20 -mb-20 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-32 bg-purple-100 flex items-center justify-center">
                            <GiftIcon className="w-12 h-12 text-purple-500" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Seguro de Hogar Plus</h3>
                            <p className="text-sm text-gray-500 mb-4 flex-1">
                                Contrata ahora y llévate 2 meses gratis. Protección total para tu vivienda.
                            </p>
                            <button className="w-full border border-purple-500 text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                                Ver Detalles
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-32 bg-green-100 flex items-center justify-center">
                            <TagIcon className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Descuentos en Comercios</h3>
                            <p className="text-sm text-gray-500 mb-4 flex-1">
                                Hasta 20% de descuento en restaurantes y tiendas seleccionadas pagando con tu tarjeta SGBGE.
                            </p>
                            <button className="w-full border border-green-500 text-green-600 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                                Ver Comercios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
