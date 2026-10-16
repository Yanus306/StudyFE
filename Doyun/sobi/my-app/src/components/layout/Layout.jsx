import {
  Bell,
  UserRound,
  Home,
  ShoppingCart,
  Clock3,
  ShoppingBag,
  ChartNoAxesColumn,
} from "lucide-react";

export default function Layout({ children, activeTab, setActiveTab, hasUnread }) {
  const navItems = [
    { label: "홈", icon: Home },
    { label: "장바구니", icon: ShoppingCart },
    { label: "구매유예", icon: Clock3 },
    { label: "구매", icon: ShoppingBag },
    { label: "분석", icon: ChartNoAxesColumn },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      
      {/* 상단 노치 아래 고정 여백 */}
      <div className="h-6 shrink-0" />

      {/* 1. 상단 헤더 */}
      <header className="flex shrink-0 items-center justify-between px-5 py-3 bg-white z-50">
        <button
          type="button"
          aria-label="알림"
          onClick={() => setActiveTab("알림")}
          className="relative rounded-full p-2 text-slate-700 transition active:bg-slate-100"
        >
          <Bell size={22} strokeWidth={1.8} />
          {/* 💡 안 읽은 알림이 있을 때만 빨간 불 표시 */}
          {hasUnread && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          aria-label="마이페이지"
          onClick={() => setActiveTab("마이페이지")}
          className="rounded-full p-2 text-slate-700 transition active:bg-slate-100"
        >
          <UserRound size={22} strokeWidth={1.8} />
        </button>
      </header>

      {/* 2. 중앙 본문 영역 */}
      <div className="flex-1 flex flex-col items-center px-4 py-3 text-slate-400 text-sm overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>

      {/* 3. 하단 네비게이션 */}
      <nav className="grid shrink-0 grid-cols-5 border-t border-slate-100 bg-white/95 px-2 pt-2 pb-5 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-50">
        {navItems.map(({ label, icon: Icon }) => {
          const active = activeTab === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(label)}
              className={`flex flex-col items-center gap-0.5 rounded-xl py-1 transition ${
                active
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px]">{label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}