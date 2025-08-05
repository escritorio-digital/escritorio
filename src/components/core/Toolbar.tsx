import React from 'react';
import { WIDGET_REGISTRY } from '../widgets';

interface ToolbarProps {
  pinnedWidgets: string[];
  onWidgetClick: (widgetId: string) => void;
  onSettingsClick: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ pinnedWidgets, onWidgetClick, onSettingsClick }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-md p-2 rounded-2xl flex items-center gap-2 shadow-lg z-[10000]">
      {pinnedWidgets.map(widgetId => {
        const widget = WIDGET_REGISTRY[widgetId];
        if (!widget) return null;
        return (
          <button
            key={widget.id}
            onClick={() => onWidgetClick(widget.id)}
            className="w-14 h-14 bg-widget-header text-2xl rounded-lg flex items-center justify-center hover:bg-[#7b69b1] transition-all duration-200 hover:scale-110"
            title={widget.title}
          >
            {widget.icon}
          </button>
        );
      })}
      <div className="h-10 w-px bg-white/30 mx-2"></div>
      <button
        onClick={onSettingsClick}
        className="w-14 h-14 bg-gray-500/50 text-white text-2xl rounded-lg flex items-center justify-center hover:bg-gray-500/80 transition-all duration-200 hover:scale-110"
        title="Configurar Widgets"
      >
        <img src="/escritorio/icons/Settings.png" alt="Ajsutes" width="52" height="52" />
      </button>
    </div>
  );
};