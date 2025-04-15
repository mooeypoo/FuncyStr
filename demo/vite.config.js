import { defineConfig } from 'vite';

export default defineConfig({
    // base: '/FuncyStr/',
    base: './', // Try using relative paths for Github Pages
    root: 'public',
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
}); 