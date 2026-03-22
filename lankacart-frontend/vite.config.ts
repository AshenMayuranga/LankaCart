import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/users': { target: 'http://localhost:8086', changeOrigin: true },
      '/products': { target: 'http://localhost:8086', changeOrigin: true },
      '/orders': { target: 'http://localhost:8086', changeOrigin: true },
      '/inventory': { target: 'http://localhost:8086', changeOrigin: true },
    },
  },
})
