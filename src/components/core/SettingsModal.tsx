import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WIDGET_REGISTRY } from '../widgets';
import { ThemeSettings } from './ThemeSettings.tsx';
import { ProfileManager } from './ProfileManager'; // Importa el nuevo componente
import type { ProfileCollection } from '../../types'; // Importa el tipo

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedWidgets: string[];
  setPinnedWidgets: React.Dispatch<React.SetStateAction<string[]>>;
  // Nuevas props para perfiles
  profiles: ProfileCollection;
  setProfiles: React.Dispatch<React.SetStateAction<ProfileCollection>>;
  activeProfileName: string;
  setActiveProfileName: (name: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  pinnedWidgets,
  setPinnedWidgets,
  // Recibe las nuevas props
  profiles,
  setProfiles,
  activeProfileName,
  setActiveProfileName,
}) => {
  const [activeTab, setActiveTab] = useState('profiles'); // Inicia en la nueva pestaña

  if (!isOpen) return null;

  const MAX_WIDGETS = 20;

  const togglePin = (widgetId: string) => {
    setPinnedWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId);
      } else if (prev.length < MAX_WIDGETS) {
        return [...prev, widgetId];
      }
      alert(`No se pueden fijar más de ${MAX_WIDGETS} widgets.`);
      return prev;
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white/90 backdrop-blur-xl text-text-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Configuración</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10"><X size={20}/></button>
        </header>

        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 p-3 font-semibold ${activeTab === 'profiles' ? 'bg-accent text-text-dark' : 'hover:bg-gray-200'}`}
          >
            Perfiles de Escritorio
          </button>
          <button 
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 p-3 font-semibold ${activeTab === 'widgets' ? 'bg-accent text-text-dark' : 'hover:bg-gray-200'}`}
          >
            Librería de Widgets
          </button>
          <button 
            onClick={() => setActiveTab('theme')}
            className={`flex-1 p-3 font-semibold ${activeTab === 'theme' ? 'bg-accent text-text-dark' : 'hover:bg-gray-200'}`}
          >
            Personalizar Tema
          </button>
        </div>

        <div className="overflow-y-auto">
          {activeTab === 'profiles' && (
            <ProfileManager
              profiles={profiles}
              setProfiles={setProfiles}
              activeProfileName={activeProfileName}
              setActiveProfileName={setActiveProfileName}
            />
          )}
          {activeTab === 'widgets' && (
            <div className="p-4">
              <p className="mb-4 text-sm text-gray-600">Selecciona los widgets que quieres en tu barra de herramientas. ({pinnedWidgets.length}/{MAX_WIDGETS})</p>
              <ul className="space-y-2">
                {Object.values(WIDGET_REGISTRY).map(widget => (
                  <li key={widget.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{widget.icon}</span>
                      <span className="font-semibold">{widget.title}</span>
                    </div>
                    <button
                      onClick={() => togglePin(widget.id)}
                      className={`font-semibold py-2 px-4 rounded-lg transition-colors ${pinnedWidgets.includes(widget.id) ? 'bg-widget-header text-text-light hover:bg-[#7b69b1]' : 'bg-accent text-text-dark hover:bg-[#8ec9c9]'}`}
                    >
                      {pinnedWidgets.includes(widget.id) ? 'Quitar' : 'Añadir'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'theme' && <ThemeSettings />}
        </div>
      </div>
    </div>
  );
};