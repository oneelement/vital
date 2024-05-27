import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/vital': {
        target: 'https://api.sandbox.eu.tryvital.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vital/, '')
      }
    }
  }
})
