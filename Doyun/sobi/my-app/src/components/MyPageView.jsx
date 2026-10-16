import { useState } from "react";
import { UserRound, Calendar, Edit3, Lock, UserX, ChevronRight, Wallet, Clock, X, Check } from "lucide-react";
import { useTime } from "../hooks/useTime";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function MyPageView() {
  const { formatDate } = useTime();

  // 사용자 이름 및 자산 상태 (로컬스토리지 연동)
  const [userName, setUserName] = useLocalStorage("cofix_user_name", "도윤");
  const [totalAsset, setTotalAsset] = useLocalStorage("cofix_total_asset", 1000000); 

  // 💡 카테고리별 유예기간 설정 상태 (기본값: 자기계발/업무 3일, 취미/소장 7일 등)
  const [delaySettings, setDelaySettings] = useLocalStorage("cofix_delay_settings", {
    studyWork: 3,     // 자기계발/업무 (일 단위)
    hobbyCollection: 7, // 취미/소장 (일 단위)
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [isEditingAsset, setIsEditingAsset] = useState(false);
  const [tempAsset, setTempAsset] = useState(totalAsset);

  // 💡 유예기간 설정 모달 및 임시 입력 상태
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [tempStudyWork, setTempStudyWork] = useState(delaySettings.studyWork);
  const [tempHobbyCollection, setTempHobbyCollection] = useState(delaySettings.hobbyCollection);
  const [isUnified, setIsUnified] = useState(false); // 모두 통일 체크박스 상태

  const [joinDate] = useState(new Date(2026, 9, 1)); 

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      setIsEditingName(false);
    }
  };

  const handleSaveAsset = () => {
    const parsed = Number(tempAsset);
    if (!isNaN(parsed)) {
      setTotalAsset(parsed);
      setIsEditingAsset(false);
    }
  };

  // 유예기간 설정 저장 핸들러
  const handleSaveDelaySettings = () => {
    const sw = Number(tempStudyWork);
    const hc = Number(tempHobbyCollection);

    if (isNaN(sw) || isNaN(hc) || sw < 1 || hc < 1) {
      alert("유예기간은 1일 이상으로 설정해 주세요.");
      return;
    }

    setDelaySettings({
      studyWork: isUnified ? sw : sw,
      hobbyCollection: isUnified ? sw : hc,
    });
    setIsDelayModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col relative space-y-4">
      
      {/* 1. 프로필 카드 영역 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-white shadow-inner">
            <UserRound size={32} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/20 border border-white/40 text-white text-sm font-bold px-3 py-1 rounded-xl w-full focus:outline-none"
                  placeholder="이름 입력"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="bg-white text-blue-600 px-3 py-1 rounded-xl text-xs font-black shrink-0 active:scale-95 transition"
                >
                  저장
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight truncate">{userName} 님</h2>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                  className="text-[11px] bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1"
                >
                  <Edit3 size={12} /> 수정
                </button>
              </div>
            )}
            
            <p className="text-xs text-blue-100/80 font-medium mt-1 flex items-center gap-1.5">
              <Calendar size={13} className="text-blue-200" /> 
              가입일: {formatDate(joinDate)}
            </p>
          </div>
        </div>

        {/* 자산 설정 섹션 */}
        <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wallet size={18} className="text-blue-200" />
            <div>
              <p className="text-[10px] text-blue-200 font-semibold">나의 총 자산 (예산)</p>
              {isEditingAsset ? (
                <input
                  type="number"
                  value={tempAsset}
                  onChange={(e) => setTempAsset(e.target.value)}
                  className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-lg w-28 mt-0.5 focus:outline-none"
                />
              ) : (
                <p className="text-sm font-black tracking-tight mt-0.5">₩ {totalAsset.toLocaleString()}</p>
              )}
            </div>
          </div>

          {isEditingAsset ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSaveAsset}
                className="bg-white text-blue-600 px-2.5 py-1 rounded-xl text-[11px] font-black"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => setIsEditingAsset(false)}
                className="bg-white/20 text-white px-2 py-1 rounded-xl text-[11px]"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempAsset(totalAsset);
                setIsEditingAsset(true);
              }}
              className="text-[11px] bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-xl font-bold transition"
            >
              자산 설정
            </button>
          )}
        </div>
      </div>

      {/* 2. 계정 및 설정 메뉴 리스트 */}
      <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-xs space-y-1">
        <h3 className="text-[11px] font-extrabold text-slate-400 px-3 py-2">계정 및 설정</h3>

        {/* 프로필 이름 수정 */}
        <button
          type="button"
          onClick={() => {
            setTempName(userName);
            setIsEditingName(true);
          }}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Edit3 size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">프로필 이름 수정</p>
              <p className="text-[10px] text-slate-400 mt-0.5">사용자 이름을 변경합니다.</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* 💡 유예기간 설정 버튼 추가 */}
        <button
          type="button"
          onClick={() => {
            setTempStudyWork(delaySettings.studyWork);
            setTempHobbyCollection(delaySettings.hobbyCollection);
            setIsUnified(false);
            setIsDelayModalOpen(true);
          }}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">분류별 유예기간 설정</p>
              <p className="text-[10px] text-slate-400 mt-0.5">자기계발·업무 / 취미·소장 유예 기간 관리</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* 비밀번호 변경 */}
        <button
          type="button"
          onClick={() => alert("비밀번호 변경 모달 또는 페이지로 이동합니다.")}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">비밀번호 변경</p>
              <p className="text-[10px] text-slate-400 mt-0.5">계정 비밀번호를 안전하게 변경합니다.</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </div>

      {/* 3. 위험 구역 */}
      <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-xs space-y-1">
        <h3 className="text-[11px] font-extrabold text-rose-400 px-3 py-2">위험 구역</h3>

        <button
          type="button"
          onClick={() => {
            if (window.confirm("정말 회원 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50/60 transition text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition">
              <UserX size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-600">회원 탈퇴</p>
              <p className="text-[10px] text-slate-400 mt-0.5">계정과 모든 기록을 영구적으로 삭제합니다.</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </div>

      {/* 💡 4. 분류별 유예기간 설정 모달창 */}
      {isDelayModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock size={16} className="text-amber-500" />
                분류별 유예기간 설정
              </h4>
              <button
                type="button"
                onClick={() => setIsDelayModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              상품 성격에 따라 고민할 유예 기간(일)을 다르게 설정해 보세요.
            </p>

            {/* 모두 통일 체크박스 */}
            <label className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 cursor-pointer select-none">
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                isUnified ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
              }`}>
                {isUnified && <Check size={12} strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                checked={isUnified}
                onChange={(e) => setIsUnified(e.target.checked)}
                className="hidden"
              />
              <span className="text-xs font-extrabold text-slate-800">모든 분류의 유예기간 통일하기</span>
            </label>

            {/* 입력 필드 영역 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">자기계발 / 업무</p>
                  <p className="text-[10px] text-slate-400">학습, 장비, 도서 등</p>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    value={tempStudyWork}
                    onChange={(e) => setTempStudyWork(e.target.value)}
                    className="w-14 bg-white border border-slate-200 text-center text-xs font-black py-1.5 rounded-xl focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-600">일</span>
                </div>
              </div>

              <div className={`flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 transition ${
                isUnified ? "opacity-40 pointer-events-none" : ""
              }`}>
                <div>
                  <p className="text-xs font-bold text-slate-800">취미 / 소장</p>
                  <p className="text-[10px] text-slate-400">게임, 피규어, 의류 등</p>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    value={isUnified ? tempStudyWork : tempHobbyCollection}
                    onChange={(e) => setTempHobbyCollection(e.target.value)}
                    className="w-14 bg-white border border-slate-200 text-center text-xs font-black py-1.5 rounded-xl focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-600">일</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsDelayModalOpen(false)}
                className="py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveDelaySettings}
                className="py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
              >
                저장하기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}