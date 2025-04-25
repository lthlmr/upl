import React, { useEffect, useState } from 'react';

const Background: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background gradient - Noir profond vers gris foncé avec nuance violette */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800" />
      
      {/* Overlay avec effet brumeux violet */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15), rgba(0, 0, 0, 0) 70%)'
        }}
      />
      
      {/* Animated particles with neon purple and violet colors */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${
              Math.random() > 0.7 ? 'bg-purple-500' : 'bg-violet-600'
            } opacity-${Math.random() > 0.5 ? '20' : '10'}`}
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(139, 92, 246, 0.6)`,
              transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
              animation: `float ${Math.random() * 15 + 10}s infinite ${Math.random() * 5}s ease-in-out`,
            }}
          />
        ))}
      </div>
      
      {/* Hexagonal grid for cyberpunk/RPG feel */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='%23a855f7' fill-opacity='0.15'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '24px 42px',
          transform: `translateY(${scrollY * 0.03}px)`,
        }}
      />
      
      {/* Glow effects */}
      <div 
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-600 opacity-5 blur-[150px]"
        style={{
          transform: `translate(${Math.sin(scrollY * 0.001) * 20}px, ${Math.cos(scrollY * 0.001) * 20}px)`,
        }}
      />
      
      <div 
        className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-violet-500 opacity-5 blur-[100px]"
        style={{
          transform: `translate(${Math.cos(scrollY * 0.001) * 30}px, ${Math.sin(scrollY * 0.001) * 30}px)`,
        }}
      />
      
      {/* Digital lines - horizontal scanning line */}
      <div 
        className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"
        style={{
          top: `${(scrollY * 0.5) % 100}%`,
          animation: 'scanline 8s linear infinite',
          boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
        }}
      />
      
      {/* Animated style for the particles */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes scanline {
            0% {
              top: 0%;
              opacity: 0.1;
            }
            50% {
              opacity: 0.3;
            }
            100% {
              top: 100%;
              opacity: 0.1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Background;