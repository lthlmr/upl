import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
      <div className="relative">
        {/* Glowing circle */}
        <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-30 animate-pulse" />
        
        {/* Spinner */}
        <svg
          className="w-16 h-16 text-blue-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      
      <p className="mt-4 text-xl font-semibold text-white animate-pulse">
        Loading...
      </p>
      
      <p className="mt-2 text-sm text-gray-400">
        Initializing launcher
      </p>
    </div>
  );
};

export default LoadingScreen;