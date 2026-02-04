'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterForm) => {
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(userCredential.user, { displayName: data.name });

            // Create user profile in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: data.name,
                email: data.email,
                createdAt: Date.now()
            });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-sg-blue p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-sg-blue mb-2 text-center">Registro SGBGE</h1>
                <p className="text-gray-500 text-center mb-8">Crea tu cuenta digital</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input {...register('name')} className="w-full px-4 py-2 border rounded-lg" />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input {...register('email')} type="email" className="w-full px-4 py-2 border rounded-lg" />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input {...register('password')} type="password" className="w-full px-4 py-2 border rounded-lg" />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                        <input {...register('confirmPassword')} type="password" className="w-full px-4 py-2 border rounded-lg" />
                        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-sg-red text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50">
                        {isSubmitting ? 'Registrando...' : 'CREAR CUENTA'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta? <Link href="/login" className="text-sg-blue font-bold">Inicia Sesión</Link>
                </p>

                <PWAInstallBanner />
            </div>
        </main>
    );
}

// Reuse PWA Banner logic safely imported or inline if needed
function PWAInstallBanner() {
    return <div className="mt-4 text-center text-xs text-gray-400">Descarga nuestra App</div>
}
