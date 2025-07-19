import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/escritorio-interactivo-aula/',
  plugins: [react()],
  optimizeDeps: {
    include: ['showdown'],
  },
})