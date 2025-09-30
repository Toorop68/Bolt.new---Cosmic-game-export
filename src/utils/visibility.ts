import { GameState, VisibilityLevel } from '../types';

const getVisibilityRadius = (state: GameState): number => {
  const scannerLevel = state.upgrades.find(u => u.name === 'Advanced Scanner')?.currentLevel || 0;
  switch (scannerLevel) {
    case 1: return 3;
    case 2: return 5;
    case 3: return Infinity;
    default: return 2;
  }
};

const isInRange = (x1: number, y1: number, x2: number, y2: number, range: number): boolean => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return Math.sqrt(dx * dx + dy * dy) <= range;
};

export const calculateVisibility = (state: GameState): GameState => {
  const { grid, playerPosition, visibilityGrid } = state;
  const radius = getVisibilityRadius(state);
  const newVisibilityGrid = visibilityGrid.map(row => [...row]);

  // First, set all currently visible (2) tiles to explored (1)
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (newVisibilityGrid[y][x] === 2) {
        newVisibilityGrid[y][x] = 1;
      }
    }
  }

  // Then, update visibility based on current position and scanner range
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (isInRange(x, y, playerPosition.x, playerPosition.y, radius)) {
        newVisibilityGrid[y][x] = 2 as VisibilityLevel;
      }
    }
  }

  return {
    ...state,
    visibilityGrid: newVisibilityGrid
  };
};