import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/escritorio-interactivo-aula/',
  plugins: [react()],
})