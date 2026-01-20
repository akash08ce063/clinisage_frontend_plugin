import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'


// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/widget.tsx'),
            name: 'ClinisageWidget',
            fileName: (format) => `widget.${format}.js`,
            formats: ['umd']
        },
        rollupOptions: {
            output: {
                globals: {
                    // Provide global variables if needed
                },
                entryFileNames: 'widget.js'
            }
        },
        cssCodeSplit: false,
        emptyOutDir: false // Important: Don't clear dist so we don't wipe the app build
    },
    define: {
        'process.env.NODE_ENV': '"production"'
    }
})
