import React, { useEffect, useRef, useState } from 'react';

export default function BallDetailCard({ selectedBall, onClose }) {
  const cardRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 디테일 카드 바깥쪽 클릭 시 닫기
  useEffect(() => {
    if (!selectedBall) return;

    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBall, onClose]);

  // 공이 바뀌거나 카드가 닫힐 때 큰 이미지 모달도 같이 닫기
  useEffect(() => {
    setIsModalOpen(false);
  }, [selectedBall]);

  if (!selectedBall) return null;

  // petType에 따라 보여줄 텍스트 결정
  const petTypeText = selectedBall.petType === 'dog' ? '🐶 강아지' : selectedBall.petType === 'cat' ? '🐱 고양이' : '정보 없음';

  return (
    <>
      <div 
        ref={cardRef}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-700 text-xs font-bold p-1 cursor-pointer"
          title="닫기"
        >
          ✕
        </button>

        <h4 className="text-xs font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1.5 text-center">
          🔍 #{selectedBall.id} 세부 정보
        </h4>

        <div className="flex flex-col items-center gap-3">
          {/* 사진에 호버 효과 및 클릭 이벤트 추가 */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400 shadow-md bg-gray-100 flex items-center justify-center cursor-pointer relative group transition-transform duration-200 hover:scale-105"
            title="클릭하여 크게 보기"
          >
            <img 
              src={selectedBall.imagePath} 
              alt={`공 #${selectedBall.id}`} 
              className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
            />
            {/* 호버 시 살짝 회색빛 오버레이와 돋보기 아이콘 효과 */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-xs font-bold">
              🔍
            </div>
          </div>
          
          <div className="w-full space-y-1.5 text-xs text-gray-700">
            <div className="flex justify-between bg-white/60 px-2.5 py-1.5 rounded-lg">
              <span className="text-gray-500">이름</span>
              <span className="font-bold">{selectedBall.name || '이름 없음'}</span>
            </div>

            {/* 고양이 / 강아지 여부 표시 */}
            <div className="flex justify-between bg-white/60 px-2.5 py-1.5 rounded-lg">
              <span className="text-gray-500">종류</span>
              <span className="font-bold">{petTypeText}</span>
            </div>
            
            <div className="flex justify-between bg-white/60 px-2.5 py-1.5 rounded-lg">
              <span className="text-gray-500">지름 (크기)</span>
              <span className="font-bold">{selectedBall.diameter}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* 화면 정중앙에 띄워주는 큰 이미지 모달 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl p-4 shadow-2xl max-w-lg w-full flex flex-col items-center gap-4 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              title="닫기"
            >
              ✕
            </button>

            <div className="text-sm font-bold text-gray-800 mt-1">
              #{selectedBall.id} - {selectedBall.name || '이름 없음'} ({petTypeText})
            </div>

            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100 flex items-center justify-center">
              <img 
                src={selectedBall.imagePath} 
                alt={`공 확대 #${selectedBall.id}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}