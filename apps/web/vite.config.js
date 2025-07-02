import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

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
        cors: {
            origin: [/^http:\/\/local\..*?govdo.com:?\d*/],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            ziggy: path.resolve(__dirname, 'vendor/tightenco/ziggy/dist'), // based on the tip here https://github.com/tighten/ziggy/issues/427#issuecomment-898823699
        },
    },
});
