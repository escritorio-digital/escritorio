// src/components/core/WidgetWindow.tsx

import React from 'react';
import { Rnd } from 'react-rnd';
// --- LÍNEA MODIFICADA: Importamos los nuevos iconos ---
import { X, Minus, Maximize, Minimize } from 'lucide-react';

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
  // --- PROPS AÑADIDAS ---
  isMinimized?: boolean;
  isMaximized?: boolean;
  onToggleMinimize: () => void;
  onToggleMaximize: () => void;
  // --- FIN DE PROPS AÑADIDAS ---
}

export const WidgetWindow: React.FC<WidgetWindowProps> = ({ 
    title, children, position, size, zIndex, onDragStop, onResizeStop, 
    onClose, onFocus, isMinimized, isMaximized, onToggleMinimize, onToggleMaximize 
}) => {
  
  // --- LÓGICA AÑADIDA ---
  // Determinamos el tamaño final de la ventana. Si está minimizada, la altura es fija.
  const finalSize = isMinimized ? { ...size, height: 40 } : size;
  // --- FIN DE LA LÓGICA AÑADIDA ---
  
  return (
      <Rnd
        // Usamos el tamaño final y deshabilitamos el arrastre y redimensionamiento si está maximizada
        size={finalSize}
        position={position}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        minWidth={200}
        minHeight={isMinimized ? 40 : 150}
        disableDragging={isMaximized}
        enableResizing={!isMaximized && !isMinimized} // No se puede redimensionar si está maximizada o minimizada
        style={{ zIndex }}
        onMouseDown={onFocus}
        className="bg-widget-bg rounded-lg shadow-2xl border-2 border-widget-header relative"
        dragHandleClassName="widget-header-drag-handle" // Cambiamos el handle para no interferir con los botones
      >
        <div className="flex items-center justify-between h-10 bg-widget-header text-text-light font-bold px-3 absolute top-0 left-0 right-0">
          {/* El área de arrastre ahora es solo el título */}
          <span className="widget-header-drag-handle flex-grow h-full cursor-move">{title}</span>
          
          {/* --- BOTONES AÑADIDOS --- */}
          <div className="flex items-center gap-1">
            <button onClick={onToggleMinimize} className="hover:bg-black/20 rounded-full p-1">
              <Minus size={18} />
            </button>
            <button onClick={onToggleMaximize} className="hover:bg-black/20 rounded-full p-1">
              {isMaximized ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
            <button onClick={onClose} className="hover:bg-black/20 rounded-full p-1">
              <X size={18} />
            </button>
          </div>
          {/* --- FIN DE BOTONES AÑADIDOS --- */}
        </div>

        {/* El contenido solo se muestra si la ventana NO está minimizada */}
        {!isMinimized && (
          <div className="absolute top-10 left-0 right-0 bottom-0 min-h-0 overflow-auto">
            {children}
          </div>
        )}
      </Rnd>
    );
};