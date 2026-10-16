import { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import { ShoppingCart, Clock3, ShoppingBag, ChevronRight } from "lucide-react";
import CartView from "./CartView";
import DelayView from "./DelayView";
import PurchaseView from "./PurchaseView";
import NotificationView from "./NotificationView";
import AnalysisView from "./AnalysisView";
import MyPageView from "./MyPageView";
import ProfileWidget from "./ProfileWidget";
import { useDelayTimer } from "../hooks/useDelayTimer";
import { useTime } from "../hooks/useTime";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function HomeComp() {
  const [activeTab, setActiveTab] = useState("홈");

  // 💡 모든 핵심 상태를 로컬스토리지와 연동하여 영구 보존
  const [cartItems, setCartItems] = useLocalStorage("cofix_cart_items", []);
  const [purchaseItems, setPurchaseItems] = useLocalStorage("cofix_purchase_items", []);
  const [notifications, setNotifications] = useLocalStorage("cofix_notifications", []);
  const [delayItems, setDelayItems] = useLocalStorage("cofix_delay_items", []);

  const { getCurrentTimestamp } = useTime();

  // 💡 유예 만료 시 구매 프로세스 이동 및 알림 생성 함수
  const handleExpireToPurchase = (expiredItem) => {
    // 1. 구매 프로세스(purchaseItems)에 중복 없이 추가
    setPurchaseItems((prevPurchase) => {
      if (prevPurchase.some(p => p.id === expiredItem.id)) return prevPurchase;
      return [{
        ...expiredItem,
        isConfirmed: false,
        finalPrice: expiredItem.price,
      }, ...prevPurchase];
    });

    // 2. 알림함(notifications)에 알림 생성 (중복 방지 체크 포함)
    setNotifications((prevNotis) => {
      // 이미 해당 아이템 ID로 알림이 존재하면 중복 생성 안 함
      if (prevNotis.some(n => n.itemId === expiredItem.id)) return prevNotis;
      
      const newNotification = {
        id: Date.now() + Math.random(),
        itemId: expiredItem.id, // 💡 아이템 고유 ID 매칭용
        name: expiredItem.name,
        image: expiredItem.image,
        price: expiredItem.price,
        category: expiredItem.category,
        message: `"${expiredItem.name}"의 구매유예 시간이 완료되었습니다!`,
        createdAt: getCurrentTimestamp(),
        isRead: false, // 💡 읽지 않음 상태로 설정하여 알림함에 빨간 불(뱃지) 점등
      };

      return [newNotification, ...prevNotis];
    });
  };

  // 타이머 훅에 로컬스토리지 상태와 setter 연동 (3초 테스트)
  useDelayTimer(3, handleExpireToPurchase, delayItems, setDelayItems);

  // 💡 추가 안전 장치: delayItems 상태가 바뀔 때 이미 만료되었으나 알림이 없는 경우 강제 동기화
  useEffect(() => {
    if (!delayItems || delayItems.length === 0) return;

    delayItems.forEach(item => {
      const isFinished = item.isExpired || item.timeLeft === 0;
      if (isFinished) {
        // 이미 알림함에 있는지 체크
        const hasNoti = notifications.some(n => n.itemId === item.id);
        if (!hasNoti) {
          handleExpireToPurchase(item);
        }
      }
    });
  }, [delayItems]);

  const handleDeleteDelayItem = (id) => {
    setDelayItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleConfirm = (id) => {
    setPurchaseItems(prev =>
      prev.map(item => item.id === id ? { ...item, isConfirmed: !item.isConfirmed } : item)
    );
  };

  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString();
  const cartExtraCount = cartItems.length > 3 ? cartItems.length - 3 : 0;
  const delayExtraCount = delayItems.length > 3 ? delayItems.length - 3 : 0;

  const totalPurchasePrice = purchaseItems.reduce((sum, item) => sum + item.price, 0).toLocaleString();
  const totalConfirmedPrice = purchaseItems
    .filter(item => item.isConfirmed)
    .reduce((sum, item) => sum + (item.finalPrice || item.price), 0)
    .toLocaleString();

  const unconfirmedCount = purchaseItems.filter(item => !item.isConfirmed).length;
  const hasUnreadNotification = notifications.some(n => !n.isRead);

  const renderHomeContent = () => (
    <div className="w-full space-y-4 py-2">
      
      {/* 프로필 위젯 */}
      <ProfileWidget purchaseItems={purchaseItems} setActiveTab={setActiveTab} />

      {/* 1. 장바구니 위젯 */}
      <section className="rounded-[24px] bg-gradient-to-br from-blue-50/90 to-indigo-50/50 p-4 border border-blue-100/70 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-blue-700">
            <ShoppingCart size={20} strokeWidth={2.2} />
            <h2 className="text-[15px] font-extrabold text-slate-900">장바구니</h2>
          </div>
          {cartExtraCount > 0 && (
            <span className="text-[11px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
              ... 외 {cartExtraCount}개의 상품
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {cartItems.length === 0 ? (
            <div className="col-span-3 text-center py-4 text-slate-400 text-xs">
              장바구니가 비어 있습니다.
            </div>
          ) : (
            cartItems.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white/90 rounded-2xl p-2 border border-blue-100/40 text-center shadow-xs">
                <img src={item.image} alt={item.name} className="w-full h-16 object-cover rounded-xl mb-1.5" />
                <p className="text-[11px] font-bold text-slate-800 truncate">{item.name}</p>
                <p className="text-[10px] font-medium text-slate-500 truncate">₩ {item.price.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-blue-100/60">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">총 금액 </span>
            <span className="text-sm font-black text-slate-900 ml-1">₩ {totalCartPrice}</span>
          </div>
          <button
            onClick={() => setActiveTab("장바구니")}
            className="flex items-center gap-0.5 text-xs font-bold text-blue-600 active:opacity-75"
          >
            전체 보기 <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* 2. 구매유예 위젯 */}
      <section className="rounded-[24px] bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-amber-100/40 p-4 border border-amber-200/70 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-800">
            <Clock3 size={20} strokeWidth={2.2} className="text-amber-500" />
            <h2 className="text-[15px] font-extrabold text-slate-900">구매유예</h2>
          </div>
          {delayExtraCount > 0 && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/50">
              ... 외 {delayExtraCount}개의 상품
            </span>
          )}
        </div>

        <div className="space-y-2 mb-3">
          {delayItems.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              구매유예 중인 물품이 없습니다.
            </div>
          ) : (
            delayItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-white/95 rounded-2xl p-2.5 border border-amber-100/60 shadow-xs">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs font-black text-slate-900 mt-0.5">₩ {item.price.toLocaleString()}</p>
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                    <Clock3 size={11} className="text-amber-500" /> {item.isExpired || item.timeLeft === 0 ? "유예 완료됨" : "유예 진행중"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-amber-100/70">
          <button
            onClick={() => setActiveTab("구매유예")}
            className="flex items-center gap-0.5 text-xs font-bold text-amber-700 hover:text-amber-800 active:opacity-75 transition"
          >
            전체 보기 <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* 3. 구매 위젯 */}
      <section className="rounded-[24px] bg-gradient-to-br from-sky-50/90 to-blue-50/50 p-4 border border-blue-100/70 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-blue-700">
            <ShoppingBag size={20} strokeWidth={2.2} />
            <h2 className="text-[15px] font-extrabold text-slate-900">구매 프로세스</h2>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-full">
              총 {purchaseItems.length}개 품목
            </span>
            {purchaseItems.length > 0 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200/50">
                확정대기 {unconfirmedCount}개
              </span>
            )}
          </div>
        </div>

        {purchaseItems.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs bg-white/60 rounded-2xl border border-blue-100/40 mb-3">
            구매 프로세스에 등록된 품목이 없습니다.
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white/90 rounded-2xl p-3 border border-blue-100/40 mb-3 shadow-xs">
            <img src={purchaseItems[0].image} alt={purchaseItems[0].name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">{purchaseItems[0].name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${purchaseItems[0].isConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {purchaseItems[0].isConfirmed ? '구매확정' : '구매확정 전'}
                </span>
              </div>
              <p className="text-xs font-black text-slate-900 mt-0.5">₩ {purchaseItems[0].price.toLocaleString()}</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-0.5">확정가: ₩ {(purchaseItems[0].finalPrice || purchaseItems[0].price).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 bg-white/60 p-2.5 rounded-2xl mb-3 text-center border border-blue-100/50">
          <div>
            <p className="text-[10px] text-slate-500 font-medium">총 구매가</p>
            <p className="text-xs font-black text-slate-900 mt-0.5">₩ {totalPurchasePrice}</p>
          </div>
          <div className="border-l border-blue-100">
            <p className="text-[10px] text-blue-600 font-medium">총 확정가</p>
            <p className="text-xs font-black text-blue-700 mt-0.5">₩ {totalConfirmedPrice}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-blue-100/60">
          <button
            onClick={() => setActiveTab("구매")}
            className="flex items-center gap-0.5 text-xs font-bold text-blue-600 active:opacity-75"
          >
            전체 보기 <ChevronRight size={15} />
          </button>
        </div>
      </section>

    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "홈":
        return renderHomeContent();
      case "장바구니":
        return (
          <CartView 
            cartItems={cartItems} 
            setCartItems={setCartItems} 
            delayItems={delayItems}
            setDelayItems={setDelayItems}
            purchaseItems={purchaseItems}
            setPurchaseItems={setPurchaseItems}
          />
        );
      case "구매유예":
        return (
          <DelayView 
            delayItems={delayItems} 
            onDeleteDelayItem={handleDeleteDelayItem} 
          />
        );
      case "구매":
        return (
          <PurchaseView 
            purchaseItems={purchaseItems} 
            setPurchaseItems={setPurchaseItems}
            cartItems={cartItems}
            setCartItems={setCartItems}
            delayItems={delayItems}
            setDelayItems={setDelayItems}
            totalPurchasePrice={totalPurchasePrice} 
            totalConfirmedPrice={totalConfirmedPrice} 
          />
        );
      case "알림":
        return (
          <NotificationView 
            notifications={notifications} 
            setNotifications={setNotifications} 
          />
        );
      case "분석":
        return <AnalysisView purchaseItems={purchaseItems} />;
      case "마이페이지":
        return <MyPageView />;
      default:
        return <p className="font-bold text-slate-800 text-base">준비 중인 화면</p>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} hasUnread={hasUnreadNotification}>
      {renderContent()}
    </Layout>
  );
}