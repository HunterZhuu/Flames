import { useState, useEffect } from 'react';
import { useStore } from './store/store';
import LoginScreen from './components/LoginScreen';
import POSScreen from './components/POSScreen';
import AdminPanel from './components/AdminPanel';
import { Toaster } from 'react-hot-toast';

type View = 'pos' | 'admin';

export default function App() {
  const { isLoggedIn, currentUser } = useStore();
  const [currentView, setCurrentView] = useState<View>('pos');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-center" />
        <LoginScreen />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white px-4 py-2 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h1 className="font-black text-lg leading-tight tracking-tight">FLAMES</h1>
              <p className="text-[10px] text-orange-200 font-medium -mt-0.5">BURGERS & MORE</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-1 ml-4">
            <button
              onClick={() => setCurrentView('pos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'pos'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <i className="fas fa-cash-register mr-1"></i> POS
            </button>
            {currentUser?.permissions.canViewReports && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'admin'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <i className="fas fa-cog mr-1"></i> Admin
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
            isOnline ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {currentUser?.name[0]}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-orange-200 capitalize">{currentUser?.role}</p>
            </div>
          </div>

          {/* Mobile nav toggle */}
          <div className="sm:hidden flex items-center gap-1">
            <button
              onClick={() => setCurrentView('pos')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentView === 'pos' ? 'bg-white/20' : ''
              }`}
            >
              <i className="fas fa-cash-register text-xs"></i>
            </button>
            {currentUser?.permissions.canViewReports && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentView === 'admin' ? 'bg-white/20' : ''
                }`}
              >
                <i className="fas fa-cog text-xs"></i>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'pos' ? <POSScreen /> : <AdminPanel />}
      </div>
    </div>
  );
}
