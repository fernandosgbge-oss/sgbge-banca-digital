'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { db } from '@/lib/firebase/client';
import { addDoc, collection } from 'firebase/firestore';
import { createNotification } from '@/lib/notifications/service';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const loanSchema = z.object({
    purpose: z.string().min(5, "Detalla el objetivo"),
    amount: z.coerce.number().min(500000, "Mínimo 500.000"),
    months: z.coerce.number().min(6).max(120),
    monthlyIncome: z.coerce.number().min(100000, "Ingresos insuficientes"),
    employmentStatus: z.string().min(2, "Requerido"),
    observations: z.string().optional()
});

type LoanForm = z.infer<typeof loanSchema>;

export default function LoanApplyPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pre-fill from URL params if available (from simulator)
    const defaultAmount = searchParams.get('amount') || '';
    const defaultMonths = searchParams.get('months') || '';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoanForm>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            amount: Number(defaultAmount),
            months: Number(defaultMonths)
        }
    });

    const onSubmit = async (data: LoanForm) => {
        if (!user) return;

        try {
            await addDoc(collection(db, 'loanRequests'), {
                uid: user.id,
                ...data,
                status: 'pending',
                createdAt: Date.now()
            });

            await createNotification(
                user.id,
                'loan_request',
                'Solicitud de Préstamo Recibida',
                `Hemos recibido tu solicitud de ${(data.amount).toLocaleString()} FCFA. Un gestor la revisará pronto.`,
                { amount: data.amount }
            );

            router.push('/dashboard/loans?success=true');
        } catch (error) {
            console.error(error);
            alert("Error al enviar solicitud");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/dashboard/loans" className="hover:text-sg-blue">Préstamos</Link>
                <span>/</span>
                <span className="font-medium text-gray-900">Solicitud Online</span>
            </div>

            <header>
                <h1 className="text-2xl font-bold text-gray-900">Solicitud de Préstamo Personal</h1>
                <p className="text-gray-500">Cuéntanos sobre tu proyecto</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo del Préstamo</label>
                    <input {...register('purpose')} placeholder="Ej: Compra de vehículo, Reformas..." className="w-full px-4 py-2 border rounded-lg" />
                    {errors.purpose && <p className="text-red-500 text-xs">{errors.purpose.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monto (FCFA)</label>
                        <input type="number" {...register('amount')} className="w-full px-4 py-2 border rounded-lg" />
                        {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (Meses)</label>
                        <input type="number" {...register('months')} className="w-full px-4 py-2 border rounded-lg" />
                        {errors.months && <p className="text-red-500 text-xs">{errors.months.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos Mensuales</label>
                        <input type="number" {...register('monthlyIncome')} className="w-full px-4 py-2 border rounded-lg" />
                        {errors.monthlyIncome && <p className="text-red-500 text-xs">{errors.monthlyIncome.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Situación Laboral</label>
                        <select {...register('employmentStatus')} className="w-full px-4 py-2 border rounded-lg">
                            <option value="">Seleccionar...</option>
                            <option value="employed">Empleado Fijo</option>
                            <option value="contract">Contrato Temporal</option>
                            <option value="self_employed">Autónomo</option>
                            <option value="civil_servant">Funcionario</option>
                            <option value="retired">Jubilado</option>
                        </select>
                        {errors.employmentStatus && <p className="text-red-500 text-xs">{errors.employmentStatus.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
                    <textarea {...register('observations')} className="w-full px-4 py-2 border rounded-lg h-24"></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sg-blue text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 disabled:bg-gray-400 transition-all"
                >
                    {isSubmitting ? 'Procesando...' : 'ENVIAR SOLICITUD'}
                </button>
            </form>
        </div>
    );
}
