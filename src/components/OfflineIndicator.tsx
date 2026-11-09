import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto flex items-center justify-between gap-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md px-4 py-2.5 text-xs text-slate-100 shadow-2xl border border-slate-700/60 animate-fadeIn">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <div className="flex items-center gap-1.5 font-medium">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Offline Mode Active</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Local data saved</span>
      </div>
    </div>
  );
};
