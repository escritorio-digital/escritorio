import type { FC } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import { useTranslation } from 'react-i18next';

type LightState = 'red' | 'yellow' | 'green';

const Light: FC<{ color: string; active: boolean }> = ({ color, active }) => {
  const baseStyle = 'w-20 h-20 rounded-full border-4 border-gray-700 transition-all duration-300';
  
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
  const { t } = useTranslation();
  const [activeLight, setActiveLight] = useLocalStorage<LightState>('traffic-light-state', 'red');

  const handleClick = () => {
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
      className="flex flex-col items-center justify-center cursor-pointer p-4"
      onClick={handleClick}
      title={t('widgets.traffic_light.tooltip')}
    >
      <div className="bg-gray-800 p-4 rounded-2xl flex flex-col gap-4 border-4 border-gray-600">
        <Light color="red" active={activeLight === 'red'} />
        <Light color="yellow" active={activeLight === 'yellow'} />
        <Light color="green" active={activeLight === 'green'} />
      </div>
    </div>
  );
};

const WidgetIcon: FC = () => {
    const { t } = useTranslation();
    return <img src="/icons/TrafficLight.png" alt={t('widgets.traffic_light.icon_alt')} width="52" height="52" />;
}

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'traffic-light',
  title: 'widgets.traffic_light.title',
  icon: <WidgetIcon />,
  defaultSize: { width: 150, height: 350 },
};