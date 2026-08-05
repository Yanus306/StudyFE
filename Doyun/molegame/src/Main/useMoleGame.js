import { useState, useEffect, useCallback, useRef } from 'react';
import { playPopSound, playStartSound, playLevelUpSound, playLevelDownSound } from '../sound';

export function useMoleGame() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMole, setActiveMole] = useState(null);
  
  const [difficulty, setDifficulty] = useState('normal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [streak, setStreak] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [level, setLevel] = useState(0);

  // 👉 최고 기록 상태 (로컬 스토리지에서 초기화)
  const [maxStats, setMaxStats] = useState(() => {
    try {
      const saved = localStorage.getItem('moleGameMaxStats');
      return saved ? JSON.parse(saved) : { maxScore: 0, maxLevel: 0, maxStreak: 0 };
    } catch (e) {
      return { maxScore: 0, maxLevel: 0, maxStreak: 0 };
    }
  });

  const streakRef = useRef(streak);
  streakRef.current = streak;
  
  const prevLevelRef = useRef(level);
  prevLevelRef.current = level;

  const scoreRef = useRef(score);
  scoreRef.current = score;

  const levelRef = useRef(level);
  levelRef.current = level;

  const difficultySettings = {
    easy: { size: 2, totalCells: 4, popInterval: 1400, hideTime: 1500 },    
    normal: { size: 4, totalCells: 16, popInterval: 1100, hideTime: 1200 }, 
    hard: { size: 8, totalCells: 64, popInterval: 800, hideTime: 900 },    
  };

  const baseSetting = difficultySettings[difficulty] || difficultySettings.normal;

  const currentSetting = {
    ...baseSetting,
    popInterval: Math.max(300, Math.round(baseSetting.popInterval / Math.pow(1.1, level))),
    hideTime: Math.max(300, Math.round(baseSetting.hideTime / Math.pow(1.1, level))),
  };

  const hideTimerRef = useRef(null);
  const activeMoleRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setLevel(0);
    setSpeedMultiplier(1);
    setIsPlaying(true);
    playStartSound(); 
    spawnMole();
  };

  const stopGame = () => {
    setIsPlaying(false);
    setActiveMole(null);
    activeMoleRef.current = null;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // 게임 종료 시에도 혹시 모를 누락 방지를 위해 최종 확인 및 저장
    setMaxStats((prev) => {
      const newMaxScore = Math.max(prev.maxScore, scoreRef.current);
      const newMaxLevel = Math.max(prev.maxLevel, levelRef.current);
      const newMaxStreak = Math.max(prev.maxStreak, streakRef.current);

      const updated = { maxScore: newMaxScore, maxLevel: newMaxLevel, maxStreak: newMaxStreak };
      try {
        localStorage.setItem('moleGameMaxStats', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });

    setStreak(0);
    setLevel(0);
    setSpeedMultiplier(1);
  };

  const handleMistake = () => {
    playPopSound('red'); 
    setScore((prev) => prev - 1); 
    setStreak(0);
    
    setLevel((prevLevel) => {
      const nextLevel = Math.max(0, prevLevel - 1);
      if (nextLevel < prevLevel) {
        playLevelDownSound(); 
      }
      return nextLevel;
    });
  };

// spawnMole 함수 내부에 피버타임 반영 예시
const spawnMole = useCallback((isFever) => {
  if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

  if (activeMoleRef.current && activeMoleRef.current.type === 'green' && !isFever) {
    handleMistake();
  }

  const randomIndex = Math.floor(Math.random() * currentSetting.totalCells);
  
  // 👉 피버타임일 때는 무조건 초록색('green') 두더지만 등장
  const randomType = isFever ? 'green' : (Math.random() < 0.7 ? 'green' : 'red');
  
  const newMole = { index: randomIndex, type: randomType };
  setActiveMole(newMole);
  activeMoleRef.current = newMole;

  hideTimerRef.current = setTimeout(() => {
    if (activeMoleRef.current && activeMoleRef.current.type === 'green' && !isFever) {
      handleMistake();
    }
    setActiveMole(null);
    activeMoleRef.current = null;
  }, currentSetting.hideTime);
}, [currentSetting]);

  useEffect(() => {
    let intervalTimer;
    
    if (isPlaying) {
      intervalTimer = setInterval(() => {
        spawnMole();
      }, currentSetting.popInterval);
    } else {
      setActiveMole(null);
      activeMoleRef.current = null;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }

    return () => {
      if (intervalTimer) clearInterval(intervalTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, currentSetting, spawnMole]);

  const handleMoleClick = useCallback((index) => {
    if (!isPlaying || !activeMoleRef.current) return;

    const currentMole = activeMoleRef.current;

    if (index === currentMole.index) {
      if (currentMole.type === 'green') {
        playPopSound('green'); 
        
        // 👉 점수가 오를 때마다 최고 점수(maxScore)와 비교하여 실시간 갱신 및 로컬스토리지 저장
        setScore((prevScore) => {
          const updatedScore = prevScore + 1;
          
          setMaxStats((prevStats) => {
            if (updatedScore > prevStats.maxScore) {
              const updated = {
                ...prevStats,
                maxScore: updatedScore,
                maxLevel: Math.max(prevStats.maxLevel, levelRef.current),
                maxStreak: Math.max(prevStats.maxStreak, streakRef.current),
              };
              try {
                localStorage.setItem('moleGameMaxStats', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            }
            return prevStats;
          });

          return updatedScore;
        });
        
        setStreak((prevStreak) => {
          const nextStreak = prevStreak + 1;
          const calculatedLevel = Math.floor(nextStreak / 10);
          
          if (calculatedLevel > prevLevelRef.current) {
            playLevelUpSound(calculatedLevel); 
          }

          setLevel(calculatedLevel);
          return nextStreak;
        });

      } else if (currentMole.type === 'red') {
        handleMistake(); 
      }
      
      setActiveMole(null);
      activeMoleRef.current = null;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isPlaying]);

  return {
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
    speedMultiplier, 
    maxStats, // 이 객체 안에 { maxScore, maxLevel, maxStreak }가 들어있으므로 컴포넌트에서 maxStats.maxScore로 바로 출력하면 됩니다!
    startGame,
    stopGame,
    handleMoleClick,
  };
}