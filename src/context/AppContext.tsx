import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CurrencyConfig, WishlistItem, UserProfile } from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', name: 'US Dollar (USA)', rate: 1.0, defaultLang: 'EN' },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar (Canada)', rate: 1.38, defaultLang: 'EN' },
  GBP: { symbol: '£', name: 'British Pound (UK)', rate: 0.79, defaultLang: 'EN' },
  AUD: { symbol: 'A$', name: 'Australian Dollar (Australia)', rate: 1.53, defaultLang: 'EN' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar (NZ)', rate: 1.66, defaultLang: 'EN' },
  EUR: { symbol: '€', name: 'Euro (Eurozone)', rate: 0.92, defaultLang: 'EN' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc (Switzerland)', rate: 0.88, defaultLang: 'DE' },
  SEK: { symbol: 'kr', name: 'Swedish Krona (Sweden)', rate: 10.6, defaultLang: 'SV' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone (Norway)', rate: 10.7, defaultLang: 'NO' },
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
  AED: { symbol: 'AED', name: 'UAE Dirham (UAE)', rate: 3.67, defaultLang: 'AR' },
  SAR: { symbol: 'SAR', name: 'Saudi Riyal (Saudi Arabia)', rate: 3.75, defaultLang: 'AR' },
};

export const LANGUAGES: Record<string, string> = {
  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  DE: 'Deutsch',
  IT: 'Italiano',
  NL: 'Nederlands',
  PT: 'Português',
  SV: 'Svenska',
  NO: 'Norsk',
  DA: 'Dansk',
  AR: 'العربية',
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
  'ritual', 'sizing', 'styling', 'care', 'gift', 'layering',
  'anniversary', 'gold', 'diamond', 'earrings', 'wishlist',
  'vault', 'planner', 'beading'
];

export const ADMIN_OWNER_EMAIL = 'said.cpge24@gmail.com';
export const STRIPE_BASE = 'https://buy.stripe.com/5kQ00kb7pgWc8p8c6Y0ZW00';
export const STRIPE_PORTAL = 'https://billing.stripe.com/p/login/';

const SB_URL = 'https://kbcruuirhkidkbmrthbc.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY3J1dWlyaGtpZGtibXJ0aGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzU5MTksImV4cCI6MjEwODcxMTkxOX0.NVhiP74USvG4GU7_pnsNqDPaZ8oQhTl145wmnD-Fp3Y';

export const supabase: SupabaseClient = createClient(SB_URL, SB_KEY);

const MCGEE_I18N: Record<string, Record<string, string>> = {
  EN: {
    'nav.ritual': 'Daily Ritual', 'nav.vault': 'Jewelry Box', 'nav.planner': 'Look Planner', 'nav.sizing': 'Size guide',
    'nav.styling': 'Metal match', 'nav.gift': 'Gift finder', 'nav.more': 'More', 'nav.login': 'Log in', 'nav.menu': 'Menu',
    'hero.eyebrow': 'Daily Jewelry Ritual · Live Gold Vault · 14 Studios',
    'hero.title': 'Your daily jewelry ritual & value vault, in one studio.',
    'hero.sub': 'Pick your morning jewelry stack in 10 seconds, protect pieces from tarnish, track live 10k–24k gold melt value, and share your exact size passport.',
    'hero.cta_ritual': 'Start Today’s 10s Ritual →', 'hero.cta_vault': 'Open My Jewelry Box',
    'ritual.title': 'Daily Jewelry Ritual & Care',
    'ritual.sub': 'Your 10-second morning check-in: match your neckline, protect metals from tarnish, log today’s wear streak, and share your size passport.',
    'vault.title': 'My Jewelry Box & Value Tracker',
    'planner.title': 'Jewelry Lookbook & Wear Planner',
    'pro.badge': '✨ MCGEE JEWELRY PRO',
    'pro.title_unlock': 'Unlock Your Daily Jewelry Concierge',
    'pro.title_lock': 'Free Preview Used — Keep Going with Pro',
    'loc.title': 'Currency & Language',
    'loc.sub': 'Select your currency and language. Prices, gold rates, and text update instantly.',
    'loc.apply': 'Apply & Translate',
  },
  FR: {
    'nav.ritual': 'Rituel Jour', 'nav.vault': 'Mon Coffret', 'nav.planner': 'Lookbook', 'nav.sizing': 'Tailles',
    'nav.styling': 'Métal & Teint', 'nav.gift': 'Cadeaux', 'nav.more': 'Plus', 'nav.login': 'Connexion', 'nav.menu': 'Menu',
    'hero.eyebrow': 'Rituel Bijoux Quotidien · Coffret Or · 14 Studios',
    'hero.title': 'Votre rituel bijoux quotidien & coffret valeur, en un studio.',
    'hero.sub': 'Composez votre parure en 10 secondes le matin, protégez l’or et l’argent de l’oxydation, suivez la valeur de fonte et partagez vos tailles.',
    'hero.cta_ritual': 'Lancer le Rituel du Jour →', 'hero.cta_vault': 'Ouvrir Mon Coffret',
    'ritual.title': 'Rituel Bijoux Quotidien & Soin',
    'ritual.sub': 'Votre check-in du matin en 10 secondes : accordez vos chaînes, protégez vos métaux et partagez votre passeport tailles.',
    'vault.title': 'Mon Coffret à Bijoux & Valeur Or',
    'planner.title': 'Lookbook & Agenda de Port',
    'pro.badge': '✨ MCGEE JEWELRY PRO',
    'pro.title_unlock': 'Débloquez Votre Concierge Bijoux',
    'pro.title_lock': 'Aperçu utilisé — Passez à Pro en illimité',
    'loc.title': 'Devise & Langue',
    'loc.sub': 'Choisissez votre devise et votre langue. Les prix et textes se mettent à jour.',
    'loc.apply': 'Appliquer & Traduire',
  },
  ES: {
    'nav.ritual': 'Ritual Diario', 'nav.vault': 'Mi Joyero', 'nav.planner': 'Lookbook', 'nav.sizing': 'Tallas',
    'nav.styling': 'Tono y Metal', 'nav.gift': 'Regalos', 'nav.more': 'Más', 'nav.login': 'Entrar', 'nav.menu': 'Menú',
    'hero.eyebrow': 'Ritual Diario · Bóveda de Oro · 14 Estudios',
    'hero.title': 'Tu ritual diario de joyería y bóveda de valor, en un estudio.',
    'hero.sub': 'Elige tus joyas en 10 segundos cada mañana, evita el deslustre, calcula el valor del oro y comparte tu pasaporte de tallas.',
    'hero.cta_ritual': 'Iniciar Ritual de Hoy →', 'hero.cta_vault': 'Abrir Mi Joyero',
    'ritual.title': 'Ritual Diario de Joyería y Cuidado',
    'vault.title': 'Mi Joyero y Valor en Oro',
    'planner.title': 'Planificador Semanal y Coste por Uso',
    'loc.title': 'Moneda e Idioma', 'loc.apply': 'Aplicar y Traducir',
  },
  DE: {
    'nav.ritual': 'Tagesritual', 'nav.vault': 'Schmuckbox', 'nav.planner': 'Lookbook', 'nav.sizing': 'Größen',
    'nav.styling': 'Metall-Match', 'nav.gift': 'Geschenke', 'nav.more': 'Mehr', 'nav.login': 'Anmelden', 'nav.menu': 'Menü',
    'hero.eyebrow': 'Tägliches Schmuckritual · Gold-Tresor · 14 Studios',
    'hero.title': 'Dein tägliches Schmuckritual & Wert-Tresor in einem Studio.',
    'hero.sub': 'Wähle deinen Morgen-Look in 10 Sekunden, schütze Schmuck vor Anlaufen und verfolge deinen Goldwert.',
    'hero.cta_ritual': 'Heutiges Ritual starten →', 'hero.cta_vault': 'Schmuckbox öffnen',
    'ritual.title': 'Tägliches Schmuckritual & Pflege',
    'vault.title': 'Meine Schmuckbox & Goldwert',
    'planner.title': 'Wochen-Lookbook & Trage-Planer',
    'loc.title': 'Währung & Sprache', 'loc.apply': 'Übernehmen & Übersetzen',
  },
  IT: {
    'nav.ritual': 'Rituale Giorno', 'nav.vault': 'Portagioie', 'nav.planner': 'Lookbook', 'nav.sizing': 'Misure',
    'nav.styling': 'Armonia Metalli', 'nav.gift': 'Regali', 'nav.more': 'Altro', 'nav.login': 'Accedi', 'nav.menu': 'Menu',
    'hero.title': 'Il tuo rituale quotidiano di gioielleria e caveau in uno studio.',
    'hero.cta_ritual': 'Inizia il Rituale di Oggi →', 'hero.cta_vault': 'Apri il Portagioie',
    'ritual.title': 'Rituale Quotidiano e Cura',
    'vault.title': 'Il Mio Portagioie e Valore Oro',
    'planner.title': 'Lookbook Settimanale',
    'loc.title': 'Valuta e Lingua', 'loc.apply': 'Applica e Traduci',
  },
  NL: {
    'nav.ritual': 'Dagritueel', 'nav.vault': 'Sieradendoos', 'nav.planner': 'Lookbook', 'nav.sizing': 'Maten',
    'nav.styling': 'Metaalmatch', 'nav.gift': 'Cadeaus', 'nav.more': 'Meer', 'nav.login': 'Inloggen', 'nav.menu': 'Menu',
    'hero.title': 'Jouw dagelijkse sieradenritueel & goudkluis in één studio.',
    'hero.cta_ritual': 'Start Ritueel van Vandaag →', 'hero.cta_vault': 'Open Sieradendoos',
    'loc.title': 'Valuta & Taal', 'loc.apply': 'Toepassen & Vertalen',
  },
  PT: {
    'nav.ritual': 'Ritual Diário', 'nav.vault': 'Porta-Joias', 'nav.planner': 'Lookbook', 'nav.sizing': 'Tamanhos',
    'nav.styling': 'Metais', 'nav.gift': 'Presentes', 'nav.more': 'Mais', 'nav.login': 'Entrar', 'nav.menu': 'Menu',
    'hero.title': 'O seu ritual diário de joalharia e cofre de valor num só estúdio.',
    'hero.cta_ritual': 'Iniciar Ritual de Hoje →', 'hero.cta_vault': 'Abrir Porta-Joias',
    'loc.title': 'Moeda e Idioma', 'loc.apply': 'Aplicar e Traduzir',
  },
  SV: {
    'nav.ritual': 'Daglig Ritual', 'nav.vault': 'Smyckeskrin', 'nav.planner': 'Veckoplan', 'nav.sizing': 'Storlekar',
    'nav.styling': 'Metallmatch', 'nav.gift': 'Presenter', 'nav.more': 'Mer', 'nav.login': 'Logga in', 'nav.menu': 'Meny',
    'hero.title': 'Din dagliga smyckesritual och värdevalv i en studio.',
    'hero.cta_ritual': 'Starta Dagens Ritual →', 'hero.cta_vault': 'Öppna Smyckeskrin',
    'loc.title': 'Valuta & Språk', 'loc.apply': 'Verkställ & Översätt',
  },
  NO: {
    'nav.ritual': 'Daglig Rituale', 'nav.vault': 'Smykkeskrin', 'nav.planner': 'Lookbook', 'nav.sizing': 'Størrelser',
    'nav.styling': 'Metallmatch', 'nav.gift': 'Gaver', 'nav.more': 'Mer', 'nav.login': 'Logg inn', 'nav.menu': 'Meny',
    'hero.title': 'Ditt daglige smykkerituale og verdihvelv i ett studio.',
    'hero.cta_ritual': 'Start Dagens Rituale →', 'hero.cta_vault': 'Åpne Smykkeskrin',
    'loc.title': 'Valuta & Språk', 'loc.apply': 'Bruk & Oversett',
  },
  DA: {
    'nav.ritual': 'Dagligt Ritual', 'nav.vault': 'Smykkeskrin', 'nav.planner': 'Lookbook', 'nav.sizing': 'Størrelser',
    'nav.styling': 'Metallmatch', 'nav.gift': 'Gaver', 'nav.more': 'Mere', 'nav.login': 'Log ind', 'nav.menu': 'Menu',
    'hero.title': 'Dit daglige smykkeritual og værdiboks i ét studio.',
    'hero.cta_ritual': 'Start Dagens Ritual →', 'hero.cta_vault': 'Åbn Smykkeskrin',
    'loc.title': 'Valuta & Sprog', 'loc.apply': 'Anvend & Oversæt',
  },
  AR: {
    'nav.ritual': 'الروتين اليومي', 'nav.vault': 'صندوق مجوهراتي', 'nav.planner': 'مخطط الإطلالات', 'nav.sizing': 'دليل المقاسات',
    'nav.styling': 'المعدن المناسب', 'nav.gift': 'مكتشف الهدايا', 'nav.more': 'المزيد', 'nav.login': 'دخول', 'nav.menu': 'القائمة',
    'hero.eyebrow': 'روتين المجوهرات اليومي · خزينة الذهب الحية · 14 استوديو',
    'hero.title': 'روتينكِ اليومي للمجوهرات وخزينة قيمتها، في استوديو واحد.',
    'hero.sub': 'اختاري تنسيق مجوهراتك في 10 ثوانٍ كل صباح، واحميها من البهتان، وتابعي قيمة الذهب اللحظية، وشاركي بطاقة مقاساتك.',
    'hero.cta_ritual': 'ابدئي روتين اليوم (10 ثوانٍ) ←', 'hero.cta_vault': 'افتحي صندوق مجوهراتي',
    'ritual.title': 'الروتين اليومي للمجوهرات والعناية',
    'ritual.sub': 'فحصكِ الصباحي السريع: اختاري الطول المناسب، احمي المجوهرات من التأكسد، وشاركي مقاساتكِ بدقة.',
    'vault.title': 'صندوق مجوهراتي وحاسبة القيمة',
    'planner.title': 'مخطط الإطلالات الأسبوعي وتكلفة الارتداء',
    'pro.badge': '✨ عضوية McGee Pro',
    'pro.title_unlock': 'افتحي مساعدكِ اليومي للمجوهرات',
    'pro.title_lock': 'انتهت المعاينة المجانية — الترقية إلى Pro',
    'loc.title': 'العملة واللغة',
    'loc.sub': 'اختاري عملتك ولغتك المفضلة. يتحدث الموقع ويُترجم فوراً.',
    'loc.apply': 'تطبيق وترجمة',
  },
};

function detectLocale(): { currency: string; lang: string } {
  try {
    const qp = new URLSearchParams(window.location.search);
    const qCur = (qp.get('cur') || '').toUpperCase();
    const qLang = (qp.get('lang') || '').toUpperCase();
    if (CURRENCIES[qCur] || LANGUAGES[qLang]) {
      const fromUrl = {
        currency: CURRENCIES[qCur] ? qCur : 'USD',
        lang: LANGUAGES[qLang] ? qLang : ((CURRENCIES[qCur] && CURRENCIES[qCur].defaultLang) || 'EN'),
      };
      localStorage.setItem('koo_user_locale', JSON.stringify(fromUrl));
      return fromUrl;
    }
  } catch {}

  try {
    const saved = JSON.parse(localStorage.getItem('koo_user_locale') || '');
    if (saved && saved.currency && CURRENCIES[saved.currency] && saved.lang) return saved;
  } catch {}

  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch {}
  const navLang = (navigator.language || 'en').toLowerCase();
  let cur = 'USD';
  let lang = 'EN';

  if (/New_York|Detroit|Indiana|Kentucky|Chicago|Menominee|Denver|Boise|Phoenix|Los_Angeles|Anchorage|Honolulu/.test(tz) || navLang === 'en-us') {
    cur = 'USD'; lang = navLang.startsWith('es') ? 'ES' : 'EN';
  } else if (/Toronto|Montreal|Winnipeg|Regina|Edmonton|Vancouver|Halifax|St_Johns|Moncton/.test(tz) || navLang === 'en-ca' || navLang === 'fr-ca') {
    cur = 'CAD'; lang = (navLang.startsWith('fr') || tz.includes('Montreal')) ? 'FR' : 'EN';
  } else if (/Sydney|Melbourne|Brisbane|Perth|Adelaide|Hobart|Darwin/.test(tz) || navLang === 'en-au') {
    cur = 'AUD'; lang = 'EN';
  } else if (/Auckland|Wellington|Pacific\/Chatham/.test(tz) || navLang === 'en-nz') {
    cur = 'NZD'; lang = 'EN';
  } else if (/London|Belfast/.test(tz) || navLang === 'en-gb') {
    cur = 'GBP'; lang = 'EN';
  } else if (/Dublin/.test(tz) || navLang === 'en-ie') {
    cur = 'EUR'; lang = 'EN';
  } else if (/Zurich|Geneva/.test(tz)) {
    cur = 'CHF'; lang = navLang.startsWith('fr') ? 'FR' : (navLang.startsWith('it') ? 'IT' : 'DE');
  } else if (tz.includes('Stockholm') || navLang.startsWith('sv')) {
    cur = 'SEK'; lang = 'SV';
  } else if (tz.includes('Oslo') || navLang.startsWith('no') || navLang.startsWith('nb')) {
    cur = 'NOK'; lang = 'NO';
  } else if (tz.includes('Copenhagen') || navLang.startsWith('da')) {
    cur = 'DKK'; lang = 'DA';
  } else if (/Berlin|Vienna|Munich/.test(tz) || navLang.startsWith('de')) {
    cur = 'EUR'; lang = 'DE';
  } else if (/Paris|Lyon|Brussels|Luxembourg/.test(tz) || navLang.startsWith('fr')) {
    cur = 'EUR'; lang = 'FR';
  } else if (/Madrid|Barcelona/.test(tz) || navLang.startsWith('es')) {
    cur = 'EUR'; lang = 'ES';
  } else if (/Rome|Milan/.test(tz) || navLang.startsWith('it')) {
    cur = 'EUR'; lang = 'IT';
  } else if (/Amsterdam/.test(tz) || navLang.startsWith('nl')) {
    cur = 'EUR'; lang = 'NL';
  } else if (/Lisbon/.test(tz) || navLang.startsWith('pt')) {
    cur = 'EUR'; lang = 'PT';
  } else if (tz.includes('Casablanca') || navLang === 'ar-ma') {
    cur = 'MAD'; lang = 'FR';
  } else if (tz.includes('Dubai') || tz.includes('Muscat')) {
    cur = 'AED'; lang = 'AR';
  } else if (tz.includes('Riyadh')) {
    cur = 'SAR'; lang = 'AR';
  } else if (navLang.startsWith('ar')) {
    cur = 'USD'; lang = 'AR';
  }

  return { currency: cur, lang };
}

function captureAttribution() {
  try {
    const qp = new URLSearchParams(window.location.search);
    const src = qp.get('utm_source') || (qp.get('fbclid') ? 'meta' : '');
    const med = qp.get('utm_medium') || '';
    const camp = qp.get('utm_campaign') || '';
    const cont = qp.get('utm_content') || '';
    const fbclid = qp.get('fbclid') || '';
    if (src || camp || fbclid) {
      let prev: Record<string, string> = {};
      try { prev = JSON.parse(localStorage.getItem('mcgee_utm') || '{}'); } catch {}
      localStorage.setItem('mcgee_utm', JSON.stringify({
        utm_source: src || prev.utm_source || '',
        utm_medium: med || prev.utm_medium || '',
        utm_campaign: camp || prev.utm_campaign || '',
        utm_content: cont || prev.utm_content || '',
        fbclid: fbclid || prev.fbclid || '',
        landed_at: prev.landed_at || new Date().toISOString(),
      }));
    }
  } catch {}
}

interface AppContextType {
  currentRoute: string;
  navigate: (path: string) => void;
  currentLocale: { currency: string; lang: string };
  setLocale: (currency: string, lang: string) => void;
  t: (key: string, fallback?: string) => string;
  formatPrice: (usdAmount: number) => string;
  goldUsdPerOz: number;
  goldPerGramUsd: number;
  metaPixelId: string;
  reloadSiteConfig: () => Promise<void>;
  trackEvent: (eventName: string, params?: Record<string, any>) => void;
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
  refreshProStatus: () => Promise<void>;
  login: (e: string, p: string) => Promise<{ error?: string }>;
  signup: (e: string, p: string) => Promise<{ error?: string; needsConfirmation?: boolean; alreadyExists?: boolean }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
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
  authMode: 'login' | 'signup' | 'forgot' | 'recovery';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot' | 'recovery') => void;
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
    captureAttribution();
    const handlePopState = () => setCurrentRoute(getInitialRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme
  const [theme, setThemeState] = useState<'light' | 'plum' | 'midnight'>(() => {
    const saved = localStorage.getItem('koo_theme');
    return (saved === 'plum' || saved === 'midnight') ? saved : 'light';
  });

  const setTheme = (tVal: 'light' | 'plum' | 'midnight') => {
    setThemeState(tVal);
    localStorage.setItem('koo_theme', tVal);
    if (tVal === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', tVal);
    }
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('plum');
    else if (theme === 'plum') setTheme('midnight');
    else setTheme('light');
  };

  useEffect(() => {
    if (theme === 'light') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Locale + i18n
  const [currentLocale, setCurrentLocaleState] = useState<{ currency: string; lang: string }>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = currentLocale.lang.toLowerCase();
    if (currentLocale.lang.toUpperCase() === 'AR') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
  }, [currentLocale]);

  const setLocale = (currency: string, lang: string) => {
    const updated = { currency, lang };
    setCurrentLocaleState(updated);
    localStorage.setItem('koo_user_locale', JSON.stringify(updated));
    if (currentUser?.id) {
      supabase
        .from('profiles')
        .upsert(
          { user_id: currentUser.id, currency, language: lang, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
        .then(() => {});
    }
  };

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const lang = currentLocale.lang.toUpperCase();
      return MCGEE_I18N[lang]?.[key] || MCGEE_I18N.EN[key] || fallback || key;
    },
    [currentLocale.lang]
  );

  const formatPrice = useCallback(
    (usdAmount: number): string => {
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
    },
    [currentLocale.currency]
  );

  // Cloud Site Config (Meta Pixel ID & Gold Spot Price)
  const [goldUsdPerOz, setGoldUsdPerOz] = useState<number>(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('mcgee_site_config') || '{}');
      return parseFloat(cached.gold_usd_per_oz) || 2650;
    } catch {
      return 2650;
    }
  });
  const [metaPixelId, setMetaPixelId] = useState<string>(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('mcgee_site_config') || '{}');
      return String(cached.meta_pixel_id || '');
    } catch {
      return '';
    }
  });

  const bootMetaPixel = useCallback((pixelId: string) => {
    const cleanId = String(pixelId || '').replace(/[^0-9]/g, '');
    if (!cleanId || cleanId.length < 8) return;
    const w = window as any;
    if (w.__mcgeePixelBooted === cleanId) return;
    w.__mcgeePixelBooted = cleanId;
    if (!w.fbq) {
      const n: any = function () {
        if (n.callMethod) n.callMethod.apply(n, arguments);
        else n.queue.push(arguments);
      };
      w.fbq = n;
      w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    }
    w.fbq('init', cleanId);
    w.fbq('track', 'PageView');
  }, []);

  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    try {
      const w = window as any;
      if (typeof w.fbq === 'function') w.fbq('track', eventName, params || {});
      if (typeof w.gtag === 'function') w.gtag('event', eventName, params || {});
    } catch {}
  }, []);

  const reloadSiteConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('site_config').select('key, value');
      if (!error && Array.isArray(data)) {
        const nextCfg: Record<string, string> = {};
        data.forEach((row: any) => {
          if (row?.key) nextCfg[row.key] = row.value || '';
        });
        if (nextCfg.gold_usd_per_oz) {
          const parsed = parseFloat(nextCfg.gold_usd_per_oz);
          if (parsed > 500) setGoldUsdPerOz(parsed);
        }
        if (nextCfg.meta_pixel_id !== undefined) {
          setMetaPixelId(nextCfg.meta_pixel_id);
          if (nextCfg.meta_pixel_id) bootMetaPixel(nextCfg.meta_pixel_id);
        }
        try {
          localStorage.setItem('mcgee_site_config', JSON.stringify(nextCfg));
        } catch {}
      }
    } catch {}
  }, [bootMetaPixel]);

  useEffect(() => {
    if (metaPixelId) bootMetaPixel(metaPixelId);
    reloadSiteConfig();
  }, [metaPixelId, bootMetaPixel, reloadSiteConfig]);

  const goldPerGramUsd = goldUsdPerOz / 31.1035;

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
    const updated = hasWishlist(item.id)
      ? wishlist.filter((x) => x.id !== item.id)
      : [...wishlist, item];
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

  // Auth & Authoritative Pro Verification
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isProCloud, setIsProCloud] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Clean up legacy insecure local bypass key
  useEffect(() => {
    try { localStorage.removeItem('koo_pro_active'); } catch {}
  }, []);

  const refreshProStatus = useCallback(async (uid?: string, email?: string) => {
    const targetUid = uid || currentUser?.id;
    const targetEmail = (email || currentUser?.email || '').toLowerCase().trim();
    if (!targetUid) {
      setIsProCloud(false);
      return;
    }
    if (targetEmail === ADMIN_OWNER_EMAIL.toLowerCase()) {
      setIsProCloud(true);
      return;
    }
    try {
      const [subRes, admRes] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('status, current_period_end')
          .eq('user_id', targetUid)
          .maybeSingle(),
        supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', targetUid)
          .maybeSingle(),
      ]);
      const activeSub =
        subRes.data &&
        (subRes.data.status === 'active' || subRes.data.status === 'trialing') &&
        new Date(subRes.data.current_period_end).getTime() > Date.now();
      const isAdm = Boolean(admRes.data);
      setIsProCloud(Boolean(activeSub || isAdm));
    } catch {
      setIsProCloud(false);
    }
  }, [currentUser?.id, currentUser?.email]);

  const isPro = Boolean(
    isProCloud ||
    (currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_OWNER_EMAIL.toLowerCase()) ||
    currentUser?.is_pro === true
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const isOwner = u.email?.toLowerCase().trim() === ADMIN_OWNER_EMAIL.toLowerCase();
        setCurrentUser({
          id: u.id,
          email: u.email || 'Member',
          is_pro: Boolean(isOwner),
          created_at: u.created_at,
        });
        refreshProStatus(u.id, u.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = session.user;
        const isOwner = u.email?.toLowerCase().trim() === ADMIN_OWNER_EMAIL.toLowerCase();
        setCurrentUser({
          id: u.id,
          email: u.email || 'Member',
          is_pro: Boolean(isOwner),
          created_at: u.created_at,
        });
        refreshProStatus(u.id, u.email || '');
      } else {
        setCurrentUser(null);
        setIsProCloud(false);
      }
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('recovery');
        setIsAuthModalOpen(true);
      }
    });

    if (window.location.search.includes('payment=success')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      try {
        if (!sessionStorage.getItem('mcgee_purchase_tracked')) {
          sessionStorage.setItem('mcgee_purchase_tracked', '1');
          trackEvent('Purchase', { value: 6, currency: 'USD', content_name: 'McGee Pro Membership' });
        }
      } catch {}
      setBannerMessage('✨ Payment received! Syncing your McGee Jewelry Pro membership...');
      setTimeout(() => {
        refreshProStatus();
      }, 1500);
    }

    return () => subscription.unsubscribe();
  }, [refreshProStatus, trackEvent]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data?.user) {
        const u = data.user;
        setCurrentUser({
          id: u.id,
          email: u.email || '',
          is_pro: u.email?.toLowerCase().trim() === ADMIN_OWNER_EMAIL.toLowerCase(),
          created_at: u.created_at,
        });
        await refreshProStatus(u.id, u.email || '');
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
      let utm: Record<string, string> = {};
      try { utm = JSON.parse(localStorage.getItem('mcgee_utm') || '{}'); } catch {}
      let tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch {}
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            currency: currentLocale.currency,
            language: currentLocale.lang,
            utm_source: utm.utm_source || '',
            utm_medium: utm.utm_medium || '',
            utm_campaign: utm.utm_campaign || '',
            utm_content: utm.utm_content || '',
            country_hint: tz,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) return { error: error.message };
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return { alreadyExists: true };
      }
      trackEvent('CompleteRegistration', {
        currency: currentLocale.currency,
        utm_source: utm.utm_source || 'direct',
      });
      if (!data?.session) {
        return { needsConfirmation: true };
      }
      if (data?.user) {
        const u = data.user;
        setCurrentUser({
          id: u.id,
          email: u.email || '',
          is_pro: u.email?.toLowerCase().trim() === ADMIN_OWNER_EMAIL.toLowerCase(),
          created_at: u.created_at,
        });
        await refreshProStatus(u.id, u.email || '');
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Signup error' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Password reset error' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Password update error' };
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
    setIsProCloud(false);
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
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'recovery'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);

  const openProModal = (lock = false) => {
    if (isPro) return;
    setIsPageLock(lock);
    setIsProModalOpen(true);
    trackEvent('ViewContent', { content_name: 'McGee Pro Membership', value: 6, currency: 'USD' });
  };

  const closeProModal = () => {
    setIsProModalOpen(false);
    if (isPageLock) navigate('index');
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' | 'recovery' = 'login') => {
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
        t,
        formatPrice,
        goldUsdPerOz,
        goldPerGramUsd,
        metaPixelId,
        reloadSiteConfig,
        trackEvent,
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
        refreshProStatus: () => refreshProStatus(),
        login,
        signup,
        resetPassword,
        updatePassword,
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
