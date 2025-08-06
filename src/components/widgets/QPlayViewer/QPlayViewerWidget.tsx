import React from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { Info } from 'lucide-react';

// --- Estilos CSS como objetos de JavaScript ---

const widgetStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f2f5',
};

const iframeStyles: React.CSSProperties = {
    flexGrow: 1,
    border: 'none',
};

// --- ESTILOS ACTUALIZADOS ---
// Se han cambiado 'top' y 'right' por 'bottom' y 'left'.
const infoButtonStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '8px', // <-- Cambio aquí
    left: '8px',   // <-- Cambio aquí
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: 'white',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
};

// --- Componente principal del Widget ---
export const QPlayViewerWidget: FC = () => {
    const qplayUrl = "https://jjdeharo.github.io/qplay/";
    const repoUrl = "https://github.com/jjdeharo/qplay";

    return (
        <div style={widgetStyles}>
            <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={infoButtonStyles}
                title="Ir al repositorio original de QPlay"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)')}
            >
                <Info size={16} />
            </a>

            <iframe
                src={qplayUrl}
                title="QPlay"
                style={iframeStyles}
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
        </div>
    );
};

// --- Configuración del Widget ---
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'qplay-viewer',
  title: 'QPlay',
  icon: '👑',
  defaultSize: { width: 800, height: 600 },
};