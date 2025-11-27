
import React, { useState, useEffect } from 'react';
import { Game, GameResult } from '../types';
import { gameService } from '../services/mockData';
import { Button } from '../components/Button';
import { MemoryGame } from './games/MemoryGame';
import { RacerGame } from './games/RacerGame';
import { FarmGame } from './games/FarmGame';

interface GameRoomProps {
  game: Game;
  onExit: () => void;
  onFinish: (score: number) => void;
  fontSizeScale: number;
}

export const GameRoom: React.FC<GameRoomProps> = ({ game, onExit, onFinish, fontSizeScale }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Default 60s for all games
  const [gameOverResult, setGameOverResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading assets
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isPaused || gameOverResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, gameOverResult, score]);

  const handleStart = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
  };

  const handleGameOver = async (finalScore: number) => {
    setIsPlaying(false);
    // Fetch result from backend simulation
    const res = await gameService.submitScore(game.id, finalScore);
    setGameOverResult(res);
    onFinish(finalScore);
  };

  // Render the specific game logic based on ID or Category
  const renderGameContent = () => {
    const commonProps = {
      onScoreUpdate: setScore,
      isActive: isPlaying && !isPaused,
      onGameOver: handleGameOver,
    };

    // ID 1 & 4 = Puzzle (Memory)
    if (game.id === '1' || game.id === '4') {
      return <MemoryGame {...commonProps} />;
    }
    
    // ID 2 & 5 = Competitive (Racer)
    if (game.id === '2' || game.id === '5') {
       return <RacerGame {...commonProps} />;
    }

    // ID 3 = Simulation (Farm)
    if (game.id === '3') {
      return <FarmGame {...commonProps} />;
    }

    // Fallback for unknown games
    return (
       <div className="flex items-center justify-center h-full text-slate-500">
          Game content not found for {game.title}
       </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-8 text-center">
        <div className={`text-6xl mb-6 animate-pulse`}>{game.icon}</div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading {game.title}...</h2>
        <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-indigo-500 animate-[width_1s_ease-out_forwards]" style={{width: '90%'}}></div>
        </div>
      </div>
    );
  }

  // Settlement Screen
  if (gameOverResult) {
    return (
      <div className="fixed inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-50 p-8 animate-fade-in backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
          
          <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-orange-500 mb-6 uppercase tracking-wider">
            Match Finished!
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 text-xs mb-1">Final Score</div>
              <div className="text-2xl font-bold text-white">{gameOverResult.score}</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 text-xs mb-1">Coins</div>
              <div className="text-2xl font-bold text-yellow-400">+{gameOverResult.coinsEarned}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-slate-300 text-sm">
              You defeated <span className="font-bold text-indigo-400 text-lg">{gameOverResult.rankPercent}%</span> of players!
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${gameOverResult.rankPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
             <Button variant="primary" className="w-full py-3" onClick={onExit}>Share Results</Button>
             <Button variant="secondary" className="w-full" onClick={() => {
                setGameOverResult(null);
                handleStart();
             }}>Play Again</Button>
             <Button variant="ghost" className="w-full" onClick={onExit}>Back to Lobby</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col h-full font-sans">
      {/* Game Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsPaused(true)} className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
           </button>
           <div className="font-bold text-slate-100 truncate max-w-[150px]">{game.title}</div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Timer */}
           <div className={`font-mono text-xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>
             00:{timeLeft.toString().padStart(2, '0')}
           </div>
           
           {/* Score */}
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-sm font-mono text-indigo-400 border border-slate-700">
              {score} pts
           </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        {renderGameContent()}
      </div>

      {/* Start Overlay */}
      {!isPlaying && !gameOverResult && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fade-in">
           <div className="text-8xl mb-6 animate-bounce">{game.icon}</div>
           <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
           <p className="text-slate-400 mb-8 max-w-xs text-center">{game.description}</p>
           
           <button 
             onClick={handleStart}
             className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold px-16 py-6 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] scale-100 hover:scale-105 active:scale-95 transition-all"
           >
             START GAME
           </button>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-40 gap-6 animate-fade-in">
           <h3 className="text-4xl font-black text-white tracking-wider">PAUSED</h3>
           <div className="flex flex-col gap-3 w-64">
             <Button variant="primary" className="w-full py-4 text-lg" onClick={() => setIsPaused(false)}>Resume</Button>
             <Button variant="outline" className="w-full py-4 text-lg" onClick={onExit}>Exit Game</Button>
           </div>
        </div>
      )}
    </div>
  );
};
