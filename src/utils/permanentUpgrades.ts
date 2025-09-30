import { PermanentUpgrade } from '../types';

export const PERMANENT_UPGRADES: PermanentUpgrade[] = [
  {
    name: 'Fuel Efficiency',
    description: 'Reduce fuel consumption',
    cost: 100,
    maxLevel: 5,
    currentLevel: 0,
    effect: (level) => `Reduce fuel consumption by ${level * 5}%`
  },
  {
    name: 'Scanner Range',
    description: 'Detect objects from afar',
    cost: 150,
    maxLevel: 3,
    currentLevel: 0,
    effect: (level) => `Detect objects ${level} tiles away`
  },
  {
    name: 'Black Hole Resistance',
    description: 'Better resist black hole pull',
    cost: 200,
    maxLevel: 5,
    currentLevel: 0,
    effect: (level) => `Reduce pull effect by ${level * 10}%`
  },
  {
    name: 'Thrust Boosters',
    description: 'Diagonal movement',
    cost: 250,
    maxLevel: 1,
    currentLevel: 0,
    effect: () => 'Enable diagonal movement'
  },
  {
    name: 'Cargo Expansion',
    description: 'Carry more resources',
    cost: 200,
    maxLevel: 3,
    currentLevel: 0,
    effect: (level) => `+${level * 50}% cargo capacity`
  },
  {
    name: 'Shields',
    description: 'Reduce damage taken',
    cost: 300,
    maxLevel: 4,
    currentLevel: 0,
    effect: (level) => `Reduce damage by ${level * 25}%`
  },
  {
    name: 'Hyperdrive',
    description: 'Emergency sector escape',
    cost: 500,
    maxLevel: 3,
    currentLevel: 0,
    effect: (level) => `${level} emergency escapes per run`
  },
  {
    name: 'Diplomatic Translator',
    description: 'Better faction relations',
    cost: 400,
    maxLevel: 4,
    currentLevel: 0,
    effect: (level) => `+${level * 25}% reputation gains`
  },
  {
    name: 'Mining Efficiency',
    description: 'Better resource collection',
    cost: 250,
    maxLevel: 5,
    currentLevel: 0,
    effect: (level) => `+${level * 20}% mining yields`
  },
  {
    name: 'Hull Strength',
    description: 'Reduce all damage',
    cost: 300,
    maxLevel: 5,
    currentLevel: 0,
    effect: (level) => `Reduce damage by ${level * 5}%`
  }
];