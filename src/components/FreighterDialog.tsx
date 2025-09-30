import React from 'react';
import { Freighter } from '../types';
import { Shield, CreditCard, Package } from 'lucide-react';
import { getTradeOffers } from '../utils/freighterInteraction';

interface FreighterDialogProps {
  freighter: Freighter;
  onTrade: (offer: { credits: number; blueprints: number; reputation: number }) => void;
  onDefend: () => void;
  onClose: () => void;
  canTrade: boolean;
}

export const FreighterDialog: React.FC<FreighterDialogProps> = ({
  freighter,
  onTrade,
  onDefend,
  onClose,
  canTrade
}) => {
  const tradeOffers = getTradeOffers(freighter);
  const faction = freighter.type.slice(0, -1);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2">{faction} Freighter</h2>
        <p className="text-gray-300 mb-4">
          A well-maintained trading vessel from the {faction} faction.
        </p>

        {canTrade ? (
          <>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Package className="text-blue-400" />
              Available Trades
            </h3>
            <div className="space-y-2 mb-4">
              {tradeOffers.map((offer, index) => (
                <button
                  key={index}
                  onClick={() => onTrade(offer)}
                  className="w-full p-3 bg-blue-900 hover:bg-blue-800 rounded flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold">Trade Package {index + 1}</div>
                    <div className="text-sm text-gray-300">
                      Cost: {offer.credits} credits
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400">+{offer.blueprints} blueprints</div>
                    <div className="text-blue-400">+{offer.reputation} reputation</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-yellow-400 mb-4">
            Higher reputation required to trade with {faction} freighters.
          </p>
        )}

        <div className="space-y-2">
          <button
            onClick={onDefend}
            className="w-full p-3 bg-red-900 hover:bg-red-800 rounded flex items-center gap-2"
          >
            <Shield className="text-red-400" />
            <div>
              <div className="font-bold">Defend Freighter</div>
              <div className="text-sm text-gray-300">
                Protect from pirates for reputation
              </div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};