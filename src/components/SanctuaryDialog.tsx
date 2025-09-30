import React from 'react';
import { Shield, Zap, ScrollText, Coins } from 'lucide-react';
import { FactionType } from '../types';

interface SanctuaryDialogProps {
  faction: FactionType;
  reputation: number;
  onTrade: () => void;
  onHeal: () => void;
  onUpgrade: () => void;
  onClose: () => void;
  canTrade: boolean;
  canUpgrade: boolean;
  credits: number;
}

export const SanctuaryDialog: React.FC<SanctuaryDialogProps> = ({
  faction,
  reputation,
  onTrade,
  onHeal,
  onUpgrade,
  onClose,
  canTrade,
  canUpgrade,
  credits
}) => {
  const getFactionColor = (faction: FactionType): string => {
    switch (faction) {
      case 'Aserian': return 'bg-blue-600 hover:bg-blue-500';
      case 'Krynn': return 'bg-red-600 hover:bg-red-500';
      case 'Eldari': return 'bg-purple-600 hover:bg-purple-500';
    }
  };

  const getFactionDescription = (faction: FactionType): string => {
    switch (faction) {
      case 'Aserian':
        return 'A bustling trade hub of the Aserian Collective. Advanced technology and fair deals await.';
      case 'Krynn':
        return 'A fortified stronghold of the Krynn. Black market goods and combat enhancements available.';
      case 'Eldari':
        return 'A mysterious sanctuary of the ancient Eldari. Powerful artifacts and forgotten knowledge within.';
    }
  };

  const buttonClass = `w-full p-3 ${getFactionColor(faction)} rounded flex items-center gap-2`;
  const disabledClass = 'w-full p-3 bg-gray-700 rounded flex items-center gap-2 cursor-not-allowed opacity-50';

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2">{faction} Sanctuary</h2>
        <p className="text-gray-300 mb-4">{getFactionDescription(faction)}</p>

        <div className="space-y-3">
          <button
            onClick={onHeal}
            className={buttonClass}
          >
            <Shield className="w-5 h-5" />
            <div>
              <div className="font-bold">Repair Ship</div>
              <div className="text-sm text-gray-300">Restore hull integrity</div>
            </div>
          </button>

          <button
            onClick={onTrade}
            disabled={!canTrade}
            className={canTrade ? buttonClass : disabledClass}
          >
            <Coins className="w-5 h-5" />
            <div>
              <div className="font-bold">Trade</div>
              <div className="text-sm text-gray-300">
                {canTrade ? 'Exchange resources and technology' : 'Higher reputation required'}
              </div>
            </div>
          </button>

          <button
            onClick={onUpgrade}
            disabled={!canUpgrade}
            className={canUpgrade ? buttonClass : disabledClass}
          >
            <Zap className="w-5 h-5" />
            <div>
              <div className="font-bold">Faction Technology</div>
              <div className="text-sm text-gray-300">
                {canUpgrade ? 'Access unique upgrades' : 'Requires Allied status'}
              </div>
            </div>
          </button>

          <div className="text-sm text-gray-400 mt-4">
            <div className="flex justify-between">
              <span>Current Reputation</span>
              <span>{reputation}</span>
            </div>
            <div className="flex justify-between">
              <span>Available Credits</span>
              <span>{credits}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};