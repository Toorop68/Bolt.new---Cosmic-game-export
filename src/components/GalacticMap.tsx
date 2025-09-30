import React from 'react';
import { Map } from 'lucide-react';

interface GalacticMapProps {
  currentSector: { x: number; y: number };
  exploredSectors: Set<string>;
  onClose: () => void;
}

export const GalacticMap: React.FC<GalacticMapProps> = ({
  currentSector,
  exploredSectors,
  onClose
}) => {
  const mapSize = 5; // Show 5x5 grid centered on current position
  const grid: JSX.Element[][] = [];

  for (let y = -Math.floor(mapSize/2); y <= Math.floor(mapSize/2); y++) {
    const row: JSX.Element[] = [];
    for (let x = -Math.floor(mapSize/2); x <= Math.floor(mapSize/2); x++) {
      const sectorX = currentSector.x + x;
      const sectorY = currentSector.y + y;
      const isCurrentSector = x === 0 && y === 0;
      const isExplored = exploredSectors.has(`${sectorX},${sectorY}`);
      
      row.push(
        <div
          key={`${x},${y}`}
          className={`w-12 h-12 flex items-center justify-center rounded ${
            isCurrentSector
              ? 'bg-blue-500 text-white'
              : isExplored
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-800 text-gray-600'
          }`}
        >
          {isCurrentSector ? '*' : isExplored ? 'o' : '?'}
        </div>
      );
    }
    grid.push(row);
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Map className="w-6 h-6" />
            Galactic Map
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="grid gap-1">
          {grid.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-500">*</span> Current Location
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300">o</span> Explored Sector
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">?</span> Unexplored
          </div>
        </div>

        <div className="mt-4 text-center text-gray-300">
          Current Sector: ({currentSector.x}, {currentSector.y})
        </div>
      </div>
    </div>
  );
};