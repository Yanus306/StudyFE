// src/pokemonData.js
import { getMultiplier } from '../data/typeChart';
import { getPokemonAssets } from './PokemonImg';

const POKEMON_CONFIGS = [
  {
    id: 'pikachu',
    name: '피카츄',
    type: 'ELEC',
    hp: 35,
    attack: 55,
    defense: 40,
    spAtk: 50,
    spDef: 50,
    speed: 90,
    nextEvolution: '라이츄',
    evolutionLevel: 30,
  },
  {
    id: 'raichu',
    name: '라이츄',
    type: 'ELEC',
    hp: 60,
    attack: 90,
    defense: 55,
    spAtk: 90,
    spDef: 80,
    speed: 110,
    nextEvolution: '이상해풀',
    evolutionLevel: 16,
  }, 
  {
    id: 'test',
    name: 'test',
    type: 'NRML',
    hp: 999,
    attack: 999,
    defense: 999,
    spAtk: 999,
    spDef: 999,
    speed: 999,
  },

];

export const POKEMON_DATABASE = POKEMON_CONFIGS.map((pokemon) => {
  // pokemon.id ('pikachu', 'bulbasaur' 등)로 이미지 매핑 함수 호출
  const assets = getPokemonAssets(pokemon.id);

  return {
    ...pokemon,
    maxHp: pokemon.hp,
    ...assets,
    getDamageMultiplierAgainst: (attackType) => getMultiplier(attackType, pokemon.type),
  };
});