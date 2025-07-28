// src/components/core/ProfileManager.tsx

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { ProfileCollection } from '../../types';

interface ProfileManagerProps {
  profiles: ProfileCollection;
  setProfiles: React.Dispatch<React.SetStateAction<ProfileCollection>>;
  activeProfileName: string;
  setActiveProfileName: (name: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  setProfiles,
  activeProfileName,
  setActiveProfileName,
}) => {
  const [newProfileName, setNewProfileName] = useState('');
  const { theme } = useTheme();

  const handleSaveCurrent = () => {
    if (newProfileName.trim() && !profiles[newProfileName.trim()]) {
      const currentProfile = profiles[activeProfileName];
      setProfiles(prev => ({
        ...prev,
        [newProfileName.trim()]: {
            ...currentProfile,
            theme: theme, // Asegúrate de guardar el tema actual
        }
      }));
      setNewProfileName('');
    } else {
      alert('El nombre del perfil no es válido o ya existe.');
    }
  };

  const handleDelete = (name: string) => {
    if (Object.keys(profiles).length <= 1) {
      alert('No puedes eliminar el último perfil.');
      return;
    }
    if (window.confirm(`¿Seguro que quieres eliminar el perfil "${name}"?`)) {
      const newProfiles = { ...profiles };
      delete newProfiles[name];
      setProfiles(newProfiles);
      // Si se borra el activo, activa el primero que quede
      if (activeProfileName === name) {
        setActiveProfileName(Object.keys(newProfiles)[0]);
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Guardar Escritorio Actual</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Nombre del nuevo perfil..."
            className="flex-grow bg-white border-2 border-gray-300 rounded p-2 focus:border-accent outline-none text-sm"
          />
          <button onClick={handleSaveCurrent} className="font-semibold py-2 px-4 rounded-lg bg-accent text-text-dark">
            Guardar
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Perfiles Guardados</h3>
        <ul className="space-y-2">
          {Object.keys(profiles).map(name => (
            <li key={name} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="font-semibold">{name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveProfileName(name)}
                  disabled={name === activeProfileName}
                  className="font-semibold py-1 px-3 rounded-lg bg-blue-500 text-white disabled:opacity-50"
                >
                  {name === activeProfileName ? 'Activo' : 'Cargar'}
                </button>
                <button onClick={() => handleDelete(name)} className="font-semibold py-1 px-3 rounded-lg bg-red-500 text-white">
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};