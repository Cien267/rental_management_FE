import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      external: [/^demo\//],
      input: {
        onboarding: fileURLToPath(new URL('./src/onboarding.ts', import.meta.url)),
        multiorder: fileURLToPath(new URL('./src/ahamoveMultiDropOff.ts', import.meta.url)),
        multiorderdelivery: fileURLToPath(new URL('./src/multiOrderDelivery.ts', import.meta.url)),
        paymentconfirmation: fileURLToPath(
          new URL('./src/paymentConfirmation.ts', import.meta.url),
        ),
        order: fileURLToPath(new URL('./src/order.ts', import.meta.url)),
      },
      output: {
        entryFileNames: 'widget_kship_v5_[name].min.js',
        chunkFileNames: 'widget_kship_v5_vendors-[hash].min.js',
        assetFileNames: (chunkInfo: any) => {
          if (chunkInfo.name.endsWith('.css')) {
            return 'widget_kship_v5_[name].min.css'
          }
          return 'assets/[name][extname]'
        },
      },
    },
    outDir: '../dist/kship-v5.1',
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    minify: 'esbuild',
  },
})
