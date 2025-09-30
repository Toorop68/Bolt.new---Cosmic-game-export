import { Freighter, GameState, Direction, TileType } from '../types';

const MOVEMENT_PATTERNS: Record<string, Direction[]> = {
  'patrol': ['right', 'right', 'left', 'left'],
  'circuit': ['right', 'down', 'left', 'up'],
  'zigzag': ['right', 'down', 'left', 'down']
};

export const moveFreighter = (
  freighter: Freighter,
  grid: TileType[][]
): Freighter => {
  const newPosition = { ...freighter.position.grid };
  
  // Simple movement logic - try to move in current direction
  switch (freighter.direction) {
    case 'up':
      if (newPosition.y > 0) newPosition.y--;
      else freighter.direction = 'down';
      break;
    case 'down':
      if (newPosition.y < grid.length - 1) newPosition.y++;
      else freighter.direction = 'up';
      break;
    case 'left':
      if (newPosition.x > 0) newPosition.x--;
      else freighter.direction = 'right';
      break;
    case 'right':
      if (newPosition.x < grid[0].length - 1) newPosition.x++;
      else freighter.direction = 'left';
      break;
  }

  return {
    ...freighter,
    position: {
      ...freighter.position,
      grid: newPosition
    }
  };
};

export const updateFreighters = (state: GameState): GameState => {
  // Only update freighters in the current sector
  const currentSectorKey = `${state.currentSector.x},${state.currentSector.y}`;
  
  const updatedFreighters = state.freighters.map(freighter => {
    const freighterSectorKey = `${freighter.position.sector.x},${freighter.position.sector.y}`;
    
    if (freighterSectorKey === currentSectorKey) {
      return moveFreighter(freighter, state.grid);
    }
    return freighter;
  });

  // Update grid with freighter positions
  const newGrid = state.grid.map(row => [...row]);
  
  // Clear old freighter positions
  for (let y = 0; y < newGrid.length; y++) {
    for (let x = 0; x < newGrid[0].length; x++) {
      const tile = newGrid[y][x];
      if (tile === 'AF' || tile === 'KF' || tile === 'EF') {
        newGrid[y][x] = '.';
      }
    }
  }

  // Add new freighter positions
  updatedFreighters.forEach(freighter => {
    if (`${freighter.position.sector.x},${freighter.position.sector.y}` === currentSectorKey) {
      newGrid[freighter.position.grid.y][freighter.position.grid.x] = freighter.type;
    }
  });

  return {
    ...state,
    grid: newGrid,
    freighters: updatedFreighters
  };
};