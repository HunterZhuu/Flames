import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';

interface LoginScreenProps {
  onBack?: () => void;
  isSwitchUser?: boolean;
}

export default function LoginScreen({ onBack, isSwitchUser = false }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const login = useStore(s => s.login);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    if (pin.length < 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }
    const success = login(pin);
    if (success) {
      toast.success(isSwitchUser ? 'User switched! 🔥' : 'Welcome back! 🔥');
      if (isSwitchUser && onBack) {
        onBack();
      }
    } else {
      toast.error('Invalid PIN. Try again.');
      setPin('');
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for number keys
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        setPin(prev => prev.length < 6 ? prev + e.key : prev);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (pin.length >= 4) {
          handleLogin();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPin('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus the container
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, login, isSwitchUser, onBack]);

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setPin(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setPin('');
    } else if (pin.length < 6) {
      setPin(prev => prev + key);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Back Button (only when switching users) */}
      {isSwitchUser && onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      )}

      <div ref={containerRef} tabIndex={-1} className="relative w-full max-w-sm outline-none">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-2xl shadow-red-500/30 mb-4">
            <span className="text-4xl">🔥</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">FLAMES</h1>
          <p className="text-orange-300 font-medium text-sm">Burgers & More</p>
          <p className="text-gray-500 text-xs mt-2">
            {isSwitchUser ? 'Switch to another user' : 'Enter your PIN to continue'}
          </p>
        </div>

        {/* PIN Display */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex justify-center gap-3 mb-3">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  pin[i]
                    ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                    : pin.length === i
                    ? 'border-orange-400/50 bg-white/5 text-white/30'
                    : 'border-white/20 bg-white/5 text-white/30'
                }`}
              >
                {pin[i] ? (showPin ? pin[i] : '•') : (pin.length === i ? <span className="animate-pulse">|</span> : '')}
              </div>
            ))}
          </div>
          
          <p className="text-center text-[10px] text-gray-500 mb-4">
            <i className="fas fa-keyboard mr-1"></i> Type on keyboard or use number pad
          </p>

          {/* Toggle PIN visibility */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowPin(!showPin)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              <i className={`fas ${showPin ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
              {showPin ? 'Hide' : 'Show'} PIN
            </button>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="h-14 rounded-xl bg-white/10 text-white text-xl font-bold hover:bg-white/20 active:scale-95 transition-all border border-white/5"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleKeyPress('clear')}
              className="h-14 rounded-xl bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 active:scale-95 transition-all border border-white/5"
            >
              CLR
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              className="h-14 rounded-xl bg-white/10 text-white text-xl font-bold hover:bg-white/20 active:scale-95 transition-all border border-white/5"
            >
              0
            </button>
            <button
              onClick={() => handleKeyPress('del')}
              className="h-14 rounded-xl bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 active:scale-95 transition-all border border-white/5"
            >
              <i className="fas fa-delete-left"></i>
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={pin.length < 4}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Sign In
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Default Admin PIN: <span className="text-gray-400 font-mono">1234</span>
        </p>
      </div>
    </div>
  );
}
