import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Importa los estilos de KaTeX
import './LatexMarkdownWidget.css';

type Mode = 'markdown' | 'latex';

export const LatexMarkdownWidget: FC = () => {
  const [input, setInput] = useState('# Hola, Markdown!\n\nEscribe **Markdown** o selecciona `LaTeX` para fórmulas.\n\n$$c = \\sqrt{a^2 + b^2}$$');
  const [mode, setMode] = useState<Mode>('markdown');
  const previewRef = useRef<HTMLDivElement>(null);

  // Efecto para renderizar el contenido cuando cambia el input o el modo
  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      if (mode === 'markdown') {
        // Renderiza Markdown y busca fórmulas de LaTeX para renderizarlas también
        const html = marked.parse(input) as string;
        previewElement.innerHTML = html;
        // Busca y renderiza bloques de LaTeX dentro del Markdown
        previewElement.querySelectorAll('.language-latex, .language-tex, pre > code').forEach((block) => {
          katex.render(block.textContent || '', block as HTMLElement, {
            throwOnError: false,
            displayMode: true,
          });
        });
         // Busca y renderiza LaTeX en línea
         // CORRECCIÓN: Se eliminó el parámetro 'match' que no se usaba
        previewElement.innerHTML = previewElement.innerHTML.replace(/\$\$([^$]+)\$\$/g, (_, latex) => {
            return katex.renderToString(latex, { throwOnError: false, displayMode: true });
        });

      } else if (mode === 'latex') {
        // Renderiza el input completo como una sola fórmula de LaTeX
        katex.render(input, previewElement, {
          throwOnError: false,
          displayMode: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        previewElement.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
      } else {
        previewElement.innerHTML = `<div class="error-message">Un error desconocido ha ocurrido.</div>`;
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
      <div className="preview-pane" ref={previewRef}>
        {/* El contenido renderizado se insertará aquí */}
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'latex-markdown-interpreter',
  title: 'Intérprete (MD/LaTeX)',
  icon: '📜',
  defaultSize: { width: 800, height: 500 },
};