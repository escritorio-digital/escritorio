import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Trash2 } from 'lucide-react';
import './GlobalClocks.css';

// --- Lista de Zonas Horarias (Formato IANA) ---
const TIMEZONES = [
  { city: 'Los Ángeles', timezone: 'America/Los_Angeles' },
  { city: 'Nueva York', timezone: 'America/New_York' },
  { city: 'Londres', timezone: 'Europe/London' },
  { city: 'París', timezone: 'Europe/Paris' },
  { city: 'Madrid', timezone: 'Europe/Madrid' }, // <-- Madrid añadido aquí
  { city: 'Tokio', timezone: 'Asia/Tokyo' },
  { city: 'Sídney', timezone: 'Australia/Sydney' },
  { city: 'Ciudad de México', timezone: 'America/Mexico_City' },
  { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
  { city: 'Moscú', timezone: 'Europe/Moscow' },
  { city: 'Dubái', timezone: 'Asia/Dubai' },
  { city: 'Shanghái', timezone: 'Asia/Shanghai' },
];

// Función para obtener la diferencia horaria en horas
const getOffset = (timeZone: string) => {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
};

// El componente principal del Reloj Mundial
export const GlobalClocksWidget: FC = () => {
  const [selectedTimezones, setSelectedTimezones] = useLocalStorage<string[]>('global-clocks-selection', [
    'Europe/London',
    'Asia/Tokyo',
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newTimezone, setNewTimezone] = useState<string>('America/New_York');

  // Actualiza la hora cada segundo
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const addClock = () => {
    if (newTimezone && !selectedTimezones.includes(newTimezone)) {
      setSelectedTimezones([...selectedTimezones, newTimezone]);
    }
  };

  const removeClock = (timezone: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };
  
  const localOffset = getOffset(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div className="global-clocks-widget">
      <div className="clocks-list">
        {/* Reloj Local del Usuario */}
        <div className="clock-row local">
          <div className="city-info">
            <span className="city-name">Tu Hora Local</span>
            <span className="offset">GTM{localOffset >= 0 ? '+' : ''}{localOffset}</span>
          </div>
          <span className="time-display">{currentTime.toLocaleTimeString()}</span>
        </div>

        {/* Relojes Seleccionados */}
        {selectedTimezones.map(tz => {
          const cityData = TIMEZONES.find(t => t.timezone === tz);
          if (!cityData) return null;
          
          const offset = getOffset(tz);
          const offsetDiff = offset - localOffset;

          return (
            <div key={tz} className="clock-row">
              <div className="city-info">
                <span className="city-name">{cityData.city}</span>
                <span className="offset">{offsetDiff >= 0 ? '+' : ''}{offsetDiff}h</span>
              </div>
              <span className="time-display">{currentTime.toLocaleTimeString('es-ES', { timeZone: tz })}</span>
              <button onClick={() => removeClock(tz)} className="remove-clock-btn"><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>

      <div className="clocks-footer">
        <select value={newTimezone} onChange={e => setNewTimezone(e.target.value)}>
          {TIMEZONES.filter(tz => !selectedTimezones.includes(tz.timezone)).map(tz => (
            <option key={tz.timezone} value={tz.timezone}>{tz.city}</option>
          ))}
        </select>
        <button onClick={addClock}>Añadir Reloj</button>
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'global-clocks',
  title: 'Relojes Mundiales',
  icon: <img src="/escritorio/icons/GlobalClocks.png" alt="Relojes mundiales" width="52" height="52" />,
  defaultSize: { width: 350, height: 400 },
};