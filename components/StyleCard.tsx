import React from 'react';
import { StyleOption } from '../types';

interface StyleCardProps {
  styleOption: StyleOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({ styleOption, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(styleOption.id)}
      className={`
        cursor-pointer group relative overflow-hidden rounded-xl p-4 transition-all duration-300
        border-2 
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20' 
          : 'border-slate-800 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'}
      `}
    >
      <div className={`
        h-24 w-full rounded-lg mb-3 bg-gradient-to-br ${styleOption.thumbnailColor}
        opacity-80 group-hover:opacity-100 transition-opacity
      `}></div>
      
      <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
        {styleOption.name}
      </h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
        {styleOption.description}
      </p>

      {isSelected && (
        <div className="absolute top-3 right-3 bg-indigo-500 text-white p-1 rounded-full">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};