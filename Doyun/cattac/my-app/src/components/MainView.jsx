import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ball, resolveCollision } from './Balls';
import { toggleMuteSound, getMuteState, setVolume } from './Sound';
import RankingBoard from '../components/RankingBoard';
import BallDetailCard from '../components/BallDetailCard';

import cat1 from '../assets/cat1.png';
import cat2 from '../assets/cat2.png';
import cat3 from '../assets/cat3.png';
import cat4 from '../assets/cat4.png';
import cat5 from '../assets/cat5.png';

const catImages = [cat1, cat2, cat3, cat4, cat5];
const MAX_BALLS = 50;
const MAX_DIAMETER = 600; // 최대 지름 600px 제한 상수
const RESET_TIME_KEY = 'app_reset_target_time'; // 6시간 타이머 기준 저장용 키
const SIX_HOURS = 6 * 60 * 60 * 1000; // 6시간 (밀리초)

export default function MainView() {
  const canvasRef = useRef(null);
  const [muted, setMuted] = useState(getMuteState());
  const [volume, setVolumeLevel] = useState(0.5);
  const [rankings, setRankings] = useState([]);
  const [selectedBall, setSelectedBall] = useState(null);
  const [isRankingsOpen, setIsRankingsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState('06:00:00');

  const ballsRef = useRef([]);
  const ballIdCounter = useRef(1);
  const mousePosRef = useRef({ x: -1, y: -1 });

  // 6시간 주기 초기화 타이머 및 새로고침 로직
  useEffect(() => {
    let targetTime = localStorage.getItem(RESET_TIME_KEY);
    const now = Date.now();

    if (!targetTime || now >= parseInt(targetTime, 10)) {
      targetTime = now + SIX_HOURS;
      localStorage.setItem(RESET_TIME_KEY, targetTime.toString());
    }

    const timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const difference = parseInt(targetTime, 10) - currentTime;

      if (difference <= 0) {
        clearInterval(timerInterval);
        localStorage.removeItem(RESET_TIME_KEY);
        window.location.reload();
        return;
      }

      const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const addBall = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (ballsRef.current.length >= MAX_BALLS) {
      const removedBall = ballsRef.current.shift();
      setSelectedBall((prev) => (prev && prev.id === removedBall.id ? null : prev));
    }

    const colors = ['#6366f1', '#2563eb', '#0ea5e9', '#d946ef', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    
    // 항상 지름 50px (반지름 25px)로 생성
    const radius = 25; 
    const speed = Math.max(1.0, 4.5 - (radius / 25));
    const angle = Math.random() * Math.PI * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const randomImage = catImages[Math.floor(Math.random() * catImages.length)];
    
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;

    const newBall = new Ball(ballIdCounter.current++, x, y, radius, speed, angle, color, randomImage);
    ballsRef.current.push(newBall);
  }, []);

  // 공 크기 증가 로직 (최대 600px 제한)
  const handleIncreaseSize = (ballId) => {
    ballsRef.current = ballsRef.current.map((ball) => {
      if (ball.id === ballId) {
        const nextDiameter = ball.diameter + 10; // 지름 기준 10px씩 증가
        if (nextDiameter <= MAX_DIAMETER) {
          const newRadius = ball.radius + 5; // 반지름 5 증가 (지름 10 증가)
          ball.radius = newRadius;
          ball.diameter = newRadius * 2;
          ball.spawnHearts();
        }
      }
      return ball;
    });

    // 선택된 공의 카드 정보도 즉시 갱신 (최대 600px 넘지 않게)
    setSelectedBall((prev) => {
      if (prev && prev.id === ballId) {
        const nextDiameter = prev.diameter + 10;
        if (nextDiameter <= MAX_DIAMETER) {
          const newRadius = prev.radius + 5;
          return {
            ...prev,
            radius: newRadius,
            diameter: newRadius * 2,
          };
        }
      }
      return prev;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1, y: -1 };
    };

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clicked = [...ballsRef.current].reverse().find((ball) => {
        const dx = clickX - ball.x;
        const dy = clickY - ball.y;
        return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
      });

      if (clicked) {
        setSelectedBall({
          id: clicked.id,
          radius: clicked.radius,
          diameter: clicked.diameter,
          imagePath: clicked.imagePath,
          color: clicked.color
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleCanvasClick);

    let animationFrameId;
    let frameCount = 0;

    const update = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#bae6fd');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const balls = ballsRef.current;
      const mouse = mousePosRef.current;
      let isAnyHovered = false;

      for (let i = 0; i < balls.length; i++) {
        balls[i].update(canvas.width, canvas.height);
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
        ball.isSelected = selectedBall && selectedBall.id === ball.id;

        if (ball.isHovered) {
          isAnyHovered = true;
        }

        ball.draw(ctx);
      }

      canvas.style.cursor = isAnyHovered ? 'pointer' : 'default';

      frameCount++;
      if (frameCount % 10 === 0) {
        const sorted = [...balls].sort((a, b) => b.diameter - a.diameter);
        setRankings(sorted);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedBall]);

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* 중앙 상단 초기화 타이머 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="px-5 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 flex items-center gap-2 text-gray-800 font-bold">
          <span className="text-xs text-gray-500 font-medium">초기화까지</span>
          <span className="tracking-wider text-base font-mono">{timeLeft}</span>
        </div>
      </div>

      {/* 왼쪽 상단 사운드 버튼 그룹 */}
      <div className="absolute top-6 left-6 z-10 group flex items-center gap-3">
        <button 
          onClick={() => setMuted(toggleMuteSound())} 
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-200 border border-white/40 active:scale-95 ${muted ? 'bg-red-500/80 text-white' : 'bg-white/80 hover:bg-white text-gray-800'}`}
          title={muted ? "사운드 켜기" : "사운드 끄기"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <div className="hidden group-hover:flex items-center bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white/40 transition-opacity">
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolumeLevel(val);
              setVolume(val);
            }}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 오른쪽 상단: 순위표와 세부 정보 카드 컨테이너 */}
      <div className="absolute top-6 right-6 w-56 flex flex-col gap-3 z-10">
        <RankingBoard 
          rankings={rankings}
          maxBalls={MAX_BALLS}
          selectedBallId={selectedBall?.id}
          onSelectBall={(ball) => setSelectedBall({
            id: ball.id,
            radius: ball.radius,
            diameter: ball.diameter,
            imagePath: ball.imagePath,
            color: ball.color
          })}
          isOpen={isRankingsOpen}
          onToggleOpen={() => setIsRankingsOpen(!isRankingsOpen)}
        />

        <BallDetailCard 
          selectedBall={selectedBall} 
          onClose={() => setSelectedBall(null)} 
          onIncreaseSize={handleIncreaseSize}
        />
      </div>

      {/* 등록하기 버튼 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <button 
          onClick={addBall} 
          className="px-8 py-3 bg-white/80 hover:bg-white text-gray-800 font-semibold rounded-3xl shadow-lg backdrop-blur-md border border-white/40 active:scale-95"
        >
          등록하기 ({ballsRef.current.length}/{MAX_BALLS})
        </button>
      </div>
    </div>
  );
}