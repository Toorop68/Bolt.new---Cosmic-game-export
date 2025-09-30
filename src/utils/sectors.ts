import { GameState, TileType, VisibilityLevel } from '../types';
import { calculateVisibility } from './visibility';

const generateGrid = (distance: number): TileType[][] => {
  const grid: TileType[][] = Array(10).fill(null)
    .map(() => Array(20).fill('.') as TileType[]);
  
  // Base probabilities - much lower than before
  const baseProbabilities: Record<TileType, number> = {
    'X': 0.02,  // Black hole
    'O': 0.05,  // Planet
    '#': 0.08,  // Asteroid
    '~': 0.04,  // Nebula
    '+': 0.03,  // Fuel
    'D': 0.02,  // Derelict
    'A': 0.01,  // Aserian
    'K': 0.01,  // Krynn
    'E': 0.01,  // Eldari
    '.': 0.73   // Empty space
  };

  // Scale certain probabilities based on distance from center
  const probabilities = { ...baseProbabilities };
  if (distance > 10) {
    probabilities['X'] *= 1.5;
    probabilities['D'] *= 1.5;
    probabilities['+'] *= 0.8;
  }
  if (distance > 20) {
    probabilities['A'] *= 1.2;
    probabilities['K'] *= 1.2;
    probabilities['E'] *= 1.2;
    probabilities['+'] *= 0.7;
  }

  // Generate grid with adjusted probabilities
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 20; x++) {
      const roll = Math.random();
      let cumulative = 0;
      
      for (const [tile, prob] of Object.entries(probabilities)) {
        cumulative += prob;
        if (roll < cumulative) {
          grid[y][x] = tile as TileType;
          break;
        }
      }
    }
  }

  return grid;
};

const initializeVisibilityAroundShip = (
  visibilityGrid: VisibilityLevel[][],
  position: { x: number; y: number },
  radius: number
): VisibilityLevel[][] => {
  const newGrid = visibilityGrid.map(row => [...row]);
  const gridHeight = newGrid.length;
  const gridWidth = newGrid[0].length;

  for (let y = Math.max(0, position.y - radius); y <= Math.min(gridHeight - 1, position.y + radius); y++) {
    for (let x = Math.max(0, position.x - radius); x <= Math.min(gridWidth - 1, position.x + radius); x++) {
      const distance = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
      if (distance <= radius) {
        newGrid[y][x] = 2;
      }
    }
  }

  return newGrid;
};

export const handleSectorTransition = (
  state: GameState,
  newCoords: { x: number; y: number }
): [GameState, string[]] => {
  const sectorKey = `${newCoords.x},${newCoords.y}`;
  const distance = Math.sqrt(Math.pow(newCoords.x, 2) + Math.pow(newCoords.y, 2));
  const messages: string[] = [];
  
  // Get or generate the new grid
  let newGrid: TileType[][];
  if (state.sectors.has(sectorKey)) {
    newGrid = state.sectors.get(sectorKey)!.map(row => [...row]);
    messages.push('Entering previously explored sector');
  } else {
    newGrid = generateGrid(distance);
    messages.push(
      `Entering new sector at (${newCoords.x}, ${newCoords.y})`,
      `Distance from origin: ${Math.floor(distance)} sectors`
    );
  }

  // Clear the target position for the ship
  newGrid[state.playerPosition.y][state.playerPosition.x] = '.';
  
  // Place the ship
  newGrid[state.playerPosition.y][state.playerPosition.x] = '^';

  // Store the grid in sectors map
  state.sectors.set(sectorKey, newGrid.map(row => [...row]));

  // Initialize visibility grid
  const newVisibilityGrid = Array(10).fill(null)
    .map(() => Array(20).fill(0) as VisibilityLevel[]);

  // Set initial visibility around ship
  const scannerLevel = state.upgrades.find(u => u.name === 'Advanced Scanner')?.currentLevel || 0;
  const visibilityRadius = scannerLevel === 3 ? 10 : scannerLevel === 2 ? 4 : scannerLevel === 1 ? 2 : 2;
  
  // Apply visibility
  const visibilityWithShip = initializeVisibilityAroundShip(
    newVisibilityGrid,
    state.playerPosition,
    visibilityRadius
  );

  // Create new state with updated grid and visibility
  const newState = {
    ...state,
    grid: newGrid,
    visibilityGrid: visibilityWithShip,
    currentSector: newCoords,
    exploredSectors: new Set([...state.exploredSectors, sectorKey]),
    stats: {
      ...state.stats,
      sectorsExplored: state.exploredSectors.has(sectorKey) ? state.stats.sectorsExplored : state.stats.sectorsExplored + 1,
      maxDistanceReached: Math.max(state.stats.maxDistanceReached, distance)
    }
  };

  return [newState, messages];
};