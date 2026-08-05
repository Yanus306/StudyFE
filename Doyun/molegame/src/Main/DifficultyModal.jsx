import React from 'react';

export default function DifficultyModal({ isOpen, onClose, currentDifficulty, onSelectDifficulty }) {
  // -------------------------------------------------------------
  // 1. 모달 닫힘 상태일 때 렌더링을 차단 (Early Return)
  // -------------------------------------------------------------
  if (!isOpen) return null;

  // -------------------------------------------------------------
  // 2. 선택 가능한 난이도 목록 데이터 정의 (ID와 화면 표시용 라벨)
  // -------------------------------------------------------------
  const levels = [
    { id: 'easy', label: '쉬움 (2x2)' },
    { id: 'normal', label: '보통 (4x4)' },
    { id: 'hard', label: '어려움 (8x8)' },
  ];

  // -------------------------------------------------------------
  // 3. 컴포넌트 렌더링부 (JSX)
  // -------------------------------------------------------------
  return (
    // 배경을 어둡게 하고 블러 처리하는 오버레이 영역 (화면 전체 고정)
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* 모달 창 본체 컨테이너 */}
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl w-80 flex flex-col items-center gap-5">
        
        {/* 모달 타이틀 */}
        <h3 className="text-xl font-bold text-white tracking-wide">난이도 선택</h3>
        
        {/* 난이도 버튼 목록 영역 */}
        <div className="flex flex-col gap-3 w-full">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                onSelectDifficulty(level.id); // 선택한 난이도 상태 업데이트 부모로 전달
                onClose();                     // 모달 닫기
              }}
              // 현재 선택된 난이도인지 여부에 따라 동적 스타일(배경색, 텍스트 색상) 적용
              className={`py-3.5 rounded-xl font-bold text-base transition-all ${
                currentDifficulty === level.id
                  ? 'bg-amber-500 text-slate-950 shadow-md' // 선택된 난이도일 때 (주황빛 강조)
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600' // 선택되지 않은 난이도일 때
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* 모달을 닫는 닫기 텍스트 버튼 */}
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