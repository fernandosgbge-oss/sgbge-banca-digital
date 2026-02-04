'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await sendPasswordResetEmail(auth, email);
            setStatus('success');
            setMsg('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        } catch (error: any) {
            setStatus('error');
            setMsg(error.message || 'Error al enviar correo.');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-sg-blue p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-sg-blue mb-2 text-center">Recuperar Contraseña</h1>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="text-green-600 mb-4 bg-green-50 p-4 rounded-lg">{msg}</div>
                        <Link href="/login" className="text-sg-blue font-bold underline">Volver al Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-600 text-sm text-center mb-6">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        {status === 'error' && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{msg}</div>}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-sg-blue text-white py-3 rounded-lg font-bold hover:bg-blue-900 disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Enviando...' : 'ENVIAR ENLACE'}
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="text-sm text-gray-500 hover:text-sg-blue">Cancelar</Link>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
