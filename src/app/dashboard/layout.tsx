'use client';

import { SessionGuard } from '@/features/auth/components/SessionGuard';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ToastProvider } from '@/features/ui/ToastProvider';
import { FloatingChat } from '@/features/support/components/FloatingChat';
import { I18nProvider, LanguageToggle, useI18n } from '@/features/i18n/I18nProvider';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

import { useState, useRef, useEffect } from 'react';

function MobileMenu({ t }: { t: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-sg-blue rounded-full transition-colors"
                aria-label="Menu"
            >
                <span className="text-xl font-bold">+</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />
                    <div className="fixed top-20 right-4 left-4 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2 grid grid-cols-2 gap-2">
                        <Link href="/dashboard" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <span className="text-2xl mb-1">🏠</span>
                            <span className="text-xs font-medium text-gray-600">{t('nav.home')}</span>
                        </Link>
                        <Link href="/dashboard/investments" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <span className="text-2xl mb-1">📈</span>
                            <span className="text-xs font-medium text-gray-600">{t('nav.investments')}</span>
                        </Link>
                        <Link href="/dashboard/services" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <span className="text-2xl mb-1">🛠️</span>
                            <span className="text-xs font-medium text-gray-600">{t('nav.services')}</span>
                        </Link>
                        <Link href="/dashboard/cards" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <span className="text-2xl mb-1">💳</span>
                            <span className="text-xs font-medium text-gray-600">{t('nav.cards')}</span>
                        </Link>
                        <Link href="/dashboard/loans" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <span className="text-2xl mb-1">💸</span>
                            <span className="text-xs font-medium text-gray-600">Préstamos</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function DashboardNavbar() {
    const { signOut } = useAuth();
    const { user } = useAuthStore(); // Keep user for display name for now
    const router = useRouter();
    const { t } = useI18n();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <nav className="bg-white text-gray-800 p-4 shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                        <img
                            src="/logo.jpeg"
                            alt="SGBGE Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none tracking-tight text-sg-blue">SGBGE</h1>
                        <span className="text-[10px] bg-sg-red px-1.5 rounded text-white font-mono block w-fit mt-0.5">BETA</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 md:gap-3">
                    {/* Navigation Links - Desktop Only */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/dashboard" className="text-sm font-medium hover:bg-gray-100 text-sg-blue px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <span>🏠</span> {t('nav.home')}
                        </Link>
                        <Link href="/dashboard/services" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <span>🛠️</span> {t('nav.services')}
                        </Link>
                        <Link href="/dashboard/investments" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <span>📈</span> {t('nav.investments')}
                        </Link>
                        <Link href="/dashboard/loans" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <span>💸</span> Préstamos
                        </Link>
                        <Link href="/dashboard/cards" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <span>💳</span> {t('nav.cards')}
                        </Link>
                    </div>

                    {/* Mobile Plus Menu */}
                    <div className="md:hidden relative">
                        <MobileMenu t={t} />
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

                    {/* Language Toggle */}
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <LanguageToggle />
                    </div>

                    {/* Profile Button */}
                    <button
                        className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title={t('nav.profile')}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sg-blue to-blue-400 flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm text-gray-600">{user?.name}</span>
                    </button>

                    {/* Mobile Profile Icon (Simplified) */}
                    <div className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-br from-sg-blue to-blue-400 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-gray-100 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-colors text-red-600"
                        title={t('nav.logout')}
                    >
                        👋
                    </button>
                </div>
            </div>
        </nav>
    );
}

function MobileBottomNav() {
    const { t } = useI18n();
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: '🏠', label: t('nav.home') },
        { href: '/dashboard/services', icon: '🛠️', label: t('nav.services') },
        { href: '/dashboard/investments', icon: '📈', label: t('nav.investments') },
        { href: '/dashboard/loans', icon: '💸', label: 'Préstamos' },
        { href: '/dashboard/cards', icon: '💳', label: t('nav.cards') },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all ${isActive
                                ? 'text-sg-blue bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className={`text-[10px] font-medium truncate max-w-[60px] ${isActive ? 'text-sg-blue' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <SessionGuard>
                <ToastProvider>
                    <div className="min-h-screen bg-sg-gray pb-24 md:pb-0">
                        <DashboardNavbar />
                        <main className="container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
                            {children}
                        </main>
                        <MobileBottomNav />
                    </div>
                </ToastProvider>
                <FloatingChat />
            </SessionGuard>
        </I18nProvider>
    );
}
