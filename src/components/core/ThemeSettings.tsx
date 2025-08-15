import React, { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme, setWallpaper, resetTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme({ ...theme, [name]: value });
  };
  
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setWallpaper(`url(${result})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const colorOptions = [
    { id: '--color-bg', labelKey: 'desktop_bg' },
    { id: '--color-widget-bg', labelKey: 'widget_bg' },
    { id: '--color-widget-header', labelKey: 'widget_header' },
    { id: '--color-accent', labelKey: 'accent' },
    { id: '--color-text-light', labelKey: 'text_light' },
    { id: '--color-text-dark', labelKey: 'text_dark' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('settings.theme.theme_colors_title')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {colorOptions.map(({ id, labelKey }) => (
            <div key={id} className="flex items-center justify-between">
              <label htmlFor={id} className="text-sm">{t(`settings.theme.colors.${labelKey}`)}</label>
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
        <h3 className="text-lg font-semibold mb-2">{t('settings.theme.wallpaper_title')}</h3>
        <div className="flex gap-2">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 font-semibold py-2 px-4 rounded-lg bg-accent text-text-dark hover:bg-[#8ec9c9] transition-colors"
            >
                {t('settings.theme.upload_image_button')}
            </button>
            <button
                onClick={() => setWallpaper('none')}
                className="flex-1 font-semibold py-2 px-4 rounded-lg bg-gray-300 text-text-dark hover:bg-gray-400 transition-colors"
            >
                {t('settings.theme.remove_wallpaper_button')}
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
        {t('settings.theme.reset_theme_button')}
        </button>
    </div>
  );
};