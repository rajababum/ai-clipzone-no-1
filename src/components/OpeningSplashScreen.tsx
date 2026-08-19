import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LOGO_DATA_URL, REMOTE_LOGO_URL } from '../logo';
import { Sparkles } from 'lucide-react';

export function checkIsInstalledApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // 1. Check if running in standalone display mode (PWA installed app)
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isMinimalUI = window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches;
    const isFullscreen = window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches;
    
    // 2. Check iOS Safari standalone mode
    const isIOSStandalone = !!(window.navigator as any).standalone;
    
    // 3. Check Android Trusted Web Activity / WebView referrer
    const isAndroidApp = typeof document !== 'undefined' && document.referrer && document.referrer.includes('android-app://');
    
    // 4. Check URL parameter indicators (e.g. ?source=pwa or ?mode=app or ?app=true)
    const urlParams = new URLSearchParams(window.location.search);
    const isAppParam = urlParams.get('source') === 'pwa' || 
                       urlParams.get('mode') === 'app' || 
                       urlParams.get('utm_source') === 'homescreen' ||
                       urlParams.get('app') === 'true';

    return isStandalone || isMinimalUI || isFullscreen || isIOSStandalone || isAndroidApp || isAppParam;
  } catch (e) {
    return false;
  }
}

interface OpeningSplashScreenProps {
  logoUrl?: string;
  siteTitle?: string;
  siteTagline?: string;
  onFinish: () => void;
}

export const OpeningSplashScreen: React.FC<OpeningSplashScreenProps> = ({
  logoUrl,
  siteTitle = 'TOP AI COURSE NEPAL 🇳🇵',
  siteTagline = "Nepal's #1 AI Video Editing & Learning Platform",
  onFinish,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(15);

  const activeLogo = logoUrl && logoUrl.trim() ? logoUrl.trim() : LOGO_DATA_URL;

  useEffect(() => {
    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 180);

    // Auto-close splash after 1.8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 450); // allow exit animation to complete
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onFinish, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: 'easeInOut' } }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[99999] bg-[#050507] text-white flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer px-4"
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Ambient Glowing Background Lights */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] bg-purple-600/20 rounded-full blur-[140px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] bg-amber-500/15 rounded-full blur-[110px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          </div>

          {/* Central Logo Container */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full px-6">
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Logo Back Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-amber-500/30 to-purple-600/30 rounded-3xl blur-xl animate-pulse" />
              
              {/* Official AI Clipzone Logo */}
              <div className="relative p-2 rounded-2xl bg-black/80 border border-zinc-800/80 shadow-2xl backdrop-blur-md">
                <img
                  src={activeLogo}
                  alt="AI Clipzone Nepal Logo"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== LOGO_DATA_URL) {
                      target.src = LOGO_DATA_URL;
                    }
                  }}
                  className="w-48 sm:w-64 md:w-72 h-auto max-h-36 sm:max-h-44 object-contain filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                />
              </div>
            </motion.div>

            {/* Institute Title & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-1.5"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-amber-300 bg-clip-text text-transparent flex items-center justify-center gap-2 drop-shadow-md">
                <span>{siteTitle}</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
                {siteTagline}
              </p>
            </motion.div>

            {/* Sleek Animated Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="w-full max-w-xs mt-8 space-y-2"
            >
              <div className="h-1.5 w-full bg-zinc-900/90 rounded-full overflow-hidden border border-zinc-800 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-purple-400 rounded-full"
                  initial={{ width: '15%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.3 }}
                />
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-widest px-1">
                <span className="flex items-center gap-1 text-amber-400/90">
                  <Sparkles className="w-3 h-3 animate-spin" /> Loading Masterclasses
                </span>
                <span>{Math.min(100, progress)}%</span>
              </div>
            </motion.div>

            {/* Quick Skip Hint */}
            <p className="text-[10px] text-zinc-600 mt-6 tracking-widest uppercase">
              Tap anywhere to enter
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
