import { GameState, DamageSource, DamageEvent } from '../types';

const BASE_DAMAGE: Record<DamageSource, number> = {
  black_hole: 20,
  asteroid: 10,
  pirate: 15,
  solar_flare: 8,
  anomaly: 12,
  nebula: 5
};

export const calculateDamage = (
  state: GameState,
  source: DamageSource,
  multiplier = 1
): DamageEvent => {
  const baseDamage = BASE_DAMAGE[source] * multiplier;
  
  // Calculate damage reduction from shields
  const shieldLevel = state.upgrades.find(u => u.name === 'Shield Generator')?.currentLevel || 0;
  const shieldReduction = shieldLevel * 0.25; // 25% per level
  
  // Apply damage reduction
  const reducedDamage = Math.floor(baseDamage * (1 - shieldReduction));
  const finalDamage = Math.max(0, reducedDamage);

  return {
    amount: baseDamage,
    source,
    reduced: baseDamage - finalDamage,
    final: finalDamage
  };
};

export const applyDamage = (state: GameState, damage: DamageEvent): [GameState, string[]] => {
  const messages: string[] = [];
  const newHP = Math.max(0, state.shipHP - damage.final);
  
  // Format damage message
  const damageSource = damage.source.replace('_', ' ');
  messages.push(`🚨 HULL DAMAGE! (-${damage.final} HP from ${damageSource})`);
  
  if (damage.reduced > 0) {
    messages.push(`Shield absorbed ${damage.reduced} damage!`);
  }

  // Check for critical damage
  if (newHP <= state.maxShipHP * 0.25) {
    messages.push('⚠️ WARNING: Hull integrity critical!');
  }

  return [
    {
      ...state,
      shipHP: newHP,
      log: [...messages, ...state.log]
    },
    messages
  ];
};