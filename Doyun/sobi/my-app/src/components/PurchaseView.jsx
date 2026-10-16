import { useState } from "react";
import { ShoppingBag, CheckCircle, Circle } from "lucide-react";
import ConfirmModal from "../components/modals/ConfirmModal";
import BudgetOverModal from "../components/modals/BudgetOverModal"; 
import { useLocalStorage } from "../hooks/useLocalStorage"; 

export default function PurchaseView({ 
  purchaseItems, 
  setPurchaseItems, 
  cartItems, 
  setCartItems, 
  delayItems, 
  setDelayItems,
  totalPurchasePrice, 
  totalConfirmedPrice 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  // 마이페이지 등에서 설정한 사용자 자산(예산) 불러오기 (기본값 100,000원)
  const [userBudget] = useLocalStorage("cofix_user_budget", 100000);

  // 자산 초과 경고 모달 상태 관리
  const [isBudgetOverModalOpen, setIsBudgetOverModalOpen] = useState(false);
  const [pendingBudgetCheckItem, setPendingBudgetCheckItem] = useState(null);

  const handleOpenModal = (item) => {
    if (item.isConfirmed) return;
    setTargetItem(item);
    setIsModalOpen(true); // 1단계: 일반 구매확정 확인 모달 오픈
  };

  // 일반 구매확정 모달에서 '확인'을 눌렀을 때 실행되는 비동기 체이닝 로직
  const handleConfirmAction = () => {
    if (!targetItem) return;

    const itemPrice = targetItem.finalPrice || targetItem.price;

    // 기존 1단계 모달 닫기
    setIsModalOpen(false);

    // 자산(예산)보다 확정가가 높을 경우, 비동기식으로 자산 초과 경고 모달 띄우기
    if (itemPrice > Number(userBudget)) {
      setPendingBudgetCheckItem(targetItem);
      setIsBudgetOverModalOpen(true);
    } else {
      // 예산 이내라면 바로 최종 확정 처리 실행
      executeFinalPurchaseConfirm(targetItem);
    }

    setTargetItem(null);
  };

  // 자산 초과 모달에서 '그래도 확정'을 눌렀을 때 최종 처리
  const handleBudgetOverConfirm = () => {
    if (pendingBudgetCheckItem) {
      executeFinalPurchaseConfirm(pendingBudgetCheckItem);
    }
    setIsBudgetOverModalOpen(false);
    setPendingBudgetCheckItem(null);
  };

  // 자산 초과 모달에서 '취소하기'를 눌렀을 때
  const handleBudgetOverCancel = () => {
    setIsBudgetOverModalOpen(false);
    setPendingBudgetCheckItem(null);
  };

  // 공통 최종 구매 확정 반영 함수 (상태 업데이트 및 스토리지 동기화)
  const executeFinalPurchaseConfirm = (item) => {
    setPurchaseItems(prev =>
      prev.map(p => p.id === item.id ? { ...p, isConfirmed: true } : p)
    );

    // 💡 [수정 완료] 구매확정을 해도 장바구니(cartItems)에서 삭제되지 않도록 setCartItems 코드 제거!
    // 대신 유예 목록(delayItems)에서는 정상적으로 제거됩니다.
    setDelayItems(prev => prev.filter(d => d.id !== item.id));
  };

  const unconfirmedCount = purchaseItems.filter(item => !item.isConfirmed).length;

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto space-y-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* 상단 타이틀 및 요약 바 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
            <ShoppingBag size={18} className="text-blue-600" />
            구매 프로세스 관리
          </h2>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200/50">
            확정 대기 {unconfirmedCount}개
          </span>
        </div>

        {/* 상단 총액 요약 카드 */}
        <div className="grid grid-cols-2 gap-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-3xl shadow-sm">
          <div>
            <p className="text-[11px] text-slate-300 font-medium">총 구매 예정가</p>
            <p className="text-sm font-black mt-0.5">₩ {totalPurchasePrice}</p>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <p className="text-[11px] text-blue-400 font-medium">총 확정 지출가</p>
            <p className="text-sm font-black text-blue-300 mt-0.5">₩ {totalConfirmedPrice}</p>
          </div>
        </div>

        {/* 구매 프로세스 품목 리스트 */}
        <div className="space-y-2.5">
          {purchaseItems.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs space-y-1">
              <ShoppingBag size={32} className="mx-auto text-slate-200 mb-2" />
              <p>구매 프로세스에 등록된 품목이 없습니다.</p>
            </div>
          ) : (
            purchaseItems.map((item) => (
              <div 
                key={item.id} 
                className={`rounded-2xl p-3 border transition flex items-center gap-3 shadow-xs ${
                  item.isConfirmed 
                    ? "bg-emerald-50/40 border-emerald-100" 
                    : "bg-white border-slate-100"
                }`}
              >
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.isConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.isConfirmed ? '구매확정 완료' : '확정 대기중'}
                    </span>
                  </div>
                  <p className="text-xs font-black text-slate-900 mt-0.5">₩ {item.price.toLocaleString()}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
                    최종 확정가: ₩ {(item.finalPrice || item.price).toLocaleString()}
                  </p>
                </div>

                {/* 구매확정 버튼 */}
                <button
                  type="button"
                  onClick={() => handleOpenModal(item)}
                  disabled={item.isConfirmed}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition ${
                    item.isConfirmed 
                      ? "bg-emerald-100 text-emerald-800 cursor-default" 
                      : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-xs"
                  }`}
                >
                  {item.isConfirmed ? (
                    <>
                      <CheckCircle size={14} /> 확정됨
                    </>
                  ) : (
                    <>
                      <Circle size={14} /> 구매확정
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

      </div>

      {/* 1단계: 일반 구매확정 확인 모달 */}
      <ConfirmModal 
        isOpen={isModalOpen}
        targetItem={targetItem}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
      />

      {/* 2단계 (비동기 체이닝): 1단계 모달 확인 직후 자산 초과 시 등장하는 경고 모달 */}
      <BudgetOverModal
        isOpen={isBudgetOverModalOpen}
        itemName={pendingBudgetCheckItem?.name || ""}
        itemPrice={pendingBudgetCheckItem?.finalPrice || pendingBudgetCheckItem?.price || 0}
        currentBudget={userBudget}
        onConfirm={handleBudgetOverConfirm}
        onCancel={handleBudgetOverCancel}
      />

    </div>
  );
}