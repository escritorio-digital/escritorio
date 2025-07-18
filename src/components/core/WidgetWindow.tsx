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
      className="bg-widget-bg rounded-lg shadow-2xl border-2 border-widget-header flex flex-col overflow-hidden"
      dragHandleClassName="widget-header"
    >
      <div className="widget-header h-10 bg-widget-header flex items-center justify-between px-3 cursor-move text-text-light font-bold">
        <span>{title}</span>
        <button onClick={onClose} className="hover:bg-black/20 rounded-full p-1">
          <X size={18} />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        {children}
      </div>
    </Rnd>
  );
};