import React from 'react';
import { WIDGET_REGISTRY } from '../widgets';

interface ToolbarProps {
  pinnedWidgets: string[];
  onWidgetClick: (widgetId: string) => void;
  onSettingsClick: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ pinnedWidgets, onWidgetClick, onSettingsClick }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-widget-bg p-2 rounded-2xl flex items-center gap-2 shadow-lg z-[10000] border border-custom-border">
      {pinnedWidgets.map(widgetId => {
        const widget = WIDGET_REGISTRY[widgetId];
        if (!widget) return null;
        return (
          <button
            key={widget.id}
            onClick={() => onWidgetClick(widget.id)}
            className="w-14 h-14 bg-accent text-2xl rounded-lg flex items-center justify-center hover:brightness-110 transition-all duration-200 hover:scale-110"
            title={widget.title}
          >
            {widget.icon}
          </button>
        );
      })}
      <div className="h-10 w-px bg-white/30 mx-2"></div>
      <button
        onClick={onSettingsClick}
        className="w-14 h-14 text-white text-2xl rounded-lg flex items-center justify-center hover:bg-black/20 transition-all duration-200 hover:scale-110"
        title="Configuración"
      >
        {/* ¡CORREGIDO OTRA VEZ! Apuntando al archivo con mayúscula. */}
        <img src="/icons/Settings.png" alt="Configuración" width="52" height="52" />
      </button>
    </div>
  );
};
