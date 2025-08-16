import React, { useState } from 'react';
import { ChevronUp, ChevronsUpDown } from 'lucide-react';
import type { ProfileCollection } from '../../types';
import { useTranslation } from 'react-i18next';

// Definimos las propiedades que nuestro componente necesita
interface ProfileSwitcherProps {
  profiles: ProfileCollection;
  activeProfileName: string;
  setActiveProfileName: (name: string) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  profiles,
  activeProfileName,
  setActiveProfileName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const profileNames = Object.keys(profiles);

  const handleProfileSelect = (name: string) => {
    setActiveProfileName(name);
    setIsOpen(false);
  };

  return (
    // Contenedor principal en la esquina inferior derecha
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="relative">
        {/* Menú desplegable que aparece cuando isOpen es true */}
        {isOpen && (
          <div className="absolute bottom-full mb-2 w-56 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-black/10">
            <ul className="p-1">
              {profileNames.map(name => (
                <li key={name}>
                  <button
                    onClick={() => handleProfileSelect(name)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-text-dark transition-colors"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* El botón principal que siempre está visible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-56 h-12 px-4 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors flex items-center justify-between"
          title={t('settings.profiles.switcher_title')}
        >
          <span className="font-semibold">{activeProfileName}</span>
          {/* El icono cambia si el menú está abierto o cerrado */}
          {isOpen ? <ChevronUp size={20} /> : <ChevronsUpDown size={20} />}
        </button>
      </div>
    </div>
  );
};
