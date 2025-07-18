import type { FC } from 'react';
import type { WidgetConfig } from '../../types';

// 1. Importamos todos los módulos de widget de forma síncrona.
//    { eager: true } es la clave para que el código esté disponible inmediatamente.
const modules = import.meta.glob<any>('./*/*Widget.tsx', { eager: true });

// 2. Creamos el registro que vamos a exportar.
const WIDGET_REGISTRY_TEMP: Record<string, WidgetConfig> = {};

// 3. Iteramos sobre los módulos encontrados.
for (const path in modules) {
    const mod = modules[path];
    
    // Un módulo de widget válido debe exportar 'widgetConfig'.
    if (mod && mod.widgetConfig) {
        
        // Buscamos dinámicamente el componente exportado en el módulo.
        // Primero buscamos una exportación nombrada que termine en "Widget".
        const componentKey = Object.keys(mod).find(key => key.endsWith('Widget'));
        // Si no la encontramos, buscamos una exportación por defecto.
        const Component = componentKey ? mod[componentKey] : mod.default;

        if (Component) {
            const config = mod.widgetConfig;
            WIDGET_REGISTRY_TEMP[config.id] = {
                ...config,
                component: Component as FC,
            };
        } else {
            // Advertencia si no se encuentra el componente
            console.warn(`[Widget Registry] El módulo en "${path}" tiene una configuración pero no se encontró un componente exportado válido (ej: 'export const MiWidget' o 'export default MiWidget').`);
        }
    } else {
        // Advertencia si falta la configuración
        console.warn(`[Widget Registry] El módulo en "${path}" no parece ser un widget válido porque le falta la exportación 'widgetConfig'.`);
    }
}

// 4. Exportamos el registro final y completo.
export const WIDGET_REGISTRY = WIDGET_REGISTRY_TEMP;
