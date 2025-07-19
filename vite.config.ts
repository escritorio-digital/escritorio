import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'; // <-- 1. Importar desde la ubicación correcta

// https://vite.dev/config/
export default defineConfig({
  base: '/escritorio-interactivo-aula/',
  plugins: [
    react(),
    commonjs(), 
  ],
})
