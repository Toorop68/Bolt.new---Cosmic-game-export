import { GameState, Direction, DeathCause, PlayerAccount } from '../types';
import { applyDamage, calculateDamage } from './damage';
import { handleSectorTransition } from './sectors';
import { UPGRADES } from './upgrades';
import { calculateVisibility } from './visibility';
import { initializeFactionStatus } from './factions';
import { updateFactionMissions } from './missions';
import { updateFreighters } from './freighterMovement';
import { createFreighter } from './freighters';
import { awardFactionPoints } from './factionPoints';

// Create initial game state
export const createInitialState = (account: PlayerAccount): GameState => {
  const initialGrid = Array(10).fill(null)
    .map(() => Array(20).fill('.'));
  
  const playerPosition = {
    x: Math.floor(20 / 2),
    y: Math.floor(10 / 2)
  };
  
  initialGrid[playerPosition.y][playerPosition.x] = '^';

  // Initialize visibility grid
  const visibilityGrid = Array(10).fill(null)
    .map(() => Array(20).fill(0));

  // Create initial freighters
  const initialFreighters = [
    createFreighter('AF', { x: 0, y: 0 }, { x: 5, y: 5 }),
    createFreighter('KF', { x: 0, y: 0 }, { x: 15, y: 5 })
  ];

  const state: GameState = {
    grid: initialGrid,
    visibilityGrid,
    playerPosition,
    currentSector: { x: 0, y: 0 },
    sectors: new Map([[`0,0`, initialGrid]]),
    exploredSectors: new Set(['0,0']),
    fuel: 100,
    maxFuel: 100,
    shipHP: 100,
    maxShipHP: 100,
    shieldStrength: 0,
    damageReduction: 0,
    blueprints: 0,
    credits: 100,
    factions: initializeFactionStatus(),
    factionTerritories: new Map(),
    freighters: initialFreighters,
    upgrades: [...UPGRADES],
    log: ['Welcome to Cosmic Cartographer!'],
    gameOver: false,
    deathCause: null,
    account,
    stats: {
      tilesExplored: 0,
      planetsDiscovered: 0,
      derelictsExplored: 0,
      nebulaeTraversed: 0,
      piratesDefeated: 0,
      diplomaticMissions: 0,
      sectorsExplored: 1,
      blueprintsCollected: 0,
      blackHolesEscaped: 0,
      maxDistanceReached: 0,
      totalScore: 0,
      deathCause: 'unknown',
      timeStarted: Date.now(),
      timeEnded: null,
      turnsPlayed: 0
    }
  };

  return calculateVisibility(state);
};

const handleFactionInteraction = (state: GameState, faction: 'Aserian' | 'Krynn' | 'Eldari'): [GameState, string[]] => {
  // Award points for visiting faction territory
  const [newState, messages] = awardFactionPoints(state, faction, 'EXPLORE_TERRITORY', 1);
  
  return [
    newState,
    [`Entered ${faction} territory`, ...messages]
  ];
};

