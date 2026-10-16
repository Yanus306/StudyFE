export default function DeleteConfirmModal({ isOpen, itemName, onConfirm, onCancel, isDelayComplete }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-5 select-none pointer-events-none">
      <div className="bg-white w-full max-w-xs rounded-[28px] p-5 shadow-2xl border border-slate-200 text-center space-y-4 pointer-events-auto">
        <h3 className="text-xs font-medium text-slate-700 leading-relaxed px-1">
          {isDelayComplete ? (
            <>
              <span className="text-slate-900 font-bold">{itemName}</span><br />
              <span className="text-rose-600 font-black mt-1 block">정말 이 물품을 삭제하시겠습니까?</span>
            </>
          ) : (
            <>
              <span className="text-slate-900 font-bold">'{itemName}'</span> 물품을 삭제하면<br />
              <span className="text-slate-600">유예탭과 구매탭에서도 함께 삭제됩니다.</span>
              <span className="block mt-1 text-rose-600 font-black">정말 이 물품을 삭제하시겠습니까?</span>
            </>
          )}
        </h3>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-slate-100 text-slate-600 text-xs font-bold py-2.5 rounded-xl active:bg-slate-200 transition"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-rose-600 text-white text-xs font-bold py-2.5 rounded-xl active:bg-rose-700 transition shadow-xs"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}