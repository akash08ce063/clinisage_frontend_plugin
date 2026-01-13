import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.tsx'),
      name: 'ClinisageWidget',
      fileName: (format) => `widget.${format}.js`,
      formats: ['umd']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // actualy for a standalone widget we want to bundle everything except maybe react if we expect it on window, 
      // but usually a widget bundles React to be safe or uses a specific preact/compat. 
      // For now we will bundle everything to ensure it works in any page.
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          // react: 'React',
          // 'react-dom': 'ReactDOM'
        },
        // Force the name of the file to be simple
        entryFileNames: 'widget.js'
      }
    },
    // Ensure CSS is emitted as a single file or injected (Vite default for lib is to emit style.css)
    cssCodeSplit: false
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
