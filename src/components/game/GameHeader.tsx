import React from 'react';
import { TowerControl as GameController, Shield, Sword, Trophy } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';

interface GameHeaderProps {
  currentVersion: string;
  remoteVersion: string;
  updateAvailable: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  currentVersion,
  remoteVersion,
  updateAvailable
}) => {
  const { state } = useAppContext();
  const { user } = state;

  return (
    <div className="w-full bg-black/40 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-purple-900/30">
      {/* Header content - responsive design */}
      <div className="flex flex-col md:flex-row items-center p-6 relative">
        {/* Magical glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-violet-600/10 to-purple-600/5" />
        
        {/* Game logo & title - stacks on mobile, side by side on larger screens */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative mr-4">
            <GameController size={48} className="text-purple-500 relative z-10" />
            <div className="absolute inset-0 blur-lg opacity-60 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
              MMORPG Fantasy
            </h1>
            <div className="flex items-center text-sm text-gray-400">
              <span>Version: {currentVersion || 'Non installé'}</span>
              {updateAvailable && (
                <span className="ml-2 text-yellow-400">
                  (Mise à jour disponible: {remoteVersion})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Game stats - hidden on small screens, shown on md and up */}
        <div className="hidden md:flex ml-auto space-x-8">
          <div className="flex items-center text-gray-300 hover:text-purple-300 transition-colors">
            <Shield className="w-5 h-5 mr-2 text-purple-400" />
            <span>Niveau Max: 60</span>
          </div>
          <div className="flex items-center text-gray-300 hover:text-purple-300 transition-colors">
            <Sword className="w-5 h-5 mr-2 text-violet-400" />
            <span>Classes: 8</span>
          </div>
          <div className="flex items-center text-gray-300 hover:text-purple-300 transition-colors">
            <Trophy className="w-5 h-5 mr-2 text-amber-400" />
            <span>Événements: 3</span>
          </div>
        </div>

        {/* User info - simplified on mobile */}
        <div className="flex flex-col items-center md:items-end mt-4 md:mt-0 md:ml-6">
          {user && (
            <>
              <div className="flex items-center">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/40'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full mr-2 border-2 border-purple-500 shadow-lg shadow-purple-500/30"
                />
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <span className="text-xs text-gray-400 mt-1">{user.email}</span>
            </>
          )}
        </div>
      </div>

      {/* Mobile game stats - only visible on small screens */}
      <div className="md:hidden bg-black/30 grid grid-cols-3 divide-x divide-purple-900/30 border-t border-purple-900/30">
        <div className="flex flex-col items-center py-3">
          <Shield className="w-5 h-5 text-purple-400 mb-1" />
          <span className="text-xs text-gray-300">Niveau 60</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <Sword className="w-5 h-5 text-violet-400 mb-1" />
          <span className="text-xs text-gray-300">8 Classes</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <Trophy className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-xs text-gray-300">3 Événements</span>
        </div>
      </div>
    </div>
  );
};

// Optimisation avec memo pour éviter les re-rendus inutiles
export default React.memo(GameHeader);