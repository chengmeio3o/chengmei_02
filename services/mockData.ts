import { Game, Task, User, GameResult } from '../types';

export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'Neon Puzzle',
    description: 'Connect the glowing lines in this relaxing puzzle game.',
    category: 'puzzle',
    icon: '🧩',
    rating: 4.8,
    playCount: 12500,
    tags: ['Relaxing', 'Brain'],
    color: 'bg-purple-600'
  },
  {
    id: '2',
    title: 'Speed Racer 2077',
    description: 'Dodge obstacles at high speed. Test your reaction time!',
    category: 'competitive',
    icon: '🏎️',
    rating: 4.5,
    playCount: 34000,
    tags: ['Fast', 'Hard'],
    color: 'bg-red-600'
  },
  {
    id: '3',
    title: 'Farm Tiny',
    description: 'Grow crops and feed animals in your pocket farm.',
    category: 'simulation',
    icon: '🌾',
    rating: 4.9,
    playCount: 8900,
    tags: ['Casual', 'Cute'],
    color: 'bg-green-600'
  },
  {
    id: '4',
    title: 'Match-3 Saga',
    description: 'Classic gem matching fun with 3-minute rounds.',
    category: 'puzzle',
    icon: '💎',
    rating: 4.7,
    playCount: 45000,
    tags: ['Popular'],
    color: 'bg-blue-600'
  },
  {
    id: '5',
    title: 'Cyber Chess',
    description: 'Quick chess puzzles for sharp minds.',
    category: 'competitive',
    icon: '♟️',
    rating: 4.6,
    playCount: 2100,
    tags: ['Strategy'],
    color: 'bg-indigo-600'
  }
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', description: 'Daily Login', reward: 50, completed: true, collected: false, current: 1, target: 1 },
  { id: 't2', description: 'Play 2 Games', reward: 100, completed: false, collected: false, current: 0, target: 2 },
  { id: 't3', description: 'Share Results', reward: 30, completed: false, collected: false, current: 0, target: 1 },
];

export const INITIAL_USER: User = {
  id: 'u1',
  nickname: 'Guest Player',
  avatar: '🐵',
  coins: 0,
  loginDays: 1,
  totalPlayTime: 0,
  gamesPlayed: 0
};

// Simulation Service
export const gameService = {
  getGames: () => Promise.resolve(MOCK_GAMES),
  
  getGamesByCategory: (cat: string) => Promise.resolve(MOCK_GAMES.filter(g => g.category === cat)),
  
  submitScore: (gameId: string, score: number): Promise<GameResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Random ranking algorithm
        const rank = Math.floor(Math.random() * 30) + 60; // 60-90%
        resolve({
          score,
          rankPercent: rank,
          coinsEarned: Math.floor(score / 10)
        });
      }, 800);
    });
  }
};
