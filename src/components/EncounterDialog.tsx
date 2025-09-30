import React from 'react';
import { Encounter } from '../types';

interface EncounterDialogProps {
  encounter: Encounter;
  onChoice: (choiceIndex: number) => void;
  onClose: () => void;
}

export const EncounterDialog: React.FC<EncounterDialogProps> = ({
  encounter,
  onChoice,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2">{encounter.name}</h2>
        <p className="text-gray-300 mb-4">{encounter.description}</p>
        
        <div className="space-y-3">
          {encounter.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(index)}
              className="w-full p-3 bg-blue-900 hover:bg-blue-800 rounded text-left"
            >
              <div className="font-bold">{choice.name}</div>
              <div className="text-sm text-gray-300">{choice.description}</div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div className="text-red-400">Risk: {choice.risk}</div>
                <div className="text-green-400">Reward: {choice.reward}</div>
              </div>
            </button>
          ))}
          
          <button
            onClick={onClose}
            className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded mt-4"
          >
            Ignore (No Risk, No Reward)
          </button>
        </div>
      </div>
    </div>
  );
};