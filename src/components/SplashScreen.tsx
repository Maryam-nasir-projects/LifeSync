import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Compass } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 p-8 text-white transition-opacity duration-500 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full flex justify-end">
        <span className="text-[11px] text-white/70 font-medium tracking-wide uppercase px-2 py-1 rounded-full bg-white/10">
          Tap anywhere to skip
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Animated App Icon Glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-peach-400 bg-amber-300 blur-2xl opacity-40 animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md p-2 shadow-2xl border border-white/20 flex items-center justify-center transform hover:scale-105 transition-transform">
            <img
              src="/pwa-192x192.png"
              alt="LifeSync Logo"
              className="w-24 h-24 rounded-2xl shadow-md"
              onError={(e) => {
                // Fallback SVG if image not loaded yet
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Life</span>
          <span className="text-amber-300">Sync</span>
        </h1>
        <p className="text-xs uppercase font-semibold tracking-widest text-purple-200 mt-1">
          Student Well-being & Focus
        </p>

        <div className="mt-8 max-w-xs text-sm text-purple-100 font-normal leading-relaxed italic bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
          "Balance is not something you find, it's something you create."
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-purple-200 font-medium">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Synchronizing your study & wellness day...</span>
        </div>
        <div className="w-36 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-300 to-purple-300 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
