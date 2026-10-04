import { useState, useEffect } from 'react';
import { menuItems } from '../data/menu';
import { useStore } from '../store/store';

interface CustomerDisplayProps {
  onClose: () => void;
}

export default function CustomerDisplay({ onClose }: CustomerDisplayProps) {
  const [currentView, setCurrentView] = useState<'grid' | 'slideshow'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { customImages } = useStore();

  // Filter only GUTech items
  const gutechItems = menuItems.filter(item => item.category === 'gutech');

  // Auto slideshow
  useEffect(() => {
    if (currentView === 'slideshow' && isAutoPlay && !selectedItem) {
      const interval = setInterval(() => {
        setSlideshowIndex((prev) => (prev + 1) % gutechItems.length);
      }, 4000); // Change every 4 seconds
      return () => clearInterval(interval);
    }
  }, [currentView, isAutoPlay, selectedItem, gutechItems.length]);

  const currentItem = gutechItems[slideshowIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 z-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">FLAMES</h1>
              <p className="text-xs text-orange-300">GUTech Event Menu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('grid')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'grid'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <i className="fas fa-th mr-1"></i> Grid
              </button>
              <button
                onClick={() => setCurrentView('slideshow')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'slideshow'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <i className="fas fa-images mr-1"></i> Slideshow
              </button>
            </div>

            {/* Auto Play Toggle (only in slideshow) */}
            {currentView === 'slideshow' && (
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isAutoPlay
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <i className={`fas ${isAutoPlay ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                {isAutoPlay ? 'Pause' : 'Play'}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full pt-20 pb-4 px-4">
        {currentView === 'grid' ? (
          // Grid View
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {gutechItems.map((item) => {
                const isSelected = selectedItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(isSelected ? null : item.id)}
                    className={`relative group transition-all duration-300 ${
                      isSelected ? 'col-span-2 row-span-2' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} shadow-2xl transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'hover:scale-105'
                    }`}>
                      {/* Image */}
                      <div className={`${isSelected ? 'h-96' : 'h-48'} overflow-hidden`}>
                        {customImages[item.id] || item.image ? (
                          <img
                            src={customImages[item.id] || item.image}
                            alt={item.name}
                            className={`w-full ${isSelected ? 'h-96' : 'h-48'} object-cover transition-transform duration-500 group-hover:scale-110`}
                          />
                        ) : (
                          <div className={`w-full ${isSelected ? 'h-96' : 'h-48'} flex items-center justify-center`}>
                            <span className={`${isSelected ? 'text-8xl' : 'text-6xl'}`}>{item.emoji}</span>
                          </div>
                        )}
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className={`${isSelected ? 'text-3xl' : 'text-lg'} font-black mb-2`}>
                          {item.name}
                        </h3>
                        {isSelected && (
                          <div className="animate-fade-in">
                            <p className="text-sm text-gray-200 mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-black text-orange-400">
                                OMR {item.price.toFixed(3)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition-all"
                              >
                                <i className="fas fa-times mr-1"></i> Close
                              </button>
                            </div>
                          </div>
                        )}
                        {!isSelected && (
                          <p className="text-xl font-black text-orange-400">
                            OMR {item.price.toFixed(3)}
                          </p>
                        )}
                      </div>

                      {/* Expand Indicator */}
                      {!isSelected && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <i className="fas fa-expand text-white text-xs"></i>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Slideshow View
          <div className="h-full flex items-center justify-center relative">
            {/* Main Slide */}
            <div className="w-full max-w-5xl mx-auto">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentItem.color} shadow-2xl transition-all duration-500`}>
                {/* Image */}
                <div className="h-[70vh] overflow-hidden">
                  {customImages[currentItem.id] || currentItem.image ? (
                    <img
                      src={customImages[currentItem.id] || currentItem.image}
                      alt={currentItem.name}
                      className="w-full h-full object-cover animate-zoom-in"
                      key={currentItem.id}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-9xl">{currentItem.emoji}</span>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="max-w-3xl">
                    <h2 className="text-5xl font-black mb-4 animate-slide-up">
                      {currentItem.name}
                    </h2>
                    <p className="text-xl text-gray-200 mb-6 animate-slide-up animation-delay-100">
                      {currentItem.description}
                    </p>
                    <div className="flex items-center gap-6 animate-slide-up animation-delay-200">
                      <span className="text-4xl font-black text-orange-400">
                        OMR {currentItem.price.toFixed(3)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSlideshowIndex((prev) => (prev - 1 + gutechItems.length) % gutechItems.length)}
                          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          onClick={() => setSlideshowIndex((prev) => (prev + 1) % gutechItems.length)}
                          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {gutechItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSlideshowIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === slideshowIndex
                        ? 'w-12 bg-orange-500'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-3">
        <div className="flex items-center justify-center gap-6 text-white text-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-map-marker-alt text-orange-400"></i>
            <span>Barka, Oman</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-phone text-orange-400"></i>
            <span>92809445</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fab fa-instagram text-orange-400"></i>
            <span>@flames.om</span>
          </div>
        </div>
      </div>
    </div>
  );
}
