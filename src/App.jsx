import React, { useState, useEffect, useRef } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';
import { useAppContext } from './context/AppContext';
import BottomNavBar from './components/BottomNavBar';
import { X, Star, Share2, Car, Bike, Truck, Bus } from 'lucide-react';
import { Share } from '@capacitor/share';
import OnboardingView from './views/OnboardingView';
import HomeView from './views/HomeView';
import AddFuelView from './views/AddFuelView';
import ExpensesView from './views/ExpensesView';
import RemindersView from './views/RemindersView';
import ProfileView from './views/ProfileView';
import FuelCalculatorView from './views/FuelCalculatorView';
import NotificationsView from './views/NotificationsView';

// Import assets to preload during splash screen phase
import logoImg from './assets/logo.png';
import heroImg from './assets/hero.png';
import motorcycleImg from './assets/vehicle_motorcycle.png';
import carImg from './assets/vehicle_car.png';
import suvImg from './assets/vehicle_suv.png';
import vanImg from './assets/vehicle_van.png';
import truckImg from './assets/vehicle_truck.png';
import busImg from './assets/vehicle_bus.png';

/* ── Live status bar clock ─────────────────────────────────────────── */
function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 2000,
      pointerEvents: 'none'
    }}>
      {/* Time */}
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
        {time}
      </span>

      {/* Dynamic Island pill (center) */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: '34px',
        borderRadius: '20px',
        background: '#000',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06)'
      }} />

      {/* Right icons: signal + wifi + battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"  y="8" width="3" height="4"  rx="1" fill="currentColor" opacity="1"/>
          <rect x="4.5" y="5" width="3" height="7"  rx="1" fill="currentColor" opacity="1"/>
          <rect x="9"  y="2" width="3" height="10" rx="1" fill="currentColor" opacity="1"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="currentColor" opacity="0.3"/>
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          <path d="M8 6.5a5 5 0 00-3.54 1.46l1.42 1.42A3 3 0 018 8.5a3 3 0 012.12.88l1.42-1.42A5 5 0 008 6.5z" opacity="0.7"/>
          <path d="M8 3.5a8.5 8.5 0 00-6.01 2.49l1.42 1.42A6.5 6.5 0 018 5.5a6.5 6.5 0 014.59 1.91l1.42-1.42A8.5 8.5 0 008 3.5z" opacity="0.4"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35"/>
          <rect x="2"   y="2"   width="16" height="8" rx="2" fill="currentColor"/>
          <path d="M23 4v4a2 2 0 000-4z" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

/* ── Home indicator bar ────────────────────────────────────────────── */
function HomeIndicator() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '6px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '134px',
      height: '5px',
      borderRadius: '3px',
      background: 'var(--text-primary)',
      opacity: 0.22,
      zIndex: 2000,
      pointerEvents: 'none'
    }} />
  );
}

// Dynamic vehicle type icon resolver
const VehicleIcon = ({ type, size = 18, color }) => {
  const iconStyle = color ? { color } : {};
  switch (type) {
    case 'Motorcycle':
      return <Bike size={size} style={iconStyle} />;
    case 'Car':
      return <Car size={size} style={iconStyle} />;
    case 'Van':
      return <Car size={size} style={iconStyle} />;
    case 'SUV':
      return <Car size={size} style={iconStyle} />;
    case 'Truck':
      return <Truck size={size} style={iconStyle} />;
    case 'Bus':
      return <Bus size={size} style={iconStyle} />;
    default:
      return <Car size={size} style={iconStyle} />;
  }
};

