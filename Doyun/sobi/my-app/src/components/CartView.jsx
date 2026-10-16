import { useState } from "react";
import { ShoppingCart, Plus, X } from "lucide-react";
import CartAddModal from "../components/modals/CartAddModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import CartDeleteConfirmModal from "../components/modals/CartDeleteConfirmModal"; // 👈 구매확정 상품 삭제 경고 모달 임포트
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function CartView({ cartItems, setCartItems, delayItems, setDelayItems, purchaseItems, setPurchaseItems }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 💡 1. 구매확정된 상품을 장바구니에서 삭제하려고 할 때 띄울 경고 모달 상태 관리
  const [isCartDeleteModalOpen, setIsCartDeleteModalOpen] = useState(false);
  const [cartDeleteTargetItem, setCartDeleteTargetItem] = useState(null);

  // 마이페이지에서 설정한 분류별 유예기간 불러오기
  const [delaySettings] = useLocalStorage("cofix_delay_settings", {
    studyWork: 3,
    hobbyCollection: 7,
  });

  const categoryStyles = {
    "필수": "bg-rose-100 text-rose-700 border-rose-200",
    "자기계발/업무": "bg-amber-100 text-amber-700 border-amber-200",
    "취미/소장": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const handleAddItem = (newItem) => {
    setCartItems([newItem, ...cartItems]);

    if (newItem.category === "필수") {
      if (typeof setPurchaseItems === "function") {
        const purchaseItem = {
          ...newItem,
          isConfirmed: false,
          finalPrice: newItem.price,
        };
        setPurchaseItems(prev => [purchaseItem, ...prev]);
      }
    } else {
      if (typeof setDelayItems === "function") {
        const days = newItem.category === "자기계발/업무" 
          ? Number(delaySettings.studyWork) 
          : Number(delaySettings.hobbyCollection);

        const expireTime = Date.now() + days * 24 * 60 * 60 * 1000;

        const delayItem = {
          ...newItem,
          delayDays: days,
          expireAt: expireTime,
          notificationEnabled: true,
        };

        setDelayItems(prev => [delayItem, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  // 💡 2. 장바구니 삭제 버튼을 클릭했을 때 검사하는 핸들러
  const handleRequestDeleteCart = (item) => {
    // purchaseItems에 존재하고 이미 구매확정(isConfirmed)된 상품인지 판별
    const isAlreadyConfirmed = purchaseItems.some(
      p => p.id === item.id && p.isConfirmed
    );

    if (isAlreadyConfirmed) {
      // 구매확정된 상품이라면 경고 모달 띄우기
      setCartDeleteTargetItem(item);
      setIsCartDeleteModalOpen(true);
    } else {
      // 일반 상품이라면 기존 삭제 모달 띄우기
      setDeleteTarget(item);
    }
  };

  // 💡 3. 구매확정 상품 삭제 경고 모달에서 '확인'을 눌렀을 때
  const handleConfirmCartDelete = () => {
    if (!cartDeleteTargetItem) return;
    const targetId = cartDeleteTargetItem.id;

    // 장바구니에서만 삭제 (구매확정/유예 목록은 유지되거나 기획에 맞게 처리)
    setCartItems(prev => prev.filter(item => item.id !== targetId));

    setIsCartDeleteModalOpen(false);
    setCartDeleteTargetItem(null);
  };

  // 일반 상품 삭제 처리
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;

    setCartItems(prev => prev.filter(item => item.id !== targetId));
    if (typeof setDelayItems === "function") {
      setDelayItems(prev => prev.filter(item => item.id !== targetId));
    }
    if (typeof setPurchaseItems === "function") {
      setPurchaseItems(prev => prev.filter(item => item.id !== targetId));
    }

    setDeleteTarget(null);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString();

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto space-y-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
            <ShoppingCart size={18} className="text-blue-600" />
            장바구니 목록 ({cartItems.length})
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition"
          >
            <Plus size={14} /> 물품 추가
          </button>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-2xl flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">장바구니 총 금액</span>
          <span className="text-sm font-black text-blue-700">₩ {totalPrice}</span>
        </div>

        <div className="space-y-2.5">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              장바구니에 담긴 물품이 없습니다. 물품을 추가해 보세요!
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-slate-100 shadow-xs relative">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.category && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyles[item.category] || 'bg-slate-100 text-slate-600'}`}>
                          {item.category}
                        </span>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleRequestDeleteCart(item)} // 💡 구매확정 여부 판별 핸들러 연결
                        className="w-5 h-5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                        aria-label="삭제"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-black text-blue-600 mt-1">₩ {item.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CartAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddItem} 
      />

      {/* 일반 상품 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* 💡 구매확정된 상품 장바구니 삭제 경고 모달 */}
      <CartDeleteConfirmModal
        isOpen={isCartDeleteModalOpen}
        itemName={cartDeleteTargetItem?.name || ""}
        onConfirm={handleConfirmCartDelete}
        onCancel={() => {
          setIsCartDeleteModalOpen(false);
          setCartDeleteTargetItem(null);
        }}
      />
    </div>
  );
}