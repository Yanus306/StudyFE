import React, { useState, useEffect } from 'react';
import { useMoleGame } from './main/useMoleGame';
import DifficultyModal from './main/DifficultyModal';
import ThemeSelector from './main/ThemeSelector';
import { themes } from './main/theme';
import { useFeverTime } from './main/useFeverTime';

export default function MainView() {
  const { 
    score, 
    isPlaying, 
    activeMole, 
    difficulty, 
    setDifficulty, 
    isModalOpen,
    setIsModalOpen,
    currentSetting, 
    streak,          
    level,          
    maxStats, 
    startGame, 
    stopGame, 
    handleMoleClick 
  } = useMoleGame();

  // 👉 테마 상태 관리 (로컬스토리지 연동)
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('moleGameTheme') || 'classic';
  });

  const theme = themes[currentThemeId] || themes.classic;

  const handleThemeChange = (themeId) => {
    setCurrentThemeId(themeId);
    try {
      localStorage.setItem('moleGameTheme', themeId);
    } catch (e) {}
  };

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

  // 👉 피버타임 훅 연동 (스트릭 30 달성 시 발동, 종료 후 스트릭 유지)
  const { isFeverTime, feverActiveIndex, startFeverWave } = useFeverTime({
    isPlaying,
    streak,
    onFeverEnd: () => {
      // 피버타임이 끝나도 스트릭은 초기화되지 않고 유지됩니다.
    }
  });

  // 피버타임이 시작되면 파도타기 애니메이션 실행
  useEffect(() => {
    if (isFeverTime) {
      startFeverWave(currentSetting.totalCells);
    }
  }, [isFeverTime, currentSetting.totalCells, startFeverWave]);

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen ${theme.bg} select-none text-white py-6 px-4 relative transition-colors duration-300 overflow-x-hidden`}>
      
      {/* 🔥 [피버타임 안내 배너] */}
      {isFeverTime && (
        <div className="mb-4 px-6 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 rounded-full font-extrabold text-lg animate-bounce shadow-lg tracking-wider">
          🎉 FEVER TIME! 파도타기 발동! 🎉
        </div>
      )}

      {/* 🏆 [게임 시작 전] 최고 기록 스코어판 */}
      {!isPlaying && maxStats && (
        <div className="flex flex-col items-center mb-6 w-full max-w-md animate-fade-in">
          <div className={`grid grid-cols-3 gap-3 w-full ${theme.scoreboardBg} p-4 rounded-2xl border shadow-xl backdrop-blur-sm transition-colors duration-300`}>
            <div className="flex flex-col items-center bg-black/40 py-2.5 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Max Score</span>
              <span className="text-xl font-bold text-amber-400">{maxStats.maxScore}</span>
            </div>
            <div className="flex flex-col items-center bg-black/40 py-2.5 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Max Level</span>
              <span className="text-xl font-bold text-sky-400">Lv.{maxStats.maxLevel}</span>
            </div>
            <div className="flex flex-col items-center bg-black/40 py-2.5 rounded-xl border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Max Streak</span>
              <span className="text-xl font-bold text-emerald-400">{maxStats.maxStreak}</span>
            </div>
          </div>
        </div>
      )}

      {/* 🎮 [게임 중] 현재 스코어, 레벨, Streak 스코어판 */}
      {isPlaying && (
        <div className={`flex items-center justify-center gap-4 sm:gap-6 mb-6 px-6 sm:px-10 py-3 ${theme.scoreboardBg} rounded-2xl border shadow-lg transition-colors duration-300 w-full max-w-md`}>
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider">SCORE</span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{score}</span>
          </div>

          <div className="w-[1px] h-8 sm:h-10 bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider">LEVEL</span>
            <span className="text-2xl sm:text-3xl font-bold text-sky-400">{level}</span>
          </div>

          <div className="w-[1px] h-8 sm:h-10 bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider">STREAK</span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">{streak}</span>
          </div>
        </div>
      )}

      {/* 📱💻 반응형 메인 컨테이너 (모바일: 세로 배치 / 데스크톱 md 이상: 가로 배치) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-2xl">
        
        {/* 난이도 선택 버튼 */}
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

        {/* 🪵 동적 두더지 게임 판 */}
        <div className={`${theme.boardBg} p-5 sm:p-7 rounded-3xl shadow-2xl border-4 transition-colors duration-300 flex justify-center w-full md:w-auto`}>
          <div className={`grid ${gridColsClass[currentSetting.size]} gap-2 sm:gap-2.5`}>
            {Array.from({ length: currentSetting.totalCells }).map((_, index) => {
              // 피버타임 중에는 파도타기 인덱스에 따라 두더지가 올라오고, 평소에는 activeMole을 따릅니다.
              const isMoleUp = isFeverTime ? (feverActiveIndex === index) : (activeMole && activeMole.index === index);
              
              // 피버타임 중에는 무조건 초록색 두더지만 표시됩니다.
              const moleType = isFeverTime ? 'green' : activeMole?.type;
              const moleColor = moleType === 'red' ? 'bg-red-500' : 'bg-emerald-500';

              return (
                <div
                  key={index}
                  onClick={() => handleMoleClick(index)}
                  className={`${theme.holeBg} rounded-full flex items-center justify-center shadow-inner relative overflow-hidden border-2 cursor-pointer group transition-colors duration-300`}
                  style={{ width: currentSetting.size === 8 ? '2.6rem' : '3.3rem', height: currentSetting.size === 8 ? '2.6rem' : '3.3rem' }}
                >
                  {/* 구멍 안쪽 음영 효과 */}
                  <div className={`absolute inset-1.5 ${theme.holeInner} rounded-full opacity-60 pointer-events-none transition-colors duration-300`} />
                  
                  {/* 🐹 튀어나오는 초록/빨강 버튼 */}
                  <div
                    className={`absolute w-8 sm:w-10 h-8 sm:h-10 ${moleColor} rounded-full border-2 border-black/30 flex items-center justify-center transition-all duration-150 ${
                      isMoleUp ? 'translate-y-0 scale-100' : 'translate-y-12 scale-0'
                    }`}
                  >
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

        {/* 게임 시작/중지 버튼 */}
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

      {/* 🎨 하단 테마 선택 컴포넌트 */}
      <div className="mt-6 w-full flex justify-center">
        <ThemeSelector currentTheme={currentThemeId} onSelectTheme={handleThemeChange} />
      </div>

      {/* 팝업 난이도 선택 모달 컴포넌트 */}
      <DifficultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentDifficulty={difficulty}
        onSelectDifficulty={setDifficulty}
      />

    </div>
  );
}