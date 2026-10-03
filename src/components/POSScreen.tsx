import { useState } from 'react';
import { useStore } from '../store/store';
import { getEffectiveMenu, categories } from '../data/menu';
import { printReceipt, queueEmailForOrder } from '../utils/syncService';
import toast from 'react-hot-toast';

export default function POSScreen() {
  const {
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
    orderType, setOrderType, tableNumber, setTableNumber,
    completeOrder, getCartSubtotal, getCartTax, getCartTotal,
    currentUser, menuOverrides, paymentMethods, customImages,
    customMenuItems, removedMenuItems,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const enabledPaymentMethods = paymentMethods.filter(pm => pm.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(enabledPaymentMethods[0]?.id || 'cash');
  const [cashAmount, setCashAmount] = useState('');
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const effectiveMenu = getEffectiveMenu(customMenuItems, removedMenuItems);
  
  // Filter menu based on user's allowed categories
  const userAllowedCategories = currentUser?.permissions.allowedCategories || [];
  const menuWithPermissions = effectiveMenu.filter(item => {
    // If allowedCategories is empty, user has access to all categories
    if (userAllowedCategories.length === 0) return true;
    return userAllowedCategories.includes(item.category);
  });
  
  const filteredItems = menuWithPermissions.filter(item => {
    const isAvailable = menuOverrides[item.id] === undefined ? item.available : !menuOverrides[item.id];
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && isAvailable;
  });

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber) {
      toast.error('Please enter a table number');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = () => {
    let cashTendered: number | undefined;
    let change: number | undefined;
    
    if (paymentMethod === 'cash') {
      const cash = parseFloat(cashAmount);
      if (isNaN(cash) || cash < total) {
        toast.error('Insufficient cash amount');
        return;
      }
      cashTendered = cash;
      change = cash - total;
    }
    const order = completeOrder(paymentMethod, cashTendered, change);
    setLastOrder(order);
    setShowPayment(false);
    setShowReceipt(true);
    setCashAmount('');
    toast.success('Order completed! 🎉');
  };

  // Use the printReceipt function from syncService

  const cashTendered = parseFloat(cashAmount) || 0;
  const change = cashTendered - total;

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Search & Order Type */}
        <div className="p-3 border-b border-gray-100 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
              />
            </div>
          </div>
          
          {/* Order Type */}
          <div className="flex gap-1.5">
            {(['takeaway', 'dine-in', 'delivery'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  orderType === type
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <i className={`fas ${type === 'takeaway' ? 'fa-bag-shopping' : type === 'dine-in' ? 'fa-utensils' : 'fa-motorcycle'} mr-1`}></i>
                {type === 'dine-in' ? 'Dine In' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Table Number for Dine-in */}
          {orderType === 'dine-in' && (
            <input
              type="text"
              placeholder="Table number..."
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
            />
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-gray-50">
          {categories
            .filter(cat => {
              // Always show "All" tab
              if (cat.id === 'all') return true;
              // If user has no restrictions, show all categories
              if (userAllowedCategories.length === 0) return true;
              // Otherwise, only show allowed categories
              return userAllowedCategories.includes(cat.id);
            })
            .map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredItems.map(item => {
              const inCart = cart.find(c => c.product.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all active:scale-95 ${
                    inCart
                      ? 'border-orange-400 bg-orange-50 shadow-md shadow-orange-100'
                      : 'border-gray-100 hover:border-orange-200 hover:shadow-md bg-white'
                  }`}
                >
                  {inCart && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                      {inCart.quantity}
                    </div>
                  )}
                  {customImages[item.id] ? (
                    <img 
                      src={customImages[item.id]} 
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover mb-2"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-lg mb-2`}>
                      {item.emoji}
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-gray-800 text-center leading-tight mb-1 line-clamp-2">
                    {item.name}
                  </span>
                  <span className="text-xs font-black text-orange-600">
                    OMR {item.price.toFixed(3)}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <i className="fas fa-search text-3xl mb-2"></i>
              <p className="text-sm">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col max-h-[45vh] lg:max-h-full">
        {/* Cart Header */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
              <i className="fas fa-receipt text-white text-xs"></i>
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-800">Current Order</h2>
              <p className="text-[10px] text-gray-400">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <i className="fas fa-trash-alt mr-1"></i>Clear
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <i className="fas fa-shopping-cart text-4xl mb-3"></i>
              <p className="text-xs font-medium text-gray-400">No items in cart</p>
              <p className="text-[10px] text-gray-300 mt-1">Tap items to add them</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  {customImages[item.product.id] ? (
                    <img 
                      src={customImages[item.product.id]} 
                      alt={item.product.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.product.color} flex items-center justify-center text-sm shrink-0`}>
                      {item.product.emoji}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400">OMR {item.product.price.toFixed(3)}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                    >
                      <i className="fas fa-minus text-[8px]"></i>
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-500"
                    >
                      <i className="fas fa-plus text-[8px]"></i>
                    </button>
                  </div>
                  <span className="text-xs font-bold text-gray-800 w-16 text-right">
                    {(item.product.price * item.quantity).toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Checkout */}
        <div className="border-t border-gray-100 p-3 space-y-2 shrink-0">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>OMR {subtotal.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>VAT (5%)</span>
              <span>OMR {tax.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-1.5 border-t border-dashed border-gray-200">
              <span>Total</span>
              <span className="text-orange-600">OMR {total.toFixed(3)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-200 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            <i className="fas fa-credit-card mr-2"></i>
            Charge OMR {total.toFixed(3)}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900">Payment</h2>
                <p className="text-xs text-gray-400">Total: <span className="font-bold text-orange-600">OMR {total.toFixed(3)}</span></p>
              </div>
              <button onClick={() => setShowPayment(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-5">
              {/* Payment Methods */}
              <div className={`grid gap-2 mb-5 ${enabledPaymentMethods.length <= 3 ? 'grid-cols-3' : enabledPaymentMethods.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {enabledPaymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <i className={`fab ${method.icon} text-lg ${paymentMethod === method.id ? 'text-orange-500' : 'text-gray-400'}`}></i>
                    <span className="text-xs font-bold text-gray-700">{method.name}</span>
                  </button>
                ))}
              </div>

              {/* Cash Input */}
              {paymentMethod === 'cash' && (
                <div className="mb-5">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Cash Tendered</label>
                  <div className="relative mb-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">OMR</span>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="0.000"
                      className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-lg font-bold"
                      step="0.100"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[0.5, 1, 2, 5, 10, 20].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setCashAmount(amt.toString())}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                  {cashTendered >= total && (
                    <div className="mt-2 p-2 rounded-lg bg-green-50 border border-green-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600 font-bold">Change Due</span>
                        <span className="font-black text-green-700">OMR {change.toFixed(3)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={paymentMethod === 'cash' && cashTendered < total}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-200 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                <i className="fas fa-check-circle mr-2"></i>
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fas fa-check text-green-500"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Order Complete!</h3>
                  <p className="text-[10px] text-gray-400">{lastOrder.id}</p>
                </div>
              </div>
              <button onClick={() => setShowReceipt(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            {/* Receipt Preview */}
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="font-mono text-xs">
                <div className="center text-center">
                  <p className="font-bold text-sm">🔥 FLAMES BURGERS & MORE</p>
                  <p className="text-[10px] text-gray-500">Barka, Oman</p>
                  <p className="text-[10px] text-gray-500">Tel: 92809445</p>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <div className="flex justify-between text-[10px]">
                  <span>Order: {lastOrder.id}</span>
                  <span>{new Date(lastOrder.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Cashier: {lastOrder.cashier}</span>
                  <span className="capitalize">{lastOrder.orderType}</span>
                </div>
                {lastOrder.tableNumber && <p className="text-[10px]">Table: {lastOrder.tableNumber}</p>}
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                {lastOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>OMR {(item.product.price * item.quantity).toFixed(3)}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <div className="flex justify-between text-[10px]"><span>Subtotal</span><span>OMR {lastOrder.subtotal.toFixed(3)}</span></div>
                <div className="flex justify-between text-[10px]"><span>VAT (5%)</span><span>OMR {lastOrder.tax.toFixed(3)}</span></div>
                <div className="flex justify-between font-bold text-xs mt-1"><span>TOTAL</span><span>OMR {lastOrder.total.toFixed(3)}</span></div>
                <div className="border-t-2 border-red-500 my-2"></div>
                <div className="bg-red-50 rounded-lg p-2 my-2">
                  <p className="text-center text-[10px] font-bold text-red-600 mb-2">PAYMENT DETAILS</p>
                  <div className="flex justify-between text-[10px]"><span>Payment Method:</span><span className="capitalize font-bold">{lastOrder.paymentMethod}</span></div>
                  {lastOrder.paymentMethod === 'cash' && lastOrder.cashTendered !== undefined && (
                    <>
                      <div className="border-t border-dashed border-red-300 my-1"></div>
                      <div className="flex justify-between text-[10px]"><span>Amount Paid:</span><span className="font-bold">OMR {lastOrder.cashTendered.toFixed(3)}</span></div>
                      <div className="flex justify-between text-[10px]"><span>Total Bill:</span><span className="font-bold">OMR {lastOrder.total.toFixed(3)}</span></div>
                      {lastOrder.change !== undefined && lastOrder.change > 0 && (
                        <>
                          <div className="border-t-2 border-green-500 my-1"></div>
                          <div className="bg-green-100 rounded p-1.5 mt-1">
                            <div className="flex justify-between text-xs font-bold text-green-700">
                              <span>💰 CHANGE TO RETURN:</span>
                              <span>OMR {lastOrder.change.toFixed(3)}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="text-center mt-2 text-[10px] text-gray-500">
                  <p>Thank you for choosing Flames! 🔥</p>
                  <a 
                    href="https://www.instagram.com/flames.om" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600 font-bold underline"
                  >
                    @flames.om
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 space-y-2">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => printReceipt(lastOrder, 'customer')}
                  className="py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                >
                  <i className="fas fa-print mr-1"></i> Customer Receipt
                </button>
                <button
                  onClick={() => printReceipt(lastOrder, 'kitchen')}
                  className="py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                >
                  <i className="fas fa-utensils mr-1"></i> Kitchen Copy
                </button>
              </div>

              {/* Email Action */}
              <button
                onClick={() => {
                  const pending = queueEmailForOrder(lastOrder);
                  toast.success(`Receipt queued for email${navigator.onLine ? '' : ' (will send when online)'}`, {
                    icon: '📧',
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-envelope mr-1"></i> Email Receipt
                {!navigator.onLine && <span className="ml-1 text-[9px] opacity-75">(Queued - Offline)</span>}
              </button>

              {/* Done */}
              <button
                onClick={() => { setShowReceipt(false); setLastOrder(null); }}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all"
              >
                <i className="fas fa-plus mr-1"></i> New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
