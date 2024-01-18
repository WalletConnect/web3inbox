import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      lib: {
	entry: 'src/firebase-messaging-sw.ts',
	name: 'firebase-messaging-sw.js',
	fileName: () => `firebase-messaging-sw.js`
      },
      rollupOptions: {
	output: {
	  format: 'iife',
	},
	inlineDynamicImports: true
      },
      emptyOutDir: false,
      assetsDir: '.'
    },
  }
})
