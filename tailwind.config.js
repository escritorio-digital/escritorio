/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hacemos que los colores de Tailwind apunten a nuestras variables CSS
        'custom-bg': 'var(--color-bg)',
        'widget-bg': 'var(--color-widget-bg)',
        'widget-header': 'var(--color-widget-header)',
        'accent': 'var(--color-accent)',
        'text-light': 'var(--color-text-light)',
        'text-dark': 'var(--color-text-dark)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}