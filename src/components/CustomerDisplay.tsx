import { useState, useEffect } from 'react';
import { menuItems } from '../data/menu';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';

interface CustomerDisplayProps {
  onClose: () => void;
}

export default function CustomerDisplay({ onClose }: CustomerDisplayProps) {
  const [currentView, setCurrentView] = useState<'grid' | 'slideshow'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { customImages, addToCart, cart } = useStore();

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
      <div className={`h-full pt-20 ${cart.length > 0 ? 'pb-32' : 'pb-20'} px-4 overflow-hidden`}>
        {currentView === 'grid' ? (
          // Grid View - Improved responsive layout
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
              {gutechItems.map((item) => {
                const isSelected = selectedItem === item.id;
                const inCart = cart.find(c => c.product.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`relative group transition-all duration-300 ${
                      isSelected ? 'col-span-2 row-span-2' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} shadow-2xl transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'hover:scale-105'
                    }`}>
                      {/* Image */}
                      <div className={`${isSelected ? 'h-64' : 'h-32'} overflow-hidden`}>
                        {customImages[item.id] || item.image ? (
                          <img
                            src={customImages[item.id] || item.image}
                            alt={item.name}
                            className={`w-full ${isSelected ? 'h-64' : 'h-32'} object-cover transition-transform duration-500 group-hover:scale-110`}
                          />
                        ) : (
                          <div className={`w-full ${isSelected ? 'h-64' : 'h-32'} flex items-center justify-center`}>
                            <span className={`${isSelected ? 'text-7xl' : 'text-5xl'}`}>{item.emoji}</span>
                          </div>
                        )}
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className={`${isSelected ? 'text-2xl' : 'text-sm'} font-black mb-1 line-clamp-2`}>
                          {item.name}
                        </h3>
                        
                        {isSelected && (
                          <div className="animate-fade-in">
                            <p className="text-xs text-gray-200 mb-2 line-clamp-3">{item.description}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xl font-black text-orange-400">
                                OMR {item.price.toFixed(3)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(null);
                                }}
                                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition-all"
                              >
                                <i className="fas fa-times mr-1"></i> Close
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {!isSelected && (
                          <p className="text-base font-black text-orange-400 mb-2">
                            OMR {item.price.toFixed(3)}
                          </p>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                            toast.success(`${item.name} added to cart!`, {
                              icon: '🛒',
                              duration: 2000,
                            });
                          }}
                          className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${
                            inCart
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <i className="fas fa-check mr-1"></i>
                              In Cart ({inCart.quantity})
                            </>
                          ) : (
                            <>
                              <i className="fas fa-cart-plus mr-1"></i>
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>

                      {/* Cart Badge */}
                      {inCart && !isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                          {inCart.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Slideshow View - Improved layout with Add to Cart
          <div className="h-full flex items-center justify-center relative px-4">
            {/* Main Slide */}
            <div className="w-full max-w-4xl mx-auto">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentItem.color} shadow-2xl transition-all duration-500`}>
                {/* Image */}
                <div className="h-[60vh] overflow-hidden">
                  {customImages[currentItem.id] || currentItem.image ? (
                    <img
                      src={customImages[currentItem.id] || currentItem.image}
                      alt={currentItem.name}
                      className="w-full h-full object-cover animate-zoom-in"
                      key={currentItem.id}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl">{currentItem.emoji}</span>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-black mb-3 animate-slide-up">
                      {currentItem.name}
                    </h2>
                    <p className="text-base text-gray-200 mb-4 animate-slide-up animation-delay-100 line-clamp-2">
                      {currentItem.description}
                    </p>
                    
                    <div className="flex items-center justify-between gap-4 animate-slide-up animation-delay-200">
                      <span className="text-3xl font-black text-orange-400">
                        OMR {currentItem.price.toFixed(3)}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        {/* Navigation Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSlideshowIndex((prev) => (prev - 1 + gutechItems.length) % gutechItems.length)}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                          >
                            <i className="fas fa-chevron-left text-sm"></i>
                          </button>
                          <button
                            onClick={() => setSlideshowIndex((prev) => (prev + 1) % gutechItems.length)}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                          >
                            <i className="fas fa-chevron-right text-sm"></i>
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => {
                            addToCart(currentItem);
                            toast.success(`${currentItem.name} added to cart!`, {
                              icon: '🛒',
                              duration: 2000,
                            });
                          }}
                          className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl"
                        >
                          <i className="fas fa-cart-plus mr-2"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-4">
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

      {/* Cart Summary Footer */}
      {cart.length > 0 && (
        <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-md shadow-2xl p-4 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-shopping-cart text-white text-xl"></i>
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                </p>
                <p className="text-white/80 text-xs">
                  {cart.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-black text-2xl">
                OMR {cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(3)}
              </p>
              <p className="text-white/80 text-xs">Total (incl. VAT)</p>
            </div>
          </div>
        </div>
      )}

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
