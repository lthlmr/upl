import React from 'react';

type ProgressBarColor = 'purple' | 'blue' | 'green' | 'red' | 'amber' | 'yellow';
type ProgressBarHeight = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  progress: number;
  color?: ProgressBarColor;
  height?: ProgressBarHeight;
  showPercent?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'purple',
  height = 'md',
  showPercent = false,
  className = '',
}) => {
  // Assurer que la progression est entre 0 et 100
  const normalizedProgress = Math.min(Math.max(0, progress), 100);
  
  // Mappings de couleurs
  const colorStyles = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-emerald-600',
    red: 'bg-red-600',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
  };
  
  // Mappings de hauteur
  const heightStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  // Effet de brillance pour un look néon
  const glowColor = {
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-emerald-500/50',
    red: 'shadow-red-500/50',
    amber: 'shadow-amber-500/50',
    yellow: 'shadow-yellow-500/50',
  };
  
  return (
    <div className={`w-full bg-gray-800/40 backdrop-blur-sm rounded-full overflow-hidden border border-purple-900/30 ${heightStyles[height]} ${className} relative`}>
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-purple-500/20 animate-pulse opacity-50" />
      
      <div 
        className={`${colorStyles[color]} h-full rounded-full shadow-inner transition-all duration-300 ${glowColor[color]} relative overflow-hidden`}
        style={{ width: `${normalizedProgress}%` }}
      >
        {/* Shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            animation: 'shine 2s linear infinite',
            backgroundSize: '200% 100%'
          }}
        />
        
        {/* Magic particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>
      
      {showPercent && (
        <div className="mt-1 text-right text-xs font-medium bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
          {normalizedProgress.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;