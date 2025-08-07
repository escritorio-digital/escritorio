import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { marked } from 'marked';
import katex from 'katex';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
// html2canvas ya no es necesario
import { Clipboard, Image as ImageIcon, FileDown, FileText } from 'lucide-react';

import 'katex/dist/katex.min.css';
import './LatexMarkdownWidget.css';

type Mode = 'markdown' | 'latex';

// 1️⃣ Función auxiliar para obtener las declaraciones @font-face del CSS
async function getFontEmbedCSS(): Promise<string> {
  let cssText = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (sheet.cssRules) {
        for (const rule of Array.from(sheet.cssRules)) {
          cssText += rule.cssText;
        }
      }
    } catch (e) {
      console.warn('No se pudo leer una hoja de estilo por restricciones de CORS:', e);
    }
  }
  return cssText;
}

export const LatexMarkdownWidget: FC = () => {
  const [input, setInput] = useState('# Teorema de Pitágoras\n\nEn un triángulo rectángulo, el cuadrado de la hipotenusa (el lado de mayor longitud) es igual a la suma de los cuadrados de los catetos.\n\nLa fórmula es:\n\n$$c = \\sqrt{a^2 + b^2}$$');
  const [mode, setMode] = useState<Mode>('markdown');
  const [feedback, setFeedback] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleCopySource = () => {
    navigator.clipboard.writeText(input)
      .then(() => showFeedback('Código fuente copiado'))
      .catch(err => console.error('Error al copiar el código:', err));
  };

  const handleCopyAsImage = async () => {
    const element = previewRef.current;
    if (!element) return;
  
    // Reutilizamos la función auxiliar aquí también para consistencia
    const fontEmbedCSS = await getFontEmbedCSS();
  
    try {
      const dataUrl = await toPng(element, { 
        backgroundColor: '#ffffff',
        fontEmbedCSS: fontEmbedCSS,
      });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
      showFeedback('Imagen copiada');
    } catch (error) {
      console.error('Error al copiar como imagen:', error);
      showFeedback('Error al copiar imagen');
    }
  };
  
  const handleSaveToFile = () => {
    const extension = mode === 'latex' ? 'tex' : 'md';
    const mimeType = mode === 'latex' ? 'text/x-latex' : 'text/markdown';
    const blob = new Blob([input], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 2️⃣ Nueva versión de handleExportAsPdf que implementa la solución
  const handleExportAsPdf = async () => {
    const node = previewRef.current;
    if (!node) return;

    await document.fonts.ready; // Esperamos a que carguen las fuentes.
    const fontCSS = await getFontEmbedCSS();

    // Se genera un canvas de alta resolución con las fuentes incrustadas.
    const canvas = await toPng(node, {
      backgroundColor: '#ffffff',
      pixelRatio: 3, // Alta resolución para evitar pixelación.
      fontEmbedCSS: fontCSS, // Se pasan las fuentes a la librería.
    }).then(async (dataUrl) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const cnv = document.createElement('canvas');
      cnv.width  = img.width;
      cnv.height = img.height;
      cnv.getContext('2d')!.drawImage(img, 0, 0);
      return cnv;
    });

    // Se crea el PDF y se añade la imagen con paginación.
    const pdf   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW  = pageW;
    const imgH  = (canvas.height * imgW) / canvas.width;

    let pos = 0;
    let hLeft = imgH;

    pdf.addImage(canvas, 'PNG', 0, pos, imgW, imgH);
    hLeft -= pageH;

    while (hLeft > 0) {
      pos -= pageH;
      pdf.addPage();
      pdf.addImage(canvas, 'PNG', 0, pos, imgW, imgH);
      hLeft -= pageH;
    }
    pdf.save('documento.pdf');
  };


  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;
    
    previewElement.innerHTML = '';

    try {
      if (mode === 'markdown') {
        const html = marked.parse(input) as string;
        previewElement.innerHTML = html;
        previewElement.innerHTML = previewElement.innerHTML.replace(/\$\$([^$]+)\$\$/g, (_, latex) => {
            return katex.renderToString(latex.trim(), { throwOnError: false, displayMode: true });
        });
        previewElement.innerHTML = previewElement.innerHTML.replace(/\$([^$]+)\$/g, (_, latex) => {
            return katex.renderToString(latex.trim(), { throwOnError: false, displayMode: false });
        });
      } else if (mode === 'latex') {
        katex.render(input, previewElement, {
          throwOnError: true,
          displayMode: true,
        });
      }
    } catch (error) {
      if (mode === 'latex' && error instanceof Error) {
        previewElement.innerHTML = `
          <div class="friendly-error-pane">
            <h3>Modo Exclusivo de LaTeX</h3>
            <p>Este modo está diseñado para previsualizar <strong>una única fórmula matemática</strong> a la vez.</p>
            <p>El contenido actual parece ser un documento de texto o Markdown (por ejemplo, empieza con '#'), lo que no se puede interpretar como una fórmula.</p>
            <hr>
            <h4>¿Cómo solucionarlo?</h4>
            <ul>
              <li>Para escribir una <strong>fórmula aislada</strong>, borra el texto actual y escribe solo el código LaTeX. Por ejemplo: <code>c = \\sqrt{a^2 + b^2}</code>.</li>
              <li>Para escribir un <strong>documento con texto y fórmulas</strong>, vuelve al modo <strong>Markdown</strong>.</li>
            </ul>
          </div>
        `;
      } else if (error instanceof Error) {
        previewElement.innerHTML = `<div class="error-message">Error de sintaxis en LaTeX: ${error.message}</div>`;
      } else {
        previewElement.innerHTML = `<div class="error-message">Ha ocurrido un error desconocido.</div>`;
      }
    }
  }, [input, mode]);

  return (
    <div className="latex-markdown-widget">
      <div className="editor-pane">
        <div className="mode-selector">
          <button onClick={() => setMode('markdown')} className={mode === 'markdown' ? 'active' : ''}>Markdown</button>
          <button onClick={() => setMode('latex')} className={mode === 'latex' ? 'active' : ''}>LaTeX</button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck="false"
          className="editor-textarea"
        />
      </div>
      <div className="preview-container">
        <div className="preview-toolbar">
            {feedback && <span className="feedback-message">{feedback}</span>}
            <button title="Copiar código fuente" onClick={handleCopySource}><Clipboard size={18} /></button>
            <button title="Copiar como imagen" onClick={handleCopyAsImage}><ImageIcon size={18} /></button>
            <button title="Guardar archivo (.md/.tex)" onClick={handleSaveToFile}><FileDown size={18} /></button>
            <button title="Exportar como PDF" onClick={handleExportAsPdf}><FileText size={18} /></button>
        </div>
        <div className="preview-pane" ref={previewRef}>
            {/* El contenido renderizado se insertará aquí */}
        </div>
      </div>
    </div>
  );
};


export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'latex-markdown-interpreter',
  title: 'Intérprete (MD/LaTeX)',
  icon: <img src="/escritorio/icons/LatexMarkdown.png" alt="Intérprete (MD/LaTeX)" width="52" height="52" />,
  defaultSize: { width: 900, height: 550 },
};
