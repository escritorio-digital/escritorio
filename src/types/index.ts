import type { FC, ReactNode } from 'react';

/**
 * Define la estructura de la configuración estática de un widget.
 * Cada widget debe exportar un objeto con esta forma.
 */
export interface WidgetConfig {
  id: string;
  title: string;
  icon: string | ReactNode;
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

/**
 * Define la estructura para un único perfil de escritorio guardado.
 * Contiene todos los ajustes que queremos persistir.
 */
export interface DesktopProfile {
  theme: any; // Usamos 'any' por simplicidad, se refiere a la estructura Theme de ThemeContext
  activeWidgets: ActiveWidget[];
  pinnedWidgets: string[];
}

/**
 * Define la colección de todos los perfiles guardados,
 * usando el nombre del perfil como clave.
 */
export type ProfileCollection = Record<string, DesktopProfile>;