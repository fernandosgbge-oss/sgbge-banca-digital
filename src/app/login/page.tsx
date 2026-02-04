'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useBiometrics } from '@/features/auth/hooks/useBiometrics';
import { PWAInstallButton } from '@/features/pwa/components/PWAInstallButton';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login: storeLogin } = useAuthStore(); // We still use store for global state sync
    const { authenticate } = useBiometrics();
    const [firebaseError, setFirebaseError] = useState('');
    const [hasBiometrics, setHasBiometrics] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        const isRegistered = localStorage.getItem('sgbge-biometrics-registered') === 'true';
        setHasBiometrics(isRegistered);
    }, []);

    const onSubmit = async (data: LoginForm) => {
        setFirebaseError('');
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            // useAuth hook will detect change and sync store
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setFirebaseError('Credenciales incorrectas');
            } else {
                setFirebaseError('Error al iniciar sesión: ' + err.code);
            }
        }
    };

    const handleBiometricLogin = async () => {
        try {
            const success = await authenticate();
            if (success) {
                router.push('/dashboard');
            }
        } catch (err) {
            setFirebaseError('Error biométrico. Use contraseña.');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-sg-blue p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sg-red max-w-md to-sg-blue"></div>

                <h1 className="text-3xl font-bold text-sg-blue mb-2 text-center">SGBGE</h1>
                <p className="text-gray-500 text-center mb-8">Acceso Seguro al Ecosistema</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue outline-none"
                            placeholder="usuario@sgbge.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sg-blue outline-none"
                            placeholder="••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        <div className="text-right mt-1">
                            <Link href="/reset-password" className="text-xs text-sg-blue hover:underline">¿Olvidaste tu contraseña?</Link>
                        </div>
                    </div>

                    {firebaseError && (
                        <div className="p-3 bg-red-50 text-sg-red text-sm rounded-lg flex items-center animate-pulse">
                            ⚠️ {firebaseError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-sg-red text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-200 disabled:opacity-50"
                    >
                        {isSubmitting ? 'INGRESANDO...' : 'INGRESAR'}
                    </button>
                </form>

                {hasBiometrics && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleBiometricLogin}
                            className="w-full flex items-center justify-center gap-2 text-sg-blue font-semibold hover:bg-gray-50 py-3 rounded-lg transition-colors"
                        >
                            <span>👆</span> Acceder con FaceID / Huella
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">¿No tienes cuenta? <Link href="/register" className="text-sg-blue font-bold">Regístrate aquí</Link></p>
                </div>
            </div>
            <PWAInstallButton />
        </main>
    );
}
