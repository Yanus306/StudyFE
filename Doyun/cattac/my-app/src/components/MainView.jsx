import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ball, resolveCollision } from './Balls';
import { toggleMuteSound, getMuteState, setVolume } from './Sound';
import RankingBoard from '../components/RankingBoard';
import BallDetailCard from '../components/BallDetailCard';
import AddBallModal from '../components/AddBalls';
import GameControls from '../components/GameControls';
import { useResetTimer } from '../hooks/ResetTimer';

const MAX_BALLS = 50;

// 기준이 되는 가상 캔버스 크기
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

export default function MainView() {
  const canvasRef = useRef(null);
  const [muted, setMuted] = useState(getMuteState());
  const [volume, setVolumeLevel] = useState(0.5);
  const [rankings, setRankings] = useState([]);
  const [selectedBall, setSelectedBall] = useState(null);
  const [isRankingsOpen, setIsRankingsOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 줌 레벨 상태 (1.0 = 100%, 3.0 = 300%)
  const [zoomLevel, setZoomLevel] = useState(1.0);
  
  const timeLeft = useResetTimer();

  const ballsRef = useRef([]);
  const ballIdCounter = useRef(1);
  const mousePosRef = useRef({ x: -1, y: -1 });
  
  const scaleRef = useRef(1);
  const zoomRef = useRef(zoomLevel);

  // 화면 패닝(드래그 이동)을 위한 오프셋 Ref (가상 좌표계 기준)
  const panRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false); // 드래그 중 이동 여부 체크용 (클릭 구분을 위해)

  // zoomLevel이 바뀔 때마다 zoomRef 업데이트 및 100%일 때 패닝 초기화
  useEffect(() => {
    zoomRef.current = zoomLevel;
    if (zoomLevel === 1.0) {
      panRef.current = { x: 0, y: 0 };
    }
  }, [zoomLevel]);

  const selectedBallRef = useRef(selectedBall);
  useEffect(() => {
    selectedBallRef.current = selectedBall;
  }, [selectedBall]);

  // 공 추가 로직
  const handleAddBall = useCallback(({ name, petType, imagePath, color }) => {
    if (ballsRef.current.length >= MAX_BALLS) {
      const removedBall = ballsRef.current.shift();
      setSelectedBall((prev) => (prev && prev.id === removedBall.id ? null : prev));
    }

    const radius = 25; 
    const speed = Math.max(1.0, 4.5 - (radius / 25));
    const angle = Math.random() * Math.PI * 2;
    
    const x = Math.random() * (BASE_WIDTH - radius * 2) + radius;
    const y = Math.random() * (BASE_HEIGHT - radius * 2) + radius;

    const newBall = new Ball(
      ballIdCounter.current++, 
      x, y, radius, speed, angle, 
      color, imagePath, 
      name || '이름 없음', 
      0,
      petType // petType 전달
    );
    ballsRef.current.push(newBall);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      scaleRef.current = Math.min(scaleX, scaleY);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 공통 좌표 변환 헬퍼 함수
    const getVirtualCoords = (clientX, clientY) => {
      const effectiveScale = scaleRef.current * zoomRef.current;
      const currentWidth = BASE_WIDTH * effectiveScale;
      const currentHeight = BASE_HEIGHT * effectiveScale;
      
      const baseOffsetX = (canvas.width - currentWidth) / 2;
      const baseOffsetY = (canvas.height - currentHeight) / 2;

      const x = (clientX - baseOffsetX - panRef.current.x) / effectiveScale;
      const y = (clientY - baseOffsetY - panRef.current.y) / effectiveScale;
      return { x, y };
    };

    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // 좌클릭만
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          hasMovedRef.current = true;
        }

        dragStartRef.current = { x: e.clientX, y: e.clientY };

        const effectiveScale = scaleRef.current * zoomRef.current;
        panRef.current.x += dx;
        panRef.current.y += dy;

        const maxPanX = (BASE_WIDTH * effectiveScale) / 2;
        const maxPanY = (BASE_HEIGHT * effectiveScale) / 2;
        panRef.current.x = Math.max(-maxPanX, Math.min(maxPanX, panRef.current.x));
        panRef.current.y = Math.max(-maxPanY, Math.min(maxPanY, panRef.current.y));
      }

      const virtual = getVirtualCoords(clientX, clientY);
      mousePosRef.current = virtual;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      mousePosRef.current = { x: -1, y: -1 };
    };

    const handleCanvasClick = (e) => {
      if (hasMovedRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const { x: clickX, y: clickY } = getVirtualCoords(clientX, clientY);

      const clicked = [...ballsRef.current].reverse().find((ball) => {
        const dx = clickX - ball.x;
        const dy = clickY - ball.y;
        return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
      });

     if (clicked) {
        setSelectedBall({
          id: clicked.id,
          name: clicked.name,
          radius: clicked.radius,
          diameter: clicked.diameter,
          imagePath: clicked.imagePath,
          color: clicked.color,
          heartsCount: clicked.heartsCount || 0,
          petType: clicked.petType // <--- 이 부분을 추가해 주세요!
        });
      }
    };

    // 마우스 휠 이벤트 핸들러
    const handleWheel = (e) => {
      e.preventDefault();
      setZoomLevel((prevZoom) => {
        const step = 0.1;
        let newZoom = e.deltaY < 0 ? prevZoom + step : prevZoom - step;
        newZoom = Math.max(1.0, Math.min(3.0, newZoom));
        return Math.round(newZoom * 10) / 10;
      });
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    let animationFrameId;
    let frameCount = 0;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#bae6fd');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      
      const effectiveScale = scaleRef.current * zoomRef.current;
      const currentWidth = BASE_WIDTH * effectiveScale;
      const currentHeight = BASE_HEIGHT * effectiveScale;
      const offsetX = (canvas.width - currentWidth) / 2 + panRef.current.x;
      const offsetY = (canvas.height - currentHeight) / 2 + panRef.current.y;

      ctx.translate(offsetX, offsetY);
      ctx.scale(effectiveScale, effectiveScale);

      // --- 1920x1080 기준 게임 영역 테두리 (하얀색 박스 및 약간의 반투명 배경) 출력 ---
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // 내부 영역을 살짝 하얗게 채워 경계 구분을 도움
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

      ctx.strokeStyle = '#ffffff'; // 하얀색 외곽선
      ctx.lineWidth = 6;           // 두께 설정 (필요시 조절 가능)
      ctx.strokeRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
      ctx.restore();
      // -------------------------------------------------------------

      const balls = ballsRef.current;
      const mouse = mousePosRef.current;
      let isAnyHovered = false;

      for (let i = 0; i < balls.length; i++) {
        balls[i].update(BASE_WIDTH, BASE_HEIGHT);
      }

      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          resolveCollision(balls[i], balls[j]);
        }
      }

      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        
        const dx = mouse.x - ball.x;
        const dy = mouse.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        ball.isHovered = distance <= ball.radius;
        ball.isSelected = selectedBallRef.current && selectedBallRef.current.id === ball.id;

        if (ball.isHovered) {
          isAnyHovered = true;
        }

        ball.draw(ctx);
      }

      ctx.restore();

      canvas.style.cursor = isDraggingRef.current ? 'grabbing' : (isAnyHovered ? 'pointer' : 'grab');

      frameCount++;
      if (frameCount % 10 === 0) {
        const sorted = [...balls].sort((a, b) => b.diameter - a.diameter);
        setRankings(sorted);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      <GameControls 
        timeLeft={timeLeft}
        muted={muted}
        onToggleMute={() => setMuted(toggleMuteSound())}
        volume={volume}
        onChangeVolume={(e) => {
          const val = parseFloat(e.target.value);
          setVolumeLevel(val);
          setVolume(val);
        }}
        ballCount={ballsRef.current.length}
        maxBalls={MAX_BALLS}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="absolute top-6 right-6 w-56 flex flex-col gap-3 z-10">
       <RankingBoard 
          rankings={rankings}
          maxBalls={MAX_BALLS}
          selectedBallId={selectedBall?.id}
          onSelectBall={(ball) => {
            const currentBall = ballsRef.current.find(b => b.id === ball.id) || ball;
            setSelectedBall({
              id: currentBall.id,
              name: currentBall.name,
              radius: currentBall.radius,
              diameter: currentBall.diameter,
              imagePath: currentBall.imagePath,
              color: currentBall.color,
              heartsCount: currentBall.heartsCount || 0,
              petType: currentBall.petType // <--- 여기도 추가해 주세요!
            });
          }}
          isOpen={isRankingsOpen}
          onToggleOpen={() => setIsRankingsOpen(!isRankingsOpen)}
        />

        <BallDetailCard 
          selectedBall={selectedBall} 
          onClose={() => setSelectedBall(null)} 
        />
      </div>

      {/* 오른쪽 하단 돋보기(줌 조절) 슬라이더 컨트롤 (마우스 휠과 연동됨) */}
      <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 z-10 text-xs text-gray-700">
        <span className="font-bold flex items-center gap-1">
          🔍 줌 ({Math.round(zoomLevel * 100)}%)
        </span>
        <input 
          type="range" 
          min="1.0" 
          max="3.0" 
          step="0.1" 
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          className="w-24 accent-blue-500 cursor-pointer"
        />
      </div>

      <AddBallModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBall={handleAddBall}
      />
    </div>
  );
}