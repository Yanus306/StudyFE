import { useState, useEffect, useRef, useCallback } from 'react';

export function useFeverTime({ isPlaying, streak, onFeverEnd }) {
  const [isFeverTime, setIsFeverTime] = useState(false);
  const [feverActiveIndex, setFeverActiveIndex] = useState(null);
  const feverTimerRef = useRef(null);
  const waveIntervalRef = useRef(null);

  // Streak이 30 이상이고 아직 피버타임이 아니면 발동
  useEffect(() => {
    if (isPlaying && streak >= 30 && !isFeverTime) {
      triggerFeverTime();
    }
  }, [streak, isPlaying]);

  const triggerFeverTime = () => {
    setIsFeverTime(true);
    setFeverActiveIndex(null);

    // 피버타임 지속 시간 (예: 5초)
    feverTimerRef.current = setTimeout(() => {
      endFeverTime();
    }, 5000);
  };

  const endFeverTime = () => {
    setIsFeverTime(false);
    setFeverActiveIndex(null);
    if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    
    // 👉 streak을 초기화하지 않고 유지합니다!
    if (onFeverEnd) onFeverEnd(); 
  };

  // 피버타임 중 관중석 파도타기 효과 (순차적으로 칸 이동)
  const startFeverWave = useCallback((totalCells) => {
    if (!isFeverTime) return;

    let currentIndex = 0;
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);

    waveIntervalRef.current = setInterval(() => {
      setFeverActiveIndex(currentIndex);
      currentIndex = (currentIndex + 1) % totalCells;
    }, 120); // 파도 속도 조절
  }, [isFeverTime]);

  // 게임이 중지되거나 꺼질 때 타이머 정리
  useEffect(() => {
    if (!isPlaying) {
      endFeverTime();
    }
    return () => {
      if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isPlaying]);

  return {
    isFeverTime,
    feverActiveIndex,
    startFeverWave,
    endFeverTime,
  };
}