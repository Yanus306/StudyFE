import { useState, useRef } from "react";
import { X } from "lucide-react";
import CartConfirmModal from "./CartConfirmModal";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function CartAddModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("필수"); // 필수, 자기계발/업무, 취미/소장

  const [priceError, setPriceError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  // 💡 마이페이지에서 설정한 분류별 유예기간 불러오기 (안전한 기본값 설정)
  const [delaySettings] = useLocalStorage("cofix_delay_settings", {
    studyWork: 3,
    hobbyCollection: 7,
  });

  if (!isOpen) return null;

  const handlePriceChange = (e) => {
    const val = e.target.value;
    setPrice(val);

    if (val === "") {
      setPriceError("이 입력란을 작성하세요.");
    } else {
      const num = Number(val);
      if (!Number.isInteger(num) || num < 0 || val.includes(".") || val.includes("-")) {
        setPriceError("정수만 입력할 수 있습니다.");
      } else {
        setPriceError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (price === "") {
      setPriceError("이 입력란을 작성하세요.");
      return;
    }

    const numPrice = Number(price);
    if (!Number.isInteger(numPrice) || numPrice < 0 || price.includes(".") || price.includes("-")) {
      setPriceError("정수만 입력할 수 있습니다.");
      return;
    }

    // 💡 마이페이지 설정값을 확실하게 숫자로 변환하여 가져오기 (문자열 방지)
    const rawDays = category === "자기계발/업무" 
      ? delaySettings.studyWork 
      : delaySettings.hobbyCollection;
      
    const days = Number(rawDays) || (category === "자기계발/업무" ? 3 : 7);

    // 💡 만료 절대 타임스탬프 계산 (일 단위 환산: 1일 = 24 * 60 * 60 * 1000)
    // 만약 테스트를 위해 초 단위로 빠르게 확인하고 싶다면 아래 코드를 `days * 1000`으로 변경해 보세요!
    const expireTime = Date.now() + days * 24 * 60 * 60 * 1000;

    setPendingItem({
      id: Date.now() + Math.random(), 
      name: name.trim(),
      price: numPrice,
      category: category,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=320&q=85",
      delayDays: days,
      expireAt: expireTime, // 👈 마이페이지 설정 일수가 반영된 만료 타임스탬프
      notificationEnabled: true,
    });
    setIsConfirmOpen(true);
  };

  const handleConfirmAdd = () => {
    if (pendingItem) {
      onAdd(pendingItem);
    }
    // 💡 추가 완료 후 입력폼 초기화
    setName("");
    setPrice("");
    setCategory("필수");
    setPriceError("");
    setDragY(0);
    setIsConfirmOpen(false);
    onClose();
  };

  const handleCancelAdd = () => {
    setIsConfirmOpen(false);
    setPendingItem(null);
  };

  const handleDragStart = (clientY) => {
    setIsDragging(true);
    dragStartY.current = clientY;
  };

  const handleDragMove = (clientY) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragY > 200) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <>
      <div 
        className="absolute inset-x-0 bottom-0 bg-white rounded-t-[32px] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-t border-slate-100 z-50 select-none"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div 
          className="w-full pb-3 cursor-grab active:cursor-grabbing flex flex-col items-center"
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">새 물품 등록</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">물품 이름</label>
            <input
              type="text"
              placeholder="예: 블루투스 스피커"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">가격 (원)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="예: 45000"
              value={price}
              onChange={handlePriceChange}
              className={`w-full text-xs bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 focus:outline-none ${
                priceError ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
              }`}
            />
            {priceError && (
              <p className="text-[10px] font-bold text-rose-500 mt-1 ml-0.5">{priceError}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">중요도 분류</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setCategory("필수")}
                className={`py-2 rounded-xl text-[11px] font-bold border transition ${
                  category === "필수"
                    ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                필수
              </button>
              <button
                type="button"
                onClick={() => setCategory("자기계발/업무")}
                className={`py-2 rounded-xl text-[11px] font-bold border transition ${
                  category === "자기계발/업무"
                    ? "bg-amber-400 text-slate-900 border-amber-400 shadow-xs"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                자기계발/업무
              </button>
              <button
                type="button"
                onClick={() => setCategory("취미/소장")}
                className={`py-2 rounded-xl text-[11px] font-bold border transition ${
                  category === "취미/소장"
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                취미/소장
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-xs font-bold py-3 rounded-xl shadow-sm active:bg-blue-700 mt-2"
          >
            장바구니에 추가하기
          </button>
        </form>
      </div>

      <CartConfirmModal
        isOpen={isConfirmOpen}
        category={category}
        onConfirm={handleConfirmAdd}
        onCancel={handleCancelAdd}
      />
    </>
  );
}