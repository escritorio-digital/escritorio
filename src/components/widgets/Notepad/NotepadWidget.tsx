import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Estilos base de Quill
import './Notepad.css'; // Nuestros estilos personalizados
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';

export const NotepadWidget: React.FC = () => {
  const [content, setContent] = useLocalStorage('notepad-content', '');
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const { quill, quillRef } = useQuill({ modules });

  // Sincronizamos el LocalStorage con el editor
  useEffect(() => {
    if (quill) {
      // Cargamos el contenido inicial
      if (content && quill.root.innerHTML !== content) {
        quill.clipboard.dangerouslyPasteHTML(content);
      }

      // Guardamos los cambios en el LocalStorage
      quill.on('text-change', () => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [quill, setContent]);

  return (
    <div className="flex flex-col h-full w-full notepad-widget">
      <div ref={quillRef} style={{ flexGrow: 1 }} />
    </div>
  );
};

// Configuración para el auto-descubrimiento del widget
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'notepad',
  title: 'Bloc de Notas',
  icon: '📝',
  defaultSize: { width: 500, height: 450 },
};