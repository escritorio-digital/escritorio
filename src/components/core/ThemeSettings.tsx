import React, { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme, setWallpaper, resetTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme({ ...theme, [name]: value });
  };
  
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convertimos la imagen a una URL de datos (Base64) para guardarla en LocalStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setWallpaper(`url(${result})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const colorOptions = [
    { id: '--color-bg', label: 'Fondo del Escritorio' },
    { id: '--color-widget-bg', label: 'Fondo del Widget' },
    { id: '--color-widget-header', label: 'Cabecera del Widget' },
    { id: '--color-accent', label: 'Color de Acento' },
    { id: '--color-text-light', label: 'Texto Claro' },
    { id: '--color-text-dark', label: 'Texto Oscuro' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Colores del Tema</h3>
        <div className="grid grid-cols-2 gap-4">
          {colorOptions.map(({ id, label }) => (
            <div key={id} className="flex items-center justify-between">
              <label htmlFor={id} className="text-sm">{label}</label>
              <input
                type="color"
                id={id}
                name={id}
                value={theme[id as keyof typeof theme]}
                onChange={handleColorChange}
                className="w-10 h-10 rounded-full border-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Fondo de Pantalla</h3>
        <div className="flex gap-2">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 font-semibold py-2 px-4 rounded-lg bg-accent text-text-dark hover:bg-[#8ec9c9] transition-colors"
            >
                Cargar Imagen
            </button>
            <button
                onClick={() => setWallpaper('none')}
                className="flex-1 font-semibold py-2 px-4 rounded-lg bg-gray-300 text-text-dark hover:bg-gray-400 transition-colors"
            >
                Quitar Fondo
            </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleWallpaperUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <button
        onClick={resetTheme}
        className="w-full font-bold py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors mt-4"
        >
        Restablecer Tema por Defecto
        </button>
    </div>
  );
};