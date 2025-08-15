import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { Trash2, Plus, Play, Expand, Minimize } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import './RandomSpinner.css';

interface SpinnerOption {
  text: string;
  color: string;
}

const getRandomColor = () => `hsl(${Math.random() * 360}, 70%, 80%)`;

export const RandomSpinnerWidget: FC = () => {
  const { t } = useTranslation();
  const [options, setOptions] = useLocalStorage<SpinnerOption[]>('spinner-options', []);
  
  useEffect(() => {
    const storedOptions = window.localStorage.getItem('spinner-options');
    if (storedOptions === null) {
        const defaultOptions = t('widgets.random_spinner.default_options', { returnObjects: true });
        if (Array.isArray(defaultOptions)) {
            setOptions(defaultOptions.map((opt: { text: string }) => ({ ...opt, color: getRandomColor() })));
        }
    }
  }, [t, setOptions]);

  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [size, setSize] = useState(300);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const resizeObserver = new ResizeObserver(() => {
      if (container) {
        const newSize = Math.min(container.offsetWidth, container.offsetHeight);
        setSize(newSize);
      }
    });
  
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    
    const numOptions = options.length;
    if (numOptions === 0) {
        ctx.clearRect(0, 0, size, size);
        return;
    };

    const arcSize = (2 * Math.PI) / numOptions;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);
    ctx.font = `bold ${Math.max(10, size * 0.05)}px sans-serif`;

    options.forEach((option, i) => {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.fillStyle = option.color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.fillStyle = '#333';
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      const text = option.text.length > 15 ? option.text.substring(0, 12) + '...' : option.text;
      ctx.fillText(text, radius - 10, 0);
      ctx.restore();
    });
  }, [options, size]);

  const addOption = () => {
    if (newOption.trim() && options.length < 20) {
      setOptions([...options, { text: newOption.trim(), color: getRandomColor() }]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(options[index].text);
  };

  const finishEditing = (index: number) => {
    if (editingText.trim()) {
      const updatedOptions = [...options];
      updatedOptions[index].text = editingText.trim();
      setOptions(updatedOptions);
    }
    setEditingIndex(null);
    setEditingText('');
  };

  const spin = () => {
    if (isSpinning || options.length < 2) return;
    setIsSpinning(true);
    setResult(null);
    const spinAngleStart = Math.random() * 20 + 20;
    const spinTimeTotal = (Math.random() * 3 + 4) * 1000;
    let start = 0;
    const animate = (time: number) => {
      if (!start) start = time;
      const timePassed = time - start;
      const progress = Math.min(timePassed / spinTimeTotal, 1);
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
      const angle = spinAngleStart * easeOut(progress);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.transform = `rotate(${angle}rad)`;
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalAngle = angle % (2 * Math.PI);
        const arcSize = (2 * Math.PI) / options.length;
        const winnerIndex = Math.floor(((2 * Math.PI) - finalAngle) / arcSize) % options.length;
        setResult(options[winnerIndex].text);
        setIsSpinning(false);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className={`random-spinner-widget ${isFullscreen ? 'fullscreen' : ''}`}>
      <div ref={containerRef} className="spinner-area">
        <canvas ref={canvasRef} className="spinner-canvas" />
        <div className="spinner-pointer" />
        <button onClick={spin} disabled={isSpinning || options.length < 2} className="spin-button">
          <Play size={32} />
        </button>
        {result && !isSpinning && (
          <div className="spinner-result" onClick={() => setResult(null)}>
            <span>{result}</span>
            <small>{t('widgets.random_spinner.result_overlay_text')}</small>
          </div>
        )}
        <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="fullscreen-button"
            title={isFullscreen ? t('widgets.random_spinner.restore_view_button_title') : t('widgets.random_spinner.fullscreen_button_title')}
        >
            {isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}
        </button>
      </div>
      <div className="options-manager">
        <div className="options-header">
            <h3>{t('widgets.random_spinner.options_header')}</h3>
        </div>
        <div className="add-option">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={t('widgets.random_spinner.add_option_placeholder')}
            maxLength={20}
            onKeyPress={(e) => e.key === 'Enter' && addOption()}
          />
          <button onClick={addOption}><Plus size={18} /></button>
        </div>
        <ul className="options-list">
          {options.map((option, index) => (
            <li key={index} onDoubleClick={() => startEditing(index)}>
              <span className="option-color" style={{ backgroundColor: option.color }} />
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => finishEditing(index)}
                  onKeyPress={(e) => e.key === 'Enter' && finishEditing(index)}
                  autoFocus
                  className="edit-input"
                />
              ) : (
                <span className="option-text">{option.text}</span>
              )}
              <button onClick={() => removeOption(index)}><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const WidgetIcon: FC = () => {
    const { t } = useTranslation();
    return <img src="/icons/RandomSpinner.png" alt={t('widgets.random_spinner.icon_alt')} width="52" height="52" />;
}

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'random-spinner',
  title: 'widgets.random_spinner.title',
  icon: <WidgetIcon />,
  defaultSize: { width: 550, height: 420 },
};