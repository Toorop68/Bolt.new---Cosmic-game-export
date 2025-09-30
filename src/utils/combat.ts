import { GameState } from '../types';

export const initiatePirateCombat = (state: GameState): [GameState, string[]] => {
  const pirateStrength = Math.floor(state.difficulty * 1.5);
  
  return [{
    ...state,
    combat: {
      inCombat: true,
      enemyType: 'pirate',
      enemyHealth: 10 * pirateStrength,
      enemyDamage: 5 * pirateStrength,
      turnCount: 0
    }
  }, ['A pirate ship approaches!', 'Prepare for combat!']];
};

export const calculateCombatDamage = (state: GameState): number => {
  const baseDamage = 10;
  const upgradeBonus = state.upgrades
    .find(u => u.name === 'Shield Generator')?.currentLevel || 0;
  return Math.max(1, baseDamage + (upgradeBonus * 5));
};

export const handleCombatAction = (
  state: GameState,
  action: 'fight' | 'bribe' | 'flee'
): [GameState, string[]] => {
  if (!state.combat.inCombat) return [state, []];

  switch (action) {
    case 'fight': {
      const damage = calculateCombatDamage(state);
      const newEnemyHealth = state.combat.enemyHealth - damage;
      
      if (newEnemyHealth <= 0) {
        // Victory
        const loot = Math.floor(Math.random() * 50) + 50;
        const [newState, repMessages] = updateReputation(state, 'Krynn', -10);
        
        return [{
          ...newState,
          combat: { ...state.combat, inCombat: false },
          credits: state.credits + loot,
          stats: {
            ...state.stats,
            piratesDefeated: state.stats.piratesDefeated + 1
          }
        }, [
          'Victory! Pirate ship destroyed!',
          `Looted ${loot} credits`,
          ...repMessages
        ]];
      }

      // Take damage
      const damageTaken = Math.max(1, state.combat.enemyDamage - (state.damageReduction || 0));
      
      return [{
        ...state,
        combat: { ...state.combat, enemyHealth: newEnemyHealth },
        fuel: Math.max(0, state.fuel - damageTaken)
      }, [
        `Dealt ${damage} damage to pirate ship!`,
        `Took ${damageTaken} damage`
      ]];
    }

    case 'bribe': {
      const bribeCost = 50 * state.difficulty;
      
      if (state.credits < bribeCost) {
        return [state, ['Not enough credits to bribe!']];
      }

      const [newState, repMessages] = updateReputation(state, 'Krynn', 5);
      
      return [{
        ...newState,
        combat: { ...state.combat, inCombat: false },
        credits: state.credits - bribeCost
      }, [
        'Bribe accepted! Pirates let you pass.',
        `Spent ${bribeCost} credits`,
        ...repMessages
      ]];
    }

    case 'flee': {
      const escapeChance = state.upgrades
        .find(u => u.name === 'Anti-Gravity Thrusters')?.currentLevel
        ? 0.7
        : 0.4;

      if (Math.random() < escapeChance) {
        return [{
          ...state,
          combat: { ...state.combat, inCombat: false },
          fuel: Math.max(0, state.fuel - 20)
        }, ['Successfully escaped! Used 20 fuel in the process.']];
      }

      const damage = state.combat.enemyDamage;
      return [{
        ...state,
        fuel: Math.max(0, state.fuel - damage)
      }, ['Failed to escape!', `Took ${damage} damage`]];
    }
  }
};