// src/components/GameControl.jsx (또는 GameControls.jsx)
import React from 'react';

// 💡 반드시 'export default'가 붙어 있어야 합니다!
export default function GameControls({
  timeLeft,
  muted,
  onToggleMute,
  volume,
  onChangeVolume,
  ballCount,
  maxBalls,
  onOpenAddModal
}) {
  return (
    <>
      {/* 중앙 상단 초기화 타이머 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="px-5 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 flex items-center gap-2 text-gray-800 font-bold">
          <span className="text-xs text-gray-500 font-medium">초기화까지</span>
          <span className="tracking-wider text-base font-mono">{timeLeft}</span>
        </div>
      </div>

      {/* 왼쪽 상단 사운드 버튼 그룹 */}
      <div className="absolute top-6 left-6 z-10 group flex items-center gap-3">
        <button 
          onClick={onToggleMute} 
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-200 border border-white/40 active:scale-95 ${muted ? 'bg-red-500/80 text-white' : 'bg-white/80 hover:bg-white text-gray-800'}`}
          title={muted ? "사운드 켜기" : "사운드 끄기"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <div className="hidden group-hover:flex items-center bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white/40 transition-opacity">
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            value={volume}
            onChange={onChangeVolume}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 등록하기 버튼 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <button 
          onClick={onOpenAddModal} 
          className="px-8 py-3 bg-white/80 hover:bg-white text-gray-800 font-semibold rounded-3xl shadow-lg backdrop-blur-md border border-white/40 active:scale-95 cursor-pointer"
        >
          등록하기 ({ballCount}/{maxBalls})
        </button>
      </div>
    </>
  );
}