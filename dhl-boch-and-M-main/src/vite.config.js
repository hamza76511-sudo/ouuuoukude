import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode } ) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          // Fallback to localhost if VITE_API_URL is not defined
          target: env.VITE_API_URL || 'http://localhost:5000', 
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
} )
