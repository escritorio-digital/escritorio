// src/components/widgets/Iframe/IframeWidget.tsx

import { useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { WidgetConfig } from '../../../types';
import { Link } from 'lucide-react';
import './IframeWidget.css';

export const IframeWidget: FC = () => {
  const { t } = useTranslation();
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
          placeholder={t('widgets.iframe.url_placeholder')}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyUrl()}
          className="url-input"
        />
        <button onClick={handleApplyUrl} className="apply-button">
          {t('widgets.iframe.load')}
        </button>
      </div>
      <div className="iframe-container">
        {url ? (
          <iframe
            src={url}
            title={t('widgets.iframe.embedded_content')}
            className="embedded-iframe"
            sandbox="allow-scripts allow-forms allow-popups"
          />
        ) : (
          <div className="placeholder">
            <p>{t('widgets.iframe.content_placeholder')}</p>
            <small>{t('widgets.iframe.embed_notice')}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'iframe',
  title: 'widgets.iframe.title',
  icon: <img src="/icons/Iframe.png" alt="Web Viewer" width="52" height="52" />,
  defaultSize: { width: 600, height: 500 },
};