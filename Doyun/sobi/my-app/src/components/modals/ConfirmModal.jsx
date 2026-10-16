import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, targetItem, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <AlertTriangle size={16} className="text-amber-500" />
            구매확정 안내
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-800 truncate">
            "{targetItem?.name}"
          </p>
          <p className="text-xs text-slate-600 font-medium">
            정말 구매확정하시겠습니까?
          </p>
        </div>

        {/* 💡 장바구니 자동 삭제 관련 문구를 제거하고 간결하게 수정 */}
        <p className="text-[11px] text-rose-600 font-bold text-center leading-relaxed">
          ⚠️ 한번 구매확정된 상품은 취소할 수 없습니다.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
          >
            확정하기
          </button>
        </div>

      </div>
    </div>
  );
}