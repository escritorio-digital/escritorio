import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import './Stopwatch.css';

// Función para formatear el tiempo de milisegundos a MM:SS.ms
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
  const milliseconds = Math.floor((time / 10) % 100).toString().padStart(2, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

// El componente principal del Cronómetro
export const StopwatchWidget: FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      const startTime = Date.now() - time;
      intervalRef.current = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Actualiza cada 10ms para mayor precisión
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, time]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isActive) {
      setLaps([time, ...laps]);
    }
  };

  return (
    <div className="stopwatch-widget">
      <div className="time-display-container">
        <span className="time-display-main">{formatTime(time)}</span>
      </div>

      <div className="controls-container">
        <button onClick={handleReset} className="control-button reset">
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
        <button onClick={handleStartStop} className={`control-button start-stop ${isActive ? 'active' : ''}`}>
          {isActive ? <Pause size={24} /> : <Play size={24} />}
          <span>{isActive ? 'Pausa' : 'Inicio'}</span>
        </button>
        <button onClick={handleLap} disabled={!isActive && time === 0} className="control-button lap">
          <Flag size={20} />
          <span>Vuelta</span>
        </button>
      </div>
      
      <div className="laps-container">
        <ul className="laps-list">
          {laps.map((lap, index) => (
            <li key={index} className="lap-item">
              <span>Vuelta {laps.length - index}</span>
              <span>{formatTime(lap)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'stopwatch',
  title: 'Cronómetro',
  icon: <img src="/escritorio/icons/Stopwatch.png" alt="Cronometro" width="52" height="52" />,
  defaultSize: { width: 320, height: 450 },
};