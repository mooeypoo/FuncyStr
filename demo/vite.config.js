import { defineConfig } from 'vite';

export default defineConfig({
    base: '/FuncyStr/',  // Use the repository name as the base path
    root: 'public',
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
});