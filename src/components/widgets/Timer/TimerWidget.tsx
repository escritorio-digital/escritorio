import { useState, useEffect } from 'react';
import type { FC } from 'react'; // <-- CORRECCIÓN 2: Importación de tipo
import { Play, Pause, RotateCw } from 'lucide-react';
import type { WidgetConfig } from '../../../types';

export const TimerWidget: FC = () => {
    const [minutesInput, setMinutesInput] = useState(5);
    const [secondsInput, setSecondsInput] = useState(0);
    const [totalDuration, setTotalDuration] = useState(300);
    const [remainingSeconds, setRemainingSeconds] = useState(300);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // CORRECCIÓN 3: Dejamos que TypeScript infiera el tipo correcto para 'interval'
        let interval: ReturnType<typeof setInterval> | undefined = undefined;
        
        if (isActive && remainingSeconds > 0) {
            interval = setInterval(() => {
                setRemainingSeconds(secs => secs - 1);
            }, 1000);
        } else if (remainingSeconds === 0 && isActive) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, remainingSeconds]);

    const handleTimeChange = () => {
        const total = (minutesInput * 60) + secondsInput;
        setTotalDuration(total);
        if (!isActive) {
            setRemainingSeconds(total);
        }
    };

    useEffect(handleTimeChange, [minutesInput, secondsInput]);

    const toggleTimer = () => {
        if (totalDuration <= 0) return;
        if (remainingSeconds === 0) {
           handleReset();
        }
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setRemainingSeconds(totalDuration);
    };

    const formatTime = (timeInSeconds: number) => {
        const mins = Math.floor(timeInSeconds / 60);
        const secs = timeInSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-text-dark p-4">
            <div className="text-6xl font-bold font-mono mb-4">
                {remainingSeconds === 0 && !isActive ? "¡FIN!" : formatTime(remainingSeconds)}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
                <input 
                    type="number" 
                    className="w-20 text-center bg-custom-bg border-2 border-accent rounded p-1"
                    value={minutesInput}
                    onChange={e => setMinutesInput(Math.max(0, parseInt(e.target.value) || 0))}
                    disabled={isActive}
                />
                <span className="text-2xl font-bold">:</span>
                <input 
                    type="number" 
                    className="w-20 text-center bg-custom-bg border-2 border-accent rounded p-1"
                    value={secondsInput}
                    onChange={e => setSecondsInput(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    disabled={isActive}
                />
            </div>

            <div className="flex gap-4">
                <button onClick={toggleTimer} className="p-3 bg-accent rounded-full hover:bg-[#8ec9c9]">
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={handleReset} className="p-3 bg-custom-bg border-2 border-accent rounded-full hover:bg-accent/50">
                    <RotateCw size={24} />
                </button>
            </div>
        </div>
    );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
    id: 'timer',
    title: 'Temporizador',
    icon: <img src="/escritorio/icons/Timer.png" alt="Temporizador" width="52" height="52" />,
    defaultSize: { width: 300, height: 300 },
};