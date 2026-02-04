'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { calculateSalaryAdvanceFee } from '@/lib/domain/fees';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { db, storage } from '@/lib/firebase/client';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createNotification } from '@/lib/notifications/service';
import { useRouter } from 'next/navigation';

const advanceSchema = z.object({
    company: z.string().min(2, "Empresa requerida"),
    profession: z.string().min(2, "Profesión requerida"),
    salary: z.coerce.number().min(100000, "Salario mínimo 100.000"),
    amountRequested: z.coerce.number().min(50000, "Mínimo 50.000"),
    repaymentMonths: z.coerce.number().int(),
    payrollFile: z.any().refine((files) => files?.length == 1, "Adjuntar nómina es obligatorio")
});

type AdvanceForm = z.infer<typeof advanceSchema>;

export default function SalaryAdvanceForm() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [feeDetails, setFeeDetails] = useState<{ fee: number, total: number } | null>(null);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<AdvanceForm>({
        resolver: zodResolver(advanceSchema),
        defaultValues: {
            repaymentMonths: 1
        }
    });

    const amount = watch('amountRequested');
    const months = watch('repaymentMonths');

    useEffect(() => {
        if (amount && months) {
            const details = calculateSalaryAdvanceFee(Number(amount), Number(months));
            setFeeDetails(details);
        }
    }, [amount, months]);

    const onSubmit = async (data: AdvanceForm) => {
        if (!user) return;

        try {
            // Upload file
            const file = data.payrollFile[0];
            const storageRef = ref(storage, `payrolls/${user.id}/${Date.now()}_${file.name}`);
            const uploadRes = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(uploadRes.ref);

            const details = calculateSalaryAdvanceFee(data.amountRequested, data.repaymentMonths);

            // Create Request
            await addDoc(collection(db, 'salaryAdvanceRequests'), {
                uid: user.id,
                ...data,
                payrollUrl: url,
                fee: details.fee,
                totalToRepay: details.total,
                status: 'pending',
                createdAt: Date.now(),
                payrollFile: null // Don't save file object
            });

            // Notify
            await createNotification(
                user.id,
                'salary_advance',
                'Solicitud de Adelanto Enviada',
                `Solicitaste ${(data.amountRequested).toLocaleString()} FCFA a devolver en ${data.repaymentMonths} meses.`,
                { amount: data.amountRequested, fee: details.fee }
            );

            router.push('/dashboard/loans?success=true');
        } catch (error) {
            console.error(error);
            alert("Error al procesar solicitud");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">Solicitar Adelanto de Nómina</h3>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Empresa / Empleador</label>
                    <input {...register('company')} className="w-full px-4 py-2 border rounded-lg" />
                    {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Profesión</label>
                    <input {...register('profession')} className="w-full px-4 py-2 border rounded-lg" />
                    {errors.profession && <p className="text-red-500 text-xs">{errors.profession.message}</p>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Salario Mensual (FCFA)</label>
                    <input type="number" {...register('salary')} className="w-full px-4 py-2 border rounded-lg" />
                    {errors.salary && <p className="text-red-500 text-xs">{errors.salary.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Adjuntar Nómina (PDF/IMG)</label>
                    <input type="file" {...register('payrollFile')} className="w-full px-4 py-2 border rounded-lg" accept=".pdf,image/*" />
                    {errors.payrollFile && <p className="text-red-500 text-xs">{errors.payrollFile.message as string}</p>}
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Importe a Solicitar</label>
                        <input type="number" {...register('amountRequested')} className="w-full px-4 py-2 border rounded-lg font-bold text-sg-blue" />
                        {errors.amountRequested && <p className="text-red-500 text-xs">{errors.amountRequested.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Plazo (Meses)</label>
                        <select {...register('repaymentMonths')} className="w-full px-4 py-2 border rounded-lg">
                            <option value="1">1 Mes</option>
                            <option value="2">2 Meses</option>
                            <option value="3">3 Meses</option>
                            <option value="6">6 Meses</option>
                        </select>
                    </div>
                </div>
            </div>

            {feeDetails && (
                <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Comisión estimada:</span>
                        <span className="font-bold">{feeDetails.fee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-sg-blue border-t border-blue-200 pt-2">
                        <span>Total a devolver:</span>
                        <span>{feeDetails.total.toLocaleString()} FCFA</span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sg-blue text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 disabled:bg-gray-400 transition-all"
            >
                {isSubmitting ? 'Enviando Solicitud...' : 'CONFIRMAR SOLICITUD'}
            </button>
        </form>
    );
}
