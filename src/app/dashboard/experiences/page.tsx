'use client';

import { StarIcon, CalendarIcon, MapPinIcon } from '@/features/ui/icons';

const EXPERIENCES = [
    {
        id: 1,
        title: 'Cena Gastronómica en Grand Hotel Djibloho',
        category: 'Gastronomía',
        date: 'Este fin de semana',
        location: 'Djibloho',
        price: '30.000 XAF',
        image: 'bg-orange-100'
    },
    {
        id: 2,
        title: 'Torneo de Golf SGBGE',
        category: 'Deportes',
        date: 'Próximo Sábado',
        location: 'Sipoopo',
        price: 'Gratis para clientes Gold',
        image: 'bg-green-100'
    },
    {
        id: 3,
        title: 'Concierto Exclusivo',
        category: 'Música',
        date: '25 de Marzo',
        location: 'Malabo',
        price: 'Desde 15.000 XAF',
        image: 'bg-purple-100'
    }
];

export default function ExperiencesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <StarIcon className="w-8 h-8 text-sg-blue" />
                    Experiencias Exclusivas
                </h1>
                <p className="text-gray-500">Eventos y beneficios únicos por ser cliente SGBGE</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                        <div className={`h-32 ${exp.image} w-full flex items-center justify-center`}>
                            <StarIcon className="w-10 h-10 text-white/50" />
                        </div>
                        <div className="p-4 space-y-3">
                            <span className="text-xs font-bold text-sg-blue bg-blue-50 px-2 py-1 rounded-md">
                                {exp.category}
                            </span>
                            <h3 className="font-bold text-gray-900 group-hover:text-sg-blue transition-colors">
                                {exp.title}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    {exp.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="w-4 h-4" />
                                    {exp.location}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                <span className="font-bold text-gray-900">{exp.price}</span>
                                <button className="text-xs font-bold text-sg-blue hover:underline">
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-sg-blue to-blue-800 rounded-2xl p-8 text-white text-center">
                <h2 className="text-xl font-bold mb-2">¿Tienes alguna sugerencia?</h2>
                <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                    Nos encantaría saber qué tipo de experiencias te gustaría disfrutar con SGBGE.
                </p>
                <button className="bg-white text-sg-blue px-6 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    Sugerir Experiencia
                </button>
            </div>
        </div>
    );
}
