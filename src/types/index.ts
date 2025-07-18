import type { FC } from 'react';

/**
 * Define la estructura de la configuración estática de un widget.
 * Cada widget debe exportar un objeto con esta forma.
 */
export interface WidgetConfig {
  id: string;
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
  component: FC; // El componente de React como una función
}

/**
 * Define la estructura de un widget que está actualmente activo en el escritorio.
 */
export interface ActiveWidget {
  instanceId: string;
  widgetId: string;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
}
