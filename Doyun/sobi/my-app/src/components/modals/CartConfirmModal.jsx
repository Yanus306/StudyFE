export default function CartConfirmModal({ isOpen, category, onConfirm, onCancel }) {
  if (!isOpen) return null;

  // 분류별 강조 텍스트 색상 맵핑
  const categoryColorStyles = {
    "필수": "text-rose-600 font-black",
    "자기계발/업무": "text-amber-600 font-black",
    "취미/소장": "text-emerald-600 font-black",
  };

  // 안내 문구 생성 로직 (거치지 않고: 초록 / 거치고: 빨강)
  const renderMessage = () => {
    if (category === "필수") {
      return (
        <>
          <span className={categoryColorStyles["필수"]}>필수</span> 분류로 지정하면 유예기간을 <span className="text-emerald-600 font-black">거치지 않고</span> 바로 구매 항목으로 보낼 수 있습니다.
          <span className="block mt-1 text-slate-800">추가하시겠습니까?</span>
        </>
      );
    } else {
      return (
        <>
          <span className={categoryColorStyles[category] || "text-slate-900 font-black"}>'{category}'</span> 분류로 지정하면 유예기간을 <span className="text-rose-600 font-black">거치고</span> 구매 항목으로 보내지게 됩니다.
          <span className="block mt-1 text-slate-800">추가하시겠습니까?</span>
        </>
      );
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-5 select-none pointer-events-none">
      <div className="bg-white w-full max-w-xs rounded-[28px] p-5 shadow-2xl border border-slate-200 text-center space-y-4 pointer-events-auto">
        <h3 className="text-xs font-medium text-slate-700 leading-relaxed px-1">
          {renderMessage()}
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
            className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl active:bg-blue-700 transition shadow-xs"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}