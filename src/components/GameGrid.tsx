import React from 'react';
import { TileType, VisibilityLevel } from '../types';

interface GameGridProps {
  grid: TileType[][];
  visibilityGrid: VisibilityLevel[][];
}

const tileColors: Record<TileType, string> = {
  '@': 'text-blue-900',  // Changed from 'X' to '@' with dark blue color
  'O': 'text-green-500',
  '#': 'text-gray-500',
  '~': 'text-purple-500',
  '+': 'text-yellow-500',
  'D': 'text-orange-500',
  '.': 'text-blue-300',
  '^': 'text-white',
  'A': 'text-blue-500',
  'K': 'text-red-500',
  'E': 'text-purple-500'
};

export const GameGrid: React.FC<GameGridProps> = ({ grid, visibilityGrid }) => {
  const getTileDisplay = (tile: TileType, visibility: VisibilityLevel) => {
    if (visibility === 0) return '?';
    if (visibility === 1) return '.';
    return tile === 'X' ? '@' : tile;  // Convert 'X' to '@' for display
  };

  const getTileStyle = (tile: TileType, visibility: VisibilityLevel) => {
    if (visibility === 0) return 'text-gray-700';
    if (visibility === 1) return 'text-gray-500';
    return tile === 'X' ? tileColors['@'] : tileColors[tile];  // Use '@' color for 'X' tiles
  };

  return (
    <pre className="font-mono bg-gray-900 p-4 rounded-lg">
      {grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((tile, j) => (
            <span
              key={`${i}-${j}`}
              className={`w-6 ${getTileStyle(tile, visibilityGrid[i][j])}`}
            >
              {getTileDisplay(tile, visibilityGrid[i][j])}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
};