import React, { useState } from 'react';
import { PlayerAccount } from '../types';
import { Rocket, Shuffle, LogIn, UserPlus, ArrowLeft } from 'lucide-react';

interface AccountScreenProps {
  existingAccount: PlayerAccount | null;
  onStart: (account: PlayerAccount) => void;
}

const TITLE_PREFIXES = ['Commander', 'Captain', 'Admiral', 'Voyager', 'Explorer'];
const NAME_PARTS = ['Nova', 'Orion', 'Zenith', 'Astra', 'Solis'];
const NAME_SUFFIXES = ['Strider', 'Vex', 'Kael', 'Nox', 'Quen'];

const generateSpaceName = (): string => {
  const prefix = TITLE_PREFIXES[Math.floor(Math.random() * TITLE_PREFIXES.length)];
  const part = NAME_PARTS[Math.floor(Math.random() * NAME_PARTS.length)];
  const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
  return `${prefix} ${part} ${suffix}`;
};

export const AccountScreen: React.FC<AccountScreenProps> = ({
  existingAccount,
  onStart
}) => {
  const [name, setName] = useState(existingAccount?.name || '');
  const [showNewAccount, setShowNewAccount] = useState(!existingAccount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const account: PlayerAccount = {
      name: name.trim(),
      created: Date.now(),
      skillPoints: existingAccount?.skillPoints || 0,
      permanentUpgrades: existingAccount?.permanentUpgrades || [],
      stats: existingAccount?.stats || {
        totalGamesPlayed: 0,
        bestScore: 0,
        furthestDistance: 0,
        totalPlayTime: 0
      }
    };

    onStart(account);
  };

  if (existingAccount && !showNewAccount) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
          <Rocket className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Welcome Back, Captain!</h2>
          <p className="text-xl text-blue-400 mb-6">{existingAccount.name}</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-gray-700 p-3 rounded">
                Games Played: {existingAccount.stats.totalGamesPlayed}
              </div>
              <div className="bg-gray-700 p-3 rounded">
                Best Score: {existingAccount.stats.bestScore}
              </div>
              <div className="bg-gray-700 p-3 rounded">
                Skill Points: {existingAccount.skillPoints}
              </div>
              <div className="bg-gray-700 p-3 rounded">
                Furthest: {Math.floor(existingAccount.stats.furthestDistance)} sectors
              </div>
            </div>
            
            <button
              onClick={() => onStart(existingAccount)}
              className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Continue Journey
            </button>
            
            <button
              onClick={() => setShowNewAccount(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          {existingAccount && (
            <button
              onClick={() => setShowNewAccount(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <h2 className={`text-2xl font-bold ${existingAccount ? 'flex-1 text-center' : ''}`}>
            Create New Account
          </h2>
          {existingAccount && <div className="w-16" />} {/* Spacer for centering */}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Captain's Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
                maxLength={30}
                required
              />
              <button
                type="button"
                onClick={() => setName(generateSpaceName())}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
                title="Generate Random Name"
              >
                <Shuffle className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold"
          >
            Begin Journey
          </button>
        </form>
      </div>
    </div>
  );
};