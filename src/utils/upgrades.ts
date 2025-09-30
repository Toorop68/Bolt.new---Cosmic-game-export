import { Upgrade, GameState } from '../types';

export const UPGRADES: Upgrade[] = [
  {
    name: 'Extended Fuel Tank',
    description: 'Increase your ship\'s fuel capacity, allowing for longer exploration journeys between refueling stations. Essential for deep space exploration.',
    cost: 3,
    maxLevel: 3,
    currentLevel: 0,
    effects: [
      '+50% fuel capacity',
      '+75% fuel capacity',
      '+100% fuel capacity'
    ],
    apply: (state: GameState, level: number): GameState => {
      const multipliers = [1.5, 1.75, 2.0];
      const baseMaxFuel = 100;
      return {
        ...state,
        maxFuel: Math.floor(baseMaxFuel * multipliers[level - 1]),
        fuel: Math.min(state.fuel, Math.floor(baseMaxFuel * multipliers[level - 1]))
      };
    }
  },
  {
    name: 'Anti-Gravity Thrusters',
    description: 'Advanced propulsion system that helps resist the pull of black holes. Higher levels allow safe passage near or even through black holes without being consumed.',
    cost: 5,
    maxLevel: 3,
    currentLevel: 0,
    effects: [
      'Reduce black hole pull by 25%',
      'Reduce black hole pull by 50%',
      'Immune to black hole pull'
    ],
    apply: (state: GameState, level: number): GameState => {
      return {
        ...state,
        blackHoleResistance: level === 3 ? 1 : 0.25 * level
      };
    }
  },
  {
    name: 'Advanced Scanner',
    description: 'Long-range scanning system that reveals the contents of nearby tiles. Higher levels increase scan range, helping you plan safer routes and find valuable resources.',
    cost: 4,
    maxLevel: 3,
    currentLevel: 0,
    effects: [
      'Reveal tiles 2 spaces away',
      'Reveal tiles 4 spaces away',
      'Reveal all tiles in current sector'
    ],
    apply: (state: GameState, level: number): GameState => {
      const scanRanges = [2, 4, Infinity];
      return {
        ...state,
        scanRange: scanRanges[level - 1]
      };
    }
  },
  {
    name: 'Shield Generator',
    description: 'Energy shield that reduces damage from hazards and hostile encounters. Higher levels provide better protection against pirates and environmental dangers.',
    cost: 6,
    maxLevel: 3,
    currentLevel: 0,
    effects: [
      'Reduce damage by 25%',
      'Reduce damage by 50%',
      'Immune to damage'
    ],
    apply: (state: GameState, level: number): GameState => {
      const damageReduction = level === 3 ? 1 : 0.25 * level;
      return {
        ...state,
        damageReduction
      };
    }
  }
];