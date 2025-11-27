import React, { useState, useEffect, useRef } from 'react';

interface GameProps {
  onScoreUpdate: (score: number) => void;
  isActive: boolean;
  onGameOver: (finalScore: number) => void;
}

interface Obstacle {
  id: number;
  lane: 0 | 1 | 2;
  y: number; // Percentage 0-100
  type: 'rock' | 'coin';
}

export const RacerGame: React.FC<GameProps> = ({ onScoreUpdate, isActive, onGameOver }) => {
  const [playerLane, setPlayerLane] = useState<0 | 1 | 2>(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const speedRef = useRef<number>(0.8); // Speed increases over time

  const moveLeft = () => setPlayerLane(prev => Math.max(0, prev - 1) as 0|1|2);
  const moveRight = () => setPlayerLane(prev => Math.min(2, prev + 1) as 0|1|2);

  // Game Loop
  useEffect(() => {
    if (!isActive) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const updateGame = (time: number) => {
      // Spawn obstacles
      if (time - lastSpawnTime.current > 1500 / speedRef.current) {
        const lane = Math.floor(Math.random() * 3) as 0|1|2;
        const type = Math.random() > 0.8 ? 'coin' : 'rock';
        setObstacles(prev => [
          ...prev, 
          { id: time, lane, y: -10, type }
        ]);
        lastSpawnTime.current = time;
        speedRef.current += 0.05; // Accel
      }

      setObstacles(prev => {
        const nextObstacles: Obstacle[] = [];
        let hit = false;
        let points = 0;

        prev.forEach(obs => {
          const newY = obs.y + speedRef.current;
          
          // Collision Check
          // Player is at Y ~ 80-90%
          if (newY > 75 && newY < 95 && obs.lane === playerLane) {
            if (obs.type === 'rock') {
              hit = true;
            } else if (obs.type === 'coin') {
              points += 50;
              return; // Remove coin
            }
          }

          if (newY < 110) {
             nextObstacles.push({ ...obs, y: newY });
          } else if (obs.type === 'rock') {
             // Passed safely
             points += 10;
          }
        });

        if (hit) {
          onGameOver(score);
          return [];
        }

        if (points > 0) {
           const newScore = score + points;
           setScore(newScore);
           onScoreUpdate(newScore);
        }

        return nextObstacles;
      });

      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, playerLane, score]); // Only re-bind if critical state changes, but ref handles loop

  return (
    <div className="relative w-full h-full bg-slate-800 overflow-hidden flex flex-col items-center">
      {/* Road */}
      <div className="w-full max-w-sm h-full bg-slate-700 relative border-x-4 border-slate-600">
        {/* Lane Markers */}
        <div className="absolute inset-0 flex justify-evenly opacity-30">
           <div className="w-1 h-full bg-dashed border-l border-dashed border-white"></div>
           <div className="w-1 h-full bg-dashed border-l border-dashed border-white"></div>
        </div>

        {/* Player */}
        <div 
          className="absolute bottom-8 transition-all duration-200 ease-out text-4xl"
          style={{ 
            left: `${playerLane * 33.33 + 16.66}%`,
            transform: 'translateX(-50%)' 
          }}
        >
          🏎️
        </div>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute text-3xl transition-none"
            style={{
              left: `${obs.lane * 33.33 + 16.66}%`,
              top: `${obs.y}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {obs.type === 'rock' ? '🪨' : '🪙'}
          </div>
        ))}
      </div>

      {/* Controls Overlay (Mobile friendly) */}
      <div className="absolute inset-0 flex z-10">
        <div className="flex-1 active:bg-white/5" onPointerDown={moveLeft}></div>
        <div className="flex-1 active:bg-white/5" onPointerDown={moveRight}></div>
      </div>
      
      <div className="absolute bottom-2 text-slate-400 text-xs pointer-events-none">
        Tap Left / Right to Dodge
      </div>
    </div>
  );
};