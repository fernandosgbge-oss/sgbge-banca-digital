'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { subscribeToNotifications, markAsRead } from '@/lib/notifications/service';
import { Notification } from '@/types/notification';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.readAt).length);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.readAt) {
            await markAsRead(notif.id);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                aria-label="Notifications"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />
                    <div className="fixed top-20 right-4 left-4 md:absolute md:top-full md:right-0 md:left-auto md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Notificaciones</h3>
                            <Link
                                href="/dashboard/notifications"
                                className="text-xs text-sg-blue hover:underline"
                                onClick={() => setIsOpen(false)}
                            >
                                Ver todas
                            </Link>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p className="text-4xl mb-2">🔕</p>
                                    <p className="text-sm">No tienes notificaciones nuevas</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {notifications.slice(0, 5).map((notification) => (
                                        <li
                                            key={notification.id}
                                            className={`hover:bg-gray-50 transition-colors ${!notification.readAt ? 'bg-blue-50/50' : ''}`}
                                        >
                                            <div
                                                onClick={() => handleNotificationClick(notification)}
                                                className="block p-4 cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${(notification.type === 'balance_alert' || notification.type === 'security') ? 'bg-red-100 text-red-600' :
                                                        notification.type === 'manager_message' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {(notification.type === 'balance_alert' || notification.type === 'security') ? 'Alerta' :
                                                            notification.type === 'manager_message' ? 'Mensaje' : 'Info'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: es })}
                                                    </span>
                                                </div>
                                                <h4 className={`text-sm ${!notification.readAt ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
