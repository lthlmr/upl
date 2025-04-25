import React from 'react';

type ProgressBarColor = 'purple' | 'blue' | 'green' | 'red';
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
  };
  
  return (
    <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${heightStyles[height]} ${className}`}>
      <div 
        className={`${colorStyles[color]} h-full rounded-full shadow-inner transition-all duration-300 ${glowColor[color]}`}
        style={{ width: `${normalizedProgress}%` }}
      />
      
      {showPercent && (
        <div className="mt-1 text-right text-xs text-gray-400">
          {normalizedProgress.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;