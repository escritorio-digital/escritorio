import React, { useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import './Notepad.css';
import { Bold, Italic, Strikethrough, List, ListOrdered, Upload, Download } from 'lucide-react';

// Componente para la barra de herramientas del editor
const MenuBar: React.FC<{ editor: Editor | null; onUpload: () => void; onDownload: () => void; }> = ({ editor, onUpload, onDownload }) => {
  if (!editor) {
    return null;
  }

  const menuButtons = [
    { Icon: Bold, action: () => editor.chain().focus().toggleBold().run(), name: 'bold', title: 'Negrita' },
    { Icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), name: 'italic', title: 'Cursiva' },
    { Icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), name: 'strike', title: 'Tachado' },
    { Icon: List, action: () => editor.chain().focus().toggleBulletList().run(), name: 'bulletList', title: 'Lista' },
    { Icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), name: 'orderedList', title: 'Lista Numerada' },
  ];

  return (
    <div className="menubar flex items-center gap-1 p-2 bg-gray-100 border-b border-accent">
      {menuButtons.map(({ Icon, action, name, title }) => (
        <button
          key={name}
          onClick={action}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive(name) ? 'is-active' : ''}`}
          title={title}
        >
          <Icon size={16} />
        </button>
      ))}
      <div className="flex-grow"></div> {/* Espaciador */}
      <button onClick={onUpload} className="p-2 rounded hover:bg-gray-200" title="Cargar nota (.md)">
          <Upload size={16} />
      </button>
      <button onClick={onDownload} className="p-2 rounded hover:bg-gray-200" title="Descargar nota (.md)">
          <Download size={16} />
      </button>
    </div>
  );
};

// Componente principal del Widget de Notepad
export const NotepadWidget: React.FC = () => {
  const [content, setContent] = useLocalStorage('notepad-content-html', '<p>¡Hola! Escribe aquí.</p>');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const turndownService = new TurndownService();

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
        attributes: {
          class: 'prose dark:prose-invert max-w-none',
        },
    },
  });

  const handleDownload = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
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
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const markdownContent = event.target?.result as string;
        const htmlContent = await marked.parse(markdownContent);
        editor.commands.setContent(htmlContent);
      };
      reader.readAsText(file);
    }
    if(e.target) e.target.value = ''; // Permite volver a subir el mismo archivo
  };

  return (
    <div className="flex flex-col h-full w-full notepad-widget bg-white rounded-b-md overflow-hidden">
      <MenuBar editor={editor} onUpload={() => fileInputRef.current?.click()} onDownload={handleDownload} />
      <EditorContent editor={editor} className="flex-grow overflow-auto" />
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

// La configuración del widget no cambia
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'notepad',
  title: 'Bloc de Notas',
  icon: '📝',
  defaultSize: { width: 500, height: 450 },
};