import React, { useState, useEffect } from 'react';
import { useMoleGame } from './main/useMoleGame';
import DifficultyModal from './main/DifficultyModal';
import ThemeSelector from './main/ThemeSelector';
import { themes } from './main/theme';
import { useFeverTime } from './main/useFeverTime';

export default function MainView() {
  // -------------------------------------------------------------
  // 1. 커스텀 훅(useMoleGame)을 통한 게임 상태 및 메서드 비구조화 할당
  // -------------------------------------------------------------
  const { 
    score,         // 현재 게임 점수
    isPlaying,     // 게임 진행 중 여부 (true/false)
    activeMole,    // 현재 튀어나온 두더지의 정보 (위치, 타입 등)
    difficulty,    // 현재 선택된 난이도 (easy, normal, hard)
    setDifficulty, // 난이도 변경 함수
    isModalOpen,   // 난이도 선택 모달창 열림 여부
    setIsModalOpen,// 모달창 열림 상태 변경 함수
    currentSetting,// 현재 난이도에 따른 그리드 크기 및 설정
    streak,        // 연속 성공 횟수 (스트릭)
    level,         // 현재 게임 레벨
    maxStats,      // 로컬스토리지 등에 저장된 최고 기록 (점수, 레벨, 스트릭)
    startGame,     // 게임 시작 함수
    stopGame,      // 게임 중지 함수
    handleMoleClick// 두더지 클릭 시 처리 함수
  } = useMoleGame();

  // -------------------------------------------------------------
  // 2. 테마 상태 관리 (로컬스토리지 연동하여 새로고침해도 유지)
  // -------------------------------------------------------------
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('moleGameTheme') || 'classic';
  });

  // 선택된 테마 객체 가져오기 (없을 경우 기본 classic 테마 사용)
  const theme = themes[currentThemeId] || themes.classic;

  // 테마 변경 시 상태 업데이트 및 로컬스토리지 저장 함수
  const handleThemeChange = (themeId) => {
    setCurrentThemeId(themeId);
    try {
      localStorage.setItem('moleGameTheme', themeId);
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // 3. UI 렌더링을 위한 매핑 객체들 (난이도 이름, 그리드 컬럼 클래스)
  // -------------------------------------------------------------
  const difficultyName = {
    easy: '쉬움',
    normal: '보통',
    hard: '어려움',
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    4: 'grid-cols-4',
    8: 'grid-cols-8',
  };

  // -------------------------------------------------------------
  // 4. 피버타임 훅 연동 (스트릭 조건 달성 시 특수 모드 활성화)
  // -------------------------------------------------------------
  const { isFeverTime, feverActiveIndex, startFeverWave } = useFeverTime({
    isPlaying,
    streak,
    onFeverEnd: () => {
      // 피버타임이 끝나도 스트릭은 초기화되지 않고 유지됩니다.
    }
  });

  // 피버타임이 시작되면 전체 셀을 순회하는 파도타기 애니메이션 실행
  useEffect(() => {
    if (isFeverTime) {
      startFeverWave(currentSetting.totalCells);
    }
  }, [isFeverTime, currentSetting.totalCells, startFeverWave]);

  // -------------------------------------------------------------
  // 5. 컴포넌트 렌더링부 (JSX)
  // -------------------------------------------------------------
  return (
    <div className={`flex flex-col items-center justify-start min-h-screen ${theme.bg} select-none text-white py-6 px-4 relative transition-colors duration-300 overflow-x-hidden`}>
      
      {/* ---------------- 파도타기 피버타임 안내 배너 ---------------- */}
      {isFeverTime && (
        <div className="mb-4 px-6 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 rounded-full font-extrabold text-lg animate-bounce shadow-lg tracking-wider">
          🎉 FEVER TIME! 파도타기 발동! 🎉
        </div>
      )}

      {/* ---------------- 게임 시작 전 최고 기록(Max Stats) 스코어판 ---------------- */}
      {!isPlaying && maxStats && (
        <div className="flex flex-col items-center mb-6 w-full max-w-md animate-fade-in">
          <div className={`grid grid-cols-3 gap-3 w-full ${theme.scoreboardBg} p-4 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors duration-300`}>
            {/* 최고 점수 */}
            <div className="flex flex-col items-center bg-black/40 py-2.5 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Max Score</span>
              <span className="text-xl font-bold text-amber-400">{maxStats.maxScore}</span>
            </div>
            {/* 최고 레벨 */}
            <div className="flex flex-col items-center bg-black/40 py-2.5 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Max Level</span>
              <span className="text-xl font-bold text-sky-400">Lv.{maxStats.maxLevel}</span>
            </div>
            {/* 최고 스트릭 */}
            <div className="flex flex-col items-center bg-black/40 py-2.5 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Max Streak</span>
              <span className="text-xl font-bold text-emerald-400">{maxStats.maxStreak}</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 게임 진행 중 실시간 스코어판 (Score, Level, Streak) ---------------- */}
      {isPlaying && (
        <div className={`flex items-center justify-center gap-4 sm:gap-6 mb-6 px-6 sm:px-10 py-3 ${theme.scoreboardBg} rounded-2xl border shadow-lg transition-colors duration-300 w-full max-w-md`}>
          {/* 현재 점수 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider">SCORE</span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{score}</span>
          </div>

          <div className="w-[1px] h-8 sm:h-10 bg-white/10" />

          {/* 현재 레벨 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider">LEVEL</span>
            <span className="text-2xl sm:text-3xl font-bold text-sky-400">{level}</span>
          </div>

          <div className="w-[1px] h-8 sm:h-10 bg-white/10" />

          {/* 현재 연속 성공 스트릭 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider">STREAK</span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">{streak}</span>
          </div>
        </div>
      )}

      {/* ---------------- 반응형 메인 컨테이너 (난이도 버튼, 게임판, 시작/중지 버튼) ---------------- */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-2xl">
        
        {/* 난이도 선택 버튼 (게임 중에는 비활성화) */}
        <button
          onClick={() => {
            if (!isPlaying) {
              setIsModalOpen(true);
            }
          }}
          disabled={isPlaying}
          className={`w-full md:w-32 h-14 md:h-[88px] rounded-2xl font-bold text-base md:text-lg shadow-lg transition-all flex items-center justify-center ${
            isPlaying 
              ? 'bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-amber-950/50 border border-amber-400 cursor-pointer'
          }`}
        >
          {difficultyName[difficulty]}
        </button>

        {/* 🪵 동적 두더지 게임 판 (그리드 구조) */}
        <div className={`${theme.boardBg} p-5 sm:p-7 rounded-3xl shadow-2xl border-4 transition-colors duration-300 flex justify-center w-full md:w-auto`}>
          <div className={`grid ${gridColsClass[currentSetting.size]} gap-2 sm:gap-2.5`}>
            {Array.from({ length: currentSetting.totalCells }).map((_, index) => {
              // 피버타임 중에는 파도타기 인덱스에 따라 두더지 활성화, 평소에는 일반 activeMole 상태를 따름
              const isMoleUp = isFeverTime ? (feverActiveIndex === index) : (activeMole && activeMole.index === index);
              
              // 피버타임 중에는 모든 두더지가 초록색(green)으로 고정 출력
              const moleType = isFeverTime ? 'green' : activeMole?.type;
              const moleColor = moleType === 'red' ? 'bg-red-500' : 'bg-emerald-500';

              return (
                <div
                  key={index}
                  onClick={() => handleMoleClick(index)}
                  className={`${theme.holeBg} rounded-full flex items-center justify-center shadow-inner relative overflow-hidden border-2 cursor-pointer group transition-colors duration-300`}
                  style={{ width: currentSetting.size === 8 ? '2.6rem' : '3.3rem', height: currentSetting.size === 8 ? '2.6rem' : '3.3rem' }}
                >
                  {/* 구멍 안쪽의 깊이감을 주는 음영 효과 레이어 */}
                  <div className={`absolute inset-1.5 ${theme.holeInner} rounded-full opacity-60 pointer-events-none transition-colors duration-300`} />
                  
                  {/* 🐹 구멍 안에서 위아래로 튀어나오는 두더지 버튼 엘리먼트 */}
                  <div
                    className={`absolute w-8 sm:w-10 h-8 sm:h-10 ${moleColor} rounded-full border-2 border-black/30 flex items-center justify-center transition-all duration-150 ${
                      isMoleUp ? 'translate-y-0 scale-100' : 'translate-y-12 scale-0'
                    }`}
                  >
                    {/* 두더지 눈(디테일 표현) */}
                    <div className="flex gap-1.5 sm:gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 게임 시작 및 중지 토글 버튼 */}
        <button
          onClick={isPlaying ? stopGame : startGame}
          className={`w-full md:w-32 h-14 md:h-[88px] rounded-2xl font-bold text-base md:text-lg shadow-lg transition-all flex items-center justify-center ${
            isPlaying 
              ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95 shadow-amber-900/50 border border-amber-500 cursor-pointer' 
              : 'bg-red-600 hover:bg-red-500 text-white active:scale-95 shadow-red-900/50 border border-red-500 cursor-pointer'
          }`}
        >
          {isPlaying ? '게임 중지' : '게임 시작'}
        </button>

      </div>

      {/* ---------------- 🎨 하단 테마 선택 컴포넌트 ---------------- */}
      <div className="mt-6 w-full flex justify-center">
        <ThemeSelector currentTheme={currentThemeId} onSelectTheme={handleThemeChange} />
      </div>

      {/* ---------------- 팝업 난이도 선택 모달 컴포넌트 ---------------- */}
      <DifficultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentDifficulty={difficulty}
        onSelectDifficulty={setDifficulty}
      />

    </div>
  );
}