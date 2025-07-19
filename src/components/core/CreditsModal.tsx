import React from 'react';
import { X } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white/90 backdrop-blur-xl text-text-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Créditos, Licencia y Agradecimientos</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10"><X size={20}/></button>
        </header>

        <div className="p-6 overflow-y-auto text-sm space-y-4">
          <p>
            El proyecto original <strong>Escritorio Interactivo para el Aula</strong> y su idea pertenecen a <strong>María Teresa González</strong>.
            Puedes visitar la aplicación original en: <a href="https://mtgonzalezm.github.io/escritorio-interactivo-aula/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://mtgonzalezm.github.io/escritorio-interactivo-aula/</a>
          </p>
          <p>
            Esta versión es una migración a <strong>React.js</strong> realizada por <strong>Pablo G. Guízar</strong> con ayuda de <strong>Gemini</strong>. El repositorio de esta migración se encuentra en: <a href="https://github.com/PabloGGuizar/escritorio-interactivo-aula/tree/migracion-react" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub - PabloGGuizar/escritorio-interactivo-aula</a>
          </p>
          <hr />
          <p>
            Tanto el proyecto original como esta migración están indexados en el <strong>Repositorio de aplicaciones educativas</strong>, una colección de recursos creados por la comunidad <strong>Vibe Coding Educativo</strong>.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Consulta más aplicaciones de esta comunidad en: <a href="https://vibe-coding-educativo.github.io/app_edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Repositorio Vibe Coding Educativo</a>
            </li>
            <li>
              Únete a la comunidad en Telegram: <a href="https://t.me/vceduca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">t.me/vceduca</a>
            </li>
          </ul>
           <hr />
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold">Este proyecto se adhiere al</p>
            <a href="https://conocimiento-abierto.github.io/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-600 hover:underline">Decálogo del Conocimiento Abierto</a>
            <p className="mt-4">
              <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer" className="inline-block" title="Creative Commons Attribution-ShareAlike 4.0 International License">
                <img src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" alt="Licencia Creative Commons BY-SA 4.0" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};