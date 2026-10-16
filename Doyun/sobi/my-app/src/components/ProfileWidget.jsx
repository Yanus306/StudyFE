import { UserRound, Wallet, ArrowRightLeft, AlertTriangle } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function ProfileWidget({ purchaseItems }) {
  // 마이페이지와 연동된 로컬스토리지 값 불러오기
  const [userName] = useLocalStorage("cofix_user_name", "도윤");
  const [totalAsset] = useLocalStorage("cofix_total_asset", 1000000);

  // 총 구매확정가 계산
  const totalConfirmedPrice = purchaseItems
    .filter(item => item.isConfirmed)
    .reduce((sum, item) => sum + (item.finalPrice || item.price), 0);

  // 남은 자산 계산 (총 자산 - 구매확정가)
  const remainingAsset = totalAsset - totalConfirmedPrice;
  const isOverBudget = remainingAsset < 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4.5 rounded-[24px] shadow-sm space-y-3.5 border border-slate-800">
      
      {/* 상단: 프로필 및 환영 문구 (버튼 제거 완료) */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
          <UserRound size={18} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">환영합니다!</p>
          <h3 className="text-xs font-extrabold text-white">{userName} 님의 자산 현황</h3>
        </div>
      </div>

      {/* 하단: 자산 상세 내역 (현재 자산 / 구매확정가 / 남은 자산) */}
      <div className="grid grid-cols-3 gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">현재 자산</p>
          <p className="text-xs font-black text-white mt-0.5 truncate">₩ {totalAsset.toLocaleString()}</p>
        </div>
        
        <div className="border-x border-white/10 px-1">
          <p className="text-[10px] text-blue-400 font-medium">구매확정가</p>
          <p className="text-xs font-black text-blue-300 mt-0.5 truncate">₩ {totalConfirmedPrice.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 font-medium">남은 자산</p>
          <p className={`text-xs font-black mt-0.5 truncate flex items-center justify-center gap-0.5 ${
            isOverBudget ? "text-rose-400 animate-pulse" : "text-emerald-400"
          }`}>
            {isOverBudget && <AlertTriangle size={12} className="shrink-0" />}
            ₩ {remainingAsset.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 예산 초과 시 안내 배너 */}
      {isOverBudget && (
        <div className="bg-rose-500/20 border border-rose-500/30 px-3 py-2 rounded-xl flex items-center gap-2 text-rose-300 text-[11px] font-bold">
          <AlertTriangle size={14} className="shrink-0 text-rose-400" />
          <span>설정된 자산보다 ₩ {Math.abs(remainingAsset).toLocaleString()} 초과 지출되었습니다!</span>
        </div>
      )}

    </div>
  );
}