import React, { useEffect, useRef, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { marked } from 'marked'; // <-- NUEVA BIBLIOTECA (MD -> HTML)
import TurndownService from 'turndown'; // <-- NUEVA BIBLIOTECA (HTML -> MD)
import 'quill/dist/quill.snow.css';
import './Notepad.css';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import { Upload, Download } from 'lucide-react';

export const NotepadWidget: React.FC = () => {
  const [content, setContent] = useLocalStorage('notepad-content-html', '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Creamos una instancia del servicio Turndown
  const [turndownService] = useState(new TurndownService());

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean'],
    ],
  };

  const { quill, quillRef } = useQuill({ modules });

  useEffect(() => {
    if (quill) {
      if (content && quill.root.innerHTML !== content) {
        quill.clipboard.dangerouslyPasteHTML(content);
      }
      const handleChange = () => {
        setContent(quill.root.innerHTML);
      };
      quill.on('text-change', handleChange);
      return () => {
        quill.off('text-change', handleChange);
      };
    }
  }, [quill, content, setContent]);
  

  const handleDownload = () => {
    if (!quill) return;
    const htmlContent = quill.root.innerHTML;
    // Usamos Turndown para convertir HTML a Markdown
    const markdownContent = turndownService.turndown(htmlContent);
    
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mi-nota.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && quill) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const markdownContent = event.target?.result as string;
        // Usamos marked para convertir Markdown a HTML
        const htmlContent = await marked.parse(markdownContent);
        quill.clipboard.dangerouslyPasteHTML(htmlContent);
      };
      reader.readAsText(file);
    }
    if(e.target) e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full w-full notepad-widget">
      <div className="flex items-center p-2 border-b border-accent bg-white rounded-t-lg">
        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-200 rounded-full" title="Cargar nota (.md)">
          <Upload size={18} />
        </button>
        <button onClick={handleDownload} className="p-2 hover:bg-gray-200 rounded-full" title="Descargar nota (.md)">
          <Download size={18} />
        </button>
      </div>

      <div ref={quillRef} style={{ flexGrow: 1 }} />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.txt"
        className="hidden"
      />
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'notepad',
  title: 'Bloc de Notas',
  icon: '📝',
  defaultSize: { width: 500, height: 450 },
};
