import { useState, useEffect } from "react";
import { Clock3 } from "lucide-react";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

export default function DelayView({ delayItems, onDeleteDelayItem }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // 유예 탭에 머무는 동안 실시간 타이머 갱신을 위한 틱(Tick) 상태
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const categoryStyles = {
    "자기계발/업무": "bg-amber-100 text-amber-700 border-amber-200",
    "취미/소장": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  // 💡 [만료 시간 - 현재 시간]을 계산하여 남은 초를 도출하는 핵심 함수
  const getRemainingSeconds = (expireAt) => {
    if (!expireAt) return 0;
    const diffMs = expireAt - Date.now();
    return Math.max(0, Math.ceil(diffMs / 1000));
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00시간 00분 00초";
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}시간 ${mins}분 ${secs}초`;
  };

  const handleItemClick = (item, isExpired) => {
    if (isExpired) {
      setDeleteTarget(item);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDeleteDelayItem(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto space-y-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
            <Clock3 size={18} className="text-amber-500" />
            구매유예 목록 ({delayItems.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">충동구매 방지 유예 중</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-2xl flex items-center justify-between">
          <span className="text-xs text-amber-800 font-medium leading-relaxed">
            유예가 끝난 물품은 자동으로 구매 프로세스로 이동하며, 여기서 목록을 정리할 수 있습니다.
          </span>
        </div>

        <div className="space-y-3">
          {delayItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs space-y-1">
              <p>구매유예 중인 물품이 없습니다.</p>
              <p className="text-[11px] text-slate-300">필수 외의 분류 물품을 추가해 보세요!</p>
            </div>
          ) : (
            delayItems.map((item) => {
              // 💡 훅이 제공한 expireAt을 바탕으로 현재 남은 초 계산
              const remainingSecs = getRemainingSeconds(item.expireAt);
              const isExpired = remainingSecs <= 0 || item.isExpired;

              return (
                <div 
                  key={item.id} 
                  onClick={() => handleItemClick(item, isExpired)}
                  className={`rounded-2xl p-3.5 border transition-all space-y-3 relative ${
                    isExpired 
                      ? "bg-slate-100 border-slate-200 cursor-pointer hover:border-slate-300 shadow-xs" 
                      : "bg-white border-slate-100 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-14 h-14 object-cover rounded-xl shrink-0 ${isExpired ? "grayscale" : ""}`} 
                    />
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${isExpired ? "text-slate-500 line-through" : "text-slate-800"}`}>
                          {item.name}
                        </p>
                        {item.category && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyles[item.category] || 'bg-slate-100 text-slate-600'}`}>
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-black mt-1 ${isExpired ? "text-slate-400" : "text-blue-600"}`}>
                        ₩ {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                      <Clock3 size={13} className={isExpired ? "text-slate-400" : "text-amber-500 animate-pulse"} />
                      <span>
                        {isExpired ? (
                          <strong className="text-slate-600 font-bold">유예 완료됨 (클릭하여 삭제)</strong>
                        ) : (
                          <>남은 시간: <strong className="text-slate-800 font-mono">{formatTime(remainingSecs)}</strong></>
                        )}
                      </span>
                    </div>

                    {!isExpired && (
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        진행 중
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        itemName="이 유예가 완료된 목록을 삭제하면 유예탭에서 영구히 삭제됩니다."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDelayComplete={true}
      />
    </div>
  );
}