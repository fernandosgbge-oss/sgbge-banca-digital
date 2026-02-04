'use client';

import { LoanSimulator } from '@/features/loans/components/LoanSimulator';
import Link from 'next/link';

export default function LoansPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Préstamos y Financiación</h1>
                <p className="text-gray-500">Calcula tus cuotas y solicita financiación a tu medida</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Simulator Section */}
                <section className="lg:col-span-2">
                    <LoanSimulator />
                </section>

                {/* Actions Sidebar */}
                <aside className="space-y-6">
                    {/* Salary Advance Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Adelanto de Nómina</h3>
                            <p className="text-indigo-100 text-sm mb-4">
                                Recibe hasta el 50% de tu sueldo hoy mismo. Sin trámites largos.
                            </p>
                            <Link
                                href="/dashboard/loans/salary-advance"
                                className="inline-block bg-white text-indigo-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                            >
                                Solicitar Adelanto
                            </Link>
                        </div>
                        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            💸
                        </div>
                    </div>

                    {/* Standard Loan Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <h3 className="font-bold text-lg mb-2 text-gray-800">Préstamo Personal Online</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Solicita hasta 50.000.000 FCFA para tus proyectos. Respuesta en 24h.
                        </p>
                        <Link
                            href="/dashboard/loans/apply"
                            className="inline-block w-full text-center border-2 border-sg-blue text-sg-blue font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                        >
                            Solicitar Préstamo
                        </Link>
                    </div>

                    {/* Tips */}
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <div className="flex gap-3">
                            <span className="text-2xl">💡</span>
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Consejo Financiero</h4>
                                <p className="text-yellow-700 text-xs mt-1">
                                    Antes de solicitar un préstamo, asegúrate de que la cuota mensual no supere el 30% de tus ingresos.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
