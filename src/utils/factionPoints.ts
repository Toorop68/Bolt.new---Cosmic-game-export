import { GameState, FactionType, FactionStatus } from '../types';
import { calculateFactionRank } from './factions';

// Points awarded for different actions
const FACTION_POINTS = {
  EXPLORE_TERRITORY: 10,
  DEFEND_FREIGHTER: 25,
  COMPLETE_MISSION: 50,
  TRADE_RESOURCES: 15,
  DEFEAT_ENEMY: 20,
  DISCOVER_ARTIFACT: 30
};

// Reputation thresholds for unlocking freighters
export const FREIGHTER_UNLOCK_THRESHOLDS: Record<FactionType, number> = {
  Aserian: 400, // Respected rank
  Krynn: 500,   // Between Respected and Champion
  Eldari: 600   // Near Champion rank
};

export const awardFactionPoints = (
  state: GameState,
  faction: FactionType,
  action: keyof typeof FACTION_POINTS,
  multiplier = 1
): [GameState, string[]] => {
  const points = Math.floor(FACTION_POINTS[action] * multiplier);
  const currentStatus = state.factions[faction];
  const oldRank = currentStatus.rank;
  const newReputation = currentStatus.reputation + points;
  const newRank = calculateFactionRank(newReputation);
  
  // Check if this unlocks freighter access
  const unlockedFreighter = 
    newReputation >= FREIGHTER_UNLOCK_THRESHOLDS[faction] &&
    currentStatus.reputation < FREIGHTER_UNLOCK_THRESHOLDS[faction];

  const messages: string[] = [`Gained ${points} reputation with ${faction}`];

  // Add rank change message if applicable
  if (newRank !== oldRank) {
    messages.push(`Achieved new rank with ${faction}: ${newRank}!`);
  }

  if (unlockedFreighter) {
    messages.push(`${faction} freighters are now available for trade!`);
  }

  return [
    {
      ...state,
      factions: {
        ...state.factions,
        [faction]: {
          ...currentStatus,
          reputation: newReputation,
          rank: newRank
        }
      }
    },
    messages
  ];
};

// Calculate reputation multiplier based on current standing
export const getReputationMultiplier = (status: FactionStatus): number => {
  switch (status.rank) {
    case 'Legendary Ally':
      return 2.0;
    case 'Champion':
      return 1.5;
    case 'Respected':
    case 'Allied':
      return 1.25;
    case 'Suspicious':
    case 'Untrustworthy':
      return 0.75;
    case 'Outlaw':
    case 'Sworn Enemy':
      return 0.5;
    default:
      return 1.0;
  }
};