// src/components/BattleUI.jsx
import React, { useState } from 'react';

export default function BattleUI({
  enemy,
  player,
  enemyHp,
  playerHp,
  menuMode,
  log,
  isEnemyDisappearing,
  isShaking,
  pokemonList = [],
  handleChangeEnemy,
  handleChangePlayer,
  handleFightClick,
  handleBackToMain,
  handleUseMove,
  handleReset,
  setLog,
}) {
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  return (
    <div 
      className={`relative w-screen h-screen bg-amber-50 text-slate-900 font-mono flex flex-col justify-between p-[2vmin] select-none overflow-hidden transition-transform ${
        isShaking ? 'translate-x-[1vmin] -translate-y-[0.5vmin] rotate-1 scale-102' : ''
      }`}
    >
      {/* === 1. 배틀 필드 전체 영역 === */}
      <div className="relative h-full w-full flex flex-col justify-between p-[2vmin] overflow-hidden">
        
        {/* 1. 적 포켓몬 컨테이너 */}
        <div className="relative self-end mr-[32vmin] mt-[12vmin] shrink-0">
          {/* 적 HP 바 */}
          <div className="absolute -top-[8vmin] left-[18vmin] z-20 w-[42vmin] bg-amber-100 border-[0.4vmin] border-slate-800 rounded-[1vmin] p-[1.2vmin] shadow-lg">
            <div className="flex justify-between items-center mb-[0.4vmin] font-extrabold text-[clamp(12px,2vmin,18px)] leading-none text-slate-900">
              <div className="flex items-center gap-[0.5vmin]">
                {enemy.icon && <img src={enemy.icon} alt="icon" className="w-[2.2vmin] h-[2.2vmin] object-contain" />}
                <span>{enemy.name}</span>
              </div>
              <span className="text-[clamp(10px,1.4vmin,13px)] bg-slate-200 px-[0.8vmin] py-[0.2vmin] rounded border border-slate-400">{enemy.type}</span>
            </div>
            <div className="w-full bg-slate-300 h-[1.8vmin] min-h-[9px] rounded-full overflow-hidden border-[0.2vmin] border-slate-700">
              <div 
                className={`h-full transition-all duration-500 ease-out ${
                  enemyHp > enemy.maxHp * 0.5 ? 'bg-emerald-500' : enemyHp > enemy.maxHp * 0.2 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* 적 포켓몬 타일 & 이미지 */}
          <div className="relative w-[28vmin] h-[28vmin] flex items-center justify-center">
            {/* 적 원형 발판 타일 */}
            <div className="absolute bottom-[1vmin] left-1/2 -translate-x-1/2 w-[26vmin] h-[7vmin] bg-emerald-700/60 border-[0.4vmin] border-emerald-900/80 rounded-[50%] shadow-inner z-0 transform rotate-x-12" />
            <div className="absolute bottom-[1.8vmin] left-1/2 -translate-x-1/2 w-[22vmin] h-[5vmin] bg-emerald-500/40 rounded-[50%] z-0" />

            {/* 적 포켓몬 이미지 */}
            <img 
              src={enemy.frontImg} 
              alt={enemy.name} 
              style={{ imageRendering: 'pixelated' }}
              className={`relative z-10 w-[95%] h-[95%] object-contain transition-all duration-700 ease-in-out ${
                isEnemyDisappearing 
                  ? 'translate-y-[30vmin] opacity-0 scale-95' 
                  : 'translate-y-0 opacity-100'
              }`}
            />
          </div>
        </div>

        {/* 2. 내 포켓몬 영역 & 코멘트 */}
        <div className="flex items-end gap-[4vmin] w-full px-[3vmin] mb-[15vmin]">
          
          {/* 내 포켓몬 컨테이너 */}
          <div className="relative ml-[40vmin] shrink-0">
            {/* 내 HP 바 */}
            <div className="absolute -top-[12vmin] right-[25vmin] z-20 w-[42vmin] bg-amber-100 border-[0.4vmin] border-slate-800 rounded-[1vmin] p-[1.2vmin] shadow-lg">
              <div className="flex justify-between items-center mb-[0.4vmin] font-extrabold text-[clamp(12px,2vmin,18px)] leading-none text-slate-900">
                <div className="flex items-center gap-[0.5vmin]">
                  {player.icon && <img src={player.icon} alt="icon" className="w-[2.2vmin] h-[2.2vmin] object-contain" />}
                  <span>{player.name}</span>
                </div>
                <span className="text-[clamp(10px,1.4vmin,13px)] bg-slate-200 px-[0.8vmin] py-[0.2vmin] rounded border border-slate-400">{player.type}</span>
              </div>
              <div className="w-full bg-slate-300 h-[1.8vmin] min-h-[9px] rounded-full overflow-hidden border-[0.2vmin] border-slate-700">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    playerHp > player.maxHp * 0.5 ? 'bg-emerald-500' : playerHp > player.maxHp * 0.2 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(playerHp / player.maxHp) * 100}%` }}
                />
              </div>
              <div className="text-right text-[clamp(10px,1.5vmin,14px)] font-bold text-slate-700 mt-[0.4vmin]">
                {playerHp} / {player.maxHp}
              </div>
            </div>

            {/* 내 포켓몬 타일 & 이미지 */}
            <div className="relative w-[30min] h-[30vmin] flex items-center justify-center">
              {/* 내 원형 발판 타일 */}
              <div className="absolute bottom-[1vmin] left-1/2 -translate-x-1/2 w-[26vmin] h-[7vmin] bg-emerald-700/60 border-[0.4vmin] border-emerald-900/80 rounded-[50%] shadow-inner z-0 transform rotate-x-12" />
              <div className="absolute bottom-[1.8vmin] left-1/2 -translate-x-1/2 w-[22vmin] h-[5vmin] bg-emerald-500/40 rounded-[50%] z-0" />

              {/* 내 포켓몬 이미지 */}
              <img 
                src={player.backImg} 
                alt={player.name} 
                style={{ imageRendering: 'pixelated' }}
                className="relative z-10 w-[100%] h-[100%] object-contain"
              />
            </div>
          </div>

          {/* 내 포켓몬 옆 코멘트 텍스트 (뒤로가기 버튼 제거됨) */}
          <div className="relative mb-[17vmin] max-w-[35vmin]">
            <p 
              className="font-sans font-semibold text-[clamp(14px,2.4vmin,24px)] text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              style={{ textShadow: '2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
            >
              ▶ {log}
            </p>
          </div>

        </div>

      </div>

      {/* === 2. 화면 우측 중앙 배치: 동그라미 버튼 4개 + 중앙 컨트롤 버튼 === */}
      <div className="absolute top-[70%] right-[20vmin] -translate-y-1/2 z-10 flex items-center justify-center">
        {menuMode === 'main' ? (
          /* 메인 커맨드 (ABXY 레이아웃) */
          <div className="relative w-[28vmin] h-[28vmin]">
            {/* 중앙 미니 장식 동그라미 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3.5vmin] h-[3.5vmin] bg-slate-800 rounded-full border border-slate-600 shadow-inner z-10" />

            {/* 위 (Y 위치): 포켓몬 */}
            <button
              onClick={() => setIsChangeModalOpen(true)}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[10vmin] h-[10vmin] bg-emerald-500 hover:bg-emerald-600 text-white rounded-full border-[0.4vmin] border-slate-800 transition-all active:scale-90 shadow-lg flex items-center justify-center cursor-pointer font-black text-[clamp(10px,1.6vmin,15px)]"
            >
              포켓몬
            </button>

            {/* 왼쪽 (X 위치): 도구 */}
            <button
              onClick={() => setLog('가방을 열었습니다.')}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-[10vmin] h-[10vmin] bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full border-[0.4vmin] border-slate-800 transition-all active:scale-90 shadow-lg flex items-center justify-center cursor-pointer font-black text-[clamp(10px,1.6vmin,15px)]"
            >
              도구
            </button>

            {/* 오른쪽 (B 위치): 도망 */}
            <button
              onClick={() => setLog('도망칠 수 없다!')}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-[10vmin] h-[10vmin] bg-blue-500 hover:bg-blue-600 text-white rounded-full border-[0.4vmin] border-slate-800 transition-all active:scale-90 shadow-lg flex items-center justify-center cursor-pointer font-black text-[clamp(10px,1.6vmin,15px)]"
            >
              도망
            </button>

            {/* 아래 (A 위치): 싸운다 */}
            <button
              disabled={isEnemyDisappearing}
              onClick={handleFightClick}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[10vmin] h-[10vmin] bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-full border-[0.4vmin] border-slate-800 transition-all active:scale-90 shadow-lg flex items-center justify-center cursor-pointer font-black text-[clamp(10px,1.6vmin,15px)]"
            >
              싸운다
            </button>
          </div>
        ) : (
          /* 기술 선택 패드 (ABXY 레이아웃) */
          <div className="relative w-[28vmin] h-[28vmin]">
            {/* 중앙 뒤로가기 버튼 (직관적인 ↩ 아이콘 및 활성화 피드백 적용) */}
            <button
              onClick={handleBackToMain}
              title="뒤로가기"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4.5vmin] h-[4.5vmin] bg-rose-600 hover:bg-rose-500 text-white rounded-full border-[0.3vmin] border-slate-900 transition-all active:scale-85 shadow-md z-20 flex items-center justify-center cursor-pointer font-bold text-[clamp(12px,2vmin,18px)]"
            >
              ↩
            </button>

            {/* 위: 10만볼트 */}
            <button
              disabled={isEnemyDisappearing}
              onClick={() => handleUseMove('10만볼트', 'ELEC')}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[10vmin] h-[10vmin] bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-slate-900 rounded-full border-[0.3vmin] border-slate-800 transition-all active:scale-90 shadow-md flex items-center justify-center cursor-pointer font-bold text-[clamp(9px,1.3vmin,12px)] text-center"
            >
              ⚡<br/>10만볼트
            </button>

            {/* 왼쪽: 덩굴채찍 */}
            <button
              disabled={isEnemyDisappearing}
              onClick={() => handleUseMove('덩굴채찍', 'GRSS')}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-[10vmin] h-[10vmin] bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50 text-slate-900 rounded-full border-[0.3vmin] border-slate-800 transition-all active:scale-90 shadow-md flex items-center justify-center cursor-pointer font-bold text-[clamp(9px,1.3vmin,12px)] text-center"
            >
              🍃<br/>덩굴채찍
            </button>

            {/* 오른쪽: 화염방사 */}
            <button
              disabled={isEnemyDisappearing}
              onClick={() => handleUseMove('화염방사', 'FIRE')}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-[10vmin] h-[10vmin] bg-red-100 hover:bg-red-200 disabled:opacity-50 text-slate-900 rounded-full border-[0.3vmin] border-slate-800 transition-all active:scale-90 shadow-md flex items-center justify-center cursor-pointer font-bold text-[clamp(9px,1.3vmin,12px)] text-center"
            >
              🔥<br/>화염방사
            </button>

            {/* 아래: 몸통박치기 */}
            <button
              disabled={isEnemyDisappearing}
              onClick={() => handleUseMove('몸통박치기', 'NRML')}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[10vmin] h-[10vmin] bg-white hover:bg-slate-200 disabled:opacity-50 text-slate-900 rounded-full border-[0.3vmin] border-slate-800 transition-all active:scale-90 shadow-md flex items-center justify-center cursor-pointer font-bold text-[clamp(9px,1.3vmin,12px)] text-center"
            >
              💥<br/>몸통박치기
            </button>
          </div>
        )}
      </div>

      {/* 상단 우측 컨트롤 버튼들 (리셋 & 포켓몬 교체) */}
      <div className="absolute top-[1vmin] right-[1vmin] z-40 flex gap-[1vmin]">
        <button
          onClick={() => setIsChangeModalOpen(true)}
          className="px-[2vmin] py-[0.8vmin] bg-emerald-700/90 hover:bg-emerald-600 text-white text-[clamp(10px,1.4vmin,14px)] font-bold rounded border border-emerald-500 transition-colors cursor-pointer shadow-md flex items-center gap-[0.5vmin]"
        >
          🐾 포켓몬 교체
        </button>
        <button
          onClick={handleReset}
          className="px-[2vmin] py-[0.8vmin] bg-slate-800/80 hover:bg-slate-700 text-white text-[clamp(10px,1.4vmin,14px)] rounded border border-slate-600 transition-colors cursor-pointer shadow-md"
        >
          🔄 리셋
        </button>
      </div>

      {/* === 3. 포켓몬 선택 모달 창 === */}
      {isChangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-[2vmin]">
          <div className="w-[80vmin] max-w-[600px] bg-amber-50 border-[0.5vmin] border-slate-800 rounded-[1.5vmin] p-[3vmin] shadow-2xl flex flex-col gap-[2vmin]">
            <div className="flex justify-between items-center border-b-[0.3vmin] border-slate-800 pb-[1vmin]">
              <h2 className="text-[clamp(14px,2.5vmin,22px)] font-black text-slate-900">🐾 포켓몬 교체 설정</h2>
              <button 
                onClick={() => setIsChangeModalOpen(false)}
                className="text-slate-600 hover:text-slate-900 font-bold text-[clamp(14px,2.5vmin,22px)] cursor-pointer px-[1vmin]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-[2vmin]">
              {/* 적 포켓몬 선택 컬럼 */}
              <div className="flex flex-col gap-[1vmin] bg-amber-100/60 border-[0.3vmin] border-slate-700 p-[1.5vmin] rounded-[1vmin]">
                <span className="font-extrabold text-[clamp(12px,1.8vmin,16px)] text-red-600 border-b border-slate-400 pb-[0.5vmin]">
                  🔴 적 포켓몬 선택
                </span>
                <div className="flex flex-col gap-[0.8vmin] max-h-[22vmin] overflow-y-auto overflow-x-hidden pr-[0.8vmin] scroll-smooth">
                  {pokemonList.map((p) => (
                    <button
                      key={`enemy-${p.id}`}
                      onClick={() => {
                        handleChangeEnemy(p);
                        setIsChangeModalOpen(false);
                      }}
                      className={`flex items-center justify-between p-[1vmin] rounded border text-left transition-all cursor-pointer shrink-0 ${
                        enemy.id === p.id 
                          ? 'bg-red-500 text-white font-bold border-slate-800 shadow' 
                          : 'bg-white hover:bg-red-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-[0.8vmin]">
                        {p.icon && <img src={p.icon} alt="" className="w-[2.2vmin] h-[2.2vmin] object-contain" />}
                        <span className="text-[clamp(11px,1.6vmin,15px)]">{p.name}</span>
                      </div>
                      <span className="text-[clamp(9px,1.2vmin,11px)] opacity-80 bg-slate-100/80 px-[0.5vmin] py-[0.1vmin] rounded border border-slate-300">{p.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 내 포켓몬 선택 컬럼 */}
              <div className="flex flex-col gap-[1vmin] bg-amber-100/60 border-[0.3vmin] border-slate-700 p-[1.5vmin] rounded-[1vmin]">
                <span className="font-extrabold text-[clamp(12px,1.8vmin,16px)] text-emerald-600 border-b border-slate-400 pb-[0.5vmin]">
                  🟢 내 포켓몬 선택
                </span>
                <div className="flex flex-col gap-[0.8vmin] max-h-[22vmin] overflow-y-auto overflow-x-hidden pr-[0.8vmin] scroll-smooth">
                  {pokemonList.map((p) => (
                    <button
                      key={`player-${p.id}`}
                      onClick={() => {
                        handleChangePlayer(p);
                        setIsChangeModalOpen(false);
                      }}
                      className={`flex items-center justify-between p-[1vmin] rounded border text-left transition-all cursor-pointer shrink-0 ${
                        player.id === p.id 
                          ? 'bg-emerald-600 text-white font-bold border-slate-800 shadow' 
                          : 'bg-white hover:bg-emerald-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-[0.8vmin]">
                        {p.icon && <img src={p.icon} alt="" className="w-[2.2vmin] h-[2.2vmin] object-contain" />}
                        <span className="text-[clamp(11px,1.6vmin,15px)]">{p.name}</span>
                      </div>
                      <span className="text-[clamp(9px,1.2vmin,11px)] opacity-80 bg-slate-100/80 px-[0.5vmin] py-[0.1vmin] rounded border border-slate-300">{p.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsChangeModalOpen(false)}
                className="px-[2.5vmin] py-[0.8vmin] bg-slate-800 hover:bg-slate-700 text-white font-bold text-[clamp(11px,1.6vmin,15px)] rounded cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}