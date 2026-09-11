// src/components/BattleScreen.jsx
import React, { useState } from 'react';
import { POKEMON_DATABASE } from '../data/pokemonData';
import BattleUI from './BattleUI';

export default function BattleScreen() {
  const getPokemonById = (id) => POKEMON_DATABASE.find((p) => p.id === id);

  const [enemy, setEnemy] = useState(() => getPokemonById('pikachu') || POKEMON_DATABASE[0]);
  const [player, setPlayer] = useState(() => getPokemonById('bulbasaur') || POKEMON_DATABASE[1]);

  const [enemyHp, setEnemyHp] = useState(enemy.maxHp);
  const [playerHp, setPlayerHp] = useState(player.maxHp);
  const [menuMode, setMenuMode] = useState('main');
  const [log, setLog] = useState(`야생의 ${enemy.name}가 나타났다!`);
  const [isEnemyDisappearing, setIsEnemyDisappearing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // 적 포켓몬 실시간 변경
  const handleChangeEnemy = (selectedPokemon) => {
    setEnemy(selectedPokemon);
    setEnemyHp(selectedPokemon.maxHp);
    setIsEnemyDisappearing(false);
    setLog(`야생의 ${selectedPokemon.name}가 나타났다!`);
  };

  // 내 포켓몬 실시간 변경
  const handleChangePlayer = (selectedPokemon) => {
    setPlayer(selectedPokemon);
    setPlayerHp(selectedPokemon.maxHp);
    setLog(`가라! ${selectedPokemon.name}!`);
  };

  // 기술 사용 이벤트
  const handleUseMove = (moveName, moveType) => {
    setLog(`${player.name}는 ${moveName}를 사용했다!`);
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);

      const multiplier = enemy.getDamageMultiplierAgainst(moveType);
      const baseDamage = 40;
      const finalDamage = Math.round(baseDamage * multiplier);

      const nextHp = Math.max(0, enemyHp - finalDamage);
      setEnemyHp(nextHp);

      let effectMsg = '';
      if (multiplier > 1) effectMsg = ' 효과가 굉장했다!';
      else if (multiplier < 1 && multiplier > 0) effectMsg = ' 효과가 별로인 듯하다...';
      else if (multiplier === 0) effectMsg = ' 효과가 없는 듯하다...';

      if (nextHp === 0) {
        setTimeout(() => {
          setLog(`${enemy.name}는 쓰러졌다!`);
          setIsEnemyDisappearing(true);
        }, 600);
      } else {
        setLog(`${enemy.name}에게 ${finalDamage} 데미지!${effectMsg}`);
      }
    }, 300);
  };

  const handleFightClick = () => {
    setMenuMode('moves');
    setLog('기술을 선택하세요!');
  };

  const handleBackToMain = () => {
    setMenuMode('main');
    setLog(`${player.name}는 무엇을 할까?`);
  };

  const handleReset = () => {
    setEnemyHp(enemy.maxHp);
    setPlayerHp(player.maxHp);
    setIsEnemyDisappearing(false);
    setIsShaking(false);
    setMenuMode('main');
    setLog(`야생의 ${enemy.name}가 나타났다!`);
  };

  return (
    <BattleUI
      enemy={enemy}
      player={player}
      enemyHp={enemyHp}
      playerHp={playerHp}
      menuMode={menuMode}
      log={log}
      isEnemyDisappearing={isEnemyDisappearing}
      isShaking={isShaking}
      pokemonList={POKEMON_DATABASE}
      handleChangeEnemy={handleChangeEnemy}
      handleChangePlayer={handleChangePlayer}
      handleFightClick={handleFightClick}
      handleBackToMain={handleBackToMain}
      handleUseMove={handleUseMove}
      handleReset={handleReset}
      setLog={setLog}
    />
  );
}