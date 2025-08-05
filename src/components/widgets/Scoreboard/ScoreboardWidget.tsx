import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Plus, Minus, UserPlus, RotateCcw, Trash2 } from 'lucide-react';
import './Scoreboard.css';

// Interfaz para cada jugador
interface Player {
  id: number;
  name: string;
  score: number;
}

// El componente principal del Marcador
export const ScoreboardWidget: FC = () => {
  const [players, setPlayers] = useLocalStorage<Player[]>('scoreboard-players', []);
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim() === '') return;
    const newPlayer: Player = {
      id: Date.now(),
      name: newPlayerName.trim(),
      score: 0,
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updateScore = (id: number, amount: number) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, score: p.score + amount } : p
    ));
  };

  const resetAllScores = () => {
    if (window.confirm('¿Seguro que quieres reiniciar todos los marcadores a cero?')) {
      setPlayers(players.map(p => ({ ...p, score: 0 })));
    }
  };

  return (
    <div className="scoreboard-widget">
      <div className="player-list">
        {players.length === 0 ? (
          <p className="empty-message">Añade un equipo o jugador para empezar.</p>
        ) : (
          players.map(player => (
            <div key={player.id} className="player-row">
              <span className="player-name">{player.name}</span>
              <div className="player-controls">
                {/* --- LÍNEAS CORREGIDAS --- */}
                <button onClick={() => updateScore(player.id, -1)} className="score-button minus">
                  <Minus size={16} />
                </button>
                <span className="player-score">{player.score}</span>
                <button onClick={() => updateScore(player.id, 1)} className="score-button plus">
                  <Plus size={16} />
                </button>
                <button onClick={() => removePlayer(player.id)} className="remove-button">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="scoreboard-footer">
        <div className="add-player-form">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nombre del equipo o jugador..."
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button onClick={addPlayer}>
            <UserPlus size={18} /> Añadir
          </button>
        </div>
        <button onClick={resetAllScores} className="reset-button" title="Reiniciar todo a cero">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

// Objeto de configuración del widget
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'scoreboard',
  title: 'Marcador de Puntos',
  icon: <img src="/escritorio/icons/Scoreboard.png" alt="Marcador de puntos" width="52" height="52" />,
  defaultSize: { width: 400, height: 450 },
};