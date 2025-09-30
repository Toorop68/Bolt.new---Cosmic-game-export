import React from 'react';

interface GameLogProps {
  logs: string[];
}

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  return (
    <div className="bg-gray-800 p-2 rounded h-24 overflow-y-auto text-sm">
      {logs.map((log, index) => (
        <p key={index} className="text-gray-300 mb-1">
          {log}
        </p>
      ))}
    </div>
  );
};