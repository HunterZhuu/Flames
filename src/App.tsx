import { useState, useEffect } from 'react';
import { Product, CartItem } from './data/products';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import PaymentModal from './components/PaymentModal';
import Header from './components/Header';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderCount, setOrderCount] = useState(0);
  const [showMobileCart, setShowMobileCart] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setCartItems([]);
    setOrderCount((prev) => prev + 1);
    setShowMobileCart(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header currentTime={currentTime} />

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
            <i className="fas fa-shopping-bag text-blue-600 text-xs"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400">Orders Today</p>
            <p className="text-sm font-bold text-gray-800">{orderCount}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-100"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
            <i className="fas fa-pound-sign text-green-600 text-xs"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400">Revenue</p>
            <p className="text-sm font-bold text-gray-800">£{(orderCount * 12.5).toFixed(2)}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-100"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
            <i className="fas fa-box text-purple-600 text-xs"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400">Items Sold</p>
            <p className="text-sm font-bold text-gray-800">{orderCount * 3}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Product Grid - Left Side */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid onAddToCart={addToCart} />
        </div>

        {/* Cart Panel - Right Side (Desktop) */}
        <div className="hidden lg:flex w-96 border-l border-gray-100 bg-white overflow-hidden">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
          />
        </div>

        {/* Mobile Cart Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowMobileCart(true)}
            className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-300 flex items-center justify-center relative"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Cart Overlay */}
        {showMobileCart && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-x-0 bottom-0 h-[85%] bg-white rounded-t-3xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Your Order</h2>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CartPanel
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onClearCart={clearCart}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          items={cartItems}
          total={total}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
