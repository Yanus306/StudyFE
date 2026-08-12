import React from 'react';

export default function RankingBoard({ rankings, maxBalls, selectedBallId, onSelectBall, isOpen, onToggleOpen }) {
  return (
    <div className="bg-white/75 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 transition-all">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-sm font-bold text-gray-700">
          🏆 순위 ({rankings.length}/{maxBalls})
        </h3>
        <button 
          onClick={onToggleOpen}
          className="text-gray-500 hover:text-gray-800 text-xs font-bold px-1.5 py-0.5 rounded transition-transform"
          title={isOpen ? "접기" : "펼치기"}
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {isOpen && (
        <ul className="space-y-1.5 max-h-52 overflow-y-auto mt-3">
          {rankings.slice(0, 7).map((ball, index) => (
            <li 
              key={ball.id} 
              onClick={() => onSelectBall(ball)}
              className={`flex items-center justify-between text-xs font-medium px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${selectedBallId === ball.id ? 'bg-blue-500 text-white font-bold' : 'bg-white/50 hover:bg-white/80 text-gray-800'}`}
            >
              <span>{index + 1}등 #{ball.id}</span>
              <span className={selectedBallId === ball.id ? 'text-white/80' : 'text-gray-500'}>{ball.diameter}px</span>
            </li>
          ))}
          {rankings.length === 0 && (
            <li className="text-center text-xs text-gray-400 py-2">공이 없습니다</li>
          )}
        </ul>
      )}
    </div>
  );
}