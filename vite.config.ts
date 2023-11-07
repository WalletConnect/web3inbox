import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      target: 'es2020'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    },
 plugins: [
    react(),
    nodePolyfills({
      protocolImports: true
    }),
  ],
    css: {
      postcss: {
        plugins: [autoprefixer({})]
      }
    }
  }
})
