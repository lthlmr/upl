import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
  imageUrl: string;
}

interface GameNewsProps {
  className?: string;
  news: NewsItem[];
}

const GameNews: React.FC<GameNewsProps> = ({ className = '', news = [] }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Navigation des nouvelles
  const goToNext = () => {
    setActiveIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };
  
  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  // Fonction d'optimisation pour gérer les événements de toucher
  const touchStartX = React.useRef<number>(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Si le glissement est assez significatif (plus de 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext(); // Glissement vers la gauche → prochain article
      } else {
        goToPrevious(); // Glissement vers la droite → article précédent
      }
    }
  };

  // Si aucune nouvelle n'est disponible
  if (!news.length) {
    return (
      <div className={`w-full text-center py-8 ${className}`}>
        <p className="text-gray-400">Aucune actualité disponible pour le moment.</p>
      </div>
    );
  }

  const activeNews = news[activeIndex];

  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
          Actualités du jeu
        </span>
      </h2>

      <div 
        className="relative overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image en arrière-plan avec superposition de gradient */}
        <div className="relative h-[280px] sm:h-[320px] overflow-hidden rounded-xl">
          <img 
            src={activeNews.imageUrl} 
            alt={activeNews.title}
            className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        {/* Contenu de l'actualité */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-center text-gray-300 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{activeNews.date}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{activeNews.title}</h3>
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3">{activeNews.content}</p>
        </div>

        {/* Flèches de navigation */}
        <button 
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white transition-all duration-300"
          aria-label="Article précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white transition-all duration-300"
          aria-label="Article suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Indicateurs de navigation */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
          <div className="flex space-x-2 p-1">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Aller à l'actualité ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Optimisation des performances
export default React.memo(GameNews); 