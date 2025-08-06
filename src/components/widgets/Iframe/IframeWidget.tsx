// src/components/widgets/Iframe/IframeWidget.tsx

import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { Link } from 'lucide-react';
import './IframeWidget.css';

export const IframeWidget: FC = () => {
  const [url, setUrl] = useState('https://vibe-coding-educativo.github.io/app_edu/');
  const [inputValue, setInputValue] = useState('https://vibe-coding-educativo.github.io/app_edu/');

  const handleApplyUrl = () => {
    if (inputValue.trim()) {
      setUrl(inputValue.trim());
    }
  };

  return (
    <div className="iframe-widget">
      <div className="controls-container">
        <Link size={20} className="url-icon" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pega una URL aquí..."
          onKeyPress={(e) => e.key === 'Enter' && handleApplyUrl()}
          className="url-input"
        />
        <button onClick={handleApplyUrl} className="apply-button">
          Cargar
        </button>
      </div>
      <div className="iframe-container">
        {url ? (
          <iframe
            src={url}
            title="Contenido Embebido"
            className="embedded-iframe"
            // --- LÍNEA MODIFICADA: Se ha eliminado el atributo 'sandbox' ---
          />
        ) : (
          <div className="placeholder">
            <p>El contenido de la URL se mostrará aquí.</p>
            <small>Algunos sitios pueden no permitir ser embebidos.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'iframe-embed',
  title: 'Visor Web',
  icon: <img src="/escritorio/icons/Iframe.png" alt="Visor Web" width="52" height="52" />,
  defaultSize: { width: 600, height: 500 },
};