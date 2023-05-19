import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/dag': {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dag/, '')
      },
      '/serv': {
        target: "http://127.0.0.1:5500",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/serv/, '')
      },
      '/video': {
        target: "http://127.0.0.1:5100",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/video/, '')
      }

    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
