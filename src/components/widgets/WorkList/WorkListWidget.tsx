import React, { useState } from 'react';
import { X, Edit, Download } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';

// Definimos una interfaz para nuestras tareas para mayor claridad
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export const WorkListWidget: React.FC = () => {
  // 1. PERSISTENCIA EN LOCAL STORAGE
  // Usamos el hook useLocalStorage en lugar de useState para que las tareas persistan.
  const [tasks, setTasks] = useLocalStorage<Task[]>('work-list-tasks', []);
  const [newTask, setNewTask] = useState('');

  // Estados para la funcionalidad de editar (UPDATE)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // CREATE: Añadir una nueva tarea
  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  // UPDATE: Cambiar el estado de completado de una tarea
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // DELETE: Eliminar una tarea
  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // UPDATE: Iniciar la edición de una tarea
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  // UPDATE: Guardar la tarea editada
  const handleUpdate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingTaskId !== null) {
      if (editingTaskText.trim() === '') {
        // Si el texto está vacío, eliminamos la tarea
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

  // 2. DESCARGA COMO CSV
  const downloadAsCSV = () => {
    const headers = 'ID,Tarea,Completada\n';
    const csvContent = tasks
      .map(t => `${t.id},"${t.text.replace(/"/g, '""')}",${t.completed}`)
      .join('\n');
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'lista_de_trabajo.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full text-text-dark">
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
          onClick={downloadAsCSV}
          className="p-2 bg-accent rounded hover:bg-[#8ec9c9] transition-colors"
          title="Descargar como CSV"
        >
          <Download size={20} />
        </button>
      </div>
      
      {/* READ: Mostramos la lista de tareas */}
      <ul className="flex-grow overflow-y-auto pr-2">
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
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
    id: 'work-list',
    title: 'Lista de Trabajo',
    icon: '✅',
    defaultSize: { width: 380, height: 400 },
};