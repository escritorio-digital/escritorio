import React from 'react';
import { Rnd } from 'react-rnd';
import { X } from 'lucide-react';

interface WidgetWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
  onDragStop: (e: any, d: { x: number; y: number }) => void;
  onResizeStop: (e: any, direction: any, ref: HTMLElement, delta: any, position: { x: number; y: number }) => void;
  onClose: () => void;
  onFocus: () => void;
}

export const WidgetWindow: React.FC<WidgetWindowProps> = ({ title, children, position, size, zIndex, onDragStop, onResizeStop, onClose, onFocus }) => {
  return (
      <Rnd
        size={size}
        position={position}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        minWidth={200}
        minHeight={150}
        style={{ zIndex }}
        onMouseDown={onFocus}
        // 1. Añadimos 'relative' para que los elementos internos puedan posicionarse absolutamente respecto a Rnd.
        // 2. Eliminamos 'flex', 'flex-col' y 'overflow-hidden' de aquí, ya que los manejaremos internamente.
        className="bg-widget-bg rounded-lg shadow-2xl border-2 border-widget-header relative"
        dragHandleClassName="widget-header"
      >
        {/* 2. Cabecera: Posicionada absolutamente en la parte superior. */}
        <div className="widget-header h-10 bg-widget-header flex items-center justify-between px-3 cursor-move text-text-light font-bold absolute top-0 left-0 right-0">
          <span>{title}</span>
          <button onClick={onClose} className="hover:bg-black/20 rounded-full p-1">
            <X size={18} />
          </button>
        </div>

        {/* 3. Contenido: Posicionado absolutamente debajo de la cabecera, rellenando el espacio restante. */}
        {/* Añadimos 'overflow-auto' aquí para que el contenido de cada widget pueda desplazarse si es necesario. */}
        <div className="absolute top-10 left-0 right-0 bottom-0 min-h-0 overflow-auto">
          {children}
        </div>
      </Rnd>
    );
};