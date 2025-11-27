
import React, { useState, useEffect } from 'react';

interface GameProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
  onGameOver: (finalScore: number) => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥥'];

export const MemoryGame: React.FC<GameProps> = ({ onScoreUpdate, isActive, onGameOver }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // Initialize game
  useEffect(() => {
    const gameEmojis = [...EMOJIS, ...EMOJIS]; // Pairs
    // Shuffle
    for (let i = gameEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameEmojis[i], gameEmojis[j]] = [gameEmojis[j], gameEmojis[i]];
    }
    
    setCards(gameEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    })));
  }, []);

  // Handle matching logic
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        
        const newScore = score + 100;
        setScore(newScore);
        onScoreUpdate(newScore);

        // Check win condition
        if (newCards.every(c => c.isMatched)) {
          // Bonus for clearing board
          onScoreUpdate(newScore + 500);
          setTimeout(() => onGameOver(newScore + 500), 1000);
        }
      } else {
        // No match
        const timer = setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flippedIndices, cards, isActive]);

  const handleCardClick = (index: number) => {
    if (!isActive || cards[index].isMatched || cards[index].isFlipped || flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedIndices([...flippedIndices, index]);
  };

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col justify-center">
      <div className="grid grid-cols-4 gap-3 p-4">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={card.isMatched}
            className={`
              aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 transform
              ${card.isFlipped || card.isMatched 
                ? 'bg-indigo-600 rotate-0' 
                : 'bg-slate-700 hover:bg-slate-600 rotate-y-180 text-transparent'}
              ${card.isMatched ? 'opacity-50 scale-95 ring-2 ring-green-400' : 'shadow-lg'}
            `}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
      <p className="text-center text-slate-400 mt-4 text-sm animate-pulse">
        Find matching pairs!
      </p>
    </div>
  );
};
