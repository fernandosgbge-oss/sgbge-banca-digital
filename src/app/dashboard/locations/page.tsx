'use client';

import { MapPinIcon, SmartphoneIcon, CalendarIcon } from '@/features/ui/icons';

export default function LocationsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPinIcon className="w-8 h-8 text-sg-blue" />
                    Oficinas y Cajeros
                </h1>
                <p className="text-gray-500">Encuentra tu sucursal o cajero más cercano</p>
            </header>

            {/* Simulated Map Placeholder */}
            <div className="w-full h-64 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-2">
                <MapPinIcon className="w-10 h-10 text-gray-400" />
                <p className="text-gray-500 font-medium">Mapa Interactivo</p>
                <span className="text-xs text-gray-400">Próximamente integración con Google Maps</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Sucursal Principal - Malabo</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Avda. Independencia, Malabo</p>
                                <p className="text-xs text-gray-500">Frente al Parque Nacional</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Horario de Apertura</p>
                                <p className="text-xs text-gray-500">Lunes - Viernes: 08:00 - 16:00</p>
                                <p className="text-xs text-gray-500">Sábados: 09:00 - 13:00</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <SmartphoneIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Contacto</p>
                                <p className="text-xs text-gray-500">+240 333 099 000</p>
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button className="flex-1 bg-sg-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Cómo llegar
                            </button>
                            <button className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Pedir Cita
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Cajero Automático (ATM) - Aeropuerto</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Aeropuerto Internacional de Malabo</p>
                                <p className="text-xs text-gray-500">Zona de Llegadas</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Disponibilidad</p>
                                <p className="text-xs text-green-600 font-bold">24 Horas / 7 Días</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-bold text-gray-700 mb-1">Servicios Disponibles:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                <li>Retirada de Efectivo (XAF)</li>
                                <li>Consulta de Saldo</li>
                                <li>Cambio de PIN</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
