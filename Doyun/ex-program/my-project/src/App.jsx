import React, { useState } from 'react';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const [hunger, setHunger] = useState(80);
  const [mood, setMood] = useState(90);
  const [feedLogs, setFeedLogs] = useState(['간식을 주었어요! 🍪', '머리를 쓰다듬어 주었어요! ✨']);
  const [inputFood, setInputFood] = useState('');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleFeed = (e) => {
    e.preventDefault();
    if (!inputFood.trim()) return;
    setFeedLogs([`${inputFood}을(를) 선물했어요! 🎁`, ...feedLogs]);
    setHunger(Math.min(100, hunger + 10));
    setInputFood('');
  };

  return (
    /* ✅ 외곽 배경을 검은색(bg-black)으로 변경 */
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans">
      
      {/* 닫혀있을 때 열기 버튼 */}
      {!isOpen && (
        <button 
          onClick={handleOpen}
          className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          🐾 펫 하우스 열기
        </button>
      )}

      {/* 확장프로그램 창 영역 */}
      {isOpen && (
        <div 
          className={`w-full max-w-[400px] min-h-[500px] max-h-[90vh] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col border border-pink-200 text-slate-700 ${
            isClosing ? 'animate-popup-out' : 'animate-popup-in'
          }`}
        >
          
          {/* Header */}
          <header className="bg-pink-100/80 border-b border-pink-200 p-4 flex items-center justify-between shadow-xs shrink-0">
            <h1 className="font-bold text-sm tracking-wide flex items-center gap-2 text-pink-700">
              🌸 치이카와 펫 하우스
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-pink-200/70 text-pink-700 px-2.5 py-0.5 rounded-full font-medium">
                v1.0.0
              </span>

              <button 
                onClick={() => alert('설정 창으로 이동!')}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-200/70 hover:bg-pink-300 text-pink-700 transition active:scale-95"
                title="설정"
              >
                <svg 
                  className="w-4 h-4 spin-hover" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>

              <button 
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-200/70 hover:bg-rose-300 text-pink-700 hover:text-rose-900 transition active:scale-95 font-bold text-xs"
                title="닫기"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-pink-50/50 to-white flex flex-col gap-4">
            
            <div className="bg-pink-50/80 p-4 rounded-2xl border border-pink-100 flex flex-col items-center gap-3 shrink-0">
              <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center text-3xl shadow-inner animate-bounce">
                🐰
              </div>
              <div className="text-center">
                <h2 className="text-pink-900 font-bold text-sm">뽀송이 (Lv. 1)</h2>
                <p className="text-pink-600 text-xs">오늘도 기분이 아주 좋아요! ✨</p>
              </div>

              <div className="w-full flex flex-col gap-2 mt-1">
                <div className="flex justify-between text-xs text-pink-700 font-medium">
                  <span>포만감</span>
                  <span>{hunger}%</span>
                </div>
                <div className="w-full bg-pink-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-pink-400 h-full rounded-full transition-all duration-300" style={{ width: `${hunger}%` }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 shrink-0">
              <button 
                onClick={() => setHunger(Math.min(100, hunger + 5))}
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 py-2.5 rounded-xl font-medium text-xs transition active:scale-95 border border-pink-200"
              >
                🍪 간식 주기
              </button>
              <button 
                onClick={() => setMood(Math.min(100, mood + 5))}
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 py-2.5 rounded-xl font-medium text-xs transition active:scale-95 border border-pink-200"
              >
                💖 쓰다듬기
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs flex flex-col gap-3">
              <h3 className="text-pink-800 font-semibold text-xs">최근 상호작용 기록</h3>
              
              <form onSubmit={handleFeed} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputFood}
                  onChange={(e) => setInputFood(e.target.value)}
                  placeholder="선물할 아이템 입력..." 
                  className="flex-1 px-3 py-1.5 text-xs bg-pink-50/50 border border-pink-200 rounded-xl text-slate-700 placeholder-pink-300 focus:outline-none focus:border-pink-400"
                />
                <button 
                  type="submit"
                  className="bg-pink-400 hover:bg-pink-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-xs"
                >
                  선물
                </button>
              </form>

              <div className="flex flex-col gap-2 mt-1">
                {feedLogs.map((log, index) => (
                  <div key={index} className="bg-pink-50/60 px-3 py-2 rounded-xl text-xs text-pink-800 flex items-center justify-between border border-pink-100">
                    <span>{log}</span>
                    <span className="text-[10px] text-pink-400">방금 전</span>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* Footer */}
          <footer className="bg-pink-50/80 border-t border-pink-100 p-3 text-center text-[11px] text-pink-400 shrink-0">
            Chiikawa Pet House Extension 🐾
          </footer>

        </div>
      )}

    </div>
  );
}

export default App;