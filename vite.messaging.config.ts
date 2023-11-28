import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
	input: 'src/firebase-messaging-sw.ts',
	output: {
	  format: 'iife'

	  ,
	  file: 'firebase-messaging-sw.js',
	  name: 'firebase-messaging-sw.js',
	  inlineDynamicImports: true
	},
	  inlineDynamicImports: true
      },
      emptyOutDir: false,
      assetsDir: '.'
    },
  }
})
