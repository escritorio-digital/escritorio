import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { WidgetConfig } from '../../../types';
// 'Shuffle' ha sido eliminado de esta línea
import { Upload, RotateCcw } from 'lucide-react'; 
import './MemoryGame.css';

// Interfaz para representar cada carta
interface Card {
  id: number;
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// El componente principal del Memorama
export const MemoryGameWidget: FC = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const setupGame = (imageFiles: FileList) => {
    const imagePromises: Promise<string>[] = [];
    Array.from(imageFiles).forEach(file => {
      if (file.type.startsWith('image/')) {
        imagePromises.push(new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        }));
      }
    });

    Promise.all(imagePromises).then(images => {
      const gameCards: Card[] = [];
      images.forEach((image, index) => {
        gameCards.push({ id: index * 2, pairId: index, content: image, isFlipped: false, isMatched: false });
        gameCards.push({ id: index * 2 + 1, pairId: index, content: image, isFlipped: false, isMatched: false });
      });

      setCards(gameCards.sort(() => Math.random() - 0.5));
      setMoves(0);
      setFlippedIndices([]);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 1) {
      setupGame(e.target.files);
    } else {
      alert(t('widgets.memory_game.min_images_alert'));
    }
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || flippedIndices.length === 2) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        const newCards = cards.map(card => 
          card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card
        );
        setCards(newCards);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedIndices]);
  
  const isGameWon = cards.length > 0 && cards.every(c => c.isMatched);

  if (cards.length === 0) {
    return (
      <div className="memory-placeholder">
        <Upload size={48} />
        <p>{t('widgets.memory_game.upload_prompt')}</p>
        <small>{t('widgets.memory_game.upload_rule')}</small>
        <input type="file" multiple accept="image/*" onChange={handleFileSelect} />
      </div>
    );
  }

  return (
    <div className="memory-game-widget">
      <div className="game-board" style={{gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`}}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">
                <img src={card.content} alt={`par ${card.pairId}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="game-footer">
        <span>{t('widgets.memory_game.moves', { count: moves })}</span>
        <button onClick={() => setCards([])}><RotateCcw size={16}/> {t('widgets.memory_game.start_over')}</button>
      </div>
       {isGameWon && (
        <div className="game-won-overlay">
          <h2>{t('widgets.memory_game.win_title')}</h2>
          <p>{t('widgets.memory_game.win_message', { moves })}</p>
          <button onClick={() => setCards([])}>{t('widgets.memory_game.play_again')}</button>
        </div>
      )}
    </div>
  );
};

const WidgetIcon: FC = () => {
  const { t } = useTranslation();
  return <img src="/icons/MemoryGame.png" alt={t('widgets.memory_game.icon_alt')} width="52" height="52" />;
}

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'memory-game',
  title: 'widgets.memory_game.title',
  icon: <WidgetIcon />,
  defaultSize: { width: 500, height: 550 },
};