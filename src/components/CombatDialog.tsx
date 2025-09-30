import React from 'react';
import { Shield, Coins, Wind } from 'lucide-react';
import { Combat } from '../types';

interface CombatDialogProps {
  combat: Combat;
  credits: number;
  onAction: (action: 'fight' | 'bribe' | 'flee') => void;
}

export const CombatDialog: React.FC<CombatDialogProps> = ({
  combat,
  credits,
  onAction
}) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2">Combat Engaged!</h2>
        <p className="text-gray-300 mb-4">
          Enemy: {combat.enemyType === 'pirate' ? 'Pirate Ship' : 'Defense System'}
        </p>
        
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Enemy Health</div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-red-500 rounded-full h-4 transition-all duration-300"
              style={{ width: `${(combat.enemyHealth / (10 * Math.floor(combat.enemyDamage / 5))) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onAction('fight')}
            className="w-full p-3 bg-red-900 hover:bg-red-800 rounded flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            <div>
              <div className="font-bold">Fight</div>
              <div className="text-sm text-gray-300">Attack the enemy ship</div>
            </div>
          </button>

          <button
            onClick={() => onAction('bribe')}
            disabled={credits < 50}
            className={`w-full p-3 rounded flex items-center gap-2 ${
              credits >= 50
                ? 'bg-yellow-900 hover:bg-yellow-800'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            <Coins className="w-5 h-5" />
            <div>
              <div className="font-bold">Bribe (50 credits)</div>
              <div className="text-sm text-gray-300">Try to buy your way out</div>
            </div>
          </button>

          <button
            onClick={() => onAction('flee')}
            className="w-full p-3 bg-blue-900 hover:bg-blue-800 rounded flex items-center gap-2"
          >
            <Wind className="w-5 h-5" />
            <div>
              <div className="font-bold">Flee</div>
              <div className="text-sm text-gray-300">Attempt to escape (costs fuel)</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};