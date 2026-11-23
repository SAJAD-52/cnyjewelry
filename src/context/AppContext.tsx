import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { CurrencyConfig, WishlistItem, UserProfile } from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: { symbol: '€', name: 'Euro (Eurozone)', rate: 0.92, defaultLang: 'FR' },
  GBP: { symbol: '£', name: 'British Pound (UK)', rate: 0.79, defaultLang: 'EN' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc (Switzerland)', rate: 0.88, defaultLang: 'FR' },
  SEK: { symbol: 'kr', name: 'Swedish Krona (Sweden)', rate: 10.5, defaultLang: 'SV' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone (Norway)', rate: 10.6, defaultLang: 'NO' },
  DKK: { symbol: 'kr', name: 'Danish Krone (Denmark)', rate: 6.9, defaultLang: 'DA' },
  PLN: { symbol: 'zł', name: 'Polish Złoty (Poland)', rate: 4.0, defaultLang: 'PL' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna (Czechia)', rate: 23.2, defaultLang: 'CS' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint (Hungary)', rate: 365, defaultLang: 'HU' },
  RON: { symbol: 'lei', name: 'Romanian Leu (Romania)', rate: 4.6, defaultLang: 'RO' },
  BGN: { symbol: 'лв', name: 'Bulgarian Lev (Bulgaria)', rate: 1.8, defaultLang: 'BG' },
  ISK: { symbol: 'kr', name: 'Icelandic Króna (Iceland)', rate: 138, defaultLang: 'EN' },
  TRY: { symbol: '₺', name: 'Turkish Lira (Turkey)', rate: 34.0, defaultLang: 'TR' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia (Ukraine)', rate: 41.0, defaultLang: 'UK' },
  RSD: { symbol: 'din', name: 'Serbian Dinar (Serbia)', rate: 108, defaultLang: 'EN' },
  MAD: { symbol: 'DH', name: 'Moroccan Dirham (Morocco)', rate: 10.1, defaultLang: 'FR' },
  USD: { symbol: '$', name: 'US Dollar (USA)', rate: 1.0, defaultLang: 'EN' },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar (Canada)', rate: 1.36, defaultLang: 'EN' },
  AED: { symbol: 'AED', name: 'UAE Dirham (UAE)', rate: 3.67, defaultLang: 'AR' },
  SAR: { symbol: 'SAR', name: 'Saudi Riyal (Saudi Arabia)', rate: 3.75, defaultLang: 'AR' },
  AUD: { symbol: 'A$', name: 'Australian Dollar (Australia)', rate: 1.52, defaultLang: 'EN' },
};

export const LANGUAGES: Record<string, string> = {
  EN: 'English',
  FR: 'Français',
  AR: 'العربية',
  SV: 'Svenska',
  NO: 'Norsk',
  DA: 'Dansk',
  DE: 'Deutsch',
  ES: 'Español',
  IT: 'Italiano',
  NL: 'Nederlands',
  PT: 'Português',
  PL: 'Polski',
  CS: 'Čeština',
  HU: 'Magyar',
  RO: 'Română',
  BG: 'Български',
  TR: 'Türkçe',
  UK: 'Українська',
  EL: 'Ελληνικά',
};

export const ALL_TOOL_SLUGS = [
  'sizing', 'styling', 'care', 'gift', 'layering', 
  'anniversary', 'gold', 'diamond', 'earrings', 'wishlist', 
  'vault', 'planner', 'beading'
];

export const PRO_EMAILS = [
  'ibrahimihamid77@gmail.com',
  'said.cpge24@gmail.com',
];

export const STRIPE_BASE = 'https://buy.stripe.com/5kQ00kb7pgWc8p8c6Y0ZW00';
export const STRIPE_PORTAL = 'https://billing.stripe.com/p/login/';

const SB_URL = 'https://kbcruuirhkidkbmrthbc.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY3J1dWlyaGtpZGtibXJ0aGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzU5MTksImV4cCI6MjEwODcxMTkxOX0.NVhiP74USvG4GU7_pnsNqDPaZ8oQhTl145wmnD-Fp3Y';

export const supabase: SupabaseClient = createClient(SB_URL, SB_KEY);

interface AppContextType {
  currentRoute: string;
  navigate: (path: string) => void;
  currentLocale: { currency: string; lang: string };
  setLocale: (currency: string, lang: string) => void;
  formatPrice: (usdAmount: number) => string;
  theme: 'light' | 'plum' | 'midnight';
  cycleTheme: () => void;
  setTheme: (t: 'light' | 'plum' | 'midnight') => void;
  wishlist: WishlistItem[];
  hasWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeWishlist: (id: string) => void;
  clearWishlist: () => void;
  currentUser: UserProfile | null;
  isPro: boolean;
  login: (e: string, p: string) => Promise<{ error?: string }>;
  signup: (e: string, p: string) => Promise<{ error?: string; needsConfirmation?: boolean; alreadyExists?: boolean }>;
  loginGoogle: () => void;
  logout: () => void;
  usedFeatures: string[];
  remainingTries: number;
  hasUsedFeature: (slug: string) => boolean;
  markFeatureUsed: (slug: string) => void;
  canAccessTool: (slug: string) => boolean;
  isProModalOpen: boolean;
  openProModal: (isPageLock?: boolean) => void;
  closeProModal: () => void;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  isLocaleModalOpen: boolean;
  openLocaleModal: () => void;
  closeLocaleModal: () => void;
  bannerMessage: string | null;
  setBannerMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Routing
  const getInitialRoute = () => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '') || 'index';
    return path.replace(/\.html$/, '');
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  const navigate = (path: string) => {
    let clean = path.replace(/^\/+|\/+$/g, '') || 'index';
    clean = clean.replace(/\.html$/, '');
    window.history.pushState({}, '', '/' + (clean === 'index' ? '' : clean));
    setCurrentRoute(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme
  const [theme, setThemeState] = useState<'light' | 'plum' | 'midnight'>(() => {
    const saved = localStorage.getItem('koo_theme');
    return (saved === 'plum' || saved === 'midnight') ? saved : 'light';
  });

  const setTheme = (t: 'light' | 'plum' | 'midnight') => {
    setThemeState(t);
    localStorage.setItem('koo_theme', t);
    if (t === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('plum');
    else if (theme === 'plum') setTheme('midnight');
    else setTheme('light');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Locale
  const [currentLocale, setCurrentLocaleState] = useState<{ currency: string; lang: string }>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('koo_user_locale') || '');
      if (saved && saved.currency && saved.lang) return saved;
    } catch {}
    return { currency: 'USD', lang: 'EN' };
  });

  const setLocale = (currency: string, lang: string) => {
    const updated = { currency, lang };
    setCurrentLocaleState(updated);
    localStorage.setItem('koo_user_locale', JSON.stringify(updated));
    if (lang.toLowerCase() === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
  };

  const formatPrice = (usdAmount: number): string => {
    const c = CURRENCIES[currentLocale.currency] || CURRENCIES.USD;
    const converted = usdAmount * c.rate;
    let formattedNumber: string;

    if (c.rate >= 40) {
      formattedNumber = Math.round(converted).toLocaleString();
    } else if (c.rate >= 3.5) {
      formattedNumber = Math.round(converted).toString();
    } else {
      formattedNumber = converted.toFixed(2);
    }

    const postfixCurrencies = ['MAD', 'AED', 'SAR', 'HUF', 'CZK', 'PLN', 'RON', 'BGN', 'SEK', 'NOK', 'DKK', 'ISK', 'RSD', 'TRY', 'UAH'];
    if (postfixCurrencies.includes(currentLocale.currency)) {
      return `${formattedNumber} ${c.symbol}`;
    }
    return `${c.symbol}${formattedNumber}`;
  };

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('koo_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const hasWishlist = (id: string) => wishlist.some((x) => x.id === id);

  const toggleWishlist = (item: WishlistItem) => {
    let updated: WishlistItem[];
    if (hasWishlist(item.id)) {
      updated = wishlist.filter((x) => x.id !== item.id);
    } else {
      updated = [...wishlist, item];
    }
    setWishlist(updated);
    localStorage.setItem('koo_wishlist', JSON.stringify(updated));
  };

  const removeWishlist = (id: string) => {
    const updated = wishlist.filter((x) => x.id !== id);
    setWishlist(updated);
    localStorage.setItem('koo_wishlist', JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.setItem('koo_wishlist', '[]');
  };

  // Auth & Pro
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isProManual, setIsProManual] = useState<boolean>(() => {
    return localStorage.getItem('koo_pro_active') === 'true';
  });

  const isPro = Boolean(
    isProManual ||
    (currentUser?.email && PRO_EMAILS.includes(currentUser.email.toLowerCase().trim())) ||
    (currentUser?.is_pro === true)
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const isProEmail = u.email && PRO_EMAILS.includes(u.email.toLowerCase().trim());
        const isProMeta = Boolean(u.user_metadata?.is_pro);
        setCurrentUser({
          id: u.id,
          email: u.email || 'Member',
          is_pro: isProEmail || isProMeta,
          created_at: u.created_at,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const isProEmail = u.email && PRO_EMAILS.includes(u.email.toLowerCase().trim());
        const isProMeta = Boolean(u.user_metadata?.is_pro);
        setCurrentUser({
          id: u.id,
          email: u.email || 'Member',
          is_pro: isProEmail || isProMeta,
          created_at: u.created_at,
        });
      } else {
        setCurrentUser(null);
      }
    });

    // Check payment=success in URL
    if (window.location.search.includes('payment=success')) {
      localStorage.setItem('koo_pro_active', 'true');
      setIsProManual(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, document.title, url.pathname);
      setBannerMessage('🎉 Payment confirmed! Your account is now upgraded to McGee Jewelry Pro.');
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data?.user) {
        const u = data.user;
        setCurrentUser({
          id: u.id,
          email: u.email || '',
          is_pro: (u.email && PRO_EMAILS.includes(u.email.toLowerCase().trim())) || Boolean(u.user_metadata?.is_pro),
          created_at: u.created_at,
        });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Login error' };
    }
  };

  const signup = async (
    email: string,
    password: string
  ): Promise<{ error?: string; needsConfirmation?: boolean; alreadyExists?: boolean }> => {
    try {
      const isProEmail = PRO_EMAILS.includes(email.toLowerCase().trim());
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { is_pro: isProEmail },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) return { error: error.message };
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return { alreadyExists: true };
      }
      if (!data?.session) {
        return { needsConfirmation: true };
      }
      if (data?.user) {
        const u = data.user;
        setCurrentUser({
          id: u.id,
          email: u.email || '',
          is_pro: isProEmail,
          created_at: u.created_at,
        });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Signup error' };
    }
  };

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const logout = () => {
    supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('koo_pro_active');
    setIsProManual(false);
  };

  // Free Tries Engine
  const [usedFeatures, setUsedFeatures] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('koo_used_features') || '[]');
    } catch {
      return [];
    }
  });

  const hasUsedFeature = (slug: string) => usedFeatures.includes(slug);

  const markFeatureUsed = (slug: string) => {
    if (!usedFeatures.includes(slug)) {
      const updated = [...usedFeatures, slug];
      setUsedFeatures(updated);
      localStorage.setItem('koo_used_features', JSON.stringify(updated));
    }
  };

  const remainingTries = Math.max(0, ALL_TOOL_SLUGS.length - usedFeatures.filter((s) => ALL_TOOL_SLUGS.includes(s)).length);

  const canAccessTool = (slug: string) => {
    if (isPro) return true;
    if (hasUsedFeature(slug)) return false;
    return true;
  };

  // Modals
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPageLock, setIsPageLock] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const openProModal = (lock = false) => {
    if (isPro) return;
    setIsPageLock(lock);
    setIsProModalOpen(true);
  };

  const closeProModal = () => {
    setIsProModalOpen(false);
    if (isPageLock) {
      navigate('index');
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openLocaleModal = () => setIsLocaleModalOpen(true);
  const closeLocaleModal = () => setIsLocaleModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        currentLocale,
        setLocale,
        formatPrice,
        theme,
        cycleTheme,
        setTheme,
        wishlist,
        hasWishlist,
        toggleWishlist,
        removeWishlist,
        clearWishlist,
        currentUser,
        isPro,
        login,
        signup,
        loginGoogle,
        logout,
        usedFeatures,
        remainingTries,
        hasUsedFeature,
        markFeatureUsed,
        canAccessTool,
        isProModalOpen,
        openProModal,
        closeProModal,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        isLocaleModalOpen,
        openLocaleModal,
        closeLocaleModal,
        bannerMessage,
        setBannerMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
