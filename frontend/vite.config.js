import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://6eb0-149-102-252-11.ngrok-free.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
});