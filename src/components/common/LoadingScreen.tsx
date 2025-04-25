import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-50">
      {/* Magical circle */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-[spin_2s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border-4 border-purple-400/20 animate-[spin_4s_linear_infinite_reverse]" />
        
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-md" />
          </div>
        </div>
      </div>
      
      <h2 className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
        Chargement...
      </h2>
      
      <p className="mt-2 text-gray-400 text-sm">
        Préparation de votre aventure
      </p>
      
      {/* Magical particles */}
      <div className="relative">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '4px',
              height: '4px',
              left: `${Math.random() * 200 - 100}px`,
              top: `${Math.random() * 200 - 100}px`,
              background: `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.2})`,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
              animation: `float ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s ease-in-out`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;