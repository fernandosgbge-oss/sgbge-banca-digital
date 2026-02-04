'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { subscribeToNotifications, markAsRead, markAllAsRead } from '@/lib/notifications/service';
import { Notification } from '@/types/notification';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleMarkAllRead = async () => {
        if (!user) return;
        await markAllAsRead(user.uid);
    };

    const handleRead = async (id: string, isRead: boolean) => {
        if (!isRead) await markAsRead(id);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sg-blue"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h1>
                    <p className="text-gray-500 text-sm">Gestiona tus alertas y mensajes</p>
                </div>
                {notifications.some(n => !n.readAt) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm font-medium text-sg-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        Marcar todo como leído
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                        <span className="text-6xl mb-4">📭</span>
                        <p className="text-lg">No tienes notificaciones</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {notifications.map((notif) => (
                            <li
                                key={notif.id}
                                onClick={() => handleRead(notif.id, !!notif.readAt)}
                                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${!notif.readAt ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${!notif.readAt ? 'bg-sg-blue' : 'bg-transparent'}`}></div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-base ${!notif.readAt ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                            {format(notif.createdAt, "d MMM yyyy, HH:mm", { locale: es })}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {notif.body}
                                    </p>

                                    {notif.metadata?.amount && (
                                        <div className="bg-gray-100 inline-block px-3 py-1 rounded text-xs font-mono font-medium mt-2 text-gray-600">
                                            Importe: {Number(notif.metadata.amount).toLocaleString()} FCFA
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
