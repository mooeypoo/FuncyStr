import { defineConfig } from 'vite';

export default defineConfig({
    base: '/funcystr/',
    root: 'public',
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
}); 