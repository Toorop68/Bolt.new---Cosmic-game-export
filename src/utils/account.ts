import { PlayerAccount, PermanentUpgrade } from '../types';
import { PERMANENT_UPGRADES } from './permanentUpgrades';

const STORAGE_KEY = 'cosmicCartographer_account';

export const loadAccount = (): PlayerAccount | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const saveAccount = (account: PlayerAccount): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
};

export const createNewAccount = (name: string): PlayerAccount => {
  return {
    name,
    created: Date.now(),
    skillPoints: 0,
    permanentUpgrades: PERMANENT_UPGRADES.map(upgrade => ({
      ...upgrade,
      currentLevel: 0
    })),
    stats: {
      totalGamesPlayed: 0,
      bestScore: 0,
      furthestDistance: 0,
      totalPlayTime: 0
    }
  };
};