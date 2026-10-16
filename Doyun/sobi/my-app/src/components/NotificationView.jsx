import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useTime } from "../hooks/useTime";

export default function NotificationView({ notifications, setNotifications }) {
  const { formatDate } = useTime();
  
  // 💡 개별 알림 클릭 시 읽음 처리하는 함수
  const handleReadNotification = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // 알림 모두 읽음 처리
  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // 개별 알림 삭제 (이벤트 버블링 방지 추가)
  const handleDeleteNotification = (e, id) => {
    e.stopPropagation(); // 삭제 버튼 누를 때 카드 클릭 이벤트(읽음 처리)가 중복 실행되는 것을 방지
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto space-y-4 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* 상단 타이틀 및 '모두 읽음' 버튼 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
            <Bell size={18} className="text-blue-600" />
            알림함 ({unreadCount}개 안 읽음)
          </h2>
          
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              type="button"
              onClick={handleReadAll}
              className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl flex items-center gap-1 active:scale-95 transition"
            >
              <CheckCheck size={13} /> 모두 읽음
            </button>
          )}
        </div>

        {/* 알림 안내 배너 */}
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
          <span className="text-xs text-slate-600 font-medium">
            구매유예가 완료된 물품들의 알림이 여기에 실시간으로 도착합니다.
          </span>
        </div>

        {/* 알림 목록 렌더링 */}
        <div className="space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs space-y-1">
              <Bell size={32} className="mx-auto text-slate-200 mb-2" />
              <p>새로운 알림이 없습니다.</p>
              <p className="text-[11px] text-slate-300">구매유예가 완료되면 알림이 울립니다!</p>
            </div>
          ) : (
            notifications.map((noti) => (
              <div 
                key={noti.id} 
                onClick={() => handleReadNotification(noti.id)} // 💡 카드 클릭 시 읽음 처리
                className={`rounded-2xl p-3.5 border transition-all flex items-center gap-3 relative cursor-pointer ${
                  noti.isRead ? "bg-white border-slate-100 opacity-75" : "bg-blue-50/40 border-blue-100 shadow-xs"
                }`}
              >
                <img src={noti.image} alt={noti.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{noti.message}</p>
                    {!noti.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">₩ {noti.price.toLocaleString()} ({noti.category})</p>
                  
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      {formatDate(noti.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteNotification(e, noti.id)} // 💡 버블링 방지 적용
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}