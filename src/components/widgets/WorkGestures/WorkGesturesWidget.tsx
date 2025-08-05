import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { Hand, Users, User, MessageSquare } from 'lucide-react';
import './WorkGestures.css';

// 1. Definimos los datos de nuestras tarjetas
const gestures = [
  {
    id: 'silence',
    label: 'Silencio',
    icon: <Hand size={48} />,
    description: 'Trabajo individual en silencio.',
    className: 'card-silence',
  },
  {
    id: 'pairs',
    label: 'Parejas',
    icon: <Users size={48} />,
    description: 'Trabajo colaborativo en parejas.',
    className: 'card-pairs',
  },
  {
    id: 'teams',
    label: 'Equipos',
    icon: <User size={48} />,
    description: 'Trabajo en pequeños grupos.',
    className: 'card-teams',
  },
  {
    id: 'plenary',
    label: 'Plenaria',
    icon: <MessageSquare size={48} />,
    description: 'Puesta en común con todo el grupo.',
    className: 'card-plenary',
  },
];

type Gesture = typeof gestures[0];

// El componente principal del widget
export const WorkGesturesWidget: FC = () => {
  const [selectedGesture, setSelectedGesture] = useState<Gesture | null>(null);

  // Vista para cuando una tarjeta está seleccionada (en grande)
  if (selectedGesture) {
    return (
      <div 
        className={`work-gestures-widget selected-view ${selectedGesture.className}`}
        onClick={() => setSelectedGesture(null)} // Click en cualquier lugar para volver
      >
        <div className="selected-card">
          <div className="selected-icon">{selectedGesture.icon}</div>
          <h2 className="selected-label">{selectedGesture.label}</h2>
          <p className="selected-description">{selectedGesture.description}</p>
        </div>
        <button className="back-button">Volver</button>
      </div>
    );
  }

  // Vista principal con la rejilla de tarjetas
  return (
    <div className="work-gestures-widget">
      <div className="card-grid">
        {gestures.map((gesture) => (
          <div
            key={gesture.id}
            className={`gesture-card ${gesture.className}`}
            onClick={() => setSelectedGesture(gesture)}
          >
            <div className="card-icon">{gesture.icon}</div>
            <span className="card-label">{gesture.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Objeto de configuración del widget
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'work-gestures',
  title: 'Gestos de Trabajo',
  icon: <img src="/escritorio/icons/WorkGestures.png" alt="Gestos de trabajo" width="52" height="52" />,
  defaultSize: { width: 450, height: 450 },
};