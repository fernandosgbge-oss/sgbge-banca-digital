'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SessionGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!loading && !user && pathname !== '/login' && !pathname.startsWith('/register') && !pathname.startsWith('/reset-password')) {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);

    // Show loading state while determining auth status
    if (loading || !isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-sg-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Verificando seguridad...</p>
                </div>
            </div>
        );
    }

    // If no user and we are not on public pages, don't implement children (redirection happens above)
    // However, if we are fast, we might return null
    if (!user && pathname !== '/login' && !pathname.startsWith('/register') && !pathname.startsWith('/reset-password')) {
        return null;
    }

    return <>{children}</>;
}
