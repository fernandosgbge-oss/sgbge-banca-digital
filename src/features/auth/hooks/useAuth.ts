'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store'; // Sync with existing store if needed

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { login: storeLogin, logout: storeLogout } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                // Sync with zustand store for existing components
                storeLogin({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email || 'Usuario',
                    email: firebaseUser.email || '',
                    biometricsRegistered: false // Ideally fetch this from Firestore profile
                });
            } else {
                storeLogout();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [storeLogin, storeLogout]);

    const signOut = async () => {
        await firebaseSignOut(auth);
        router.push('/login');
    };

    return { user, loading, signOut };
}
