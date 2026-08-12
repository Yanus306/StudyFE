import React, { useState, useEffect, useRef } from 'react';

export default function BallDetailCard({ selectedBall, onClose, onIncreaseSize }) {
  const [heartParticles, setHeartParticles] = useState([]);
  const cardRef = useRef(null);

  // 디테일 카드 바깥쪽 클릭 시 닫기
  useEffect(() => {
    if (!selectedBall) return;

    const handleClickOutside = (e) => {
      // 클릭한 대상이 카드 내부가 아닐 경우 onClose 호출
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onClose();
      }
    };

    // 약간의 딜레이를 주어 카드 자체를 클릭하며 열린 이벤트가 바로 닫히는 현상 방지
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBall, onClose]);

  if (!selectedBall) return null;

  // 하트 버튼 클릭 시 파티클 생성 및 크기 증가 함수 호출
  const handleHeartClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * -3 - 2,
      alpha: 1.0,
      scale: Math.random() * 0.4 + 0.8,
    }));

    setHeartParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setHeartParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 600);

    onIncreaseSize(selectedBall.id);
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 relative animate-fade-in"
    >
      <button 
        onClick={onClose}
        className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-700 text-xs font-bold p-1"
        title="닫기"
      >
        ✕
      </button>
      <h4 className="text-xs font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1.5 text-center">
        🔍 #{selectedBall.id} 세부 정보
      </h4>
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400 shadow-md bg-gray-100 flex items-center justify-center">
          <img 
            src={selectedBall.imagePath} 
            alt={`공 #${selectedBall.id}`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="w-full space-y-1.5 text-xs text-gray-700">
          <div className="flex justify-between bg-white/60 px-2.5 py-1.5 rounded-lg">
            <span className="text-gray-500">이름</span>
            <span className="font-bold">#{selectedBall.id}</span>
          </div>
          <div className="flex justify-between bg-white/60 px-2.5 py-1.5 rounded-lg">
            <span className="text-gray-500">지름 (크기)</span>
            <span className="font-bold">{selectedBall.diameter}px</span>
          </div>
        </div>

        {/* 하트 버튼 */}
        <div className="w-full relative overflow-hidden rounded-xl">
          <button
            onClick={handleHeartClick}
            className="w-full mt-1 py-2 bg-pink-500/80 hover:bg-pink-500 text-white font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 text-xs relative z-10"
          >
            <span>❤️</span>
          </button>

          {heartParticles.map((p) => (
            <span
              key={p.id}
              className="absolute pointer-events-none text-sm select-none animate-ping"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
              }}
            >
              💖
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}