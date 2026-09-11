// src/pokemonImg.js

// assets 폴더 내 .gif(포켓몬) 및 .png(아이콘) 동적 임포트
const gifModules = import.meta.glob('../assets/*.gif', { eager: true });
const pngModules = import.meta.glob('../assets/*.png', { eager: true });

const getAsset = (modules, fileName, ext) => {
  if (!fileName) return null;
  const match = Object.keys(modules).find((path) => path.endsWith(`/${fileName}.${ext}`));
  return match ? modules[match].default : null;
};

// 포켓몬 문자열 ID별 이미지 파일명 매핑
const POKEMON_ASSET_MAPPING = {
  pikachu: {
    frontImgName: 'pikachu',     // assets/test.gif
    backImgName: 'pikachu2',    // assets/test2.gif
    iconImgName: 'elec_icon', // assets/elec_icon.png
  },
  raichu: {
    frontImgName: 'raichu',   // assets/test2.gif
    backImgName: 'raichu2',     // assets/test.gif
    iconImgName: 'grss_icon', // assets/grss_icon.png
  },
    test: {
    frontImgName: 'test',   // assets/test2.gif
    backImgName: 'test2',     // assets/test.gif
    iconImgName: 'nomal_icon', // assets/grss_icon.png
  },
};

/**
 * 포켓몬 문자열 ID(예: 'pikachu')를 받아 해당 포켓몬의 이미지 에셋을 반환하는 함수
 */
export const getPokemonAssets = (pokemonId) => {
  const assets = POKEMON_ASSET_MAPPING[pokemonId];

  if (!assets) {
    return { frontImg: null, backImg: null, icon: null };
  }

  return {
    frontImg: getAsset(gifModules, assets.frontImgName, 'gif'),
    backImg: getAsset(gifModules, assets.backImgName, 'gif'),
    icon: getAsset(pngModules, assets.iconImgName, 'png'),
  };
};