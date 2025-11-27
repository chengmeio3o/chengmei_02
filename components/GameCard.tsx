import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  variant?: 'compact' | 'full';
  fontSizeScale?: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, variant = 'full', fontSizeScale = 1 }) => {
  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onClick(game)}
        className="flex-shrink-0 w-32 flex flex-col gap-2 cursor-pointer group"
      >
        <div className={`w-32 h-32 rounded-2xl ${game.color} flex items-center justify-center text-5xl shadow-lg shadow-slate-900/50 group-hover:scale-105 transition-transform`}>
          {game.icon}
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 truncate" style={{ fontSize: `${0.9 * fontSizeScale}rem` }}>{game.title}</h4>
          <p className="text-slate-500 text-xs truncate">{game.category}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(game)}
      className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
    >
      <div className={`w-16 h-16 rounded-xl ${game.color} flex items-center justify-center text-3xl flex-shrink-0`}>
        {game.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-100 truncate" style={{ fontSize: `${1 * fontSizeScale}rem` }}>{game.title}</h3>
          <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
            <span>⭐</span> {game.rating}
          </div>
        </div>
        <p className="text-slate-400 truncate mt-1" style={{ fontSize: `${0.875 * fontSizeScale}rem` }}>{game.description}</p>
        <div className="flex gap-2 mt-2">
           {game.tags.map(tag => (
             <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-full border border-slate-700">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
};
