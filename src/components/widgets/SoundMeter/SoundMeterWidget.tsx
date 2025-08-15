import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react'; // <-- Se ha separado la importación del tipo FC
import { useTranslation } from 'react-i18next';
import type { WidgetConfig } from '../../../types';
import { Mic, MicOff } from 'lucide-react';
import './SoundMeter.css';

// ... (El resto del archivo no necesita cambios)
type NoiseLevel = 'silence' | 'conversation' | 'noise';

interface LevelInfo {
  labelKey: string;
  emoji: string;
  className: string;
}

const LEVEL_CONFIG: Record<NoiseLevel, LevelInfo> = {
  silence: {
    labelKey: 'widgets.sound_meter.silence',
    emoji: '🤫',
    className: 'level-silence',
  },
  conversation: {
    labelKey: 'widgets.sound_meter.conversation',
    emoji: '🗣️',
    className: 'level-conversation',
  },
  noise: {
    labelKey: 'widgets.sound_meter.noise',
    emoji: '💥',
    className: 'level-noise',
  },
};


export const SoundMeterWidget: FC = () => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState<NoiseLevel>('silence');
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const animationFrameRef = useRef<number | undefined>(undefined);

  const getLevelFromVolume = (volume: number): NoiseLevel => {
    if (volume < 15) return 'silence';
    if (volume < 45) return 'conversation';
    return 'noise';
  };
  
  const startMeter = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(t('widgets.sound_meter.no_audio_support'));
        setPermission('denied');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setPermission('granted');
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setCurrentLevel(getLevelFromVolume(average));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();

    } catch (err) {
      console.error(t('widgets.sound_meter.microphone_error'), err);
      setPermission('denied');
    }
  };

  const stopMeter = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  useEffect(() => {
    return () => stopMeter();
  }, []);

  const renderContent = () => {
    if (permission === 'granted') {
      const { labelKey, emoji, className } = LEVEL_CONFIG[currentLevel];
      return (
        <div className={`level-card ${className}`}>
          <span className="emoji">{emoji}</span>
          <span className="label">{t(labelKey)}</span>
        </div>
      );
    }
    
    return (
      <div className="permission-screen">
        {permission === 'denied' ? (
          <>
            <MicOff size={48} className="text-red-500" />
            <p>{t('widgets.sound_meter.access_denied')}</p>
            <small>{t('widgets.sound_meter.enable_browser_settings')}</small>
          </>
        ) : (
          <>
            <Mic size={48} />
            <p>{t('widgets.sound_meter.permission_needed')}</p>
            <button onClick={startMeter} className="permission-button">
              {t('widgets.sound_meter.activate_meter')}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="sound-meter-widget">
      {renderContent()}
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'sound-meter',
  title: 'widgets.sound_meter.title',
  icon: <img src="/icons/SoundMeter.png" alt="Medidor de ruido" width="52" height="52" />,
  defaultSize: { width: 300, height: 300 },
};