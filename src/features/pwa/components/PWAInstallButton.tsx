'use client';

import { usePWAInstall } from '../hooks/usePWAInstall';
import { useEffect, useState } from 'react';

export function PWAInstallButton({ className }: { className?: string }) {
    const { deferredPrompt, isInstalled, promptInstall } = usePWAInstall();
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSHint, setShowIOSHint] = useState(false);

    useEffect(() => {
        // Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);
    }, []);

    if (isInstalled) return null;

    // Initial simple version: only show if install prompt is available (Android/Desktop) or if it's iOS (manual instructions)
    if (!deferredPrompt && !isIOS) return null;

    // If we want to hide it when there is no prompt on non-iOS, we already returned.
    // Exception: Maybe existing PWA logic might delay the prompt. 
    // For now, assume if deferredPrompt is null and not iOS, we don't show.

    const handleClick = () => {
        if (isIOS) {
            setShowIOSHint(true);
            setTimeout(() => setShowIOSHint(false), 5000); // Hide after 5 sec
        } else {
            promptInstall();
        }
    };

    return (
        <div className={`fixed z-50 ${className || 'bottom-6 left-0 right-0 px-4 flex justify-center'}`}>
            {showIOSHint && (
                <div className="absolute bottom-full mb-4 w-64 p-4 bg-white text-gray-800 text-sm rounded-xl shadow-2xl border border-gray-100 animate-fade-in-up">
                    <p className="font-medium mb-1">Para instalar en iOS:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                        <li>Toca el botón <span className="font-bold">Compartir</span> <span className="text-blue-500">⎋</span></li>
                        <li>Selecciona <span className="font-bold">"Agregar a Inicio"</span> ➕</li>
                    </ol>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100"></div>
                </div>
            )}
            <button
                onClick={handleClick}
                className="group w-full max-w-sm flex items-center justify-between bg-white/95 backdrop-blur-md border border-sg-blue/20 text-sg-blue px-6 py-4 rounded-2xl shadow-2xl hover:shadow-sg-blue/30 hover:scale-[1.02] transition-all duration-300"
            >
                <div className="flex flex-col items-start">
                    <span className="font-bold text-lg">Instalar App</span>
                    <span className="text-xs text-gray-500 font-medium">Acceso rápido y seguro</span>
                </div>
                <div className="bg-sg-blue text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 animate-bounce">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75V15.75m0 0L8.25 12m3.75 3.75L15.75 12" />
                    </svg>
                </div>
            </button>
        </div>
    );
}
