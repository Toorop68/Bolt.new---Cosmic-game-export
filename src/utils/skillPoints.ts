import { GameStats } from '../types';

// Calculate score based on game stats
export const calculateScore = (stats: GameStats): number => {
  return (
    stats.tilesExplored * 1 +
    stats.planetsDiscovered * 10 +
    stats.derelictsExplored * 15 +
    stats.nebulaeTraversed * 5 +
    stats.piratesDefeated * 20 +
    stats.diplomaticMissions * 10 +
    stats.sectorsExplored * 50 +
    stats.blueprintsCollected * 30 +
    stats.blackHolesEscaped * 25 +
    Math.floor(stats.maxDistanceReached) * 100
  );
};

// Calculate skill points earned from a run
export const calculateSkillPoints = (stats: GameStats): number => {
  const basePoints = Math.floor(calculateScore(stats) / 1000);
  const distanceBonus = Math.floor(stats.maxDistanceReached / 5);
  const achievementPoints = 
    (stats.blackHolesEscaped > 0 ? 5 : 0) +
    (stats.piratesDefeated >= 5 ? 10 : 0) +
    (stats.sectorsExplored >= 10 ? 15 : 0) +
    (stats.diplomaticMissions >= 3 ? 10 : 0);

  return basePoints + distanceBonus + achievementPoints;
};