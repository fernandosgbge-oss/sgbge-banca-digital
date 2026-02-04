import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SGBGE Móvil',
        short_name: 'SGBGE',
        description: 'Sistema de Gestión Bancaria y Ecosistema Digital',
        start_url: '/',
        display: 'standalone',
        background_color: '#FCFBFB', // sg-white
        theme_color: '#10218B', // sg-blue
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
