
import React, { useState, useEffect } from 'react';

interface GameProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
  onGameOver: (finalScore: number) => void;
}

type PlotState = 'empty' | 'growing' | 'ready';

interface Plot {
  id: number;
  state: PlotState;
  plantType: string;
  growTime: number; // ms
  plantedAt: number;
}

export const FarmGame: React.FC<GameProps> = ({ onScoreUpdate, isActive }) => {
  const [plots, setPlots] = useState<Plot[]>(Array.from({ length: 6 }, (_, i) => ({
    id: i, state: 'empty', plantType: '', growTime: 0, plantedAt: 0
  })));
  const [score, setScore] = useState(0);

  // Growth Tick
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setPlots(currentPlots => 
        currentPlots.map(plot => {
          if (plot.state === 'growing' && now - plot.plantedAt >= plot.growTime) {
            return { ...plot, state: 'ready' };
          }
          return plot;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  const handlePlotClick = (index: number) => {
    if (!isActive) return;
    const plot = plots[index];

    if (plot.state === 'empty') {
      // Plant
      const types = [
        { icon: '🥕', time: 2000, points: 50 },
        { icon: '🌽', time: 4000, points: 120 },
        { icon: '🎃', time: 6000, points: 250 },
      ];
      // Simple random seed selection
      const seed = types[Math.floor(Math.random() * types.length)];
      
      const newPlots = [...plots];
      newPlots[index] = {
        ...plot,
        state: 'growing',
        plantType: seed.icon,
        growTime: seed.time,
        plantedAt: Date.now(),
      };
      setPlots(newPlots);

    } else if (plot.state === 'ready') {
      // Harvest
      // Calculate points based on what was planted (reverse engineer or store it, storing simplifed here)
      let points = 50;
      if (plot.plantType === '🌽') points = 120;
      if (plot.plantType === '🎃') points = 250;

      const newScore = score + points;
      setScore(newScore);
      onScoreUpdate(newScore);

      const newPlots = [...plots];
      newPlots[index] = { ...plot, state: 'empty', plantType: '' };
      setPlots(newPlots);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col justify-center h-full">
      <h3 className="text-center text-amber-400 font-bold mb-4 animate-bounce">Tap to Plant & Harvest!</h3>
      <div className="grid grid-cols-2 gap-4">
        {plots.map((plot, i) => (
          <button
            key={plot.id}
            onClick={() => handlePlotClick(i)}
            className={`
              h-32 rounded-2xl border-4 relative overflow-hidden transition-all active:scale-95
              ${plot.state === 'empty' ? 'bg-stone-800 border-stone-700' : ''}
              ${plot.state === 'growing' ? 'bg-amber-900/50 border-amber-800' : ''}
              ${plot.state === 'ready' ? 'bg-green-800/50 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : ''}
            `}
          >
            {/* Dirt Texture */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {plot.state === 'empty' && <span className="text-4xl opacity-50">🌱</span>}
              
              {plot.state === 'growing' && (
                <div className="animate-pulse">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="w-12 h-2 bg-stone-900 rounded-full">
                     <div className="h-full bg-blue-500 rounded-full animate-[width_2s_ease-in-out]"></div>
                  </div>
                </div>
              )}

              {plot.state === 'ready' && (
                <span className="text-6xl animate-bounce">{plot.plantType}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
