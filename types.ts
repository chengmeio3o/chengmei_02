export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'puzzle' | 'competitive' | 'simulation';
  icon: string; // Emoji or URL
  rating: number;
  playCount: number;
  tags: string[];
  color: string;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string; // Emoji
  coins: number;
  loginDays: number;
  totalPlayTime: number; // minutes
  gamesPlayed: number;
}

export interface Task {
  id: string;
  description: string;
  reward: number;
  completed: boolean;
  collected: boolean;
  current: number;
  target: number;
}

export interface GameResult {
  score: number;
  rankPercent: number;
  coinsEarned: number;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  thumbnailColor: string;
}