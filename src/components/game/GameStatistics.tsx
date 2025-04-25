import React from 'react';

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface GameStatisticsProps {
  className?: string;
  stats: StatItem[];
}

const GameStatistics: React.FC<GameStatisticsProps> = ({ 
  className = '', 
  stats = [] 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
          Statistiques du jeu
        </span>
      </h2>

      {/* Affichage responsive des statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-black/30 rounded-lg p-4 border border-purple-900/20 hover:border-purple-500/50 transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="mb-3 sm:mb-0 sm:mr-3 p-2 bg-gray-800 rounded-full">
                {stat.icon}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Optimisation des performances avec React.memo
export default React.memo(GameStatistics); 