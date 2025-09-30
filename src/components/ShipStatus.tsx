import React from 'react';
import { Shield, Heart } from 'lucide-react';

interface ShipStatusProps {
  hp: number;
  maxHP: number;
  shieldLevel: number;
}

export const ShipStatus: React.FC<ShipStatusProps> = ({
  hp,
  maxHP,
  shieldLevel
}) => {
  const hpPercentage = (hp / maxHP) * 100;
  const getHPColor = () => {
    if (hpPercentage <= 25) return 'bg-red-500';
    if (hpPercentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      {/* HP Bar */}
      <div className="flex items-center gap-2 bg-gray-800 p-4 rounded-lg">
        <Heart className={`${hpPercentage <= 25 ? 'text-red-500' : 'text-green-500'}`} />
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">Hull Integrity</div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className={`${getHPColor()} rounded-full h-4 transition-all duration-300`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>
        <span className="text-white font-mono">{hp}/{maxHP}</span>
      </div>

      {/* Shield Status */}
      {shieldLevel > 0 && (
        <div className="flex items-center gap-2 bg-gray-800 p-4 rounded-lg">
          <Shield className="text-blue-500" />
          <div className="flex-1">
            <div className="text-sm text-gray-400">Shield Protection</div>
            <div className="text-blue-400">
              {shieldLevel * 25}% Damage Reduction
            </div>
          </div>
        </div>
      )}
    </div>
  );
};