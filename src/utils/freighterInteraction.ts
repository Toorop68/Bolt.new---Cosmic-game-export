import { GameState, Freighter, FactionType } from '../types';
import { FREIGHTER_UNLOCK_THRESHOLDS } from './factionPoints';
import { calculateDamage, applyDamage } from './damage';

interface TradeOffer {
  credits: number;
  blueprints: number;
  reputation: number;
}

const TRADE_OFFERS: Record<FactionType, TradeOffer[]> = {
  Aserian: [
    { credits: 200, blueprints: 2, reputation: 10 },
    { credits: 500, blueprints: 5, reputation: 25 },
    { credits: 1000, blueprints: 10, reputation: 50 }
  ],
  Krynn: [
    { credits: 300, blueprints: 3, reputation: 15 },
    { credits: 600, blueprints: 6, reputation: 30 },
    { credits: 1200, blueprints: 12, reputation: 60 }
  ],
  Eldari: [
    { credits: 400, blueprints: 4, reputation: 20 },
    { credits: 800, blueprints: 8, reputation: 40 },
    { credits: 1500, blueprints: 15, reputation: 80 }
  ]
};

export const canTradeWithFreighter = (
  state: GameState,
  freighter: Freighter
): boolean => {
  const faction = freighter.type.slice(0, -1) as FactionType;
  return state.factions[faction].reputation >= FREIGHTER_UNLOCK_THRESHOLDS[faction];
};

export const getTradeOffers = (freighter: Freighter): TradeOffer[] => {
  const faction = freighter.type.slice(0, -1) as FactionType;
  return TRADE_OFFERS[faction];
};

export const executeFreighterTrade = (
  state: GameState,
  freighter: Freighter,
  offer: TradeOffer
): [GameState, string[]] => {
  const faction = freighter.type.slice(0, -1) as FactionType;
  const messages: string[] = [];

  // Check if player can afford the trade
  if (state.credits < offer.credits) {
    return [state, ['Not enough credits for this trade']];
  }

  // Execute the trade
  let newState = {
    ...state,
    credits: state.credits - offer.credits,
    blueprints: state.blueprints + offer.blueprints,
    factions: {
      ...state.factions,
      [faction]: {
        ...state.factions[faction],
        reputation: state.factions[faction].reputation + offer.reputation
      }
    }
  };

  messages.push(
    `Traded ${offer.credits} credits for ${offer.blueprints} blueprints`,
    `Gained ${offer.reputation} reputation with ${faction}`
  );

  // Random event: Freighter might share intel
  if (Math.random() < 0.2) {
    const intelReward = Math.floor(Math.random() * 50) + 50;
    newState.credits += intelReward;
    messages.push(`Freighter shared valuable intel worth ${intelReward} credits!`);
  }

  return [newState, messages];
};

export const defendFreighter = (
  state: GameState,
  freighter: Freighter
): [GameState, string[]] => {
  const faction = freighter.type.slice(0, -1) as FactionType;
  const messages: string[] = [];
  let newState = { ...state };

  // Combat simulation
  const success = Math.random() < 0.7; // 70% base success rate
  
  if (success) {
    // Award reputation and possible bonus
    const reputationGain = 30;
    newState.factions[faction] = {
      ...newState.factions[faction],
      reputation: newState.factions[faction].reputation + reputationGain
    };

    messages.push(
      'Successfully defended the freighter!',
      `Gained ${reputationGain} reputation with ${faction}`
    );

    // Bonus reward
    const bonus = Math.floor(Math.random() * 200) + 100;
    newState.credits += bonus;
    messages.push(`Received ${bonus} credits as reward`);
  } else {
    // Take damage from the fight
    const [damagedState, damageMessages] = applyDamage(
      newState,
      calculateDamage(newState, 'pirate', 0.5)
    );
    newState = damagedState;
    messages.push('Failed to defend the freighter!', ...damageMessages);
  }

  return [newState, messages];
};