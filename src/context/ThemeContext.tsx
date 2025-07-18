import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// 1. Definimos la estructura de nuestro tema
interface Theme {
  '--color-bg': string;
  '--color-widget-bg': string;
  '--color-widget-header': string;
  '--color-accent': string;
  '--color-text-light': string;
  '--color-text-dark': string;
  '--wallpaper': string;
}

// 2. Colores por defecto
const defaultTheme: Theme = {
  '--color-bg': '#F4F8D3',
  '--color-widget-bg': '#F7CFD8',
  '--color-widget-header': '#8E7DBE',
  '--color-accent': '#A6D6D6',
  '--color-text-light': '#F4F8D3',
  '--color-text-dark': '#493e6a',
  '--wallpaper': 'none',
};

// 3. Definimos lo que nuestro contexto va a proveer
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setWallpaper: (wallpaperUrl: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. Creamos el Proveedor del Tema (El componente que envuelve la app)
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', defaultTheme);

  // Este efecto aplica los colores como variables CSS en el documento
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
      if (key !== '--wallpaper') {
        root.style.setProperty(key, value);
      }
    }
  }, [theme]);
  
  const setWallpaper = (wallpaperUrl: string) => {
    setTheme(prevTheme => ({ ...prevTheme, '--wallpaper': wallpaperUrl }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setWallpaper, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Hook personalizado para usar el tema fácilmente en otros componentes
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};