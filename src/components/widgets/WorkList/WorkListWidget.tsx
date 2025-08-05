import React, { useState, useRef } from 'react';
import { X, Edit, Download, Upload } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import Papa from 'papaparse';
import type { WidgetConfig } from '../../../types';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export const WorkListWidget: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('work-list-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleUpdate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingTaskId !== null) {
      if (editingTaskText.trim() === '') {
        removeTask(editingTaskId);
      } else {
        setTasks(
          tasks.map(task =>
            task.id === editingTaskId ? { ...task, text: editingTaskText.trim() } : task
          )
        );
      }
      setEditingTaskId(null);
      setEditingTaskText('');
    }
  };

  const downloadAsCSV = () => {
    const csv = Papa.unparse(tasks.map(t => ({ id: t.id, text: t.text, completed: t.completed })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'lista_de_trabajo.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse<Task>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const newTasks = results.data.map(row => ({
            id: Number(row.id) || Date.now() + Math.random(),
            text: String(row.text || ''),
            completed: String(row.completed).toLowerCase() === 'true'
          })).filter(task => task.text);

          if (window.confirm('¿Quieres reemplazar la lista actual con las tareas del archivo? \n(Haz clic en "Cancelar" para añadirlas al final)')) {
            setTasks(newTasks);
          } else {
            setTasks(prevTasks => [...prevTasks, ...newTasks]);
          }
        },
        error: (error) => {
          console.error("Error al parsear el CSV:", error);
          alert("Hubo un error al leer el archivo CSV. Por favor, revisa su formato.");
        }
      });
    }
    if(e.target) e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full text-text-dark p-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-grow bg-custom-bg border-2 border-accent rounded p-2 focus:border-widget-header outline-none"
          placeholder="Añadir nueva tarea y pulsar Enter..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={addTask}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-accent rounded hover:bg-[#8ec9c9] transition-colors"
          title="Cargar CSV"
        >
          <Upload size={20} />
        </button>
        <button 
          onClick={downloadAsCSV}
          className="p-2 bg-accent rounded hover:bg-[#8ec9c9] transition-colors"
          title="Descargar como CSV"
        >
          <Download size={20} />
        </button>
      </div>
      
      {/* ¡ESTA ES LA PARTE QUE FALTABA! */}
      <ul className="flex-grow overflow-y-auto pr-2  min-h-0">
        {tasks.map(task => (
          <li key={task.id} className={`flex items-center gap-3 p-2 border-b border-accent/50 ${task.completed ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 rounded text-widget-header bg-custom-bg border-accent focus:ring-widget-header"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editingTaskText}
                onChange={(e) => setEditingTaskText(e.target.value)}
                onKeyPress={handleUpdate}
                onBlur={() => setEditingTaskId(null)}
                className="flex-grow bg-white border border-widget-header rounded px-1 py-0.5"
                autoFocus
              />
            ) : (
              <span 
                className={`flex-grow cursor-pointer ${task.completed ? 'line-through' : ''}`}
                onDoubleClick={() => startEditing(task)}
              >
                {task.text}
              </span>
            )}
            <button onClick={() => startEditing(task)} className="text-gray-400 hover:text-blue-500">
              <Edit size={16} />
            </button>
            <button onClick={() => removeTask(task.id)} className="text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-2 text-center">Doble click en una tarea para editarla.</p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
    id: 'work-list',
    title: 'Lista de Trabajo',
    icon: <img src="/escritorio/icons/WorkList.png" alt="Lista de Trabajo" width="52" height="52" />,
    defaultSize: { width: 380, height: 400 },
};