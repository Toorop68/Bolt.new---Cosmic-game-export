import React, { useEffect, useState } from 'react';
import { GameGrid } from './components/GameGrid';
import { GameLog } from './components/GameLog';
import { createInitialState, movePlayer } from './utils/gameLogic';
import { Direction, Upgrade, PermanentUpgrade, FactionMission } from './types';
import { GameOver } from './components/GameOver';
import { Shield, Fuel, Map, ScrollText } from 'lucide-react';
import { ShipStatus } from './components/ShipStatus';
import { AccountScreen } from './components/AccountScreen';
import { loadAccount, saveAccount } from './utils/account';
import { calculateSkillPoints } from './utils/skillPoints';
import { Legend } from './components/Legend';
import { INITIAL_LEGEND_ITEMS } from './utils/legend';
import { ShipUpgrades } from './components/ShipUpgrades';
import { FactionPanel } from './components/FactionPanel';
import { SanctuaryDialog } from './components/SanctuaryDialog';
import { handleSanctuaryHeal, handleSanctuaryTrade, canTradeAtSanctuary, canUpgradeAtSanctuary } from './utils/sanctuary';

function App() {
  const [account, setAccount] = useState(loadAccount());
  const [gameState, setGameState] = useState(account ? createInitialState(account) : null);
  const [showAccount, setShowAccount] = useState(!account);
  const [legendItems, setLegendItems] = useState(INITIAL_LEGEND_ITEMS);
  const [activeSanctuary, setActiveSanctuary] = useState<'Aserian' | 'Krynn' | 'Eldari' | null>(null);

  const handleStartGame = (newAccount: PlayerAccount) => {
    setAccount(newAccount);
    setGameState(createInitialState(newAccount));
    setShowAccount(false);
  };

  const handleUpgrade = (upgrade: Upgrade) => {
    if (!gameState || gameState.blueprints < upgrade.cost || upgrade.currentLevel >= upgrade.maxLevel) return;

    setGameState(current => {
      if (!current) return current;
      const newState = upgrade.apply(current, upgrade.currentLevel + 1);
      return {
        ...newState,
        blueprints: newState.blueprints - upgrade.cost,
        upgrades: newState.upgrades.map(u =>
          u.name === upgrade.name
            ? { ...u, currentLevel: u.currentLevel + 1, cost: Math.floor(u.cost * 1.5) }
            : u
        )
      };
    });
  };

  const handleAcceptMission = (mission: FactionMission) => {
    if (!gameState) return;

    setGameState(current => {
      if (!current) return current;
      return {
        ...current,
        factions: {
          ...current.factions,
          [mission.type]: {
            ...current.factions[mission.type],
            missions: current.factions[mission.type].missions.map(m =>
              m.id === mission.id ? { ...m, status: 'active' } : m
            )
          }
        },
        log: [`Accepted mission: ${mission.name}`, ...current.log]
      };
    });
  };

  const handleSanctuaryAction = (action: 'heal' | 'trade' | 'upgrade') => {
    if (!gameState || !activeSanctuary) return;

    switch (action) {
      case 'heal': {
        const { state: newState, messages } = handleSanctuaryHeal(gameState, activeSanctuary);
        setGameState({
          ...newState,
          log: [...messages, ...newState.log]
        });
        break;
      }
      case 'trade': {
        const { state: newState, messages } = handleSanctuaryTrade(gameState, activeSanctuary);
        setGameState({
          ...newState,
          log: [...messages, ...newState.log]
        });
        break;
      }
      case 'upgrade': {
        // Handle faction-specific upgrades
        break;
      }
    }
  };

  const handlePermanentUpgrade = (upgrade: PermanentUpgrade) => {
    if (!gameState || !account) return;
    
    const cost = upgrade.cost;
    if (account.skillPoints < cost || upgrade.currentLevel >= upgrade.maxLevel) return;

    const newAccount = {
      ...account,
      skillPoints: account.skillPoints - cost,
      permanentUpgrades: account.permanentUpgrades.map(u =>
        u.name === upgrade.name
          ? { ...u, currentLevel: u.currentLevel + 1 }
          : u
      )
    };

    setAccount(newAccount);
    saveAccount(newAccount);
  };

  const handleNewGame = () => {
    if (!account || !gameState) return;

    // Update account stats
    const newAccount = {
      ...account,
      stats: {
        ...account.stats,
        totalGamesPlayed: account.stats.totalGamesPlayed + 1,
        bestScore: Math.max(account.stats.bestScore, gameState.stats.totalScore || 0),
        furthestDistance: Math.max(account.stats.furthestDistance, gameState.stats.maxDistanceReached || 0),
        totalPlayTime: account.stats.totalPlayTime + 
          ((gameState.stats.timeEnded || Date.now()) - gameState.stats.timeStarted)
      },
      skillPoints: account.skillPoints + calculateSkillPoints(gameState.stats)
    };

    setAccount(newAccount);
    saveAccount(newAccount);
    setGameState(createInitialState(newAccount));
  };

  const handleBackToHome = () => {
    setShowAccount(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState || showAccount) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      const keyDirections: Record<string, Direction> = {
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
      };

      const direction = keyDirections[e.key];
      if (direction) {
        setGameState(current => current ? movePlayer(current, direction) : current);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, showAccount]);

  if (showAccount) {
    return <AccountScreen existingAccount={account} onStart={handleStartGame} />;
  }

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cosmic Cartographer</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ScrollText className="text-blue-400" />
              <span>Blueprints: {gameState.blueprints}</span>
            </div>
            <div className="flex items-center gap-2">
              <Map className="text-green-400" />
              <span>Sectors: {gameState.exploredSectors.size}</span>
            </div>
          </div>
        </div>
        
        {/* Ship Status */}
        <div className="space-y-2">
          <ShipStatus
            hp={gameState.shipHP}
            maxHP={gameState.maxShipHP}
            shieldLevel={gameState.upgrades.find(u => u.name === 'Shield Generator')?.currentLevel || 0}
          />
          
          {/* Fuel Bar */}
          <div className="flex items-center gap-2 bg-gray-800 p-4 rounded-lg">
            <Fuel className="text-yellow-500" />
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-yellow-500 rounded-full h-4 transition-all duration-300"
                style={{ width: `${(gameState.fuel / gameState.maxFuel) * 100}%` }}
              />
            </div>
            <span className="text-white font-mono">{gameState.fuel}/{gameState.maxFuel}</span>
          </div>
        </div>
        
        {/* Main Game Area */}
        <div className="grid grid-cols-[2fr,1fr] gap-4">
          <div className="space-y-4">
            <GameGrid
              grid={gameState.grid}
              visibilityGrid={gameState.visibilityGrid}
            />
            <Legend items={legendItems} />
          </div>
          
          <div className="space-y-4">
            {/* Ship Upgrades */}
            <ShipUpgrades
              upgrades={gameState.upgrades}
              blueprints={gameState.blueprints}
              onUpgrade={handleUpgrade}
            />

            {/* Faction Panel */}
            <FactionPanel
              factions={gameState.factions}
              onAcceptMission={handleAcceptMission}
            />

            {/* Game Log */}
            <div>
              <h2 className="text-lg font-bold mb-1">Log</h2>
              <GameLog logs={gameState.log} />
            </div>
          </div>
        </div>

        {/* Sanctuary Dialog */}
        {activeSanctuary && (
          <SanctuaryDialog
            faction={activeSanctuary}
            reputation={gameState.factions[activeSanctuary].reputation}
            onTrade={() => handleSanctuaryAction('trade')}
            onHeal={() => handleSanctuaryAction('heal')}
            onUpgrade={() => handleSanctuaryAction('upgrade')}
            onClose={() => setActiveSanctuary(null)}
            canTrade={canTradeAtSanctuary(gameState, activeSanctuary)}
            canUpgrade={canUpgradeAtSanctuary(gameState, activeSanctuary)}
            credits={gameState.credits}
          />
        )}

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <GameOver
            stats={gameState.stats}
            skillPoints={account.skillPoints}
            permanentUpgrades={account.permanentUpgrades}
            onUpgrade={handlePermanentUpgrade}
            onNewGame={handleNewGame}
            onBackToHome={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
}

export default App;