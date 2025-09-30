import React, { useState } from 'react';
import { Upgrade } from '../types';
import { Wrench, ChevronDown, ChevronUp } from 'lucide-react';

interface ShipUpgradesProps {
  upgrades: Upgrade[];
  blueprints: number;
  onUpgrade: (upgrade: Upgrade) => void;
}

export const ShipUpgrades: React.FC<ShipUpgradesProps> = ({
  upgrades,
  blueprints,
  onUpgrade
}) => {
  const [expandedUpgrade, setExpandedUpgrade] = useState<string | null>(null);

  const toggleUpgrade = (name: string) => {
    setExpandedUpgrade(expandedUpgrade === name ? null : name);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench className="text-blue-400" />
          <h2 className="text-lg font-bold">Ship Upgrades</h2>
        </div>
        <span className="text-sm text-blue-400">
          {blueprints} blueprint{blueprints !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-2">
        {upgrades.map(upgrade => {
          const isExpanded = expandedUpgrade === upgrade.name;
          const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;
          const canAfford = blueprints >= upgrade.cost;
          
          return (
            <div
              key={upgrade.name}
              className={`rounded overflow-hidden transition-all ${
                isMaxLevel
                  ? 'bg-green-900/50'
                  : canAfford
                  ? 'bg-blue-900/50'
                  : 'bg-gray-700/50'
              }`}
            >
              <button
                onClick={() => toggleUpgrade(upgrade.name)}
                className="w-full p-2 text-left flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{upgrade.name}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span>Lvl {upgrade.currentLevel}/{upgrade.maxLevel}</span>
                      {!isMaxLevel && (
                        <span className="text-blue-300">{upgrade.cost} bp</span>
                      )}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  {upgrade.currentLevel > 0 && (
                    <div className="text-xs text-green-400 mt-1">
                      {upgrade.effects[upgrade.currentLevel - 1]}
                    </div>
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-2 pb-2">
                  <p className="text-sm text-gray-300 mb-2">{upgrade.description}</p>
                  {!isMaxLevel && (
                    <button
                      onClick={() => onUpgrade(upgrade)}
                      disabled={!canAfford || isMaxLevel}
                      className={`w-full py-1 px-2 rounded text-sm ${
                        canAfford
                          ? 'bg-blue-600 hover:bg-blue-500'
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Upgrade' : 'Not enough blueprints'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};