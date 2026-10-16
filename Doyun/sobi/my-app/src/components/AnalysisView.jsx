import { useState, useRef, useEffect } from "react";
import { ChartNoAxesColumn, TrendingUp, TrendingDown, Calendar, AlertCircle, History, X, Sparkles } from "lucide-react";
import { useTime } from "../hooks/useTime";

export default function AnalysisView({ purchaseItems }) {
  const { getDynamicMonths } = useTime();
  
  const currentSystemYear = new Date().getFullYear();
  const appStartYear = 2026; // 실서비스 기준 연도 설정

  const availableYears = [];
  for (let y = appStartYear; y <= currentSystemYear; y++) {
    availableYears.push(y);
  }

  const [selectedYear, setSelectedYear] = useState(currentSystemYear);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);

  const allMonths = getDynamicMonths();
  const months = allMonths.filter(m => m.year === selectedYear);
  
  const [selectedMonthKey, setSelectedMonthKey] = useState(months[0]?.key || `${currentSystemYear}-10`);

  useEffect(() => {
    if (months.length > 0 && !months.some(m => m.key === selectedMonthKey)) {
      setSelectedMonthKey(months[0].key);
    }
  }, [months, selectedMonthKey]);

  const selectedMonthObj = months.find(m => m.key === selectedMonthKey) || months[0];

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // 1. 현재 선택된 연/월에 해당하는 '실제 구매 확정 아이템'만 정밀 필터링
  const filteredRealItems = purchaseItems.filter(item => {
    if (!item.isConfirmed) return false;
    const itemDate = new Date(item.createdAt || item.id);
    return (
      itemDate.getFullYear() === Number(selectedYear) &&
      itemDate.getMonth() + 1 === Number(selectedMonthObj?.month || selectedMonthKey.split("-")[1])
    );
  });

  // 2. 실제 데이터 기반 실시간 지출 총액 및 카테고리별 비중 집계
  const totalSpent = filteredRealItems.reduce((sum, item) => sum + (item.finalPrice || item.price), 0);
  
  const categoryStats = filteredRealItems.reduce((acc, item) => {
    const cat = item.category || "기타";
    acc[cat] = (acc[cat] || 0) + (item.finalPrice || item.price);
    return acc;
  }, {});

  // 동적 AI 리포트 메시지 생성
  const reportSummaryText = filteredRealItems.length > 0
    ? `${selectedYear}년 ${selectedMonthObj?.label}은 총 ${totalSpent.toLocaleString()}원이 확정 지출되었습니다. 충동구매 방지 프로세스를 거쳐 안전하게 집행된 내역입니다.`
    : `${selectedYear}년 ${selectedMonthObj?.label}에 기록된 구매 확정 내역이 없습니다. 필수 외 물품을 유예하고 현명한 소비를 기록해 보세요!`;

  // 3. 전월 대비 실제 데이터 비교 산출
  const currentIndex = months.findIndex(m => m.key === selectedMonthKey);
  const prevMonthObj = currentIndex > 0 ? months[currentIndex - 1] : null;

  let prevMonthSpent = null;
  if (prevMonthObj) {
    const prevRealItems = purchaseItems.filter(item => {
      if (!item.isConfirmed) return false;
      const itemDate = new Date(item.createdAt || item.id);
      return (
        itemDate.getFullYear() === Number(selectedYear) &&
        itemDate.getMonth() + 1 === Number(prevMonthObj.month)
      );
    });
    prevMonthSpent = prevRealItems.reduce((sum, item) => sum + (item.finalPrice || item.price), 0);
  }

  const hasPrevData = prevMonthObj !== null && prevMonthSpent !== null;
  const diff = hasPrevData ? totalSpent - prevMonthSpent : 0;
  const isMore = diff > 0;

  return (
    <div className="w-full h-full flex flex-col relative space-y-4">
      
      {/* 1. 상단 동적 월 선택 바 */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none"
      >
        {months.map((m) => {
          const isSelected = selectedMonthKey === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedMonthKey(m.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 border ${
                isSelected 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {selectedYear !== currentSystemYear ? `${m.year}년 ${m.label}` : m.label}
            </button>
          );
        })}
      </div>

      {/* 2. 전월 대비 비교 카드 */}
      <div className={`p-4 rounded-3xl border flex items-center gap-3.5 ${
        !hasPrevData || prevMonthSpent === 0 && totalSpent === 0
          ? "bg-slate-50 border-slate-200 text-slate-700" 
          : isMore 
            ? "bg-rose-50/70 border-rose-100 text-rose-900" 
            : "bg-emerald-50/70 border-emerald-100 text-emerald-900"
      }`}>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
          !hasPrevData || prevMonthSpent === 0 && totalSpent === 0
            ? "bg-slate-200 text-slate-600" 
            : isMore 
              ? "bg-rose-500 text-white" 
              : "bg-emerald-500 text-white"
        }`}>
          {!hasPrevData || (prevMonthSpent === 0 && totalSpent === 0) ? <AlertCircle size={20} /> : isMore ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div>
          <p className="text-[11px] font-bold opacity-75">{selectedYear}년 {selectedMonthObj?.label} 소비 피드백</p>
          <p className="text-xs font-extrabold mt-0.5 leading-snug">
            {!hasPrevData ? (
              "저번 달 소비 데이터가 없습니다."
            ) : totalSpent === 0 && prevMonthSpent === 0 ? (
              "비교할 소비 내역이 없습니다."
            ) : isMore ? (
              `저번 달보다 약 ${Math.abs(diff).toLocaleString()}원 더 지출하셨습니다.`
            ) : (
              `저번 달보다 약 ${Math.abs(diff).toLocaleString()}원 덜 지출하셨습니다!`
            )}
          </p>
        </div>
      </div>

      {/* 3. 월별 총 지출 요약 카드 */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-400" /> {selectedYear}년 {selectedMonthObj?.label} 총 확정 지출
          </span>
          <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full font-bold">
            구매확정 기준
          </span>
        </div>
        <p className="text-xl font-black">
          ₩ {totalSpent.toLocaleString()}
        </p>
      </div>

      {/* 4. AI 소비 코멘트 리포트 카드 */}
      <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-3xl space-y-2">
        <h4 className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
          <Sparkles size={15} className="text-blue-600" />
          AI 소비 분석 리포트
        </h4>
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          {reportSummaryText}
        </p>
      </div>

      {/* 5. 카테고리별 소비 분석 차트 및 리스트 */}
      <div className="bg-white border border-slate-100 p-4 rounded-3xl space-y-3 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <ChartNoAxesColumn size={16} className="text-blue-600" />
          카테고리별 지출 비중
        </h3>

        {Object.keys(categoryStats).length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            해당 월에 분석할 소비 데이터가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, amount]) => {
              const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{category}</span>
                    <span className="font-extrabold text-slate-900">
                      ₩ {amount.toLocaleString()} <span className="text-[11px] text-blue-600 font-bold ml-1">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. 최하단 우측 '연도별 확인' 버튼 */}
      <div className="flex justify-end pt-1 pb-2">
        <button
          type="button"
          onClick={() => setIsYearModalOpen(true)}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md active:scale-95 transition"
        >
          <History size={15} />
         연도별 리포트 선택
        </button>
      </div>

      {/* 7. 연도 선택 모달창 */}
      {isYearModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <History size={16} className="text-blue-600" />
                연도별 리포트 선택
              </h4>
              <button
                type="button"
                onClick={() => setIsYearModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              확인하고 싶은 연도를 선택하시면 해당 연도의 월별 소비 리포트로 이동합니다.
            </p>

            <div className="space-y-2">
              {availableYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    setSelectedYear(year);
                    setIsYearModalOpen(false);
                  }}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-between transition border ${
                    selectedYear === year
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{year}년 리포트</span>
                  {selectedYear === year && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">조회중</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}