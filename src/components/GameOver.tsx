import React from 'react';
import { GameStats, PermanentUpgrade, DeathCause } from '../types';
import { Trophy, Star, ArrowUp, Clock, Skull, Home } from 'lucide-react';
import { calculateScore, calculateSkillPoints } from '../utils/skillPoints';

interface GameOverProps {
  stats: GameStats;
  skillPoints: number;
  permanentUpgrades: PermanentUpgrade[];
  onUpgrade: (upgrade: PermanentUpgrade) => void;
  onNewGame: () => void;
  onBackToHome: () => void;
}

const getDeathMessage = (cause: DeathCause): string => {
  switch (cause) {
    case 'fuel_depletion': return 'Your ship drifted powerless in the void...';
    case 'black_hole': return 'Consumed by the infinite darkness of a black hole...';
    case 'pirate_attack': return 'Your ship was torn apart by relentless pirates...';
    case 'anomaly': return 'Lost to an unknown spatial anomaly...';
    default: return 'Your journey has come to an end...';
  }
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

export const GameOver: React.FC<GameOverProps> = ({
  stats,
  skillPoints,
  permanentUpgrades,
  onUpgrade,
  onNewGame,
  onBackToHome
}) => {
  const timePlayed = stats.timeEnded ? stats.timeEnded - stats.timeStarted : 0;
  const earnedPoints = calculateSkillPoints(stats);
  const finalScore = calculateScore(stats);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <Skull className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Journey Over...</h2>
          <p className="text-gray-400 italic mb-4">{getDeathMessage(stats.deathCause)}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700 p-3 rounded">
              <Trophy className="w-4 h-4 text-yellow-500 inline mr-2" />
              Final Score: {finalScore}
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <Clock className="w-4 h-4 text-blue-500 inline mr-2" />
              Time: {formatDuration(timePlayed)}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-green-400">+ {earnedPoints} Skill Points Earned!</p>
            <p className="text-blue-400">Total Skill Points: {skillPoints}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              Journey Statistics
            </h3>
            <div className="space-y-1 text-sm">
              <p>Distance Traveled: {Math.floor(stats.maxDistanceReached)} sectors</p>
              <p>Tiles Explored: {stats.tilesExplored}</p>
              <p>Planets Discovered: {stats.planetsDiscovered}</p>
              <p>Derelicts Explored: {stats.derelictsExplored}</p>
              <p>Nebulae Traversed: {stats.nebulaeTraversed}</p>
              <p>Pirates Defeated: {stats.piratesDefeated}</p>
              <p>Diplomatic Missions: {stats.diplomaticMissions}</p>
              <p>Sectors Explored: {stats.sectorsExplored}</p>
              <p>Blueprints Found: {stats.blueprintsCollected}</p>
              <p>Black Holes Escaped: {stats.blackHolesEscaped}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <ArrowUp className="w-4 h-4 text-green-500 mr-2" />
              Permanent Ship Upgrades
            </h3>
            <div className="space-y-2">
              {permanentUpgrades.map(upgrade => (
                <button
                  key={upgrade.name}
                  onClick={() => onUpgrade(upgrade)}
                  disabled={skillPoints < upgrade.cost || upgrade.currentLevel >= upgrade.maxLevel}
                  className={`w-full p-2 rounded text-left text-sm ${
                    skillPoints >= upgrade.cost && upgrade.currentLevel < upgrade.maxLevel
                      ? 'bg-blue-900 hover:bg-blue-800'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold">{upgrade.name}</div>
                  <div className="text-xs text-gray-300">
                    Level {upgrade.currentLevel}/{upgrade.maxLevel}
                  </div>
                  <div className="text-xs text-gray-400">
                    Cost: {upgrade.cost} points
                  </div>
                  {upgrade.currentLevel > 0 && (
                    <div className="text-xs text-green-400 mt-1">
                      {upgrade.effect(upgrade.currentLevel)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onNewGame}
            className="w-full bg-green-700 hover:bg-green-600 py-2 rounded font-bold"
          >
            Begin New Journey
          </button>
          
          <button
            onClick={onBackToHome}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};