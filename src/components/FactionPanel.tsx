import React, { useState } from 'react';
import { Users, Star, Target, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { FactionType, FactionStatus, FactionMission } from '../types';
import { FACTION_RANKS } from '../utils/factions';

interface FactionPanelProps {
  factions: Record<FactionType, FactionStatus>;
  onAcceptMission?: (mission: FactionMission) => void;
}

const getFactionColor = (faction: FactionType): string => {
  switch (faction) {
    case 'Aserian': return 'text-blue-400';
    case 'Krynn': return 'text-red-400';
    case 'Eldari': return 'text-purple-400';
  }
};

const getRankColor = (reputation: number): string => {
  if (reputation >= 700) return 'text-yellow-400';
  if (reputation >= 400) return 'text-green-400';
  if (reputation >= 50) return 'text-blue-400';
  if (reputation <= -700) return 'text-red-600';
  if (reputation <= -400) return 'text-red-400';
  return 'text-gray-400';
};

export const FactionPanel: React.FC<FactionPanelProps> = ({
  factions,
  onAcceptMission
}) => {
  const [expandedFaction, setExpandedFaction] = useState<FactionType | null>(null);

  const toggleFaction = (faction: FactionType) => {
    setExpandedFaction(expandedFaction === faction ? null : faction);
  };

  const canAcceptMissions = (status: FactionStatus): boolean => {
    return status.rank === 'Allied' || status.rank === 'Champion' || status.rank === 'Legendary Ally';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-blue-400" />
        <h2 className="text-lg font-bold">Faction Relations</h2>
      </div>

      <div className="space-y-2">
        {Object.entries(factions).map(([factionName, status]) => {
          const faction = factionName as FactionType;
          const isExpanded = expandedFaction === faction;
          const repPercentage = ((status.reputation + 1000) / 2000) * 100;
          
          return (
            <div
              key={faction}
              className="bg-gray-700/50 rounded overflow-hidden"
            >
              <button
                onClick={() => toggleFaction(faction)}
                className="w-full p-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className={getFactionColor(faction)} size={16} />
                    <span className="font-bold">{faction}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getRankColor(status.reputation)}`}>
                      {status.rank}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Reputation Bar */}
                <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getRankColor(status.reputation)}`}
                    style={{ width: `${repPercentage}%`, marginLeft: '50%', transform: 'translateX(-50%)' }}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="px-2 pb-2 space-y-2">
                  {/* Reputation Details */}
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-gray-300">
                      <span>Reputation</span>
                      <span>{status.reputation}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Next Rank</span>
                      <span>
                        {status.reputation < 1000
                          ? `${FACTION_RANKS[status.rank].max - status.reputation} points`
                          : 'Maximum Rank'}
                      </span>
                    </div>
                  </div>

                  {/* Technologies */}
                  {status.unlockedTechnologies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold mb-1 flex items-center gap-1">
                        <Award size={14} className="text-yellow-400" />
                        Unlocked Technologies
                      </h4>
                      <div className="space-y-1">
                        {status.unlockedTechnologies.map(tech => (
                          <div
                            key={tech}
                            className="text-xs bg-gray-600/50 p-1 rounded"
                          >
                            {tech.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Missions */}
                  {status.missions.length > 0 && canAcceptMissions(status) ? (
                    <div>
                      <h4 className="text-sm font-bold mb-1 flex items-center gap-1">
                        <Target size={14} className="text-green-400" />
                        Available Missions
                      </h4>
                      <div className="space-y-1">
                        {status.missions.map(mission => (
                          <div
                            key={mission.id}
                            className="bg-gray-600/50 p-2 rounded text-sm"
                          >
                            <div className="font-bold">{mission.name}</div>
                            <p className="text-xs text-gray-300 mb-1">
                              {mission.description}
                            </p>
                            <div className="flex justify-between text-xs">
                              <span className="text-green-400">
                                +{mission.rewards.reputation} rep
                              </span>
                              {mission.rewards.credits && (
                                <span className="text-yellow-400">
                                  {mission.rewards.credits} credits
                                </span>
                              )}
                            </div>
                            {onAcceptMission && mission.status === 'available' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAcceptMission(mission);
                                }}
                                className="w-full mt-1 py-1 px-2 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                              >
                                Accept Mission
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : status.rank !== 'Allied' && status.rank !== 'Champion' && status.rank !== 'Legendary Ally' ? (
                    <div className="text-sm text-yellow-400 mt-2">
                      Reach Allied rank to unlock missions
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};