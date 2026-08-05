// src/main/ThemeSelector.jsx
import React from 'react';
import { themes } from './theme';

export default function ThemeSelector({ currentTheme, onSelectTheme }) {
  // -------------------------------------------------------------
  // 1. 컴포넌트 렌더링부 (JSX)
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-md px-4">
      
      {/* 테마 선택 섹션 상단 타이틀 라벨 */}
      <span className="text-xs text-slate-400 font-bold tracking-widest mb-2">GAME THEME</span>
      
      {/* 테마 목록을 4열 그리드 형태로 배치하는 컨테이너 */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {/* themes 객체의 값들을 배열로 변환하여 각각의 테마 버튼 생성 */}
        {Object.values(themes).map((t) => {
          // 현재 사용자가 선택한 테마인지 여부 확인
          const isSelected = currentTheme === t.id;
          
          return (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)} // 클릭 시 부모 컴포넌트로 선택된 테마 ID 전달
              // 현재 선택된 테마일 경우 강조 스타일(주황빛 배경, 확대 등), 아닐 경우 기본 스타일 적용
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105' // 선택된 테마 스타일
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'  // 일반 테마 스타일
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