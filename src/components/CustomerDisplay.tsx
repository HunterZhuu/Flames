import { useState, useEffect } from 'react';
import { getEffectiveMenu } from '../data/menu';
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
  const { customImages, addToCart, cart, customMenuItems, removedMenuItems } = useStore();

  // Get effective menu and filter only GUTech items
  const effectiveMenu = getEffectiveMenu(customMenuItems, removedMenuItems);
  const gutechItems = effectiveMenu.filter(item => item.category === 'gutech');

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
      <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white drop-shadow-2xl">FLAMES</h1>
              <p className="text-xs text-orange-300 drop-shadow-lg">GUTech Event Menu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle - Only show in Grid mode */}
            {currentView === 'grid' && (
              <button
                onClick={() => setCurrentView('slideshow')}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-bold transition-all"
              >
                <i className="fas fa-images mr-1"></i> Slideshow
              </button>
            )}

            {/* Slideshow Controls - Only show in Slideshow mode */}
            {currentView === 'slideshow' && (
              <>
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all backdrop-blur-md border ${
                    isAutoPlay
                      ? 'bg-green-500/80 text-white border-green-400'
                      : 'bg-black/50 text-white hover:bg-black/70 border-white/30'
                  }`}
                >
                  <i className={`fas ${isAutoPlay ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                  {isAutoPlay ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={() => setCurrentView('grid')}
                  className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 text-xs font-bold transition-all border border-white/30"
                >
                  <i className="fas fa-th mr-1"></i> Grid View
                </button>
              </>
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
      <div className={`h-full pt-20 ${cart.length > 0 ? 'pb-32' : 'pb-20'} px-4 overflow-hidden ${currentView === 'slideshow' ? 'p-0' : ''}`}>
        {currentView === 'grid' ? (
          // Grid View - Bigger pictures layout
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
              {gutechItems.map((item: any) => {
                const isSelected = selectedItem === item.id;
                const inCart = cart.find(c => c.product.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`relative group transition-all duration-300 ${
                      isSelected ? 'sm:col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.color} shadow-2xl transition-all duration-300 ${
                      isSelected ? 'scale-[1.02]' : 'hover:scale-[1.02]'
                    }`}>
                      {/* Image - Bigger */}
                      <div className={`${isSelected ? 'h-96' : 'h-64'} overflow-hidden`}>
                        {customImages[item.id] || item.image ? (
                          <img
                            src={customImages[item.id] || item.image}
                            alt={item.name}
                            className={`w-full ${isSelected ? 'h-96' : 'h-64'} object-cover transition-transform duration-500 group-hover:scale-110`}
                          />
                        ) : (
                          <div className={`w-full ${isSelected ? 'h-96' : 'h-64'} flex items-center justify-center`}>
                            <span className={`${isSelected ? 'text-9xl' : 'text-7xl'}`}>{item.emoji}</span>
                          </div>
                        )}
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 className={`${isSelected ? 'text-3xl' : 'text-xl'} font-black mb-2 line-clamp-2 drop-shadow-lg`}>
                          {item.name}
                        </h3>
                        
                        {isSelected && (
                          <div className="animate-fade-in">
                            <p className="text-sm text-gray-200 mb-3 line-clamp-3 drop-shadow">{item.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-black text-orange-400 drop-shadow-lg">
                                OMR {item.price.toFixed(3)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-bold transition-all backdrop-blur-sm"
                              >
                                <i className="fas fa-times mr-1"></i> Close
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {!isSelected && (
                          <p className="text-xl font-black text-orange-400 mb-3 drop-shadow-lg">
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
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                            inCart
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <i className="fas fa-check mr-2"></i>
                              In Cart ({inCart.quantity})
                            </>
                          ) : (
                            <>
                              <i className="fas fa-cart-plus mr-2"></i>
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>

                      {/* Cart Badge */}
                      {inCart && !isSelected && (
                        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-xl border-2 border-white">
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
          // Slideshow View - True Fullscreen
          <div className="fixed inset-0 flex items-center justify-center">
            {/* Fullscreen Image Background */}
            <div className="absolute inset-0 overflow-hidden">
              {customImages[currentItem.id] || currentItem.image ? (
                <img
                  src={customImages[currentItem.id] || currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover animate-zoom-in"
                  key={currentItem.id}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${currentItem.color} flex items-center justify-center`}>
                  <span className="text-[200px]">{currentItem.emoji}</span>
                </div>
              )}
            </div>

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 pb-32">
              <div className="max-w-4xl mx-auto w-full">
                {/* Item Info */}
                <div className="mb-6">
                  <h2 className="text-6xl font-black mb-4 text-white animate-slide-up drop-shadow-2xl">
                    {currentItem.name}
                  </h2>
                  <p className="text-xl text-gray-100 mb-6 animate-slide-up animation-delay-100 line-clamp-3 drop-shadow-lg">
                    {currentItem.description}
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between gap-6 animate-slide-up animation-delay-200">
                  <div>
                    <span className="text-5xl font-black text-orange-400 drop-shadow-2xl">
                      OMR {currentItem.price.toFixed(3)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSlideshowIndex((prev) => (prev - 1 + gutechItems.length) % gutechItems.length)}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30"
                      >
                        <i className="fas fa-chevron-left text-xl text-white"></i>
                      </button>
                      <button
                        onClick={() => setSlideshowIndex((prev) => (prev + 1) % gutechItems.length)}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30"
                      >
                        <i className="fas fa-chevron-right text-xl text-white"></i>
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
                      className="px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all shadow-2xl hover:shadow-orange-500/50 hover:scale-105 border-2 border-orange-400"
                    >
                      <i className="fas fa-cart-plus mr-3"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Indicators - Bottom Center */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {gutechItems.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSlideshowIndex(index)}                  className={`h-2 rounded-full transition-all ${
                    index === slideshowIndex
                      ? 'w-16 bg-orange-500'
                      : 'w-3 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Item Counter - Top Right */}
            <div className="absolute top-24 right-8 z-10">
              <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-sm border border-white/20">
                {slideshowIndex + 1} / {gutechItems.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Summary Footer - Hidden in Slideshow Mode */}
      {cart.length > 0 && currentView !== 'slideshow' && (
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

      {/* Footer - Hidden in Slideshow Mode */}
      {currentView !== 'slideshow' && (
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
      )}
    </div>
  );
}
