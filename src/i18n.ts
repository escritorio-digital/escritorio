// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Carga las traducciones desde una API/backend (en este caso, la carpeta `public/locales`)
  .use(Backend)
  // Detecta el idioma del usuario
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Configuración inicial
  .init({
    // Idioma por defecto si no se detecta ninguno
    fallbackLng: 'es',
    // Activa el modo debug en desarrollo
    debug: true,
    // Forzar recarga
    initImmediate: false,
    // Define el namespace por defecto
    ns: 'translation',
    defaultNS: 'translation',
    // Configuración para el backend de carga
    backend: {
      // Ruta donde se encuentran los archivos de traducción  
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Añadir opciones para debug
      requestOptions: {
        cache: 'no-cache'
      }
    },
    // Configuración para el detector de idioma
    detection: {
      // Orden de detección: querystring, cookie, localStorage, navigator, htmlTag
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      // Caché a usar
      caches: ['localStorage', 'cookie'],
    },
    // Configuración de react-i18next
    react: {
      // Usa Suspense para cargar las traducciones de forma asíncrona
      useSuspense: false,
    },
  });

export default i18n;

// Promesa para asegurar que i18n esté listo antes de renderizar React
export const i18nReady: Promise<void> = new Promise((resolve) => {
  const ensureNsLoaded = () => {
    // Garantiza que el namespace por defecto esté cargado
    i18n.loadNamespaces(['translation']).then(() => resolve());
  };

  if (i18n.isInitialized) {
    ensureNsLoaded();
  } else {
    i18n.on('initialized', ensureNsLoaded);
  }
});
