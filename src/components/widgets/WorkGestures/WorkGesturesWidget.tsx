import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { useTranslation } from 'react-i18next';
import { Hand, Users, User, MessageSquare } from 'lucide-react';
import './WorkGestures.css';

const gestureData = [
  {
    id: 'silence',
    icon: <Hand size={48} />,
    className: 'card-silence',
  },
  {
    id: 'pairs',
    icon: <Users size={48} />,
    className: 'card-pairs',
  },
  {
    id: 'teams',
    icon: <User size={48} />,
    className: 'card-teams',
  },
  {
    id: 'plenary',
    icon: <MessageSquare size={48} />,
    className: 'card-plenary',
  },
];

interface Gesture {
    id: string;
    icon: React.ReactNode;
    className: string;
    label: string;
    description: string;
}

export const WorkGesturesWidget: FC = () => {
  const { t } = useTranslation();
  const [selectedGesture, setSelectedGesture] = useState<Gesture | null>(null);

  const gestures: Gesture[] = gestureData.map(g => ({
      ...g,
      label: t(`widgets.work_gestures.gestures.${g.id}.label`),
      description: t(`widgets.work_gestures.gestures.${g.id}.description`)
  }));

  if (selectedGesture) {
    return (
      <div 
        className={`work-gestures-widget selected-view ${selectedGesture.className}`}
        onClick={() => setSelectedGesture(null)}
      >
        <div className="selected-card">
          <div className="selected-icon">{selectedGesture.icon}</div>
          <h2 className="selected-label">{selectedGesture.label}</h2>
          <p className="selected-description">{selectedGesture.description}</p>
        </div>
        <button className="back-button">{t('widgets.work_gestures.back_button')}</button>
      </div>
    );
  }

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

const WidgetIcon: FC = () => {
    const { t } = useTranslation();
    return <img src="/icons/WorkGestures.png" alt={t('widgets.work_gestures.icon_alt')} width="52" height="52" />;
}

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'work-gestures',
  title: 'widgets.work_gestures.title',
  icon: <WidgetIcon />,
  defaultSize: { width: 450, height: 450 },
};