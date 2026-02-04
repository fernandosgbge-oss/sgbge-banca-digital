'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useBiometrics } from '@/features/auth/hooks/useBiometrics';
import { PWAInstallButton } from '@/features/pwa/components/PWAInstallButton';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

    const handleGoogleLogin = async () => {
        setFirebaseError('');
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
                setFirebaseError('Ventana de inicio cerrada');
            } else {
                setFirebaseError('Error al iniciar con Google: ' + err.code);
            }
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

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continuar con Google
                    </button>
                    
                    {hasBiometrics && (
                        <button
                            type="button"
                            onClick={handleBiometricLogin}
                            className="w-full flex items-center justify-center gap-2 text-sg-blue font-semibold hover:bg-gray-50 py-3 rounded-lg transition-colors"
                        >
                            <span>👆</span> Acceder con FaceID / Huella
                        </button>
                    )}
                </div>

                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">¿No tienes cuenta? <Link href="/register" className="text-sg-blue font-bold">Regístrate aquí</Link></p>
                </div>
            </div>
            <PWAInstallButton />
        </main>
    );
}
