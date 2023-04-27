import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
      host: '0.0.0.0',
      proxy: {
          '/dag': {
              target: "http://114.212.81.11:5000",
              changeOrigin: true,
              rewrite: path => path.replace(/^\/dag/, '')
          },
          '/serv': {
              target: "http://114.212.81.11:5500",
              changeOrigin: true,
              rewrite: path => path.replace(/^\/serv/, '')
          }
      }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
