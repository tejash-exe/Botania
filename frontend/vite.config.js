import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': "http://localhost:3000",
    },
    host: true, // Listen on all network interfaces
    port: 5173, // Optional: ensure the correct port is specified
  },
  plugins: [react()],
})
