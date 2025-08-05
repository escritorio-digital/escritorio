import type { FC } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';

// Definimos los posibles estados del semáforo
type LightState = 'red' | 'yellow' | 'green';

// Componente para una sola luz del semáforo
const Light: FC<{ color: string; active: boolean }> = ({ color, active }) => {
  const baseStyle = 'w-20 h-20 rounded-full border-4 border-gray-700 transition-all duration-300';
  
  // Tailwind necesita clases completas, por eso este truco para los colores dinámicos
  const colorVariants = {
    red: 'bg-red-500 shadow-[0_0_20px_5px_var(--tw-shadow-color)] shadow-red-400',
    yellow: 'bg-yellow-500 shadow-[0_0_20px_5px_var(--tw-shadow-color)] shadow-yellow-400',
    green: 'bg-green-500 shadow-[0_0_20px_5px_var(--tw-shadow-color)] shadow-green-400',
  };

  const inactiveStyle = 'bg-gray-500 opacity-30';
  const dynamicActiveStyle = active ? colorVariants[color as keyof typeof colorVariants] : inactiveStyle;

  return <div className={`${baseStyle} ${dynamicActiveStyle}`} />;
};


export const TrafficLightWidget: FC = () => {
  // El estado persiste en el almacenamiento local
  const [activeLight, setActiveLight] = useLocalStorage<LightState>('traffic-light-state', 'red');

  const handleClick = () => {
    // Ciclo: red -> green -> yellow -> red
    if (activeLight === 'red') {
      setActiveLight('green');
    } else if (activeLight === 'green') {
      setActiveLight('yellow');
    } else {
      setActiveLight('red');
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center cursor-pointer  p-4"
      onClick={handleClick}
      title="Haz clic para cambiar de color"
    >
      <div className="bg-gray-800 p-4 rounded-2xl flex flex-col gap-4 border-4 border-gray-600">
        <Light color="red" active={activeLight === 'red'} />
        {/* ¡AQUÍ ESTABA EL ERROR CORREGIDO! */}
        <Light color="yellow" active={activeLight === 'yellow'} />
        <Light color="green" active={activeLight === 'green'} />
      </div>
    </div>
  );
};

// Configuración para que el sistema detecte el widget automáticamente
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'traffic-light',
  title: 'Semáforo',
  icon: <img src="/escritorio/icons/TrafficLight.png" alt="Semáforo" width="52" height="52" />,
  defaultSize: { width: 150, height: 350 },
};
