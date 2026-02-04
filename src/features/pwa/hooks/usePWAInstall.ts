import { useState, useEffect } from 'react';

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        const checkIfInstalled = () => {
            // Check if running in standalone mode (PWA installed)
            if (window.matchMedia('(display-mode: standalone)').matches) {
                return true;
            }
            // Check if running as standalone on iOS
            if ((window.navigator as any).standalone === true) {
                return true;
            }
            // Check if the app was added to home screen
            if (document.referrer.includes('android-app://')) {
                return true;
            }
            return false;
        };

        if (checkIfInstalled()) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    return { deferredPrompt, isInstalled, promptInstall };
}
