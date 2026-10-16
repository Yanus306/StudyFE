import { AlertTriangle, X } from "lucide-react";

export default function BudgetOverModal({ isOpen, itemName, itemPrice, currentBudget, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    // 💡 [수정 전] bg-black/40 backdrop-blur-xs 제거
    // [수정 후] 배경색이 없는 투명한 전체 영역 컨테이너
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      
      {/* 💡 모달 본체 (pointer-events-auto를 추가하여 모달만 클릭 가능하게 함) */}
      <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-200 select-none pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <button 
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="font-extrabold text-slate-900 text-sm">설정 자산 초과 경고</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            현재 상품 <strong className="text-slate-900">"{itemName}"</strong>의 가격(₩ {itemPrice?.toLocaleString()})이 설정된 자산(₩ {currentBudget?.toLocaleString()})보다 더 높은 금액입니다.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl">
          <p className="text-[11px] text-amber-800 font-medium">
            예산 범위를 초과하는 지출입니다. 정말 구매 확정하시겠습니까?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95"
          >
            취소하기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 rounded-2xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition active:scale-95"
          >
            그래도 확정
          </button>
        </div>
      </div>
    </div>
  );
}