import React, { createContext, useContext } from 'react';

// 1. Definimos la estructura de nuestro tema (esto no cambia)
interface Theme {
  '--color-bg': string;
  '--color-widget-bg': string;
  '--color-widget-header': string;
  '--color-accent': string;
  '--color-text-light': string;
  '--color-text-dark': string;
  '--wallpaper': string;
}

// 2. Colores por defecto (esto no cambia)
export const defaultTheme: Theme = {
  '--color-bg': '#FFFFFF',
  '--color-widget-bg': '#F7CFD8',
  '--color-widget-header': '#8E7DBE',
  '--color-accent': '#A6D6D6',
  '--color-text-light': '#F4F8D3',
  '--color-text-dark': '#493e6a',
  '--wallpaper': 'none',
};

// 3. Definimos lo que nuestro contexto va a proveer (esto no cambia)
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme | ((val: Theme) => Theme)) => void;
  setWallpaper: (wallpaperUrl: string) => void;
  resetTheme: () => void;
  defaultTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. MODIFICAMOS EL PROVEEDOR DEL TEMA
// Ahora es un componente simple que recibe el valor del contexto como prop.
export const ThemeProvider: React.FC<{ children: React.ReactNode; value: ThemeContextType }> = ({ children, value }) => {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Hook personalizado para usar el tema (esto no cambia)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};