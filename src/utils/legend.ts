import { LegendItem } from '../types';

export const INITIAL_LEGEND_ITEMS: LegendItem[] = [
  // Planets
  {
    id: 'earth_like',
    symbol: 'O',
    name: 'Earth-like Planet',
    description: 'A habitable planet with valuable resources',
    category: 'planets',
    discovered: false,
    color: 'text-green-500'
  },
  
  // Hazards
  {
    id: 'black_hole',
    symbol: '@',
    name: 'Black Hole',
    description: 'A dangerous gravitational anomaly',
    category: 'hazards',
    discovered: false,
    color: 'text-blue-900'
  },
  {
    id: 'asteroid',
    symbol: '#',
    name: 'Asteroid Field',
    description: 'Dense field of mineable asteroids',
    category: 'hazards',
    discovered: false,
    color: 'text-gray-500'
  },
  
  // Factions
  {
    id: 'aserian',
    symbol: 'A',
    name: 'Aserian Outpost',
    description: 'Trading hub of the Aserian Collective',
    category: 'factions',
    discovered: false,
    color: 'text-blue-400'
  },
  {
    id: 'krynn',
    symbol: 'K',
    name: 'Krynn Station',
    description: 'Pirate stronghold of the Krynn',
    category: 'factions',
    discovered: false,
    color: 'text-red-400'
  },
  {
    id: 'eldari',
    symbol: 'E',
    name: 'Eldari Sanctuary',
    description: 'Mysterious base of the Eldari',
    category: 'factions',
    discovered: false,
    color: 'text-purple-400'
  },
  
  // Freighters
  {
    id: 'aserian_freighter',
    symbol: 'AF',
    name: 'Aserian Trade Freighter',
    description: 'Well-armed trading vessel of the Aserian Collective',
    category: 'freighters',
    discovered: false,
    color: 'text-blue-400'
  },
  {
    id: 'krynn_freighter',
    symbol: 'KF',
    name: 'Krynn Smuggler Transport',
    description: 'Fast but lightly defended smuggling ship',
    category: 'freighters',
    discovered: false,
    color: 'text-red-400'
  },
  {
    id: 'eldari_freighter',
    symbol: 'EF',
    name: 'Eldari Void Carrier',
    description: 'Ancient and mysterious carrier ship',
    category: 'freighters',
    discovered: false,
    color: 'text-purple-400'
  }
];