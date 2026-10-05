import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './store/store';
import LoginScreen from './components/LoginScreen';
import POSScreen from './components/POSScreen';
import AdminPanel from './components/AdminPanel';
import { syncPendingEmails } from './utils/syncService';
import { Toaster } from 'react-hot-toast';

type View = 'pos' | 'admin';

export default function App() {
  const { isLoggedIn, currentUser, pendingEmails, emailConfig, logout } = useStore();
  const [currentView, setCurrentView] = useState<View>('pos');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [switchingUser, setSwitchingUser] = useState(false);
  const hasSyncedRef = useRef(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pendingCount = pendingEmails.filter(e => e.status === 'pending' || e.status === 'failed').length;

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      if (emailConfig.enabled && emailConfig.autoSyncOnConnect && pendingCount > 0 && !hasSyncedRef.current) {
        hasSyncedRef.current = true;
        setSyncing(true);
        await syncPendingEmails();
        setSyncing(false);
        setTimeout(() => { hasSyncedRef.current = false; }, 60000);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      hasSyncedRef.current = false;
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [emailConfig.enabled, emailConfig.autoSyncOnConnect, pendingCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const view = event.detail as View;
      if (view === 'pos') setCurrentView('pos');
    };
    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  const handleSwitchUser = () => {
    setShowUserMenu(false);
    setSwitchingUser(true);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      setShowUserMenu(false);
    }
  };

  if (switchingUser) {
    return (
      <>
        <Toaster position="top-center" />
        <LoginScreen onBack={() => setSwitchingUser(false)} isSwitchUser={true} />
      </>
    );
  }

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
            <button onClick={() => setCurrentView('pos')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'pos' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <i className="fas fa-cash-register mr-1"></i> POS
            </button>
            {currentUser?.permissions.canViewReports && (
              <button onClick={() => setCurrentView('admin')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'admin' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <i className="fas fa-cog mr-1"></i> Admin
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${syncing ? 'bg-blue-500/20 text-blue-200' : isOnline ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {syncing ? (<i className="fas fa-sync fa-spin text-[10px]"></i>) : (<div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>)}
            <span className="hidden sm:inline">{syncing ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}</span>
            {pendingCount > 0 && (<span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500 text-yellow-900 text-[9px] font-black">{pendingCount}</span>)}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-all">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{currentUser?.name[0]}</div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-orange-200 capitalize">{currentUser?.role}</p>
              </div>
              <i className="fas fa-chevron-down text-[10px] text-white/60 hidden sm:block"></i>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">{currentUser?.name[0]}</div>
                    <div><p className="text-sm font-bold text-gray-800">{currentUser?.name}</p><p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p></div>
                  </div>
                </div>
                <div className="p-1">
                  <button onClick={handleSwitchUser} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all text-left">
                    <i className="fas fa-exchange-alt text-blue-500 w-5"></i><span>Switch User</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all text-left">
                    <i className="fas fa-sign-out-alt w-5"></i><span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="sm:hidden flex items-center gap-1">
            <button onClick={() => setCurrentView('pos')} className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === 'pos' ? 'bg-white/20' : ''}`}>
              <i className="fas fa-cash-register text-xs"></i>
            </button>
            {currentUser?.permissions.canViewReports && (
              <button onClick={() => setCurrentView('admin')} className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === 'admin' ? 'bg-white/20' : ''}`}>
                <i className="fas fa-cog text-xs"></i>
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-hidden">
        {currentView === 'pos' ? <POSScreen /> : <AdminPanel />}
      </div>
    </div>
  );
}
