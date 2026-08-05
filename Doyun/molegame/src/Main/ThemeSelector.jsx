// src/main/ThemeSelector.jsx
import React from 'react';
import { themes } from './theme';

export default function ThemeSelector({ currentTheme, onSelectTheme }) {
  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-md px-4">
      <span className="text-xs text-slate-400 font-bold tracking-widest mb-2">GAME THEME</span>
      <div className="grid grid-cols-4 gap-2 w-full">
        {Object.values(themes).map((t) => {
          const isSelected = currentTheme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}