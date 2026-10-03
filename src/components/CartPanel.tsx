import { CartItem } from '../data/products';

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartPanelProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <i className="fas fa-receipt text-white text-sm"></i>
            </div>
            <h2 className="font-bold text-gray-800">Current Order</h2>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        {totalItems > 0 && (
          <p className="text-xs text-gray-400 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <i className="fas fa-shopping-cart text-5xl mb-4"></i>
            <p className="text-sm font-medium text-gray-400">No items yet</p>
            <p className="text-xs text-gray-300 mt-1">Tap products to add them</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.product.color} flex items-center justify-center text-lg shrink-0`}>
                  {item.product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-400">£{item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-minus text-xs"></i>
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-200 hover:text-green-500 transition-colors"
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-gray-800">£{(item.product.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-xs text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals & Checkout */}
      <div className="border-t border-gray-100 p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>VAT (20%)</span>
            <span>£{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
            <span>Total</span>
            <span className="text-blue-600">£{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <i className="fas fa-credit-card"></i>
          <span>Charge £{total.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}
