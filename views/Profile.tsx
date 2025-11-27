import React from 'react';
import { User, Task } from '../types';
import { Button } from '../components/Button';

interface ProfileProps {
  user: User;
  tasks: Task[];
  onCollectReward: (taskId: string) => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  fontSizeScale: number;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, tasks, onCollectReward, fontScale, onFontScaleChange, fontSizeScale 
}) => {
  
  return (
    <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full no-scrollbar">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-slate-100" style={{ fontSize: `${1.5 * fontSizeScale}rem` }}>My Profile</h1>
        <button className="text-slate-400 hover:text-white">⚙️</button>
      </div>

      {/* User Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl border-2 border-indigo-500">
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900">
            LV. 5
          </div>
        </div>
        <div>
          <h2 className="font-bold text-white text-lg">{user.nickname}</h2>
          <div className="text-slate-400 text-sm mt-1">ID: 8839201</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-400 text-sm font-bold">🪙 {user.coins}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
         <div className="bg-slate-900/50 p-4 rounded-2xl text-center border border-slate-800/50">
            <div className="text-indigo-400 text-lg font-bold">{user.loginDays}</div>
            <div className="text-slate-500 text-xs mt-1">Days</div>
         </div>
         <div className="bg-slate-900/50 p-4 rounded-2xl text-center border border-slate-800/50">
            <div className="text-purple-400 text-lg font-bold">{user.gamesPlayed}</div>
            <div className="text-slate-500 text-xs mt-1">Games</div>
         </div>
         <div className="bg-slate-900/50 p-4 rounded-2xl text-center border border-slate-800/50">
            <div className="text-emerald-400 text-lg font-bold">{Math.floor(user.totalPlayTime / 60)}h</div>
            <div className="text-slate-500 text-xs mt-1">Time</div>
         </div>
      </div>

      {/* Daily Tasks */}
      <section>
        <h3 className="font-bold text-slate-200 mb-4" style={{ fontSize: `${1.1 * fontSizeScale}rem` }}>Daily Tasks</h3>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-200 mb-1">{task.description}</div>
                <div className="flex items-center gap-2">
                   <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${(task.current / task.target) * 100}%` }}></div>
                   </div>
                   <span className="text-xs text-slate-500">{task.current}/{task.target}</span>
                </div>
              </div>
              
              {task.completed && !task.collected ? (
                <Button 
                  onClick={() => onCollectReward(task.id)}
                  className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                >
                  Get {task.reward}
                </Button>
              ) : task.collected ? (
                <span className="text-slate-600 text-xs font-medium px-3 py-1">Done</span>
              ) : (
                <span className="text-slate-500 text-xs bg-slate-800 px-3 py-1 rounded-lg">
                  +{task.reward} 🪙
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Settings: Accessibility */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
        <h3 className="font-bold text-slate-200 mb-4" style={{ fontSize: `${1 * fontSizeScale}rem` }}>Accessibility</h3>
        <div className="flex items-center justify-between">
           <span className="text-slate-400 text-sm">Font Size</span>
           <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => onFontScaleChange(1)} 
                className={`w-8 h-8 rounded flex items-center justify-center text-xs ${fontScale === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                A
              </button>
              <button 
                onClick={() => onFontScaleChange(1.2)} 
                className={`w-8 h-8 rounded flex items-center justify-center text-base ${fontScale === 1.2 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                A
              </button>
              <button 
                onClick={() => onFontScaleChange(1.4)} 
                className={`w-8 h-8 rounded flex items-center justify-center text-lg ${fontScale === 1.4 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                A
              </button>
           </div>
        </div>
      </section>

    </div>
  );
};
