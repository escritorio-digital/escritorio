/// <reference types="vite/client" />

// Añade esta declaración para los módulos CSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}