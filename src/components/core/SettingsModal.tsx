import React, { useState, useMemo } from 'react';
// --- INICIO DE CAMBIOS PARA ANIMACIÓN ---
import { motion, AnimatePresence } from 'framer-motion';
// --- FIN DE CAMBIOS PARA ANIMACIÓN ---
import { X, Search } from 'lucide-react';
import { WIDGET_REGISTRY } from '../widgets';
import { ThemeSettings } from './ThemeSettings';
import { ProfileManager } from './ProfileManager';
import type { ProfileCollection } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedWidgets: string[];
  setPinnedWidgets: React.Dispatch<React.SetStateAction<string[]>>;
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
  profiles,
  setProfiles,
  activeProfileName,
  setActiveProfileName,
}) => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWidgets = useMemo(() => {
    if (!searchTerm) {
      return Object.values(WIDGET_REGISTRY);
    }
    return Object.values(WIDGET_REGISTRY).filter(widget =>
      widget.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Fondo aún más lento
        >
          <motion.div 
            className="bg-white/90 backdrop-blur-xl text-text-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" 
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.7, opacity: 0 }} // Empieza más pequeño
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            // ¡AQUÍ ESTÁ EL CAMBIO! Animación muy exagerada.
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            {/* El resto del contenido no cambia */}
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
              {activeTab === 'profiles' && <ProfileManager profiles={profiles} setProfiles={setProfiles} activeProfileName={activeProfileName} setActiveProfileName={setActiveProfileName} />}
              {activeTab === 'widgets' && (
                <div className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Buscar widget..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white/80 focus:ring-2 focus:ring-accent focus:outline-none" />
                  </div>
                  <p className="mb-4 text-sm text-gray-600">Selecciona los widgets que quieres en tu barra de herramientas. ({pinnedWidgets.length}/{MAX_WIDGETS})</p>
                  <ul className="space-y-2">
                    {filteredWidgets.map(widget => (
                      <li key={widget.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{widget.icon}</span>
                          <span className="font-semibold">{widget.title}</span>
                        </div>
                        <button onClick={() => togglePin(widget.id)} className={`font-semibold py-2 px-4 rounded-lg transition-colors ${pinnedWidgets.includes(widget.id) ? 'bg-widget-header text-text-light hover:bg-[#7b69b1]' : 'bg-accent text-text-dark hover:bg-[#8ec9c9]'}`}>
                          {pinnedWidgets.includes(widget.id) ? 'Quitar' : 'Añadir'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'theme' && <ThemeSettings />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
