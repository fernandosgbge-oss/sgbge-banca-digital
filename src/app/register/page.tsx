'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

    const handleGoogleSignUp = async () => {
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Check if user profile exists, if not create it
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    name: result.user.displayName || 'Usuario',
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    createdAt: Date.now(),
                    provider: 'google'
                });
            }
            
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Ventana de registro cerrada');
            } else {
                setError('Error al registrar con Google: ' + err.code);
            }
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

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Registrarse con Google
                    </button>
                </div>

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
