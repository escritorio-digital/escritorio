import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Dices, Info } from 'lucide-react';
import type { WidgetConfig } from '../../../types';
import './Dice.css';

// ... (Interfaz DieState sin cambios)
interface DieState {
  id: number;
  value: number;
  isRolling: boolean;
}

export const DiceWidget: FC = () => {
  const [numDice, setNumDice] = useState(2);
  const [dice, setDice] = useState<DieState[]>([]);
  const [total, setTotal] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  
  // 1. Inicializa la referencia como null
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 2. Crea el objeto de Audio solo en el lado del cliente (en el navegador)
  useEffect(() => {
    audioRef.current = new Audio('/escritorio-interactivo-aula/sounds/dice-142528.mp3');
  }, []);


  const rollDice = () => {
    // Aseguramos que el audio esté listo y no se esté reproduciendo
    if (isRolling || !audioRef.current) return;
    
    setIsRolling(true);

    // Reproduce el sonido
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
        // Opcional: Maneja errores si la reproducción falla por alguna razón
        console.error("Error al reproducir el audio:", error);
    });

    const rollingDice = Array.from({ length: numDice }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 6) + 1,
      isRolling: true,
    }));
    setDice(rollingDice);
    setTotal(0);

    setTimeout(() => {
      let finalTotal = 0;
      const finalDice = rollingDice.map(d => {
        finalTotal += d.value;
        return { ...d, isRolling: false };
      });
      setDice(finalDice);
      setTotal(finalTotal);
      setIsRolling(false);
    }, 1500);
  };
  
  // 3. Hemos eliminado el useEffect que llamaba a rollDice() al inicio.

  // ... (El resto del componente: handleNumDiceChange, el componente Die y el JSX se mantienen exactamente igual)
  const handleNumDiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRolling) return;
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 10) {
        setNumDice(value);
    }
  };

  const Die: FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
    const face = (num: number) => (
        <div className={`face face-${num}`}>
        {Array.from({ length: num }).map((_, i) => <span key={i} className="dot" />)}
        </div>
    );
    return (
        <div className="die-scene">
        <div className={`die-3d ${isRolling ? 'rolling' : `show-${value}`}`}>
            {face(1)}
            {face(2)}
            {face(3)}
            {face(4)}
            {face(5)}
            {face(6)}
        </div>
        </div>
    );
  };

  return (
    <div className="dice-widget">
        <div className="controls">
            <div className="dice-selector">
                <label htmlFor="num-dice-input">Número de Dados:</label>
                <input
                    id="num-dice-input"
                    type="number"
                    value={numDice}
                    onChange={handleNumDiceChange}
                    min="1"
                    max="10"
                    disabled={isRolling}
                />
            </div>
            <button onClick={rollDice} className="roll-button" disabled={isRolling}>
                <Dices size={20} />
                {isRolling ? 'Lanzando...' : 'Lanzar Dados'}
            </button>
        </div>

        <div className="dice-container">
            {dice.map(d => <Die key={d.id} value={d.value} isRolling={d.isRolling} />)}
        </div>

        {!isRolling && total > 0 && (
            <div className="total">
                Total: <span>{total}</span>
            </div>
        )}

        <a
            href="https://pixabay.com/users/u_qpfzpydtro-29496424/?utm_source=link-attribution&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="attribution-button"
            title="Sound Effect by u_qpfzpydtro from Pixabay"
            onClick={e => e.stopPropagation()}
        >
            <Info size={12} />
        </a>
    </div>
  );
};

// ... (La configuración del widget no cambia)
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'dice-roller',
  title: 'Dados 3D',
  icon: <img src="/escritorio/icons/Dice.png" alt="Dados 3D" width="52" height="52" />,
  defaultSize: { width: 400, height: 300 },
};