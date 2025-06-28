import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

function extractHostOrGetDefault() {
    const rawAppUrl = process.env.APP_URL || 'local.govdo.com';
    const appUrlWithProtocol = rawAppUrl.includes('://')
        ? rawAppUrl
        : `http://${rawAppUrl}`;
    const host = new URL(appUrlWithProtocol).hostname;
    return host;
}

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        allowedHosts: ['.govdo.com'],
        host: extractHostOrGetDefault(),
    },
});
