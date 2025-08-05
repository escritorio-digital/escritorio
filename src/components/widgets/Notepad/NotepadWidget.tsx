import React, { useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
// Importamos las extensiones de Tiptap. Mantener los alias para evitar conflictos.
import StarterKit from '@tiptap/starter-kit';
import { Heading as TiptapHeadingExtension } from '@tiptap/extension-heading'; // Alias para la extensión de Tiptap

import { marked } from 'marked';
import TurndownService from 'turndown';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import './Notepad.css';
// Importa los componentes de íconos de Lucide.
// Usamos Heading1, Heading2, Heading3 si están disponibles.
// Si no lo están, usa 'Heading' y diferéncialos con el title o estilos extra.
// Para el código, si 'Code' sigue dando error, elimínalo junto con los botones de código.
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Upload,
  Download,
  Text, // Usaremos 'Text' para el párrafo si 'Type' no funciona o para mayor claridad.
  Heading1, // Esperamos que Lucide React 0.525.0 tenga Heading1, Heading2, Heading3
  Heading2,
  Heading3,
} from 'lucide-react';

// Componente para la barra de herramientas del editor
const MenuBar: React.FC<{ editor: Editor | null; onUpload: () => void; onDownload: () => void; }> = ({ editor, onUpload, onDownload }) => {
  if (!editor) {
    return null;
  }

  const menuButtons = [
    { Icon: Bold, action: () => editor.chain().focus().toggleBold().run(), name: 'bold', title: 'Negrita' },
    { Icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), name: 'italic', title: 'Cursiva' },
    { Icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), name: 'strike', title: 'Tachado' },
    { Icon: List, action: () => editor.chain().focus().toggleBulletList().run(), name: 'bulletList', title: 'Lista de viñetas' }, // Título más descriptivo
    { Icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), name: 'orderedList', title: 'Lista numerada' }, // Título más descriptivo
    { Icon: Text, action: () => editor.chain().focus().setParagraph().run(), name: 'paragraph', title: 'Párrafo' }, // Cambiado a 'Text'
    { Icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), name: 'heading', level: 1, title: 'Título (H1)' },
    { Icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), name: 'heading', level: 2, title: 'Subtítulo (H2)' },
    { Icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), name: 'heading', level: 3, title: 'Subtítulo Menor (H3)' },
    // Eliminados los botones de código
  ];

  return (
    <div className="menubar flex items-center gap-1 p-2 bg-gray-100 border-b border-accent">
      {menuButtons.map(({ Icon, action, name, title, level }) => (
        <button
          key={name + (level || '')}
          onClick={action}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive(name, level ? { level } : undefined) ? 'is-active' : ''}`}
          title={title}
        >
          <Icon size={16} />
        </button>
      ))}
      <div className="flex-grow"></div>
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
    extensions: [
      StarterKit.configure({
        // Desactivamos Heading de StarterKit para configurarlo individualmente
        heading: false,
        codeBlock: false, // Asegurarse de que CodeBlock también esté desactivado en StarterKit
        // inlineCode: false, // También podríamos desactivar el código en línea si no se quiere
      }),
      TiptapHeadingExtension.configure({ levels: [1, 2, 3] }), // Usa la extensión de Tiptap aliada
      // Eliminada la extensión CodeBlock
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
        attributes: {
          class: 'prose dark:prose-invert max-w-none', // Mantén la clase prose para estilos base
        },
    },
  });

  const handleDownload = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
    // TurndownService por defecto no convierte código a menos que se configure
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
    if(e.target) e.target.value = '';
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

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'notepad',
  title: 'Bloc de Notas',
  icon: <img src="/escritorio/icons/Notepad.png" alt="Bloc de notas" width="52" height="52" />,
  defaultSize: { width: 500, height: 450 },
};