/* ── Splash Screen Overlay ─────────────────────────────────────────── */
function AppSplashOverlay({ fadeOut }) {
  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#EBF5FF',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 65%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 55%), linear-gradient(135deg, #E0F2FE 0%, #D1FAE5 100%)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: fadeOut ? 'scale(1.06)' : 'scale(1)',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: 'none',
        willChange: 'opacity, transform'
      }}
    >
      <div 
        className="flex flex-col items-center animate-fade-in" 
        style={{ 
          gap: '20px',
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? 'scale(0.9) translateY(-12px)' : 'scale(1) translateY(0px)',
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'opacity, transform'
        }}
      >
        {/* App Icon (Branded logo image directly) */}
        <img 
          src={logoImg} 
          alt="App Logo" 
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '22px',
            boxShadow: '0 12px 36px rgba(37, 99, 235, 0.12)',
            animation: 'pulse 2s infinite ease-in-out',
            objectFit: 'contain'
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#1E3A8A',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            margin: 0
          }}>
            MILEAGE
          </h1>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#065F46',
            letterSpacing: '5px',
            textTransform: 'uppercase'
          }}>
            & EXPENSES
          </span>
        </div>
      </div>
      
      {/* Animated Spinner (Logo themed: blue/green transition) */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '3px solid rgba(37, 99, 235, 0.15)',
        borderTopColor: '#3B82F6',
        animation: 'spin 1s linear infinite',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(0.8)' : 'scale(1)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Main App
   ══════════════════════════════════════════════════════════════════════ */
function App() {
  const { 
    vehicles, 
    activeVehicle, 
    drawerOpen, 
    setDrawerOpen, 
    language, 
    setLanguage, 
    theme, 
    t 
  } = useAppContext();
  
  const isLight = theme === 'light';
  const currentVehicle = activeVehicle || {};
  
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      // DEVELOPER_TEST_MODE: Set this to true to test the update popup UI locally!
      const DEVELOPER_TEST_MODE = false;

      if (DEVELOPER_TEST_MODE) {
        setUpdateInfo({
          latestVersionCode: 4,
          latestVersionName: "1.2.1-test",
          updateUrl: "https://play.google.com/store/apps/details?id=com.mileageexpensetracker.app",
          forceUpdate: false,
          releaseNotes: "• This is a test update notification!\n• It checks your update popup UI styling.\n• Verify layout, spacing, and buttons."
        });
        setShowUpdateModal(true);
        return;
      }

      try {
        const response = await fetch('https://raw.githubusercontent.com/sl307282-ui/mileage-expenses-tracker/main/version.json');
        if (!response.ok) return;
        const config = await response.json();

        let localBuild = 3; // fallback default
        try {
          if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            const info = await CapApp.getInfo();
            localBuild = parseInt(info.build, 10) || 3;
          }
        } catch (e) {
          console.error('Capacitor App info error:', e);
        }

        if (config.latestVersionCode > localBuild) {
          const dismissedVersion = localStorage.getItem('dismissed_update_version');
          if (config.forceUpdate || dismissedVersion !== String(config.latestVersionCode)) {
            setUpdateInfo(config);
            setShowUpdateModal(true);
          }
        }
      } catch (err) {
        console.warn('Update check failed:', err);
      }
    };

    const timer = setTimeout(checkForUpdates, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [showSplash, setShowSplash] = useState(true);
  const [splashFadeOut, setSplashFadeOut] = useState(false);

  useEffect(() => {
    // Preload heavy image assets on startup in the background
    const assets = [logoImg, heroImg, motorcycleImg, carImg, suvImg, vanImg, truckImg, busImg];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Hide the native splash screen after a tiny delay so the React splash overlay is ready
    const nativeSplashTimer = setTimeout(() => {
      try {
        SplashScreen.hide();
      } catch (e) {
        console.warn('Native SplashScreen plugin error:', e);
      }
    }, 150);

    const fadeTimer = setTimeout(() => {
      setSplashFadeOut(true);
    }, 500);

    const unmountTimer = setTimeout(() => {
      setShowSplash(false);
    }, 900);

    return () => {
      clearTimeout(nativeSplashTimer);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);
  
  // Bottom tabs horizontal order
  const BOTTOM_TABS = ['home', 'expenses', 'fuel', 'reminders', 'profile'];

  // Custom Stack Navigation state
  const [history, setHistory] = useState(['home']);
  const [animatingHistory, setAnimatingHistory] = useState(['home']);
  const [transition, setTransition] = useState({
    active: false,
    direction: null, // 'forward' | 'backward' | 'tab-forward' | 'tab-backward'
    progress: 0,     // 0 to 1
    interactive: false
  });

  const activeTab = history[history.length - 1] || 'home';

  // Navigation helpers
  const navigateTo = (tab) => {
    if (transition.active) return;
    const currentTab = history[history.length - 1];
    if (tab === currentTab) return;

    const isCurrentTabInBottom = BOTTOM_TABS.includes(currentTab);
    const isTargetTabInBottom = BOTTOM_TABS.includes(tab);

    if (isCurrentTabInBottom && isTargetTabInBottom) {
      // Bottom navigation tab transition: horizontal Android-style slide
      const currentIdx = BOTTOM_TABS.indexOf(currentTab);
      const targetIdx = BOTTOM_TABS.indexOf(tab);
      const dir = targetIdx > currentIdx ? 'tab-forward' : 'tab-backward';

      const newHistory = tab === 'home' ? ['home'] : ['home', tab];

      setHistory(newHistory);
      setAnimatingHistory([currentTab, tab]);
      setTransition({ active: true, direction: dir, progress: 0, interactive: false });

      setTimeout(() => {
        setTransition(prev => ({ ...prev, progress: 1 }));
      }, 30);

      setTimeout(() => {
        setAnimatingHistory(newHistory);
        setTransition({ active: false, direction: null, progress: 0, interactive: false });
      }, 350);
    } else {
      // Stack transition for deep sub-pages
      let newHistory;
      if (tab === 'home') {
        newHistory = ['home'];
      } else if (history.includes(tab)) {
        const idx = history.indexOf(tab);
        newHistory = history.slice(0, idx + 1);
      } else {
        newHistory = [...history, tab];
      }

      const isForward = newHistory.length > history.length;

      if (isForward) {
        setHistory(newHistory);
        setAnimatingHistory(newHistory);
        setTransition({ active: true, direction: 'forward', progress: 0, interactive: false });
        
        setTimeout(() => {
          setTransition(prev => ({ ...prev, progress: 1 }));
        }, 30);

        setTimeout(() => {
          setTransition({ active: false, direction: null, progress: 0, interactive: false });
        }, 350);
      } else {
        setHistory(newHistory);
        setAnimatingHistory(history); 
        setTransition({ active: true, direction: 'backward', progress: 0, interactive: false });

        setTimeout(() => {
          setTransition(prev => ({ ...prev, progress: 1 }));
        }, 30);

        setTimeout(() => {
          setAnimatingHistory(newHistory);
          setTransition({ active: false, direction: null, progress: 0, interactive: false });
        }, 350);
      }
    }
  };

  const goBack = () => {
    if (transition.active) return true;
    if (history.length > 1) {
      const currentTab = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      const prevTab = newHistory[newHistory.length - 1];

      const isCurrentTabInBottom = BOTTOM_TABS.includes(currentTab);
      const isPrevTabInBottom = BOTTOM_TABS.includes(prevTab);

      let dir = 'backward';
      if (isCurrentTabInBottom && isPrevTabInBottom) {
        const currentIdx = BOTTOM_TABS.indexOf(currentTab);
        const prevIdx = BOTTOM_TABS.indexOf(prevTab);
        dir = prevIdx > currentIdx ? 'tab-forward' : 'tab-backward';
      }

      setHistory(newHistory);
      setAnimatingHistory(history); 
      setTransition({ active: true, direction: dir, progress: 0, interactive: false });

      setTimeout(() => {
        setTransition(prev => ({ ...prev, progress: 1 }));
      }, 30);

      setTimeout(() => {
        setAnimatingHistory(newHistory);
        setTransition({ active: false, direction: null, progress: 0, interactive: false });
      }, 350);
      return true;
    }
    return false;
  };

  // Keep a ref of goBack to always access latest state in event listener
  const goBackRef = useRef(goBack);
  useEffect(() => {
    goBackRef.current = goBack;
  });

  // Setup Capacitor Android native back button listener
  useEffect(() => {
    let backListener;
    const setupBackListener = async () => {
      try {
        backListener = await CapApp.addListener('backButton', () => {
          const handled = goBackRef.current();
          if (!handled) {
            CapApp.exitApp();
          }
        });
      } catch (err) {
        console.warn('Native backButton event listener skipped:', err);
      }
    };

    setupBackListener();

    return () => {
      if (backListener) {
        backListener.remove();
      }
    };
  }, []);

  // Web Edge Swipe Gesture (Fallback & Web Preview)
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const isSwiping = useRef(false);

  const handleTouchStart = (e) => {
    if (history.length <= 1 || transition.active) return;
    const touch = e.touches[0];
    
    // Only trigger swipe back if starting close to left edge (within 40px)
    if (touch.clientX < 40) {
      touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      isSwiping.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    if (deltaX < 0 || Math.abs(deltaY) > deltaX) {
      if (deltaX < 5) {
        isSwiping.current = false;
      }
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    const progress = Math.min(1, deltaX / window.innerWidth);
    
    const currentTab = history[history.length - 1];
    const prevTab = history[history.length - 2];
    const isCurrentTabInBottom = BOTTOM_TABS.includes(currentTab);
    const isPrevTabInBottom = BOTTOM_TABS.includes(prevTab);
    let dir = 'backward';
    if (isCurrentTabInBottom && isPrevTabInBottom) {
      const currentIdx = BOTTOM_TABS.indexOf(currentTab);
      const prevIdx = BOTTOM_TABS.indexOf(prevTab);
      dir = prevIdx > currentIdx ? 'tab-forward' : 'tab-backward';
    }

    setTransition({
      active: true,
      direction: dir,
      progress,
      interactive: true
    });
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    // If no drag gesture actually occurred, do not set transition to active
    if (!transition.interactive) return;

    const dragDistance = transition.progress * window.innerWidth;
    const duration = Date.now() - touchStart.current.time;
    const velocity = dragDistance / duration; // px/ms

    // Thresholds: (40% screen width OR fast velocity (> 0.4 px/ms)) AND dragDistance > 30px
    const shouldGoBack = (transition.progress > 0.4 || velocity > 0.4) && dragDistance > 30;

    const currentTab = history[history.length - 1];
    const prevTab = history[history.length - 2];
    const isCurrentTabInBottom = BOTTOM_TABS.includes(currentTab);
    const isPrevTabInBottom = BOTTOM_TABS.includes(prevTab);
    let dir = 'backward';
    if (isCurrentTabInBottom && isPrevTabInBottom) {
      const currentIdx = BOTTOM_TABS.indexOf(currentTab);
      const prevIdx = BOTTOM_TABS.indexOf(prevTab);
      dir = prevIdx > currentIdx ? 'tab-forward' : 'tab-backward';
    }

    if (shouldGoBack) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setTransition({
        active: true,
        direction: dir,
        progress: 1,
        interactive: false
      });

      setTimeout(() => {
        setAnimatingHistory(newHistory);
        setTransition({ active: false, direction: null, progress: 0, interactive: false });
      }, 300);
    } else {
      setTransition({
        active: true,
        direction: dir,
        progress: 0,
        interactive: false
      });

      setTimeout(() => {
        setTransition({ active: false, direction: null, progress: 0, interactive: false });
      }, 300);
    }
  };

  const isNative = typeof window !== 'undefined' && (
    !!window.Capacitor || 
    window.location.protocol === 'file:' || 
    /android|iphone|ipad|ipod/i.test(window.navigator.userAgent)
  );

  if (vehicles.length === 0) {
    return (
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: isNative 
            ? 'calc(env(safe-area-inset-top, 0px) + 8px)'
            : 'max(60px, calc(env(safe-area-inset-top, 0px) + 12px))',
          boxSizing: 'border-box'
        }}
      >
        {!isNative && <StatusBar />}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <OnboardingView />
        </div>
        {!isNative && <HomeIndicator />}
        {showSplash && <AppSplashOverlay fadeOut={splashFadeOut} />}
      </div>
    );
  }

  const renderView = (tab) => {
    switch (tab) {
      case 'home':          return <HomeView onNavigate={navigateTo} />;
      case 'fuel':          return <AddFuelView onSuccess={() => navigateTo('home')} />;
      case 'expenses':      return <ExpensesView onNavigate={navigateTo} />;
      case 'reminders':     return <RemindersView onNavigate={navigateTo} />;
      case 'profile':       return <FuelCalculatorView onNavigate={navigateTo} />;
      case 'settings':      return <ProfileView onNavigate={navigateTo} />;
      case 'notifications': return <NotificationsView onNavigate={navigateTo} />;
      default:              return <HomeView onNavigate={navigateTo} />;
    }
  };

  const getScreenStylesAndClass = (tabName, index, animHist) => {
    const len = animHist.length;
    const isForeground = (index === len - 1);
    const isBackground = (index === len - 2);

    const baseStyle = {
      paddingTop: ['home', 'expenses', 'reminders', 'profile', 'fuel'].includes(tabName)
        ? 0
        : (isNative 
            ? 'calc(env(safe-area-inset-top, 0px) + 8px)'
            : 'max(60px, calc(env(safe-area-inset-top, 0px) + 12px))'),
      boxSizing: 'border-box'
    };

    if (!transition.active) {
      if (isForeground) {
        return {
          style: { ...baseStyle, zIndex: 2 },
          className: 'screen-scroll-container'
        };
      }
      return {
        style: { display: 'none' },
        className: 'screen-scroll-container'
      };
    }

    if (!isForeground && !isBackground) {
      return {
        style: { display: 'none' },
        className: 'screen-scroll-container'
      };
    }

    let style = { ...baseStyle };
    let className = 'screen-scroll-container';

    // Flat transition without overlapping shadow for sibling tab changes
    const isTabTransition = transition.direction === 'tab-forward' || transition.direction === 'tab-backward';
    if (isForeground && !isTabTransition) {
      className += ' screen-shadow';
    }

    if (!transition.interactive) {
      className += ' screen-transition';
    }

    const progress = transition.progress;

    if (transition.direction === 'forward') {
      if (isForeground) {
        style = {
          ...style,
          zIndex: 2,
          transform: `translate3d(${(1 - progress) * 100}%, 0, 0)`
        };
      } else if (isBackground) {
        style = {
          ...style,
          zIndex: 1,
          transform: `translate3d(${-30 + (progress * 30)}%, 0, 0)`
        };
      }
    } else if (transition.direction === 'backward') {
      if (isForeground) {
        style = {
          ...style,
          zIndex: 2,
          transform: `translate3d(${progress * 100}%, 0, 0)`
        };
      } else if (isBackground) {
        style = {
          ...style,
          zIndex: 1,
          transform: `translate3d(${-30 + (1 - progress) * 30}%, 0, 0)`
        };
      }
    } else if (transition.direction === 'tab-forward') {
      // Navigating right: old page slides left, new page slides in from right
      if (isForeground) {
        style = {
          ...style,
          zIndex: 2,
          transform: `translate3d(${(1 - progress) * 100}%, 0, 0)`
        };
      } else if (isBackground) {
        style = {
          ...style,
          zIndex: 1,
          transform: `translate3d(${-progress * 30}%, 0, 0)`
        };
      }
    } else if (transition.direction === 'tab-backward') {
      // Navigating left: old page slides right, new page slides in from left
      if (isForeground) {
        style = {
          ...style,
          zIndex: 2,
          transform: `translate3d(${(progress - 1) * 100}%, 0, 0)`
        };
      } else if (isBackground) {
        style = {
          ...style,
          zIndex: 1,
          transform: `translate3d(${progress * 30}%, 0, 0)`
        };
      }
    }

    return { style, className };
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Live status bar */}
      {!isNative && <StatusBar />}

      <div 
        className="screens-wrapper" 
        style={{ flex: 1 }}
      >
        {animatingHistory.map((tab, i) => {
          const { style, className } = getScreenStylesAndClass(tab, i, animatingHistory);
          const isBackground = (i === animatingHistory.length - 2);
          
          return (
            <div key={tab} className={className} style={style}>
              {renderView(tab)}
              {isBackground && ['forward', 'backward'].includes(transition.direction) && (
                <div 
                  className={!transition.interactive ? "screen-dimmer screen-transition" : "screen-dimmer"}
                  style={{ 
                    opacity: transition.direction === 'forward' ? transition.progress * 0.35 : (1 - transition.progress) * 0.35
                  }} 
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom navigation */}
      {['home', 'fuel', 'expenses', 'reminders', 'profile', 'settings', 'notifications'].includes(activeTab) && (
        <BottomNavBar activeTab={activeTab} setActiveTab={navigateTo} />
      )}

      {/* iOS-style home indicator */}
      {!isNative && <HomeIndicator />}

      {showSplash && <AppSplashOverlay fadeOut={splashFadeOut} />}

      {/* ── Premium Slide-Out Navigation Drawer ─────────────────────── */}
      <div 
        className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} 
        onClick={() => setDrawerOpen(false)} 
      />
      
      <div className={`drawer-panel ${drawerOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={logoImg} 
              alt="App Logo" 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <div>
              <span className="drawer-title" style={{ display: 'block', lineHeight: 1.1 }}>Mileage & Expenses</span>
              <div className="drawer-subtitle" style={{ lineHeight: 1 }}>Tracker</div>
            </div>
          </div>
          <button 
            className="drawer-close-btn animate-scale" 
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Vehicle Summary Badge */}
        {currentVehicle.name && (
          <div className="drawer-vehicle-badge">
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}>
              <VehicleIcon type={currentVehicle.type} size={22} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentVehicle.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {currentVehicle.plateNumber || 'No Plate'}
              </span>
            </div>
          </div>
        )}

        {/* Drawer Menu List */}
        <div className="drawer-menu-list">
          {/* Language Selector Row */}
          <div className="drawer-menu-item" style={{ cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pointerEvents: 'auto' }}>
            <div className="flex items-center gap-3">
              <div className="drawer-menu-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '16px' }}>🌐</span>
              </div>
              <span>Language</span>
            </div>
            <div style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <option value="en" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>English</option>
                <option value="hi" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>हिंदी (Hindi)</option>
                <option value="rj" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>राजस्थानी (Rajasthani)</option>
                <option value="gu" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>ગુજરાતી (Gujarati)</option>
                <option value="es" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>Español (Spanish)</option>
                <option value="ar" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>العربية (Arabic)</option>
                <option value="fr" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>Français (French)</option>
                <option value="pt" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>Português (Portuguese)</option>
                <option value="id" style={{ background: isLight ? '#fff' : '#1e1e2f', color: 'var(--text-primary)' }}>Bahasa Indonesia</option>
              </select>
            </div>
          </div>

          {/* Review App */}
          <button 
            className="drawer-menu-item"
            onClick={() => {
              setDrawerOpen(false);
              window.open("https://play.google.com/store/apps/details?id=com.mileageexpensetracker.app", "_system");
            }}
          >
            <div className="drawer-menu-item-icon">
              <Star size={18} color="#F59E0B" />
            </div>
            <span>Review App</span>
          </button>

          {/* Share App */}
          <button 
            className="drawer-menu-item"
            onClick={async () => {
              setDrawerOpen(false);
              try {
                await Share.share({
                  title: 'Mileage & Expenses Tracker',
                  text: 'Track your fuel mileage, expenses, and service reminders with this premium app!',
                  url: 'https://play.google.com/store/apps/details?id=com.mileageexpensetracker.app',
                  dialogTitle: 'Share Mileage & Expenses Tracker'
                });
              } catch (err) {
                console.log(err);
                try {
                  await navigator.clipboard.writeText('https://play.google.com/store/apps/details?id=com.mileageexpensetracker.app');
                  alert("App link copied to clipboard! Share it with your friends! 🚀");
                } catch (clipErr) {
                  console.log(clipErr);
                }
              }
            }}
          >
            <div className="drawer-menu-item-icon">
              <Share2 size={18} color="#0284C7" />
            </div>
            <span>Share App</span>
          </button>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div>Mileage & Expenses Tracker</div>
          <div style={{ marginTop: '4px', opacity: 0.7 }}>v1.2.8</div>
        </div>
      </div>

      {/* ── Premium In-App Update Modal ────────────────────────────── */}
      {showUpdateModal && updateInfo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: isLight ? '#FFFFFF' : '#1e1e2f',
            borderRadius: '24px',
            padding: '28px',
            width: '100%',
            maxWidth: '340px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            animation: 'cardEnter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#FFFFFF',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)'
              }}>
                <Star size={28} color="#fff" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                New Update Available!
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
                v{updateInfo.latestVersionName}
              </p>
            </div>

            {/* Release Notes */}
            {updateInfo.releaseNotes && (
              <div style={{
                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '16px',
                border: isLight ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.05)'
              }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  What's New:
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}>
                  {updateInfo.releaseNotes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              {!updateInfo.forceUpdate && (
                <button
                  className="btn btn-outline flex-1"
                  onClick={() => {
                    localStorage.setItem('dismissed_update_version', String(updateInfo.latestVersionCode));
                    setShowUpdateModal(false);
                  }}
                  style={{ height: '44px', borderRadius: '12px' }}
                >
                  Later
                </button>
              )}
              <button
                className="btn flex-1"
                onClick={() => {
                  window.open(updateInfo.updateUrl || "https://play.google.com/store/apps/details?id=com.mileageexpensetracker.app", "_system");
                  if (!updateInfo.forceUpdate) {
                    setShowUpdateModal(false);
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  height: '44px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                Update Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
