import React, { useRef, useEffect, useState } from 'react';
// ¡CORREGIDO! La ruta ahora es correcta según tu estructura de carpetas.
import type { WidgetConfig } from '../../../types/index';
import { Paintbrush, Eraser, Trash2, Pen, Highlighter, SprayCan } from 'lucide-react';

// --- El Componente Principal del Widget de Dibujo ---
export const DrawingPadWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [brushType, setBrushType] = useState<'pencil' | 'marker' | 'spray'>('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = mode === 'draw' ? 'source-over' : 'destination-out';
    }
  }, [mode]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    draw(event);
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const context = contextRef.current;

    context.lineWidth = brushSize;
    context.strokeStyle = color;
    context.fillStyle = color;

    switch (brushType) {
      case 'pencil':
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineTo(offsetX, offsetY);
        context.stroke();
        break;
      case 'marker':
        context.lineCap = 'square';
        context.lineJoin = 'miter';
        context.lineTo(offsetX, offsetY);
        context.stroke();
        break;
      case 'spray':
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.random() * brushSize;
          const x = offsetX + radius * Math.cos(angle);
          const y = offsetY + radius * Math.sin(angle);
          context.fillRect(x, y, 1, 1);
        }
        break;
      default:
        break;
    }
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <div className="p-2 bg-gray-200 flex items-center gap-2 border-b flex-wrap">
        <div className="flex items-center gap-2 border-r pr-2">
          <button onClick={() => setMode('draw')} className={`p-2 rounded-md ${mode === 'draw' ? 'bg-accent' : 'hover:bg-gray-300'}`} title="Pincel"><Paintbrush size={20} /></button>
          <button onClick={() => setMode('erase')} className={`p-2 rounded-md ${mode === 'erase' ? 'bg-accent' : 'hover:bg-gray-300'}`} title="Goma de Borrar"><Eraser size={20} /></button>
        </div>

        {mode === 'draw' && (
          <div className="flex items-center gap-2 border-r pr-2">
            <button onClick={() => setBrushType('pencil')} className={`p-2 rounded-md ${brushType === 'pencil' ? 'bg-accent' : 'hover:bg-gray-300'}`} title="Lápiz"><Pen size={20} /></button>
            <button onClick={() => setBrushType('marker')} className={`p-2 rounded-md ${brushType === 'marker' ? 'bg-accent' : 'hover:bg-gray-300'}`} title="Rotulador"><Highlighter size={20} /></button>
            <button onClick={() => setBrushType('spray')} className={`p-2 rounded-md ${brushType === 'spray' ? 'bg-accent' : 'hover:bg-gray-300'}`} title="Spray"><SprayCan size={20} /></button>
          </div>
        )}

        <div className="flex items-center gap-4">
          {mode === 'draw' && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 cursor-pointer"/>}
          <div className="flex items-center gap-2">
            <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24"/>
            <span className="text-sm w-6 text-center">{brushSize}</span>
          </div>
        </div>

        <button onClick={clearCanvas} className="ml-auto p-2 rounded-md hover:bg-gray-300" title="Limpiar todo"><Trash2 size={20} /></button>
      </div>

      <div className="flex-grow w-full h-full">
        <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onMouseMove={draw} className="w-full h-full bg-white"/>
      </div>
    </div>
  );
};

export const widgetConfig: WidgetConfig = {
  id: 'drawing-pad',
  title: 'Paleta de Dibujo',
  icon: <img src="/icons/paleta.png" alt="Paleta de Dibujo" className="w-8 h-8" />,
  component: DrawingPadWidget,
  defaultSize: { width: 600, height: 450 },
};
