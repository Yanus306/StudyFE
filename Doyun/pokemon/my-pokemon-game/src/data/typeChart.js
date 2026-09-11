// src/data/typeChart.js

// 1. 18가지 타입 상성표 정의
export const TYPE_CHART = {
  NRML: { BRCK: 0.5, STEE: 0.5, GHOST: 0 },
  FIRE: { GRSS: 2, ICE: 2, BUG: 2, STEE: 2, FIRE: 0.5, WATR: 0.5, BRCK: 0.5, DRAG: 0.5 },
  WATR: { FIRE: 2, GRND: 2, BRCK: 2, WATR: 0.5, GRSS: 0.5, DRAG: 0.5 },
  GRSS: { WATR: 2, GRND: 2, BRCK: 2, FIRE: 0.5, GRSS: 0.5, POIS: 0.5, FLY: 0.5, BUG: 0.5, DRAG: 0.5, STEE: 0.5 },
  ELEC: { WATR: 2, FLY: 2, GRSS: 0.5, ELEC: 0.5, DRAG: 0.5, GRND: 0 },
  ICE:  { GRSS: 2, GRND: 2, FLY: 2, DRAG: 2, FIRE: 0.5, WATR: 0.5, ICE: 0.5, STEE: 0.5 },
  FIGH: { NRML: 2, ICE: 2, BRCK: 2, DARK: 2, STEE: 2, POIS: 0.5, FLY: 0.5, PSYC: 0.5, BUG: 0.5, FAIRY: 0.5, GHOST: 0 },
  POIS: { GRSS: 2, FAIRY: 2, POIS: 0.5, GRND: 0.5, BRCK: 0.5, GHOST: 0.5, STEE: 0 },
  GRND: { FIRE: 2, ELEC: 2, POIS: 2, BRCK: 2, STEE: 2, GRSS: 0.5, BUG: 0.5, FLY: 0 },
  FLY:  { GRSS: 2, FIGH: 2, BUG: 2, ELEC: 0.5, BRCK: 0.5, STEE: 0.5 },
  PSYC: { FIGH: 2, POIS: 2, PSYC: 0.5, STEE: 0.5, DARK: 0 },
  BUG:  { GRSS: 2, PSYC: 2, DARK: 2, FIRE: 0.5, FIGH: 0.5, POIS: 0.5, FLY: 0.5, GHOST: 0.5, STEE: 0.5, FAIRY: 0.5 },
  BRCK: { FIRE: 2, ICE: 2, FLY: 2, BUG: 2, FIGH: 0.5, GRND: 0.5, STEE: 0.5 },
  GHOST:{ PSYC: 2, GHOST: 2, DARK: 0.5, NRML: 0 },
  DRAG: { DRAG: 2, STEE: 0.5, FAIRY: 0 },
  DARK: { PSYC: 2, GHOST: 2, FIGH: 0.5, DARK: 0.5, FAIRY: 0.5 },
  STEE: { ICE: 2, BRCK: 2, FAIRY: 2, FIRE: 0.5, WATR: 0.5, ELEC: 0.5, STEE: 0.5 },
  FAIRY:{ FIGH: 2, DRAG: 2, DARK: 2, FIRE: 0.5, POIS: 0.5, STEE: 0.5 },
};

// 2. [핵심] pokemonData.js에서 불러오는 getMultiplier 함수 내보내기 (export)
export const getMultiplier = (attackType, defenderType) => {
  return TYPE_CHART[attackType]?.[defenderType] ?? 1;
};