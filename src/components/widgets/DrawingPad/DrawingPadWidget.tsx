import React, { useRef, useEffect, useState, useCallback } from 'react';
// Importamos todos los iconos necesarios, incluyendo Type para la herramienta de texto
import { Paintbrush, Eraser, Trash2, Pen, Highlighter, SprayCan, Image as ImageIcon, Save as SaveIcon, LineChart, Square, Circle, ArrowRight, Type } from 'lucide-react';
// Asumiendo que WidgetConfig existe en tu proyecto. Si no, puedes quitar esta línea o definirla.

// --- El Componente Principal del Widget de Dibujo ---
export const DrawingPadWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5); // Ahora también afecta el tamaño de la fuente
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  // `drawingTool` ahora gestiona los tipos de pincel, formas, flechas y la nueva herramienta de texto
  const [drawingTool, setDrawingTool] = useState<'pencil' | 'marker' | 'spray' | 'line' | 'rectangle' | 'circle' | 'arrow' | 'text'>('pencil');
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null); // Para la imagen de fondo
  // Para las formas y flechas: almacenar el punto de inicio y una instantánea del canvas
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // Estado para la entrada de texto interactiva
  const [isTexting, setIsTexting] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);
  const textInputRef = useRef<HTMLInputElement>(null);


  // Función para redibujar el contenido del canvas (imagen de fondo y, eventualmente, trazos guardados)
  const drawCanvasContent = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Limpia el canvas completamente
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja la imagen de fondo si existe, escalándola para que encaje
    if (backgroundImage) {
      const hRatio = canvas.width / backgroundImage.width;
      const vRatio = canvas.height / backgroundImage.height;
      const ratio = Math.min(hRatio, vRatio);

      const centerShift_x = (canvas.width - backgroundImage.width * ratio) / 2;
      const centerShift_y = (canvas.height - backgroundImage.height * ratio) / 2;

      context.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height,
                        centerShift_x, centerShift_y, backgroundImage.width * ratio, backgroundImage.height * ratio);
    }
    // En una implementación con deshacer/rehacer, aquí se redibujarían los trazos permanentes
  }, [backgroundImage]);

  // Efecto para inicializar el canvas y manejar el redimensionamiento de la ventana
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawCanvasContent(); // Redibujar el contenido al cambiar el tamaño
    };

    const context = canvas.getContext('2d');
    if (!context) return;
    contextRef.current = context;

    resizeCanvas(); // Ajusta el tamaño inicial
    window.addEventListener('resize', resizeCanvas); // Escucha eventos de redimensionamiento

    return () => {
      window.removeEventListener('resize', resizeCanvas); // Limpia el listener
    };
  }, [drawCanvasContent]); // Dependencia para que se re-ejecute si drawCanvasContent cambia

  // Efecto para cambiar el modo de composición global del canvas (dibujar vs. borrar)
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = mode === 'draw' ? 'source-over' : 'destination-out';
    }
  }, [mode]);

  // Manejador para iniciar el dibujo o la creación de forma/texto
  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Si estamos en modo texto y ya hay un input activo, no hacemos nada
    if (drawingTool === 'text' && isTexting) return;

    // Se asegura que tanto el contexto como el canvas existan antes de continuar
    if (!contextRef.current || !canvasRef.current) return;
    const { offsetX, offsetY } = event.nativeEvent;

    if (drawingTool === 'text') {
      // Si la herramienta es texto, preparamos la entrada de texto
      setIsTexting(true);
      setTextX(offsetX);
      setTextY(offsetY);
      setTextInput(''); // Limpiar el input anterior
      // Guarda una instantánea del canvas antes de añadir texto
      setSnapshot(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
      // Enfocar el input después de que se renderice
      setTimeout(() => textInputRef.current?.focus(), 0);
    } else if (['line', 'rectangle', 'circle', 'arrow'].includes(drawingTool)) {
      // Para formas y flechas, guarda el punto de inicio y una instantánea del canvas
      setStartX(offsetX);
      setStartY(offsetY);
      setSnapshot(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    } else {
      // Para pinceles, inicia una nueva ruta de dibujo
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
    }
    setIsDrawing(true); // isDrawing se usa para arrastrar, pero aquí también para indicar que una acción está en curso
  };

  // Función auxiliar para dibujar una cabeza de flecha
  const drawArrowhead = (context: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number) => {
    context.save();
    context.beginPath();
    context.translate(x, y);
    context.rotate(angle);
    context.moveTo(0, 0);
    context.lineTo(-size, -size / 2);
    context.lineTo(-size, size / 2);
    context.closePath();
    context.fill(); // Rellena la cabeza de flecha
    context.restore();
  };

  // Manejador para dibujar mientras se arrastra el ratón (incluye previsualización de formas y flechas)
  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const context = contextRef.current;

    context.lineWidth = brushSize;
    context.strokeStyle = color;
    context.fillStyle = color; // Relevante para el spray y cabeza de flecha

    // Si es una forma o flecha, restaura el canvas al estado del snapshot y dibuja la previsualización
    if (snapshot && ['line', 'rectangle', 'circle', 'arrow'].includes(drawingTool)) {
      context.putImageData(snapshot, 0, 0); // Restaura el canvas para borrar la previsualización anterior
      const width = offsetX - startX;
      const height = offsetY - startY;

      switch (drawingTool) {
        case 'line':
          context.beginPath();
          context.moveTo(startX, startY);
          context.lineTo(offsetX, offsetY);
          context.stroke();
          break;
        case 'rectangle':
          context.strokeRect(startX, startY, width, height);
          break;
        case 'circle':
          const centerX = (startX + offsetX) / 2;
          const centerY = (startY + offsetY) / 2;
          const radiusX = Math.abs(width / 2);
          const radiusY = Math.abs(height / 2);
          context.beginPath();
          context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          context.stroke();
          break;
        case 'arrow':
          context.beginPath();
          context.moveTo(startX, startY);
          context.lineTo(offsetX, offsetY);
          context.stroke();

          // Dibuja la cabeza de flecha en la previsualización
          const angle = Math.atan2(offsetY - startY, offsetX - startX);
          // Aumentado el tamaño de la cabeza de flecha para que sea más visible
          drawArrowhead(context, offsetX, offsetY, angle, brushSize * 4); 
          break;
        default:
          break;
      }
    } else if (drawingTool !== 'text') { // Solo dibujar trazo libre si no es herramienta de texto
      // Para pinceles de trazo libre
      switch (drawingTool) {
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
    }
  };

  // Manejador para detener el dibujo o finalizar la creación de forma/flecha/texto
  const stopDrawing = (event: MouseEvent) => { // Aceptar MouseEvent directamente
    if (!contextRef.current) return;
    const context = contextRef.current;
    
    // Determine the end coordinates based on the event or start point
    let currentX = event.offsetX;
    let currentY = event.offsetY;

    // Fallback para cuando offsetX/offsetY pueden ser no confiables (ej. mouseleave fuera del canvas)
    // Para formas y flechas, asegúrate de que sea al menos el punto de inicio para no dibujar desde (0,0) inesperadamente
    if (['line', 'rectangle', 'circle', 'arrow'].includes(drawingTool)) {
      if (typeof currentX === 'undefined' || typeof currentY === 'undefined') {
        currentX = startX; // Usa el punto de inicio como final si el evento no da coordenadas válidas
        currentY = startY;
      }
    }

    // Si estábamos dibujando una forma o flecha, la dibujamos de forma final
    if (snapshot && ['line', 'rectangle', 'circle', 'arrow'].includes(drawingTool)) {
        // Restauramos el canvas al estado anterior para limpiar la última previsualización
        context.putImageData(snapshot, 0, 0); 
        // Dibujamos la forma/flecha final de nuevo para que sea permanente
        const width = currentX - startX;
        const height = currentY - startY;

        switch (drawingTool) {
            case 'line':
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(currentX, currentY);
                context.stroke();
                break;
            case 'rectangle':
                context.strokeRect(startX, startY, width, height);
                break;
            case 'circle':
                const centerX = (startX + currentX) / 2;
                const centerY = (startY + currentY) / 2;
                const radiusX = Math.abs(width / 2);
                const radiusY = Math.abs(height / 2);
                context.beginPath();
                context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                context.stroke();
                break;
            case 'arrow':
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(currentX, currentY);
                context.stroke();

                // Dibuja la cabeza de flecha final
                const angle = Math.atan2(currentY - startY, currentX - startX);
                drawArrowhead(context, currentX, currentY, angle, brushSize * 4);
                break;
            default:
                break;
        }
        setSnapshot(null); // Limpiar el snapshot
    } else if (drawingTool === 'text') {
      // Para texto, la lógica de stopDrawing se maneja en handleTextSubmit
      // No se hace nada aquí directamente
    } else {
        // Para pinceles, cerrar la ruta
        context.closePath();
    }
    setIsDrawing(false);
  };

  // Limpiar todo el canvas (imagen y dibujos)
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      // Usar window.confirm para confirmación antes de borrar
      if (window.confirm('¿Estás seguro de que quieres limpiar todo el dibujo? Esto borrará la imagen y los trazos.')) {
        setBackgroundImage(null); // Elimina la imagen de fondo
        context.clearRect(0, 0, canvas.width, canvas.height); // Limpia los trazos
        setIsTexting(false); // Asegurarse de que el input de texto se oculte
        setTextInput('');
      }
    }
  };

  // Manejador para la carga de imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(img); // Establece la imagen de fondo
        drawCanvasContent(); // Redibuja el canvas con la nueva imagen
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Manejador para guardar el dibujo
  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL('image/png'); // Obtener la imagen como PNG
      const link = document.createElement('a');
      link.href = image;
      link.download = 'mi_dibujo.png'; // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // NUEVA FUNCIÓN: Dibujar el texto en el canvas de forma permanente
  const drawTextOnCanvas = useCallback((text: string, x: number, y: number) => {
    const context = contextRef.current;
    if (!context || !text) return;

    context.font = `${brushSize * 2}px Arial`; // El tamaño de pincel afecta el tamaño de la fuente
    context.fillStyle = color; // El color de pincel afecta el color del texto
    context.fillText(text, x, y);
  }, [brushSize, color]);

  // NUEVA FUNCIÓN: Manejar el envío del texto (al presionar Enter o perder el foco)
  const handleTextSubmit = () => {
    if (textInput.trim() !== '') {
      // Restaurar el canvas al estado antes de que apareciera el input
      if (snapshot) {
        contextRef.current?.putImageData(snapshot, 0, 0);
      } else {
        // Si no hay snapshot (ej. primer texto en un canvas vacío), simplemente redibujar el fondo
        drawCanvasContent();
      }
      drawTextOnCanvas(textInput, textX, textY); // Dibujar el texto de forma permanente
    }
    setIsTexting(false); // Ocultar el input de texto
    setTextInput(''); // Limpiar el estado del input
    setSnapshot(null); // Limpiar el snapshot
    setIsDrawing(false); // Finalizar la acción de "dibujo" (texto)
  };

  // Manejar la pulsación de teclas en el input de texto
  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <div className="p-2 bg-gray-200 flex items-center gap-2 border-b flex-wrap">
        {/* Modo Dibujar/Borrar */}
        <div className="flex items-center gap-2 border-r pr-2">
          <button onClick={() => setMode('draw')} className={`p-2 rounded-md ${mode === 'draw' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Pincel">
            <Paintbrush size={20} />
          </button>
          <button onClick={() => setMode('erase')} className={`p-2 rounded-md ${mode === 'erase' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Goma de Borrar">
            <Eraser size={20} />
          </button>
        </div>

        {/* Herramientas de Dibujo (Pinceles, Formas, Flechas, Texto) */}
        {mode === 'draw' && (
          <div className="flex items-center gap-2 border-r pr-2">
            {/* Pinceles */}
            <button onClick={() => setDrawingTool('pencil')} className={`p-2 rounded-md ${drawingTool === 'pencil' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Lápiz">
              <Pen size={20} />
            </button>
            <button onClick={() => setDrawingTool('marker')} className={`p-2 rounded-md ${drawingTool === 'marker' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Rotulador">
              <Highlighter size={20} />
            </button>
            <button onClick={() => setDrawingTool('spray')} className={`p-2 rounded-md ${drawingTool === 'spray' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Spray">
              <SprayCan size={20} />
            </button>
            {/* Formas */}
            <button onClick={() => setDrawingTool('line')} className={`p-2 rounded-md ${drawingTool === 'line' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Línea Recta">
              <LineChart size={20} />
            </button>
            <button onClick={() => setDrawingTool('rectangle')} className={`p-2 rounded-md ${drawingTool === 'rectangle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Rectángulo">
              <Square size={20} />
            </button>
            <button onClick={() => setDrawingTool('circle')} className={`p-2 rounded-md ${drawingTool === 'circle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Círculo/Elipse">
              <Circle size={20} />
            </button>
            {/* Herramienta: Flecha */}
            <button onClick={() => setDrawingTool('arrow')} className={`p-2 rounded-md ${drawingTool === 'arrow' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Flecha">
              <ArrowRight size={20} />
            </button>
            {/* NUEVA HERRAMIENTA: Texto */}
            <button onClick={() => setDrawingTool('text')} className={`p-2 rounded-md ${drawingTool === 'text' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`} title="Texto">
              <Type size={20} />
            </button>
          </div>
        )}

        {/* Selector de Color y Tamaño del Pincel */}
        <div className="flex items-center gap-4">
          {mode === 'draw' && (
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 cursor-pointer rounded-md border border-gray-300"
              title="Seleccionar color"
            />
          )}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              title="Tamaño del pincel"
            />
            <span className="text-sm w-6 text-center text-gray-700">{brushSize}</span>
          </div>
        </div>

        {/* Botón para subir imagen */}
        <label htmlFor="image-upload" className="p-2 rounded-md hover:bg-gray-300 cursor-pointer" title="Subir Imagen">
          <ImageIcon size={20} />
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        {/* Botón: Guardar Dibujo */}
        <button onClick={handleSaveDrawing} className="p-2 rounded-md hover:bg-green-300" title="Guardar Dibujo">
          <SaveIcon size={20} />
        </button>

        {/* Botón: Limpiar Todo */}
        <button onClick={clearCanvas} className="ml-auto p-2 rounded-md hover:bg-red-300" title="Limpiar todo">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Área del Canvas */}
      <div className="flex-grow w-full h-full relative bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          // Para el texto, onMouseUp no finaliza el dibujo, sino que lo inicia
          onMouseUp={(e) => { if (drawingTool !== 'text') stopDrawing(e.nativeEvent); }}
          onMouseLeave={(e) => { if (isDrawing && drawingTool !== 'text') stopDrawing(e.nativeEvent); }}
          onMouseMove={draw}
          className="w-full h-full block cursor-crosshair"
        />
        {!backgroundImage && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg pointer-events-none">
            Sube una imagen o empieza a dibujar
          </div>
        )}

        {/* Campo de entrada de texto interactivo */}
        {isTexting && (
          <input
            type="text"
            ref={textInputRef}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onBlur={handleTextSubmit} // Al perder el foco, se dibuja el texto
            onKeyDown={handleTextInputKeyDown} // Al presionar Enter, se dibuja el texto
            style={{
              position: 'absolute',
              left: textX,
              top: textY,
              fontSize: `${brushSize * 2}px`, // Tamaño de fuente basado en brushSize
              color: color,
              fontFamily: 'Arial', // Puedes cambiar la fuente
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              padding: '2px 5px',
              zIndex: 100,
              minWidth: '50px',
              outline: 'none',
              transform: 'translate(-50%, -50%)' // Centrar el input en el clic
            }}
            className="rounded-md shadow-sm"
          />
        )}
      </div>
    </div>
  );
};

// Se incluye widgetConfig para tu WIDGET_REGISTRY
export const widgetConfig = {
  id: 'paleta', // Este ID no cambia en este escenario si ya está así en WIDGET_REGISTRY
  title: 'Paleta de Dibujo', // El título que aparecerá en tu UI
  // RUTA DEL ICONO PERSONALIZADA: Asegúrate de que paleta.png esté en public/icons/
  icon: <img src="/icons/paleta.png" alt="Paleta de Dibujo" className="w-8 h-8" />,
  component: DrawingPadWidget,
  defaultSize: { width: 600, height: 450 },
};

// --- Componente Principal de la Aplicación (App) para la previsualización ---
// Este App solo existe aquí para que puedas previsualizar DrawingPadWidget de forma autónoma.
// NO debe copiarse en tu App.tsx principal.


