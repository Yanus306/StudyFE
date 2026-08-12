import meow1 from '../assets/meow1.mp3';
import meow2 from '../assets/meow2.mp3';
import meow3 from '../assets/meow3.mp3';

// 4개의 사운드 파일을 배열로 관리
const meowSoundFiles = [meow1, meow2, meow3];

let isMuted = false;
let currentVolume = 0.6; // 기본 볼륨 0.6
let activeAudioList = [];

export function toggleMuteSound() {
  isMuted = !isMuted;

  // 음소거 상태에 따라 모든 오디오 볼륨 조정
  activeAudioList.forEach(audio => {
    audio.volume = isMuted ? 0 : currentVolume;
  });

  return isMuted;
}

export function getMuteState() {
  return isMuted;
}

export function setVolume(value) {
  currentVolume = value;
  
  if (!isMuted) {
    activeAudioList.forEach(audio => {
      audio.volume = currentVolume;
    });
  }
}

export function playMeowSound(radius) {
  try {
    // meow1 ~ meow4 중 무작위로 하나 선택
    const randomSoundFile = meowSoundFiles[Math.floor(Math.random() * meowSoundFiles.length)];
    const audio = new Audio(randomSoundFile);

    // 공 크기에 따른 피치(재생 속도) 설정
    const minRadius = 15;
    const maxRadius = 90;
    const minRate = 0.5; 
    const maxRate = 2.0; 

    const normalized = (radius - minRadius) / (maxRadius - minRadius);
    const rate = maxRate - normalized * (maxRate - minRate);

    audio.playbackRate = Math.max(minRate, Math.min(rate, maxRate));
    
    audio.volume = isMuted ? 0 : currentVolume;

    activeAudioList.push(audio);

    audio.onended = () => {
      activeAudioList = activeAudioList.filter(item => item !== audio);
    };

    audio.play().catch(e => {
      console.warn("오디오 재생이 차단되었거나 실패했습니다:", e);
    });
  } catch (e) {
    console.error("Audio playback error:", e);
  }
}