// Handle player movement
export const movePlayer = (state: GameState, direction: Direction): GameState => {
  if (state.gameOver) return state;

  // First update freighters
  let newState = updateFreighters(state);
  
  // Then update missions
  newState = updateFactionMissions(newState);

  const newPosition = { ...state.playerPosition };
  let newSectorCoords = { ...state.currentSector };
  let sectorChanged = false;
  
  // Calculate new position and sector coordinates
  switch (direction) {
    case 'up':
      if (newPosition.y === 0) {
        newSectorCoords.y--;
        newPosition.y = 9;
        sectorChanged = true;
      } else {
        newPosition.y = Math.max(0, newPosition.y - 1);
      }
      break;
    case 'down':
      if (newPosition.y === 9) {
        newSectorCoords.y++;
        newPosition.y = 0;
        sectorChanged = true;
      } else {
        newPosition.y = Math.min(9, newPosition.y + 1);
      }
      break;
    case 'left':
      if (newPosition.x === 0) {
        newSectorCoords.x--;
        newPosition.x = 19;
        sectorChanged = true;
      } else {
        newPosition.x = Math.max(0, newPosition.x - 1);
      }
      break;
    case 'right':
      if (newPosition.x === 19) {
        newSectorCoords.x++;
        newPosition.x = 0;
        sectorChanged = true;
      } else {
        newPosition.x = Math.min(19, newPosition.x + 1);
      }
      break;
  }

  // Handle sector transition if needed
  if (sectorChanged) {
    const [transitionedState, transitionMessages] = handleSectorTransition(newState, newSectorCoords);
    newState = {
      ...transitionedState,
      playerPosition: newPosition,
      log: [...transitionMessages, ...newState.log]
    };
  } else {
    // Handle movement within the current sector
    const newGrid = newState.grid.map(row => [...row]);
    const targetTile = newGrid[newPosition.y][newPosition.x];
    let fuelChange = -1;
    let newLog: string[] = [];

    // Update old position
    newGrid[state.playerPosition.y][state.playerPosition.x] = '.';
    
    // Update new position
    newGrid[newPosition.y][newPosition.x] = '^';

    // Handle tile interactions
    switch (targetTile) {
      case 'X': // Black hole
        const [blackHoleState, blackHoleMessages] = applyDamage(
          newState,
          calculateDamage(newState, 'black_hole')
        );
        newState = blackHoleState;
        newLog = blackHoleMessages;
        break;

      case 'O': // Planet
        newLog = ['Discovered a new planet!'];
        newState.blueprints++;
        newState.stats.planetsDiscovered++;
        break;

      case '#': // Asteroid
        if (Math.random() < 0.3) {
          newLog = ['Successfully mined fuel from asteroid!'];
          fuelChange = 20;
        }
        break;

      case '~': // Nebula
        newLog = ['Entering nebula...'];
        if (Math.random() < 0.4) {
          const [nebulaState, nebulaMessages] = applyDamage(
            newState,
            calculateDamage(newState, 'nebula')
          );
          newState = nebulaState;
          newLog.push(...nebulaMessages);
        } else {
          newLog.push('Safely traversed the nebula.');
        }
        newState.stats.nebulaeTraversed++;
        break;

      case '+': // Fuel station
        newLog = ['Refueling station found!'];
        fuelChange = newState.maxFuel - newState.fuel;
        break;

      case 'D': // Derelict
        newLog = ['Exploring derelict ship...'];
        if (Math.random() < 0.5) {
          newState.blueprints += 2;
          newLog.push('Found 2 blueprints!');
        }
        newState.stats.derelictsExplored++;
        break;

      // Handle faction sanctuaries
      case 'A': // Aserian
        const [aserianState, aserianMessages] = handleFactionInteraction(newState, 'Aserian');
        newState = aserianState;
        newLog = aserianMessages;
        break;

      case 'K': // Krynn
        const [krynnState, krynnMessages] = handleFactionInteraction(newState, 'Krynn');
        newState = krynnState;
        newLog = krynnMessages;
        break;

      case 'E': // Eldari
        const [eldariState, eldariMessages] = handleFactionInteraction(newState, 'Eldari');
        newState = eldariState;
        newLog = eldariMessages;
        break;

      // Handle freighter encounters
      case 'AF':
      case 'KF':
      case 'EF':
        const freighter = newState.freighters.find(f => 
          f.position.grid.x === newPosition.x && 
          f.position.grid.y === newPosition.y &&
          f.position.sector.x === newState.currentSector.x &&
          f.position.sector.y === newState.currentSector.y
        );
        if (freighter) {
          newLog = [`Encountered ${freighter.type} freighter!`];
        }
        break;
    }

    // Update game state
    newState = {
      ...newState,
      grid: newGrid,
      playerPosition: newPosition,
      fuel: Math.min(newState.maxFuel, Math.max(0, newState.fuel + fuelChange)),
      log: [...newLog, ...newState.log],
      stats: {
        ...newState.stats,
        tilesExplored: newState.stats.tilesExplored + 1,
        turnsPlayed: newState.stats.turnsPlayed + 1
      }
    };
  }

  // Check for game over conditions
  if (newState.fuel <= 0) {
    return {
      ...newState,
      gameOver: true,
      deathCause: 'fuel_depletion'
    };
  }

  if (newState.shipHP <= 0) {
    return {
      ...newState,
      gameOver: true,
      deathCause: 'pirate_attack'
    };
  }

  // Calculate visibility after movement
  return calculateVisibility(newState);
};