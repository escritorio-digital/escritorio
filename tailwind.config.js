/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que busque clases en todos tus archivos de React.
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#F4F8D3',
        'widget-bg': '#F7CFD8',
        'widget-header': '#8E7DBE',
        'accent': '#A6D6D6',
        'text-light': '#F4F8D3',
        'text-dark': '#493e6a',
      }
    },
  },
  plugins: [],
}
