import { ReactNode } from 'react';

export type TileType = 'X' | 'O' | '#' | '~' | '+' | 'D' | '.' | '^' | 'A' | 'K' | 'E' | 'AF' | 'KF' | 'EF';

export type FactionType = 'Aserian' | 'Krynn' | 'Eldari';

export type FactionRank = 
  | 'Sworn Enemy'
  | 'Outlaw'
  | 'Untrustworthy'
  | 'Suspicious'
  | 'Neutral'
  | 'Acquainted'
  | 'Allied'
  | 'Respected'
  | 'Champion'
  | 'Legendary Ally';

export type FreighterType = 'AF' | 'KF' | 'EF';

export type VisibilityLevel = 0 | 1 | 2;

export type Direction = 'up' | 'down' | 'left' | 'right';

export type DeathCause = 
  | 'fuel_depletion'
  | 'black_hole'
  | 'pirate_attack'
  | 'anomaly'
  | 'unknown';

export interface Position {
  x: number;
  y: number;
}

export interface FreighterPosition {
  sector: Position;
  grid: Position;
}

export interface Freighter {
  id: string;
  type: FreighterType;
  position: FreighterPosition;
  direction: Direction;
  cargo: {
    credits: number;
    blueprints: number;
    isTrap: boolean;
  };
  health: number;
  maxHealth: number;
  defense: number;
}

export interface FactionMission {
  id: string;
  name: string;
  description: string;
  type: 'combat' | 'exploration' | 'trade';
  requirements: {
    minRank: FactionRank;
  };
  rewards: {
    reputation: number;
    credits?: number;
    blueprints?: number;
    technology?: string;
  };
  status: 'available' | 'active' | 'completed' | 'failed';
}

export interface FactionStatus {
  reputation: number;
  rank: FactionRank;
  missions: FactionMission[];
  unlockedTechnologies: string[];
}

export interface GameStats {
  tilesExplored: number;
  planetsDiscovered: number;
  derelictsExplored: number;
  nebulaeTraversed: number;
  piratesDefeated: number;
  diplomaticMissions: number;
  sectorsExplored: number;
  blueprintsCollected: number;
  turnsPlayed: number;
  blackHolesEscaped: number;
  maxDistanceReached: number;
  totalScore: number;
  deathCause: DeathCause;
  timeStarted: number;
  timeEnded: number | null;
}

export interface PlayerAccount {
  name: string;
  created: number;
  skillPoints: number;
  permanentUpgrades: PermanentUpgrade[];
  stats: {
    totalGamesPlayed: number;
    bestScore: number;
    furthestDistance: number;
    totalPlayTime: number;
  };
}

export interface GameState {
  grid: TileType[][];
  visibilityGrid: VisibilityLevel[][];
  playerPosition: Position;
  currentSector: Position;
  sectors: Map<string, TileType[][]>;
  exploredSectors: Set<string>;
  fuel: number;
  maxFuel: number;
  shipHP: number;
  maxShipHP: number;
  shieldStrength: number;
  damageReduction: number;
  blueprints: number;
  credits: number;
  factions: Record<FactionType, FactionStatus>;
  factionTerritories: Map<string, FactionType>;
  freighters: Freighter[];
  upgrades: Upgrade[];
  log: string[];
  gameOver: boolean;
  deathCause: DeathCause | null;
  account: PlayerAccount;
  stats: GameStats;
}

export interface Upgrade {
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  effects: string[];
  apply: (state: GameState, level: number) => GameState;
}

export interface PermanentUpgrade {
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  effect: (level: number) => string;
}

export type DamageSource = 
  | 'black_hole'
  | 'asteroid'
  | 'pirate'
  | 'solar_flare'
  | 'anomaly'
  | 'nebula';

export interface DamageEvent {
  amount: number;
  source: DamageSource;
  reduced: number;
  final: number;
}

export interface LegendItem {
  id: string;
  symbol: string;
  name: string;
  description: string;
  category: 'planets' | 'ships' | 'hazards' | 'factions' | 'freighters';
  discovered: boolean;
  color: string;
}