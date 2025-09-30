import { Encounter, GameState, TileType } from '../types';

export const TIER1_ENCOUNTERS: Encounter[] = [
  {
    name: 'New Alien Race',
    description: 'First contact with an unknown civilization',
    type: 'O' as TileType,
    tier: 'Tier1',
    size: { width: 1, height: 1 },
    choices: [
      {
        name: 'Initiate Diplomatic Contact',
        description: 'Attempt peaceful first contact',
        risk: 'May be hostile',
        reward: 'New trading options',
        action: (state: GameState): [GameState, string[]] => {
          const success = Math.random() > 0.3;
          if (success) {
            return [{
              ...state,
              reputation: {
                ...state.reputation,
                Ancient: state.reputation.Ancient + 2
              },
              blueprints: state.blueprints + 2,
              discoveredEncounters: [...state.discoveredEncounters, 'New Alien Race'],
              galacticLore: [...state.galacticLore, 'A peaceful race of crystalline beings seeks to share knowledge.']
            }, ['Successful first contact!', 'Gained 2 blueprints and improved Ancient faction standing']];
          }
          return [{
            ...state,
            fuel: state.fuel - 15,
            reputation: {
              ...state.reputation,
              Ancient: state.reputation.Ancient - 1
            }
          }, ['The aliens were hostile!', 'Lost 15 fuel escaping']];
        }
      }
    ]
  },
  {
    name: 'Resource-Rich Asteroid Field',
    description: 'Dense field of valuable minerals',
    type: '#' as TileType,
    tier: 'Tier1',
    size: { width: 3, height: 2 },
    choices: [
      {
        name: 'Mine Resources',
        description: 'Extract valuable minerals',
        risk: 'Pirates may attack',
        reward: 'High fuel yield',
        action: (state: GameState): [GameState, string[]] => {
          const pirateAttack = Math.random() > 0.7;
          if (pirateAttack) {
            return [{
              ...state,
              fuel: state.fuel - 20,
              reputation: {
                ...state.reputation,
                Pirate: state.reputation.Pirate - 1
              }
            }, ['Pirates ambushed your mining operation!', 'Lost 20 fuel fighting them off']];
          }
          return [{
            ...state,
            fuel: Math.min(state.maxFuel, state.fuel + 50),
            blueprints: state.blueprints + 1
          }, ['Successfully mined the asteroid field!', 'Gained 50 fuel and 1 blueprint']];
        }
      }
    ]
  }
];

export const TIER2_ENCOUNTERS: Encounter[] = [
  {
    name: 'Ancient Ruins',
    description: 'Massive ruins of an ancient civilization',
    type: 'R' as TileType,
    tier: 'Tier2',
    size: { width: 2, height: 2 },
    choices: [
      {
        name: 'Explore Deeply',
        description: 'Conduct a thorough exploration',
        risk: 'Ancient defense systems',
        reward: 'Permanent upgrades',
        action: (state: GameState): [GameState, string[]] => {
          const success = Math.random() > 0.4;
          if (success) {
            return [{
              ...state,
              maxFuel: state.maxFuel + 25,
              collectedArtifacts: [...state.collectedArtifacts, 'Ancient Technology Core'],
              galacticLore: [...state.galacticLore, 'The ruins tell of an ancient race that achieved technological singularity.'],
              discoveredEncounters: [...state.discoveredEncounters, 'Ancient Ruins']
            }, [
              'Discovered incredible ancient technology!',
              'Fuel capacity permanently increased by 25',
              'Found ancient historical records'
            ]];
          }
          return [{
            ...state,
            fuel: state.fuel - 25
          }, ['Triggered ancient defense systems!', 'Lost 25 fuel escaping']];
        }
      }
    ]
  },
  {
    name: 'Ring World',
    description: 'A massive artificial ring-shaped world',
    type: 'O' as TileType,
    tier: 'Tier2',
    size: { width: 6, height: 1 },
    choices: [
      {
        name: 'Study Construction',
        description: 'Analyze the ring world\'s architecture',
        risk: 'Time-consuming study',
        reward: 'Valuable scientific data',
        action: (state: GameState): [GameState, string[]] => {
          return [{
            ...state,
            blueprints: state.blueprints + 4,
            collectedArtifacts: [...state.collectedArtifacts, 'Ring World Schematics'],
            galacticLore: [...state.galacticLore, 'The ring world appears to be a habitat for billions, now abandoned.'],
            discoveredEncounters: [...state.discoveredEncounters, 'Ring World']
          }, [
            'Successfully analyzed ring world construction!',
            'Gained 4 blueprints',
            'Uncovered ancient engineering secrets'
          ]];
        }
      }
    ]
  }
];

export const chooseUniqueEncounter = (state: GameState): Encounter | null => {
  const tier = state.sectorCount % 10 === 0 ? 'Tier2' : state.sectorCount % 5 === 0 ? 'Tier1' : null;
  
  if (!tier) return null;
  
  const encounters = tier === 'Tier2' ? TIER2_ENCOUNTERS : TIER1_ENCOUNTERS;
  const availableEncounters = encounters.filter(e => !state.discoveredEncounters.includes(e.name));
  
  if (availableEncounters.length === 0) return null;
  
  return availableEncounters[Math.floor(Math.random() * availableEncounters.length)];
};

export const placeEncounter = (
  grid: TileType[][],
  encounter: Encounter
): [TileType[][], { x: number; y: number } | null] => {
  const height = grid.length;
  const width = grid[0].length;
  
  // Try to find a suitable location for the encounter
  for (let attempts = 0; attempts < 50; attempts++) {
    const startY = Math.floor(Math.random() * (height - encounter.size.height + 1));
    const startX = Math.floor(Math.random() * (width - encounter.size.width + 1));
    
    // Check if the area is clear
    let clear = true;
    for (let y = 0; y < encounter.size.height; y++) {
      for (let x = 0; x < encounter.size.width; x++) {
        if (grid[startY + y][startX + x] !== '.') {
          clear = false;
          break;
        }
      }
      if (!clear) break;
    }
    
    if (clear) {
      // Place the encounter
      const newGrid = grid.map(row => [...row]);
      for (let y = 0; y < encounter.size.height; y++) {
        for (let x = 0; x < encounter.size.width; x++) {
          newGrid[startY + y][startX + x] = encounter.type;
        }
      }
      return [newGrid, { x: startX, y: startY }];
    }
  }
  
  return [grid, null];
};