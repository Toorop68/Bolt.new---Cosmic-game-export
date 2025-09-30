import { FactionType, FactionRank, FactionStatus, GameState, FactionMission } from '../types';

// Reputation thresholds for each rank
export const FACTION_RANKS: Record<FactionRank, { min: number; max: number }> = {
  'Sworn Enemy': { min: -1000, max: -700 },
  'Outlaw': { min: -699, max: -400 },
  'Untrustworthy': { min: -399, max: -200 },
  'Suspicious': { min: -199, max: -50 },
  'Neutral': { min: -49, max: 49 },
  'Acquainted': { min: 50, max: 199 },
  'Allied': { min: 200, max: 399 },
  'Respected': { min: 400, max: 699 },
  'Champion': { min: 700, max: 999 },
  'Legendary Ally': { min: 1000, max: 1000 }
};

// Calculate faction rank based on reputation
export const calculateFactionRank = (reputation: number): FactionRank => {
  for (const [rank, threshold] of Object.entries(FACTION_RANKS)) {
    if (reputation >= threshold.min && reputation <= threshold.max) {
      return rank as FactionRank;
    }
  }
  return 'Neutral';
};

// Generate available missions based on faction rank
export const generateFactionMissions = (
  faction: FactionType,
  rank: FactionRank
): FactionMission[] => {
  const missions: FactionMission[] = [];

  switch (faction) {
    case 'Aserian':
      if (rank === 'Allied' || rank === 'Respected') {
        missions.push({
          id: `aserian_convoy_${Date.now()}`,
          name: 'Defend Trade Convoy',
          description: 'Escort an Aserian trade fleet through pirate-controlled space',
          type: 'combat',
          requirements: {
            minRank: 'Allied'
          },
          rewards: {
            reputation: 50,
            credits: 1000
          },
          status: 'available'
        });
      }
      break;

    case 'Krynn':
      if (rank === 'Allied' || rank === 'Respected') {
        missions.push({
          id: `krynn_raid_${Date.now()}`,
          name: 'Raid Aserian Freighter',
          description: 'Intercept and capture cargo from an Aserian trade ship',
          type: 'combat',
          requirements: {
            minRank: 'Allied'
          },
          rewards: {
            reputation: 40,
            blueprints: 2
          },
          status: 'available'
        });
      }
      break;

    case 'Eldari':
      if (rank === 'Allied' || rank === 'Respected') {
        missions.push({
          id: `eldari_ruins_${Date.now()}`,
          name: 'Ancient Ruins Expedition',
          description: 'Explore newly discovered ancient ruins for the Eldari',
          type: 'exploration',
          requirements: {
            minRank: 'Allied'
          },
          rewards: {
            reputation: 60,
            technology: 'eldari_artifact'
          },
          status: 'available'
        });
      }
      break;
  }

  return missions;
};

// Initialize faction status for a new game
export const initializeFactionStatus = (): Record<FactionType, FactionStatus> => ({
  Aserian: {
    reputation: 0,
    rank: 'Neutral',
    missions: [],
    unlockedTechnologies: []
  },
  Krynn: {
    reputation: 0,
    rank: 'Neutral',
    missions: [],
    unlockedTechnologies: []
  },
  Eldari: {
    reputation: 0,
    rank: 'Neutral',
    missions: [],
    unlockedTechnologies: []
  }
});