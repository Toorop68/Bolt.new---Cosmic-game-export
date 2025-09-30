import { v4 as uuidv4 } from 'uuid';
import { Freighter, FreighterType, GameState } from '../types';
import { calculateDamage, applyDamage } from './damage';

const FREIGHTER_STATS: Record<FreighterType, {
  health: number;
  defense: number;
  minCargo: number;
  maxCargo: number;
  trapChance: number;
}> = {
  'AF': { health: 200, defense: 30, minCargo: 100, maxCargo: 500, trapChance: 0.2 },
  'KF': { health: 150, defense: 20, minCargo: 200, maxCargo: 800, trapChance: 0.3 },
  'EF': { health: 300, defense: 40, minCargo: 300, maxCargo: 1000, trapChance: 0.4 }
};

export const createFreighter = (
  type: FreighterType,
  sector: { x: number; y: number },
  position: { x: number; y: number }
): Freighter => {
  const stats = FREIGHTER_STATS[type];
  const cargo = Math.floor(Math.random() * (stats.maxCargo - stats.minCargo)) + stats.minCargo;
  
  return {
    id: uuidv4(),
    type,
    position: {
      sector,
      grid: position
    },
    direction: 'right',
    cargo: {
      credits: cargo,
      blueprints: Math.floor(cargo / 100),
      isTrap: Math.random() < stats.trapChance
    },
    health: stats.health,
    maxHealth: stats.health,
    defense: stats.defense
  };
};

export const calculateRaidSuccess = (state: GameState, freighter: Freighter): number => {
  let chance = 0.5; // Base chance

  // Ship upgrades
  const scanner = state.upgrades.find(u => u.name === 'Advanced Scanner')?.currentLevel || 0;
  const engines = state.upgrades.find(u => u.name === 'Anti-Gravity Thrusters')?.currentLevel || 0;
  const shields = state.upgrades.find(u => u.name === 'Shield Generator')?.currentLevel || 0;

  chance += scanner * 0.1;  // +10% per scanner level
  chance += engines * 0.15; // +15% per engine level
  chance += shields * 0.1;  // +10% per shield level

  // Faction territory penalties
  const sectorKey = `${freighter.position.sector.x},${freighter.position.sector.y}`;
  const territory = state.factionTerritories.get(sectorKey);
  
  if (territory) {
    switch (freighter.type) {
      case 'AF':
        if (territory === 'Aserian') chance -= 0.2;
        break;
      case 'KF':
        if (territory === 'Krynn') chance -= 0.15;
        break;
      case 'EF':
        if (territory === 'Eldari') chance -= 0.25;
        break;
    }
  }

  return Math.min(Math.max(chance, 0.1), 0.9); // Clamp between 10% and 90%
};

export const handleRaidOutcome = (
  state: GameState,
  freighter: Freighter,
  success: boolean
): [GameState, string[]] => {
  const messages: string[] = [];
  let newState = { ...state };

  if (success) {
    if (freighter.cargo.isTrap) {
      // Spring the trap!
      const damage = calculateDamage(state, 'pirate', 2);
      const [damagedState, damageMessages] = applyDamage(state, damage);
      newState = damagedState;
      messages.push(
        "It's a trap! Reinforcements detected!",
        ...damageMessages
      );
    } else {
      // Successful raid
      newState = {
        ...newState,
        credits: state.credits + freighter.cargo.credits,
        blueprints: state.blueprints + freighter.cargo.blueprints
      };
      messages.push(
        `Raid successful! Acquired:`,
        `- ${freighter.cargo.credits} credits`,
        `- ${freighter.cargo.blueprints} blueprints`
      );
    }
  } else {
    // Failed raid
    const damage = calculateDamage(state, 'pirate');
    const [damagedState, damageMessages] = applyDamage(state, damage);
    newState = damagedState;
    messages.push(
      'Raid failed! Taking damage!',
      ...damageMessages
    );
  }

  return [newState, messages];
};