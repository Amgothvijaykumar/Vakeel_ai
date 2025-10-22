import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  // For local development with MongoDB backend
  const localBackend = 'http://localhost:5000'
  
  // For Colab ngrok backend (uncomment and update when using Colab)
  const colabTarget = 'https://8adf81265e62.ngrok-free.app'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Auth endpoints (MongoDB backend)
        '/auth': {
          target: localBackend,
          changeOrigin: true,
          secure: false,
        },
        // Chat endpoints (can point to Colab or local)
        '/api': {
          target: colabTarget, // Change to colabTarget for Colab
          changeOrigin: true,
          secure: false,
          // If using Colab, rewrite to remove /api prefix
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

