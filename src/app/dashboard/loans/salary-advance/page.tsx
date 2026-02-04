'use client';

import SalaryAdvanceForm from '@/features/loans/components/SalaryAdvanceForm';
import Link from 'next/link';

export default function SalaryAdvancePage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/dashboard/loans" className="hover:text-sg-blue">Préstamos</Link>
                <span>/</span>
                <span className="font-medium text-gray-900">Adelanto Salarial</span>
            </div>

            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Solicitud de Adelanto Salarial</h1>
                <p className="text-gray-500">Completa los datos para recibir tu anticipo</p>
            </header>

            <SalaryAdvanceForm />
        </div>
    );
}
