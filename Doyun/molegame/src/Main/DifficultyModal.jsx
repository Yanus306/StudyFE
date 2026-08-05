import React from 'react';

export default function DifficultyModal({ isOpen, onClose, currentDifficulty, onSelectDifficulty }) {
  if (!isOpen) return null;

  const levels = [
    { id: 'easy', label: '쉬움 (2x2)' },
    { id: 'normal', label: '보통 (4x4)' },
    { id: 'hard', label: '어려움 (8x8)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl w-80 flex flex-col items-center gap-5">
        <h3 className="text-xl font-bold text-white tracking-wide">난이도 선택</h3>
        
        <div className="flex flex-col gap-3 w-full">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                onSelectDifficulty(level.id);
                onClose();
              }}
              className={`py-3.5 rounded-xl font-bold text-base transition-all ${
                currentDifficulty === level.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}