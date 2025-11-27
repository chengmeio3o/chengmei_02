import React, { useState } from 'react';
import { Game, User, Task } from './types';
import { MOCK_TASKS, INITIAL_USER } from './services/mockData';
import { Lobby } from './views/Lobby';
import { Profile } from './views/Profile';
import { GameRoom } from './views/GameRoom';

export default function App() {
  const [view, setView] = useState<'lobby' | 'profile'>('lobby');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [fontScale, setFontScale] = useState(1);

  // --- Actions ---

  const handleGameSelect = (game: Game) => {
    setActiveGame(game);
  };

  const handleGameExit = () => {
    setActiveGame(null);
  };

  const handleGameFinish = (score: number) => {
    // Update User Stats
    setUser(prev => ({
      ...prev,
      totalPlayTime: prev.totalPlayTime + 5, // Mock 5 mins
      gamesPlayed: prev.gamesPlayed + 1,
      coins: prev.coins + Math.floor(score / 10)
    }));

    // Update Tasks
    setTasks(prev => prev.map(t => {
      if (t.id === 't2' && !t.completed) { // "Play 2 Games" logic
        const newCurrent = Math.min(t.current + 1, t.target);
        return {
          ...t,
          current: newCurrent,
          completed: newCurrent >= t.target
        };
      }
      return t;
    }));
  };

  const handleCollectReward = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.completed && !task.collected) {
      setUser(prev => ({ ...prev, coins: prev.coins + task.reward }));
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, collected: true } : t));
    }
  };

  // --- Render ---

  // 1. Game Room (Full Screen Overlay)
  if (activeGame) {
    return (
      <GameRoom 
        game={activeGame} 
        onExit={handleGameExit} 
        onFinish={handleGameFinish}
        fontSizeScale={fontScale}
      />
    );
  }

  // 2. Main App Layout (Lobby/Profile)
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {view === 'lobby' && <Lobby onGameSelect={handleGameSelect} fontSizeScale={fontScale} />}
        {view === 'profile' && (
           <Profile 
             user={user} 
             tasks={tasks} 
             onCollectReward={handleCollectReward} 
             fontScale={fontScale}
             onFontScaleChange={setFontScale}
             fontSizeScale={fontScale}
           />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-4 shrink-0 pb-safe z-30">
        <button 
          onClick={() => setView('lobby')}
          className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${view === 'lobby' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          <span className="text-[10px] font-medium">Games</span>
        </button>

        <div className="w-12 h-12 -mt-8 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-lg shadow-indigo-900/50 cursor-pointer hover:bg-indigo-500 transition-colors" onClick={() => handleGameSelect(MOCK_TASKS[0] as any || {}) /* Just a visual play button */}>
           <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
             <path d="M8 5v14l11-7z" />
           </svg>
        </div>

        <button 
          onClick={() => setView('profile')}
          className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${view === 'profile' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-medium">Me</span>
        </button>
      </nav>

    </div>
  );
}
