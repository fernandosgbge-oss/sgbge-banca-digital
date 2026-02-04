'use client';

export const dynamic = 'force-dynamic';

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
import {
    HomeIcon,
    TrendingUpIcon,
    WrenchIcon,
    CreditCardIcon,
    BanknoteIcon,
    SettingsIcon,
    ShieldIcon,
    ZapIcon,
    TargetIcon,
    MapPinIcon,
    UsersIcon,
    TagIcon,
    LogOutIcon,
    PlusIcon,
    LockIcon,
    StarIcon,
    UserPlusIcon,
    UserIcon
} from '@/features/ui/icons';

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
        <div ref={menuRef} className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-sg-blue rounded-full transition-colors"
                aria-label="Menu"
            >
                <PlusIcon className="w-5 h-5" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />
                    <div className="fixed top-20 right-4 left-4 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2 grid grid-cols-2 gap-2">
                        <Link href="/dashboard" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <HomeIcon className="w-6 h-6 mb-1 text-sg-blue" />
                            <span className="text-xs font-medium text-gray-600">{t('nav.home')}</span>
                        </Link>
                        <Link href="/dashboard/investments" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <TrendingUpIcon className="w-6 h-6 mb-1 text-sg-blue" />
                            <span className="text-xs font-medium text-gray-600">{t('nav.investments')}</span>
                        </Link>
                        <Link href="/dashboard/services" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <WrenchIcon className="w-6 h-6 mb-1 text-sg-blue" />
                            <span className="text-xs font-medium text-gray-600">{t('nav.services')}</span>
                        </Link>
                        <Link href="/dashboard/cards" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <CreditCardIcon className="w-6 h-6 mb-1 text-sg-blue" />
                            <span className="text-xs font-medium text-gray-600">{t('nav.cards')}</span>
                        </Link>
                        <Link href="/dashboard/loans" className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                            <BanknoteIcon className="w-6 h-6 mb-1 text-sg-blue" />
                            <span className="text-xs font-medium text-gray-600">Préstamos</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

function ProfileMenu({ t }: { t: any }) {
    const { user } = useAuthStore();
    const { signOut } = useAuth();
    const router = useRouter();
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

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-sg-blue text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-xl text-gray-900">{user?.name || 'Usuario'}</h3>
                        <p className="text-sm text-gray-500">Perfil</p>
                    </div>
                    <div className="py-2">
                        <button onClick={() => { router.push('/dashboard/profile'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <SettingsIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Configuración</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/security'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <LockIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Seguridad y privacidad</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/energy-saving'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <ZapIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Tu ahorro energético</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/transfers'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <CreditCardIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Hacer una operación</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/experiences'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <StarIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Experiencias</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/locations'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <MapPinIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Oficinas y cajeros</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/invite'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <UserPlusIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Invita a un amigo</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/promotions'); setIsOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                            <TagIcon className="w-5 h-5 text-sg-blue" />
                            <span className="text-gray-900 font-medium">Mis promociones</span>
                        </button>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left">
                                <LogOutIcon className="w-5 h-5 text-yellow-600" />
                                <span className="text-yellow-600 font-medium">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DashboardNavbar() {
    const { t } = useI18n();

    return (
        <nav className="bg-white text-gray-800 p-4 shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <MobileMenu t={t} />
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sg-blue rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <span className="text-xl font-bold text-sg-blue tracking-tight hidden md:block">SGBGE Digital</span>
                    </Link>
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                    {/* Navigation Links - Desktop Only */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/dashboard" className="text-sm font-medium hover:bg-gray-100 text-sg-blue px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <HomeIcon className="w-4 h-4" /> {t('nav.home')}
                        </Link>
                        <Link href="/dashboard/services" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <WrenchIcon className="w-4 h-4" /> {t('nav.services')}
                        </Link>
                        <Link href="/dashboard/investments" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <TrendingUpIcon className="w-4 h-4" /> {t('nav.investments')}
                        </Link>
                        <Link href="/dashboard/loans" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <BanknoteIcon className="w-4 h-4" /> Préstamos
                        </Link>
                        <Link href="/dashboard/cards" className="text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <CreditCardIcon className="w-4 h-4" /> {t('nav.cards')}
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

                    <LanguageToggle />
                    <NotificationBell />
                    <ProfileMenu t={t} />
                </div>
            </div>
        </nav>
    );
}

function MobileBottomNav() {
    const { t } = useI18n();
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: HomeIcon, label: t('nav.home') },
        { href: '/dashboard/services', icon: WrenchIcon, label: t('nav.services') },
        { href: '/dashboard/investments', icon: TrendingUpIcon, label: t('nav.investments') },
        { href: '/dashboard/loans', icon: BanknoteIcon, label: 'Préstamos' },
        { href: '/dashboard/cards', icon: CreditCardIcon, label: t('nav.cards') },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all ${isActive
                                ? 'text-sg-blue bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
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
