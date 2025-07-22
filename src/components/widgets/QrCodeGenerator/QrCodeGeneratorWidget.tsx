import { useState } from 'react';
import type { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { WidgetConfig } from '../../../types';
import { QrCode } from 'lucide-react';
import './QrCodeGenerator.css';

export const QrCodeGeneratorWidget: FC = () => {
  const [text, setText] = useState('https://pablogguizar.github.io/escritorio-interactivo-aula/');
  // Estado separado para evitar regenerar el QR en cada pulsación de tecla
  const [qrValue, setQrValue] = useState('https://pablogguizar.github.io/escritorio-interactivo-aula/');

  const handleGenerate = () => {
    setQrValue(text);
  };

  return (
    <div className="qr-generator-widget">
      <div className="qr-display-area">
        {qrValue ? (
          <QRCodeSVG
            value={qrValue}
            size={256} // Tamaño base, se ajustará con CSS
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={true}
            className="qr-code-svg"
          />
        ) : (
          <div className="qr-placeholder">
            <QrCode size={64} />
            <p>Introduce texto para generar un código QR.</p>
          </div>
        )}
      </div>
      <div className="qr-controls-area">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe el texto o URL aquí..."
          className="qr-input"
        />
        <button onClick={handleGenerate} className="generate-button">
          Generar QR
        </button>
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'qr-code-generator',
  title: 'Generador QR',
  icon: '🔲',
  defaultSize: { width: 350, height: 500 },
};