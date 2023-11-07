import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'

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
    css: {
      postcss: {
        plugins: [autoprefixer({})]
      }
    }
  }
})
