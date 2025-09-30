import { FactionType, FactionMission, GameState } from '../types';
import { calculateFactionRank } from './factions';

// Mission templates for each faction
const MISSION_TEMPLATES: Record<FactionType, Array<{
  name: string;
  description: string;
  type: 'combat' | 'exploration' | 'trade';
  minRank: string;
  rewards: {
    reputation: number;
    credits?: number;
    blueprints?: number;
    technology?: string;
  };
}>> = {
  Aserian: [
    {
      name: 'Secure Trade Route',
      description: 'Clear pirate activity from an important trade route',
      type: 'combat',
      minRank: 'Allied',
      rewards: {
        reputation: 50,
        credits: 1000
      }
    },
    {
      name: 'Resource Survey',
      description: 'Map and analyze resource-rich sectors',
      type: 'exploration',
      minRank: 'Allied',
      rewards: {
        reputation: 30,
        blueprints: 2
      }
    }
  ],
  Krynn: [
    {
      name: 'Raid Convoy',
      description: 'Attack and loot a valuable trade convoy',
      type: 'combat',
      minRank: 'Allied',
      rewards: {
        reputation: 40,
        credits: 1500
      }
    },
    {
      name: 'Smuggling Run',
      description: 'Transport contraband through hostile space',
      type: 'trade',
      minRank: 'Allied',
      rewards: {
        reputation: 35,
        blueprints: 3
      }
    }
  ],
  Eldari: [
    {
      name: 'Ancient Artifacts',
      description: 'Recover artifacts from dangerous ruins',
      type: 'exploration',
      minRank: 'Allied',
      rewards: {
        reputation: 60,
        technology: 'eldari_artifact'
      }
    },
    {
      name: 'Knowledge Exchange',
      description: 'Transport sensitive data between Eldari sanctuaries',
      type: 'trade',
      minRank: 'Allied',
      rewards: {
        reputation: 45,
        blueprints: 4
      }
    }
  ]
};

// Generate new missions for a faction
export const generateMissions = (
  faction: FactionType,
  currentRank: string
): FactionMission[] => {
  // Only generate missions for Allied rank or higher
  if (currentRank !== 'Allied' && currentRank !== 'Champion' && currentRank !== 'Legendary Ally') {
    return [];
  }

  return MISSION_TEMPLATES[faction]
    .filter(template => template.minRank === currentRank)
    .map(template => ({
      id: `${faction.toLowerCase()}_${template.type}_${Date.now()}`,
      name: template.name,
      description: template.description,
      type: template.type,
      requirements: {
        minRank: currentRank
      },
      rewards: template.rewards,
      status: 'available'
    }));
};

// Update missions for all factions
export const updateFactionMissions = (state: GameState): GameState => {
  const newState = { ...state };
  
  Object.entries(state.factions).forEach(([faction, status]) => {
    const currentRank = calculateFactionRank(status.reputation);
    
    // Only generate new missions if rank has changed and is Allied or higher
    if (currentRank !== status.rank) {
      const newMissions = generateMissions(faction as FactionType, currentRank);
      
      newState.factions[faction as FactionType] = {
        ...status,
        rank: currentRank,
        missions: [
          ...status.missions.filter(m => m.status === 'active'),
          ...newMissions
        ]
      };
    }
  });

  return newState;
};