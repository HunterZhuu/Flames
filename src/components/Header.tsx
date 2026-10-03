import { useState, useEffect } from 'react';

interface HeaderProps {
  currentTime: Date;
}

export default function Header({ currentTime }: HeaderProps) {
  const [cashier] = useState('Alex');

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
          <i className="fas fa-cash-register text-white text-sm"></i>
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">QuickPOS</h1>
          <p className="text-xs text-gray-400">Point of Sale</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <i className="fas fa-clock text-gray-400"></i>
          <span className="font-medium">
            {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">
            {currentTime.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-green-700">Online</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {cashier[0]}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{cashier}</span>
        </div>
      </div>
    </header>
  );
}
