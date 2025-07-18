import React from 'react';
import { X } from 'lucide-react';
import { WIDGET_REGISTRY } from '../widgets';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedWidgets: string[];
  setPinnedWidgets: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, pinnedWidgets, setPinnedWidgets }) => {
  if (!isOpen) return null;

  const MAX_WIDGETS = 20;

  const togglePin = (widgetId: string) => {
    setPinnedWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId);
      } else if (prev.length < MAX_WIDGETS) {
        return [...prev, widgetId];
      }
      alert(`No se pueden fijar más de ${MAX_WIDGETS} widgets.`);
      return prev;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white/90 backdrop-blur-xl text-text-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Librería de Widgets</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10"><X size={20}/></button>
        </header>
        <div className="p-4 overflow-y-auto">
          <p className="mb-4 text-sm text-gray-600">Selecciona los widgets que quieres en tu barra de herramientas. ({pinnedWidgets.length}/{MAX_WIDGETS})</p>
          <ul className="space-y-2">
            {Object.values(WIDGET_REGISTRY).map(widget => (
              <li key={widget.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{widget.icon}</span>
                  <span className="font-semibold">{widget.title}</span>
                </div>
                <button
                  onClick={() => togglePin(widget.id)}
                  className={`font-semibold py-2 px-4 rounded-lg transition-colors ${pinnedWidgets.includes(widget.id) ? 'bg-widget-header text-text-light hover:bg-[#7b69b1]' : 'bg-accent text-text-dark hover:bg-[#8ec9c9]'}`}
                >
                  {pinnedWidgets.includes(widget.id) ? 'Quitar' : 'Añadir'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};