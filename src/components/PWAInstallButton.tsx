import React, { useState } from 'react';
import { Download, Sparkles, X, Smartphone, CheckCircle2, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'card' | 'floating';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 4000);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all duration-150 cursor-pointer"
          title="Install LifeSync App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'card' && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4 text-white shadow-lg">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-wide">Install LifeSync Mobile</h4>
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-peach-500 bg-amber-400 text-purple-950">Free PWA</span>
                </div>
                <p className="text-xs text-purple-100 mt-0.5">
                  Add to your Android or iOS home screen. Fast, offline & zero Play Store needed!
                </p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-purple-700 font-bold text-xs shadow hover:bg-purple-50 active:scale-95 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          </div>
        </div>
      )}

      {/* Instructional Modal for Android Chrome & iOS Safari */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-800">Install LifeSync to Your Phone</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              LifeSync is a Progressive Web App (PWA). You don't need a Google Play Store account, APKs, or external downloads.
            </p>

            <div className="space-y-3 text-xs text-slate-700 bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                    <p>Tap the <strong>Share</strong> button <Share className="w-3 h-3 inline mx-0.5 text-blue-500" /> in Safari's bottom toolbar.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                    <p>Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                    <p>Tap <strong>Add</strong> in the top-right corner to launch anytime like a native app!</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                    <p>In Chrome on Android, tap the three dots <strong>(⋮)</strong> in the top-right corner.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                    <p>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                    <p>Confirm, and LifeSync will appear on your app drawer and home screen with offline capability!</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Trigger Install Now
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {installedSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>LifeSync installed successfully!</span>
        </div>
      )}
    </>
  );
};
