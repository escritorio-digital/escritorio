// src/components/widgets/LatexMarkdown/LatexMarkdownWidget.tsx

import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { marked } from 'marked';
import katex from 'katex';
import { toPng } from 'html-to-image'; // para "Copiar como imagen"
import { Clipboard, Image as ImageIcon, FileDown, FileText } from 'lucide-react';

import 'katex/dist/katex.min.css';
import './LatexMarkdownWidget.css';

type Mode = 'markdown' | 'latex';

/** Lee las @font-face de las hojas de estilo para incrustarlas cuando copiamos como imagen */
async function getFontEmbedCSS(): Promise<string> {
  let cssText = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (sheet.cssRules) {
        for (const rule of Array.from(sheet.cssRules)) {
          cssText += rule.cssText;
        }
      }
    } catch {
      // hojas con CORS: las ignoramos
    }
  }
  return cssText;
}

/** Renderiza el contenido (Markdown+KaTeX o KaTeX puro) en un elemento destino */
function renderContentInto(target: HTMLElement, mode: Mode, input: string) {
  target.innerHTML = '';
  if (mode === 'markdown') {
    const html = marked.parse(input) as string;
    target.innerHTML = html;

    // $$...$$ (display)
    target.innerHTML = target.innerHTML.replace(
      /\$\$([^$]+)\$\$/g,
      (_, latex) => katex.renderToString(latex.trim(), { throwOnError: false, displayMode: true })
    );
    // $...$ (inline)
    target.innerHTML = target.innerHTML.replace(
      /\$([^$]+)\$/g,
      (_, latex) => katex.renderToString(latex.trim(), { throwOnError: false, displayMode: false })
    );
  } else {
    katex.render(input, target, { throwOnError: true, displayMode: true });
  }
}

export const LatexMarkdownWidget: FC = () => {
  const [input, setInput] = useState<string>(
    '# Teorema de Pitágoras\n\nEn un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.\n\n$$c = \\sqrt{a^2 + b^2}$$'
  );
  const [mode, setMode] = useState<Mode>('markdown');
  const [feedback, setFeedback] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // EFECTO: Mueve el nodo de impresión al body al montar el componente
  // para que no herede estilos y la estrategia de impresión sea más robusta.
  useEffect(() => {
    const node = printRef.current;
    if (!node) return;
    
    document.body.appendChild(node);
    
    return () => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
  }, []);


  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 1800);
  };

  const handleCopySource = () => {
    navigator.clipboard
      .writeText(input)
      .then(() => showFeedback('Código fuente copiado'))
      .catch(() => showFeedback('No se pudo copiar'));
  };

  const handleCopyAsImage = async () => {
    const element = previewRef.current;
    if (!element) return;

    const fontEmbedCSS = await getFontEmbedCSS();

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        fontEmbedCSS,
      });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showFeedback('Imagen copiada');
    } catch {
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

  const handleExportAsPdfText = async () => {
    const dst = printRef.current;
    if (!dst) return;

    renderContentInto(dst, mode, input);

    try {
      // @ts-expect-error: document.fonts no siempre tipado
      await document.fonts?.ready;
    } catch {}
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    const cleanup = () => {
      dst.innerHTML = '';
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    window.print();
  };

  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      renderContentInto(previewElement, mode, input);
    } catch (error) {
      if (mode === 'latex' && error instanceof Error) {
        previewElement.innerHTML = `
          <div class="friendly-error-pane">
            <h3>Modo exclusivo de LaTeX</h3>
            <p>Este modo muestra una única fórmula. El contenido actual parece ser texto o Markdown.</p>
            <h4>Cómo proceder</h4>
            <ul>
              <li>Para una fórmula aislada, deja solo LaTeX. Ejemplo: <code>c = \\\\sqrt{a^2 + b^2}</code>.</li>
              <li>Para texto con fórmulas, usa el modo <strong>Markdown</strong>.</li>
            </ul>
          </div>
        `;
      } else if (error instanceof Error) {
        previewElement.innerHTML = `<div class="error-message">Error de sintaxis en LaTeX: ${error.message}</div>`;
      } else {
        previewElement.innerHTML = `<div class="error-message">Ha ocurrido un error.</div>`;
      }
    }
  }, [input, mode]);

  return (
    <>
      <div className="latex-markdown-widget">
        <div className="editor-pane">
          <div className="mode-selector">
            <button onClick={() => setMode('markdown')} className={mode === 'markdown' ? 'active' : ''}>
              Markdown
            </button>
            <button onClick={() => setMode('latex')} className={mode === 'latex' ? 'active' : ''}>
              LaTeX
            </button>
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
            <button title="Copiar código fuente" onClick={handleCopySource}>
              <Clipboard size={18} />
            </button>
            <button title="Copiar como imagen" onClick={handleCopyAsImage}>
              <ImageIcon size={18} />
            </button>
            <button title="Guardar archivo (.md/.tex)" onClick={handleSaveToFile}>
              <FileDown size={18} />
            </button>
            <button title="Exportar como PDF (texto)" onClick={handleExportAsPdfText}>
              <FileText size={18} />
            </button>
          </div>
          <div className="preview-pane prose" ref={previewRef} />
        </div>
      </div>

      {/* Este div se renderiza aquí, pero el useEffect lo mueve al body */}
      <div id="print-root" ref={printRef} className="prose"></div>
    </>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'latex-markdown-interpreter',
  title: 'Intérprete (MD/LaTeX)',
  icon: <img src="/icons/LatexMarkdown.png" alt="Intérprete (MD/LaTeX)" width="52" height="52" />,
  defaultSize: { width: 900, height: 550 },
};
