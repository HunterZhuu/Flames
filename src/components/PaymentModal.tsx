import { useState } from 'react';
import { CartItem } from '../data/products';

interface PaymentModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onComplete: () => void;
}

export default function PaymentModal({ items, total, onClose, onComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'contactless'>('card');
  const [cashAmount, setCashAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const cashTendered = parseFloat(cashAmount) || 0;
  const change = cashTendered - total;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.2;

  const quickCashAmounts = [
    Math.ceil(total),
    Math.ceil(total / 5) * 5,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total).slice(0, 4);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 1500);
  };

  const handleDone = () => {
    onComplete();
  };

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-4xl text-green-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Transaction completed</p>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-800">£{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-700 capitalize">{paymentMethod}</span>
            </div>
            {paymentMethod === 'cash' && change > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Change</span>
                <span className="font-bold text-green-600">£{change.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 mt-2 border-t border-gray-200">
              <span className="text-gray-400">Ref #</span>
              <span className="font-mono text-xs text-gray-500">
                TXN-{Date.now().toString(36).toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={handleDone}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment</h2>
            <p className="text-sm text-gray-400 mt-0.5">Select payment method</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>VAT (20%)</span>
            <span>£{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span className="text-blue-600">£{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <i className="fas fa-credit-card"></i>
              </div>
              <span className="text-xs font-medium text-gray-700">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('contactless')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'contactless'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === 'contactless' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <i className="fas fa-wifi"></i>
              </div>
              <span className="text-xs font-medium text-gray-700">Contactless</span>
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === 'cash' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <span className="text-xs font-medium text-gray-700">Cash</span>
            </button>
          </div>

          {/* Cash Input */}
          {paymentMethod === 'cash' && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Cash Tendered</label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">£</span>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg font-bold"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                {quickCashAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCashAmount(amount.toString())}
                    className="flex-1 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    £{amount.toFixed(2)}
                  </button>
                ))}
              </div>
              {cashTendered >= total && (
                <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">Change Due</span>
                    <span className="font-bold text-green-700">£{change.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={processing || (paymentMethod === 'cash' && cashTendered < total)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <i className="fas fa-lock text-sm"></i>
                <span>Pay £{total.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
