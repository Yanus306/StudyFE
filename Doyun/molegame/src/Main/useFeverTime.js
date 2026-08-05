import { useState, useEffect, useRef, useCallback } from 'react';

export function useFeverTime({ isPlaying, streak, onFeverEnd }) {
  // -------------------------------------------------------------
  // 1. 상태 및 레퍼런스(Ref) 정의
  // -------------------------------------------------------------
  const [isFeverTime, setIsFeverTime] = useState(false);     // 피버타임 활성화 여부
  const [feverActiveIndex, setFeverActiveIndex] = useState(null); // 파도타기 시 현재 불이 들어오는 셀 인덱스
  const feverTimerRef = useRef(null);   // 피버타임 전체 지속 시간을 제어하는 타이머 레퍼런스
  const waveIntervalRef = useRef(null); // 파도타기 애니메이션 주기를 제어하는 인터벌 레퍼런스

  // -------------------------------------------------------------
  // 2. 스트릭 조건 달성 시 피버타임 자동 발동 감지 (useEffect)
  // -------------------------------------------------------------
  useEffect(() => {
    // 게임 중이고, 스트릭이 30 이상이며, 현재 피버타임 상태가 아닐 때 발동
    if (isPlaying && streak >= 30 && !isFeverTime) {
      triggerFeverTime();
    }
  }, [streak, isPlaying]);

  // -------------------------------------------------------------
  // 3. 피버타임 시작 함수
  // -------------------------------------------------------------
  const triggerFeverTime = () => {
    setIsFeverTime(true);
    setFeverActiveIndex(null);

    // 피버타임 지속 시간 설정 (여기서는 5초 동안 유지 후 종료)
    feverTimerRef.current = setTimeout(() => {
      endFeverTime();
    }, 5000);
  };

  // -------------------------------------------------------------
  // 4. 피버타임 종료 함수 (타이머 및 인터벌 정리)
  // -------------------------------------------------------------
  const endFeverTime = () => {
    setIsFeverTime(false);
    setFeverActiveIndex(null);
    
    // 동작 중이던 타이머와 인터벌 정리
    if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    
    // 👉 streak을 초기화하지 않고 그대로 유지하기 위해 콜백 함수 호출
    if (onFeverEnd) onFeverEnd(); 
  };

  // -------------------------------------------------------------
  // 5. 파도타기 애니메이션 실행 함수 (useCallback으로 최적화)
  // -------------------------------------------------------------
  const startFeverWave = useCallback((totalCells) => {
    if (!isFeverTime) return;

    let currentIndex = 0;
    // 기존에 돌고 있던 인터벌이 있다면 먼저 제거
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);

    // 일정 간격(120ms)마다 다음 셀로 인덱스를 순차적으로 이동시켜 파도타기 연출
    waveIntervalRef.current = setInterval(() => {
      setFeverActiveIndex(currentIndex);
      currentIndex = (currentIndex + 1) % totalCells; // 마지막 셀에 도달하면 처음으로 순환
    }, 120); 
  }, [isFeverTime]);

  // -------------------------------------------------------------
  // 6. 게임 종료 또는 컴포넌트 언마운트 시 정리 작업 (Cleanup)
  // -------------------------------------------------------------
  useEffect(() => {
    // 게임이 중지되면 피버타임도 즉시 강제 종료
    if (!isPlaying) {
      endFeverTime();
    }
    // 컴포넌트가 사라질 때 메모리 누수 방지를 위해 타이머와 인터벌 모두 해제
    return () => {
      if (feverTimerRef.current) clearTimeout(feverTimerRef.current);
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isPlaying]);

  // -------------------------------------------------------------
  // 7. 외부 컴포넌트에서 사용할 상태 및 함수 반환
  // -------------------------------------------------------------
  return {
    isFeverTime,
    feverActiveIndex,
    startFeverWave,
    endFeverTime,
  };
}