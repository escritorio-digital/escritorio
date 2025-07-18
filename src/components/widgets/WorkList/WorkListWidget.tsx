import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { WidgetConfig } from '../../../types'; // Importamos el tipo

export const WorkListWidget: React.FC = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="flex flex-col h-full text-text-dark">
      <input
        type="text"
        className="bg-custom-bg border-2 border-accent rounded p-2 mb-2 focus:border-widget-header outline-none"
        placeholder="Añadir nueva tarea y pulsar Enter..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={addTask}
      />
      <ul className="flex-grow overflow-y-auto pr-2">
        {tasks.map(task => (
          <li key={task.id} className={`flex items-center gap-3 p-2 border-b border-accent/50 ${task.completed ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 rounded text-widget-header bg-custom-bg border-accent focus:ring-widget-header"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className={`flex-grow ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
            <button onClick={() => removeTask(task.id)} className="text-gray-400 hover:text-red-500">
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ¡NUEVO! Cada widget ahora exporta su propia configuración.
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
    id: 'work-list',
    title: 'Lista de Trabajo',
    icon: '✅',
    defaultSize: { width: 350, height: 400 },
};
