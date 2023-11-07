import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { VitePWA } from 'vite-plugin-pwa'
import type { VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'production',
  base: '/',
  strategies: 'injectManifest',
  injectRegister: 'inline',
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg'],
  injectManifest: {
    injectionPoint: undefined
  },
  srcDir: 'src',
  filename: 'main-sw.ts',
  manifest: {
    name: 'Web3Inbox',
    short_name: 'Web3Inbox',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html'
  }
}

// https://vitejs.dev/config/
export default defineConfig(({mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log({env})
  return (
    {
  build: {
    target: 'es2020'
  },
// using define for vite pwa, as it uses the define build prop
// taken from https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/modules.ts#L94
      // and this https://vitejs.dev/config/shared-options.html#define
  define: {
    '__VITE_PROJECT_ID__': JSON.stringify(env.VITE_PROJECT_ID)
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
    VitePWA({
      ...pwaOptions,
    })
  ],
  css: {
    postcss: {
      plugins: [autoprefixer({})]
    }
  }
    }
  )
})
