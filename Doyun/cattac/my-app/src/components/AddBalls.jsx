import React, { useState, useEffect, useRef } from 'react';
import { playMeowSound } from './Sound';

const colors = ['#6366f1', '#2563eb', '#0ea5e9', '#d946ef', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export default function AddBallModal({ isOpen, onClose, onAddBall }) {
  const modalRef = useRef(null);
  const [name, setName] = useState('');
  const [petType, setPetType] = useState('cat'); // 기본값 'cat' ('cat' 또는 'dog')
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [uploadedImage, setUploadedImage] = useState(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedImage) return;

    // petType에 따라 명확하게 'cat' 또는 'dog' 전달
    onAddBall({
      name: name.trim() !== '' ? name : (petType === 'dog' ? '귀여운 강아지' : '귀여운 고양이'),
      petType: petType, // 'cat' 또는 'dog'
      imagePath: uploadedImage,
      color: selectedColor,
      hearts: 0,
    });

    // 입력 필드 초기화 후 모달 닫기
    setName('');
    setPetType('cat');
    setUploadedImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="w-[460px] h-[460px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-9 flex flex-col justify-between relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-base font-bold p-1 cursor-pointer"
          title="닫기"
        >
          ✕
        </button>

        <h3 className="text-base font-bold text-gray-800 text-center border-b border-gray-200 pb-3">
          🐾 반려동물 등록하기
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 justify-center">
          <div className="flex gap-6 items-center">
            {/* 왼쪽: 사진 등록 네모칸 */}
            <div className="w-36 h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200/60 transition-colors relative overflow-hidden group shrink-0">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-1">
                  <span className="text-3xl">📷</span>
                  <span className="text-xs text-gray-500 block mt-1.5 font-medium">사진 등록</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploadedImage(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            {/* 오른쪽: 이름 입력 및 강아지('dog') / 고양이('cat') 선택 */}
            <div className="flex-1 flex flex-col justify-between h-36">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 font-medium">이름</label>
                <input 
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white/90 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">반려동물을 선택해주세요!</label>
                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPetType('dog')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      petType === 'dog' 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                        : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-white'
                    }`}
                  >
                    🐶 강아지
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPetType('cat');
                      playMeowSound(40); 
                    }}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      petType === 'cat' 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                        : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-white'
                    }`}
                  >
                    🐱 고양이
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 배경 테마 색상 선택 */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">배경 테마 색상</span>
            <div className="flex gap-3 justify-center">
              {colors.slice(0, 5).map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!uploadedImage}
            className={`w-full py-3.5 font-bold rounded-xl shadow-lg transition-all text-xs ${
              uploadedImage 
                ? 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            {uploadedImage ? '등록 완료' : '사진을 등록해주세요'}
          </button>
        </form>
      </div>
    </div>
  );
}