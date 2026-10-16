import { AlertTriangle, X } from "lucide-react";

export default function CartDeleteConfirmModal({ isOpen, itemName, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
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
          <h4 className="font-extrabold text-slate-900 text-sm">구매확정 상품 삭제 경고</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            상품 <strong className="text-slate-900">"{itemName}"</strong>은(는) 이미 구매확정된 상품입니다. 장바구니에서 정말 삭제하시겠습니까?
          </p>
        </div>

        {/* 💡 장바구니에서 삭제해도 구매확정 기록은 안전하다는 안내 문구 추가 */}
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
         <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
    💡 장바구니 목록에서만 삭제되며, <strong className="text-slate-900">구매확정 목록에선 안전하게 남겨집니다</strong>.
  </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 rounded-2xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition active:scale-95"
          >
            확인
          </button>
        </div>
        
      </div>
    </div>
  );
}