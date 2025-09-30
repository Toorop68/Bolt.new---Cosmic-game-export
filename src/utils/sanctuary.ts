import { GameState, FactionType } from '../types';
import { awardFactionPoints } from './factionPoints';

interface SanctuaryInteraction {
  state: GameState;
  messages: string[];
}

export const handleSanctuaryHeal = (
  state: GameState,
  faction: FactionType
): SanctuaryInteraction => {
  const healCost = 50;
  const messages: string[] = [];

  if (state.credits < healCost) {
    return {
      state,
      messages: ['Not enough credits for repairs']
    };
  }

  const healAmount = state.maxShipHP - state.shipHP;
  if (healAmount <= 0) {
    return {
      state,
      messages: ['Ship is already at full health']
    };
  }

  // Award faction points with multiplier based on heal amount
  const multiplier = healAmount / state.maxShipHP;
  const [newState, repMessages] = awardFactionPoints(
    state,
    faction,
    'EXPLORE_TERRITORY',
    multiplier
  );

  return {
    state: {
      ...newState,
      shipHP: state.maxShipHP,
      credits: state.credits - healCost
    },
    messages: [
      `Repaired ${healAmount} hull damage`,
      `Spent ${healCost} credits`,
      ...repMessages
    ]
  };
};

export const handleSanctuaryTrade = (
  state: GameState,
  faction: FactionType
): SanctuaryInteraction => {
  const tradeCost = 100;
  const blueprintReward = 3;
  const messages: string[] = [];

  if (state.credits < tradeCost) {
    return {
      state,
      messages: ['Not enough credits for trade']
    };
  }

  // Award faction points with multiplier based on trade value
  const multiplier = tradeCost / 50; // Base multiplier on trade value
  const [newState, repMessages] = awardFactionPoints(
    state,
    faction,
    'TRADE_RESOURCES',
    multiplier
  );

  return {
    state: {
      ...newState,
      credits: state.credits - tradeCost,
      blueprints: state.blueprints + blueprintReward
    },
    messages: [
      `Traded ${tradeCost} credits for ${blueprintReward} blueprints`,
      ...repMessages
    ]
  };
};

export const canTradeAtSanctuary = (state: GameState, faction: FactionType): boolean => {
  return state.factions[faction].reputation >= 50; // Requires at least "Acquainted" status
};

export const canUpgradeAtSanctuary = (state: GameState, faction: FactionType): boolean => {
  return state.factions[faction].rank === 'Allied' || 
         state.factions[faction].rank === 'Champion' || 
         state.factions[faction].rank === 'Legendary Ally';
};