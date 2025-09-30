import React from 'react';
import { Fuel, Shield } from 'lucide-react';
import { FactionType, Upgrade } from '../types';

interface GameStatsProps {
  fuel: number;
  maxFuel: number;
  blueprints: number;
  reputation: Record<FactionType, number>;
  upgrades: Upgrade[];
  onUpgrade: (upgrade: Upgrade) => void;
}

export const GameStats: React.FC<GameStatsProps> = ({
  fuel,
  maxFuel,
  blueprints,
  reputation,
  upgrades,
  onUpgrade
}) => {
  const getFactionColor = (rep: number) => {
    if (rep >= 50) return 'text-green-500';
    if (rep <= -50) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-gray-800 p-4 rounded-lg">
        <Fuel className="text-yellow-500" />
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-yellow-500 rounded-full h-4 transition-all duration-300"
            style={{ width: `${(fuel / maxFuel) * 100}%` }}
          />
        </div>
        <span className="text-white font-mono">{fuel}/{maxFuel}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Ship Upgrades</h2>
            <span className="text-blue-400">Blueprints: {blueprints}</span>
          </div>
          <div className="space-y-2">
            {upgrades.map(upgrade => (
              <button
                key={upgrade.name}
                onClick={() => onUpgrade(upgrade)}
                disabled={upgrade.currentLevel >= upgrade.maxLevel || blueprints < upgrade.cost}
                className={`w-full p-2 rounded text-left ${
                  upgrade.currentLevel >= upgrade.maxLevel
                    ? 'bg-green-900 cursor-not-allowed'
                    : blueprints >= upgrade.cost
                    ? 'bg-blue-900 hover:bg-blue-800'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                <div className="font-bold">{upgrade.name}</div>
                <div className="text-sm text-gray-300">{upgrade.description}</div>
                <div className="text-sm text-gray-400">
                  Level {upgrade.currentLevel}/{upgrade.maxLevel}
                </div>
                <div className="text-sm text-gray-400">
                  Cost: {upgrade.cost} blueprint{upgrade.cost !== 1 ? 's' : ''}
                </div>
                {upgrade.currentLevel > 0 && (
                  <div className="text-sm text-green-400 mt-1">
                    Current Effect: {upgrade.effects[upgrade.currentLevel - 1]}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Faction Relations</h2>
          <div className="space-y-4">
            {Object.entries(reputation).map(([faction, value]) => (
              <div key={faction} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className={getFactionColor(value)} />
                  <span className="font-bold">{faction}</span>
                  <span className={`${getFactionColor(value)} ml-auto`}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 transition-all duration-300 ${
                      value >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.abs(value)}%`,
                      marginLeft: value < 0 ? '50%' : undefined,
                      marginRight: value >= 0 ? '50%' : undefined
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {value >= 50 ? 'Friendly' : value <= -50 ? 'Hostile' : 'Neutral'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};