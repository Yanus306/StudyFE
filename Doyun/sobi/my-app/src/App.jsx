import Home from './components/home'

export default function App() {
  return (
    // 배경: 상하 화이트에 중앙 연한 하늘색 그라데이션
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50/60 to-white flex justify-center items-center p-4">
      
      {/* 휴대폰 외곽 프레임 (틀) */}
      <div className="relative w-[392px] h-[848px] bg-slate-900 rounded-[48px] p-[16px] shadow-[0_20px_50px_rgba(14,116,144,0.12)] ring-1 ring-slate-900/10">
        
        {/* 측면 버튼들 */}
        <div className="absolute -left-[3px] top-[130px] w-[3px] h-[35px] bg-slate-700 rounded-l-md"></div>
        <div className="absolute -left-[3px] top-[175px] w-[3px] h-[35px] bg-slate-700 rounded-l-md"></div>
        <div className="absolute -right-[3px] top-[150px] w-[3px] h-[55px] bg-slate-700 rounded-r-md"></div>

        {/* 실제 화면 영역 (w: 360px, h: 800px) 안에 컴포넌트 장착 */}
        <div className="relative w-[360px] h-[800px] bg-white rounded-[32px] overflow-hidden flex flex-col shadow-inner">
          
          {/* 상단 노치 / 카메라 영역 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[24px] w-[130px] bg-slate-900 rounded-b-xl z-50 flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 bg-black rounded-full border border-slate-700"></div>
            <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
          </div>

          {/* 내부 화면 컴포넌트 불러오기 */}
          <Home />

          {/* 하단 홈 인디케이터 바 */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-300 rounded-full z-50 pointer-events-none"></div>

        </div>
      </div>
    </div>
  );
}