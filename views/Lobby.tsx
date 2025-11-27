import React, { useMemo } from 'react';
import { Game } from '../types';
import { MOCK_GAMES } from '../services/mockData';
import { GameCard } from '../components/GameCard';

interface LobbyProps {
  onGameSelect: (game: Game) => void;
  fontSizeScale: number;
}

export const Lobby: React.FC<LobbyProps> = ({ onGameSelect, fontSizeScale }) => {
  const categories = [
    { id: 'puzzle', name: '🧩 Puzzle', desc: 'Relax & Think' },
    { id: 'competitive', name: '🏆 Competitive', desc: 'Challenge Others' },
    { id: 'simulation', name: '🌱 Simulation', desc: 'Build & Grow' },
  ];

  const popularGames = useMemo(() => [...MOCK_GAMES].sort((a, b) => b.playCount - a.playCount), []);
  const newGames = useMemo(() => MOCK_GAMES.filter(g => g.tags.includes('Relaxing') || g.tags.includes('New')), []);

  return (
    <div className="p-4 space-y-8 pb-24 overflow-y-auto h-full no-scrollbar">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="font-bold text-slate-100" style={{ fontSize: `${1.5 * fontSizeScale}rem` }}>Game Hall</h1>
           <p className="text-slate-400" style={{ fontSize: `${0.9 * fontSizeScale}rem` }}>Ready to play?</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
          🔍
        </div>
      </div>

      {/* Banner/Carousel */}
      <div className="w-full h-40 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-between p-6 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
        <div className="relative z-10 text-white space-y-2">
          <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Featured</span>
          <h2 className="text-2xl font-bold">Speed Racer</h2>
          <button 
             onClick={() => onGameSelect(MOCK_GAMES.find(g => g.id === '2')!)}
             className="bg-white text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-transform">
            Play Now
          </button>
        </div>
        <div className="text-8xl opacity-20 absolute -right-4 -bottom-4 rotate-12">🏎️</div>
      </div>

      {/* Categories */}
      <section>
        <h3 className="font-bold text-slate-200 mb-4" style={{ fontSize: `${1.1 * fontSizeScale}rem` }}>Categories</h3>
        <div className="grid grid-cols-3 gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1 text-center hover:bg-slate-800 transition-colors cursor-pointer">
              <span className="text-2xl">{cat.name.split(' ')[0]}</span>
              <span className="text-xs font-medium text-slate-300">{cat.name.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-slate-200" style={{ fontSize: `${1.1 * fontSizeScale}rem` }}>Recommended for You</h3>
          <span className="text-indigo-400 text-xs font-medium">See All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {popularGames.map(game => (
            <GameCard key={game.id} game={game} onClick={onGameSelect} variant="compact" fontSizeScale={fontSizeScale} />
          ))}
        </div>
      </section>

      {/* All Games List */}
      <section>
        <h3 className="font-bold text-slate-200 mb-4" style={{ fontSize: `${1.1 * fontSizeScale}rem` }}>Popular Now</h3>
        <div className="space-y-3">
          {MOCK_GAMES.map(game => (
            <GameCard key={game.id} game={game} onClick={onGameSelect} fontSizeScale={fontSizeScale} />
          ))}
        </div>
      </section>

    </div>
  );
};
