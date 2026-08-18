import { playMeowSound } from './Sound'; // Sound.jsx에서 playMeowSound 임포트

// 이미지 캐싱을 위한 객체
const imageCache = {};

export class Ball {
  // 👇 여기에 petType을 매개변수 맨 끝에 반드시 추가해주셔야 합니다!
  constructor(id, x, y, radius, speed, angle, color, imagePath, name = '이름 없음', heartsCount = 0, petType = 'cat') {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.diameter = Math.round(radius * 2);
    this.mass = radius * radius;
    this.color = color;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.imagePath = imagePath;
    this.imageLoaded = false;
    this.isHovered = false; // 호버 상태 초기화
    this.isSelected = false; // 선택 상태 초기화
    this.name = name; // 반려동물 이름 추가
    this.heartsCount = heartsCount; // 0부터 시작하는 하트 받은 횟수 추가
    this.hearts = []; // 하트 뿅뿅 효과를 위한 파티클 배열
    this.petType = petType; // 이제 에러가 나지 않습니다!

    // 이미지가 캐시에 없으면 새로 로드
    if (imagePath) {
      if (!imageCache[imagePath]) {
        const img = new Image();
        img.src = imagePath;
        imageCache[imagePath] = img;
      }
      this.image = imageCache[imagePath];
    }
  }

  // 하트 뿅뿅 효과 생성 메서드 (크기가 커질 때 호출)
  spawnHearts() {
    // 하트를 받을 때 카운트 증가 처리 예시
    this.heartsCount += 1;

    const heartCount = 6; // 한 번에 생성될 하트 개수
    for (let i = 0; i < heartCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1.5;
      this.hearts.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // 위로 살짝 뜨는 힘 추가
        alpha: 1.0, // 투명도
        scale: Math.random() * 0.5 + 0.8, // 크기 다양화
        life: 1.0 // 수명
      });
    }
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x + this.radius >= width) {
      this.x = width - this.radius;
      this.vx *= -1;
    }

    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y + this.radius >= height) {
      this.y = height - this.radius;
      this.vy *= -1;
    }

    // 하트 파티클 업데이트
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.vy += 0.05; // 중력 효과
      h.alpha -= 0.02; // 서서히 투명해짐

      if (h.alpha <= 0) {
        this.hearts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip(); // 원형 클리핑 적용 (고양이가 원 모양으로 잘리게 함)

    if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
      // 이미지가 로드된 경우 이미지 그리기
      ctx.drawImage(
        this.image,
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      // 이미지가 로드되기 전이나 실패한 경우 기본 배경색 채우기
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.restore();

    // 테두리 강조 로직
    if (this.isSelected) {
      ctx.strokeStyle = '#3b82f6'; // 선택된 공: 파란색 테두리
      ctx.lineWidth = 5;
    } else if (this.isHovered) {
      ctx.strokeStyle = '#fbbf24'; // 마우스 호버: 노란색 테두리
      ctx.lineWidth = 4;
    } else {
      ctx.strokeStyle = '#ffffff'; // 기본: 하얀색 테두리
      ctx.lineWidth = 2;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // 하트 뿅뿅 파티클 렌더링
    ctx.save();
    for (const h of this.hearts) {
      ctx.globalAlpha = Math.max(0, h.alpha);
      ctx.font = `${Math.round(20 * h.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💖', h.x, h.y);
    }
    ctx.restore();
  }
}

export function resolveCollision(b1, b2) {
  const dx = b2.x - b1.x;
  const dy = b2.y - b1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDist = b1.radius + b2.radius;

  if (distance < minDist) {
    const overlap = minDist - distance;
    const nx = dx / distance;
    const ny = dy / distance;

    b1.x -= nx * overlap * (b2.mass / (b1.mass + b2.mass));
    b1.y -= ny * overlap * (b2.mass / (b1.mass + b2.mass));
    b2.x += nx * overlap * (b1.mass / (b1.mass + b2.mass));
    b2.y += ny * overlap * (b1.mass / (b1.mass + b2.mass));

    const kx = b1.vx - b2.vx;
    const ky = b1.vy - b2.vy;
    const p = (2 * (nx * kx + ny * ky)) / (b1.mass + b2.mass);

    b1.vx -= p * b2.mass * nx;
    b1.vy -= p * b2.mass * ny;
    b2.vx += p * b1.mass * nx;
    b2.vy += p * b1.mass * ny;

    playMeowSound(Math.max(b1.radius, b2.radius));
  }
}