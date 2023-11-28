import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
	input: 'src/firebase-messaging-sw.ts',
	output: {
	  format: 'es',
	  file: 'dist/firebase-messaging-sw.js'
	}
      },
      emptyOutDir: false,
      
    },
  }
})
