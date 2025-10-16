import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  // Point to your Colab ngrok backend
  // UPDATE THIS URL whenever ngrok restarts with a new URL
  const target = 'https://260141486b10.ngrok-free.app'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          // Forwards '/api/ask' to 'https://NGROK_URL/ask'
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

