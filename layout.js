// Google Analytics (GA4) Tracking Setup
(function() {
  var GA_ID = 'G-VGDMTL2JN9';
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

// Load Supabase Client SDK
(function() {
  if (!window.supabase) {
    var sbScript = document.createElement('script');
    sbScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    sbScript.async = true;
    sbScript.onload = function() {
      if (window.initMcGeeAuth) window.initMcGeeAuth();
    };
    document.head.appendChild(sbScript);
  }
})();

(function(){
var SB_URL = 'https://kbcruuirhkidkbmrthbc.supabase.co';
var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY3J1dWlyaGtpZGtibXJ0aGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzU5MTksImV4cCI6MjEwODcxMTkxOX0.NVhiP74USvG4GU7_pnsNqDPaZ8oQhTl145wmnD-Fp3Y';
var STRIPE_BASE = 'https://buy.stripe.com/5kQ00kb7pgWc8p8c6Y0ZW00';
var STRIPE_PORTAL = 'https://billing.stripe.com/p/login/';

var ALL_TOOL_SLUGS = ['ritual', 'sizing', 'styling', 'care', 'gift', 'layering', 'anniversary', 'gold', 'diamond', 'earrings', 'wishlist', 'vault', 'planner', 'beading'];

/* ---------- CURRENCIES & MATCHING LANGUAGES ---------- */
var CURRENCIES = {
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
  SAR: { symbol: 'SAR', name: 'Saudi Riyal (Saudi Arabia)', rate: 3.75, defaultLang: 'AR' }
};

var LANGUAGES = {
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
  EL: 'Ελληνικά'
};

function detectLocale() {
  try {
    var qp = new URLSearchParams(window.location.search);
    var qCur = (qp.get('cur') || '').toUpperCase();
    var qLang = (qp.get('lang') || '').toUpperCase();
    if (CURRENCIES[qCur] || LANGUAGES[qLang]) {
      var fromUrl = {
        currency: CURRENCIES[qCur] ? qCur : 'USD',
        lang: LANGUAGES[qLang] ? qLang : ((CURRENCIES[qCur] && CURRENCIES[qCur].defaultLang) || 'EN')
      };
      localStorage.setItem('koo_user_locale', JSON.stringify(fromUrl));
      return fromUrl;
    }
  } catch(e){}

  var saved = null;
  try { saved = JSON.parse(localStorage.getItem('koo_user_locale')); } catch(e){}
  if (saved && saved.currency && CURRENCIES[saved.currency] && saved.lang) return saved;

  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
  var navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();

  var cur = 'USD';
  var lang = 'EN';

  if (/New_York|Detroit|Indiana|Kentucky|Chicago|Menominee|Denver|Boise|Phoenix|Los_Angeles|Anchorage|Honolulu|Adak/.test(tz) || navLang === 'en-us') {
    cur = 'USD'; lang = navLang.indexOf('es') === 0 ? 'ES' : 'EN';
  } else if (/Toronto|Montreal|Winnipeg|Regina|Edmonton|Vancouver|Halifax|St_Johns|Moncton/.test(tz) || navLang === 'en-ca' || navLang === 'fr-ca') {
    cur = 'CAD'; lang = (navLang.indexOf('fr') === 0 || tz.indexOf('Montreal') >= 0) ? 'FR' : 'EN';
  } else if (/Sydney|Melbourne|Brisbane|Perth|Adelaide|Hobart|Darwin/.test(tz) || navLang === 'en-au') {
    cur = 'AUD'; lang = 'EN';
  } else if (/Auckland|Wellington|Pacific\/Chatham/.test(tz) || navLang === 'en-nz') {
    cur = 'NZD'; lang = 'EN';
  } else if (/London|Belfast/.test(tz) || navLang === 'en-gb') {
    cur = 'GBP'; lang = 'EN';
  } else if (/Dublin/.test(tz) || navLang === 'en-ie') {
    cur = 'EUR'; lang = 'EN';
  } else if (/Zurich|Geneva/.test(tz)) {
    cur = 'CHF'; lang = navLang.indexOf('fr') === 0 ? 'FR' : (navLang.indexOf('it') === 0 ? 'IT' : 'DE');
  } else if (tz.indexOf('Stockholm') >= 0 || navLang.indexOf('sv') === 0) {
    cur = 'SEK'; lang = 'SV';
  } else if (tz.indexOf('Oslo') >= 0 || navLang.indexOf('no') === 0 || navLang.indexOf('nb') === 0 || navLang.indexOf('nn') === 0) {
    cur = 'NOK'; lang = 'NO';
  } else if (tz.indexOf('Copenhagen') >= 0 || navLang.indexOf('da') === 0) {
    cur = 'DKK'; lang = 'DA';
  } else if (tz.indexOf('Warsaw') >= 0 || navLang.indexOf('pl') === 0) {
    cur = 'PLN'; lang = 'PL';
  } else if (tz.indexOf('Prague') >= 0 || navLang.indexOf('cs') === 0) {
    cur = 'CZK'; lang = 'CS';
  } else if (tz.indexOf('Budapest') >= 0 || navLang.indexOf('hu') === 0) {
    cur = 'HUF'; lang = 'HU';
  } else if (tz.indexOf('Bucharest') >= 0 || navLang.indexOf('ro') === 0) {
    cur = 'RON'; lang = 'RO';
  } else if (tz.indexOf('Sofia') >= 0 || navLang.indexOf('bg') === 0) {
    cur = 'BGN'; lang = 'BG';
  } else if (tz.indexOf('Reykjavik') >= 0 || navLang.indexOf('is') === 0) {
    cur = 'ISK'; lang = 'EN';
  } else if (tz.indexOf('Istanbul') >= 0 || navLang.indexOf('tr') === 0) {
    cur = 'TRY'; lang = 'TR';
  } else if (tz.indexOf('Kyiv') >= 0 || navLang.indexOf('uk') === 0) {
    cur = 'UAH'; lang = 'UK';
  } else if (tz.indexOf('Belgrade') >= 0 || navLang.indexOf('sr') === 0) {
    cur = 'RSD'; lang = 'EN';
  } else if (tz.indexOf('Casablanca') >= 0 || navLang === 'ar-ma') {
    cur = 'MAD'; lang = 'FR';
  } else if (tz.indexOf('Dubai') >= 0 || tz.indexOf('Muscat') >= 0) {
    cur = 'AED'; lang = 'AR';
  } else if (tz.indexOf('Riyadh') >= 0) {
    cur = 'SAR'; lang = 'AR';
  } else if (/Berlin|Vienna|Munich/.test(tz) || navLang.indexOf('de') === 0) {
    cur = 'EUR'; lang = 'DE';
  } else if (/Paris|Lyon|Brussels|Luxembourg/.test(tz) || navLang.indexOf('fr') === 0) {
    cur = 'EUR'; lang = 'FR';
  } else if (/Madrid|Barcelona/.test(tz) || navLang.indexOf('es') === 0) {
    cur = 'EUR'; lang = 'ES';
  } else if (/Rome|Milan/.test(tz) || navLang.indexOf('it') === 0) {
    cur = 'EUR'; lang = 'IT';
  } else if (/Amsterdam/.test(tz) || navLang.indexOf('nl') === 0) {
    cur = 'EUR'; lang = 'NL';
  } else if (/Lisbon/.test(tz) || navLang.indexOf('pt') === 0) {
    cur = 'EUR'; lang = 'PT';
  } else if (/Athens/.test(tz) || navLang.indexOf('el') === 0) {
    cur = 'EUR'; lang = 'EL';
  } else if (navLang.indexOf('ar') === 0) {
    cur = 'USD'; lang = 'AR';
  }

  return { currency: cur, lang: lang };
}

var currentLocale = detectLocale();
window.currentLocale = currentLocale;

/* ---------- UTM & META AD ATTRIBUTION ---------- */
function captureAttribution() {
  try {
    var qp = new URLSearchParams(window.location.search);
    var src = qp.get('utm_source') || (qp.get('fbclid') ? 'meta' : '');
    var med = qp.get('utm_medium') || '';
    var camp = qp.get('utm_campaign') || '';
    var cont = qp.get('utm_content') || '';
    var fbclid = qp.get('fbclid') || '';
    if (src || camp || fbclid) {
      var prev = {};
      try { prev = JSON.parse(localStorage.getItem('mcgee_utm')) || {}; } catch(e){}
      var next = {
        utm_source: src || prev.utm_source || '',
        utm_medium: med || prev.utm_medium || '',
        utm_campaign: camp || prev.utm_campaign || '',
        utm_content: cont || prev.utm_content || '',
        fbclid: fbclid || prev.fbclid || '',
        landed_at: prev.landed_at || new Date().toISOString()
      };
      localStorage.setItem('mcgee_utm', JSON.stringify(next));
    }
  } catch(e){}
}
captureAttribution();

function getSavedAttribution() {
  try { return JSON.parse(localStorage.getItem('mcgee_utm')) || {}; } catch(e){ return {}; }
}

/* ---------- LIVE I18N ENGINE (11 LANGUAGES + RTL FOR AR) ---------- */
var MCGEE_I18N = {
  EN: {
    'nav.ritual': 'Daily Ritual', 'nav.vault': 'Jewelry Box', 'nav.planner': 'Look Planner', 'nav.sizing': 'Size guide',
    'nav.styling': 'Metal match', 'nav.gift': 'Gift finder', 'nav.more': 'More', 'nav.login': 'Log in', 'nav.menu': 'Menu',
    'nav.theme': 'Theme', 'footer.tag': 'Daily styling rituals, fine jewelry value vault & sizing precision across every device.',
    'footer.copy': '© 2026 McGee Jewelry. Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.',
    'hero.eyebrow': 'Daily Jewelry Ritual · Live Gold Vault · 14 Studios',
    'hero.title': 'Your daily jewelry ritual & value vault, in one studio.',
    'hero.sub': 'Pick your morning jewelry stack in 10 seconds, protect pieces from tarnish, track live 10k–24k gold melt value, and share your exact size passport.',
    'hero.cta_ritual': 'Start Today’s 10s Ritual →', 'hero.cta_vault': 'Open My Jewelry Box', 'hero.cta_explore': 'Explore All 14 Studios ↓',
    'habit.title': 'Built for every day, every week & every month',
    'habit.d_tag': 'EVERY MORNING · 10 SECONDS', 'habit.d_title': 'Morning Look & Care Check',
    'habit.d_desc': 'Pick your neckline and occasion to get instant chain lengths, tarnish safety reminders, and 1-tap wear streak logging.',
    'habit.w_tag': 'EVERY SUNDAY · 2 MINUTES', 'habit.w_title': '7-Day Lookbook & Cleaning Radar',
    'habit.w_desc': 'Plan Monday–Sunday looks without typing, spot pieces due for cleaning, and add a Sunday care alert to your phone calendar.',
    'habit.m_tag': 'EVERY MONTH · ASSET & GIFTS', 'habit.m_title': 'Gold Melt Vault & Gift Passport',
    'habit.m_desc': 'Watch your collection’s bullion value in your local currency, print insurance sheets, and copy your ring & wrist size card for your partner.',
    'ritual.title': 'Daily Jewelry Ritual & Care',
    'ritual.sub': 'Your 10-second morning check-in: match your neckline, protect metals from tarnish, log today’s wear streak, and share your size passport.',
    'vault.title': 'My Jewelry Box & Value Tracker',
    'vault.sub': 'Catalog your fine pieces, upload high-res photos, track pure gold grams, and monitor your collection’s estimated melt and replacement value.',
    'planner.title': 'Jewelry Lookbook & Wear Planner',
    'planner.sub': 'Organize what jewelry you wear every day, track your 30-day wearing history, and discover your true Cost-Per-Wear.',
    'pro.badge': '✨ MCGEE JEWELRY PRO', 'pro.title_unlock': 'Unlock Your Daily Jewelry Concierge',
    'pro.title_lock': 'Free Preview Used — Keep Going with Pro',
    'pro.cancel': 'Instant activation via Stripe · Local currency checkout · Cancel in 1 click',
    'loc.title': 'Currency & Language', 'loc.sub': 'Select your currency and language. Prices, gold rates, and text update instantly.',
    'loc.apply': 'Apply & Translate'
  },
  FR: {
    'nav.ritual': 'Rituel Jour', 'nav.vault': 'Mon Coffret', 'nav.planner': 'Lookbook', 'nav.sizing': 'Tailles',
    'nav.styling': 'Métal & Teint', 'nav.gift': 'Idées Cadeaux', 'nav.more': 'Plus', 'nav.login': 'Connexion', 'nav.menu': 'Menu',
    'nav.theme': 'Thème', 'footer.tag': 'Rituels bijoux quotidiens, coffret valeur or et guide de tailles synchronisé.',
    'footer.copy': '© 2026 McGee Jewelry. Conseils généraux de taille et d’entretien. Consultez un joaillier pour vos pièces anciennes.',
    'hero.eyebrow': 'Rituel Bijoux Quotidien · Coffret Or · 14 Studios',
    'hero.title': 'Votre rituel bijoux quotidien & coffret valeur, en un studio.',
    'hero.sub': 'Composez votre parure en 10 secondes le matin, protégez l’or et l’argent de l’oxydation, suivez la valeur de fonte et partagez vos tailles.',
    'hero.cta_ritual': 'Lancer le Rituel du Jour →', 'hero.cta_vault': 'Ouvrir Mon Coffret', 'hero.cta_explore': 'Explorer les 14 Studios ↓',
    'habit.title': 'Pensé pour chaque jour, semaine et mois',
    'habit.d_tag': 'CHAQUE MATIN · 10 SECONDES', 'habit.d_title': 'Look du Jour & Alerte Entretien',
    'habit.d_desc': 'Choisissez votre encolure et l’occasion pour obtenir longueurs idéales, conseils anti-ternissement et suivi de série.',
    'habit.w_tag': 'CHAQUE DIMANCHE · 2 MINUTES', 'habit.w_title': 'Planificateur 7 Jours & Nettoyage',
    'habit.w_desc': 'Planifiez la semaine du lundi au dimanche, repérez les bijoux à nettoyer et ajoutez un rappel au calendrier.',
    'habit.m_tag': 'CHAQUE MOIS · PATRIMOINE & CADEAUX', 'habit.m_title': 'Valeur Or & Passeport Tailles',
    'habit.m_desc': 'Suivez la valeur en devise locale, imprimez votre dossier assurance et copiez votre fiche tailles pour vos proches.',
    'ritual.title': 'Rituel Bijoux Quotidien & Soin',
    'ritual.sub': 'Votre check-in du matin en 10 secondes : accordez vos chaînes, protégez vos métaux et partagez votre passeport tailles.',
    'vault.title': 'Mon Coffret à Bijoux & Valeur Or',
    'vault.sub': 'Cataloguez vos bagues et chaînes, calculez le poids d’or pur et estimez la valeur de remplacement.',
    'planner.title': 'Lookbook & Agenda de Port',
    'planner.sub': 'Organisez vos parures de la semaine et calculez votre coût réel par port sur 30 jours.',
    'pro.badge': '✨ MCGEE JEWELRY PRO', 'pro.title_unlock': 'Débloquez Votre Concierge Bijoux',
    'pro.title_lock': 'Aperçu utilisé — Passez à Pro en illimité',
    'pro.cancel': 'Accès instantané via Stripe · Paiement sécurisé · Annulation en 1 clic',
    'loc.title': 'Devise & Langue', 'loc.sub': 'Choisissez votre devise et votre langue. Le site se traduit instantanément.',
    'loc.apply': 'Appliquer & Traduire'
  },
  ES: {
    'nav.ritual': 'Ritual Diario', 'nav.vault': 'Mi Joyero', 'nav.planner': 'Lookbook', 'nav.sizing': 'Tallas',
    'nav.styling': 'Tono y Metal', 'nav.gift': 'Regalos', 'nav.more': 'Más', 'nav.login': 'Entrar', 'nav.menu': 'Menú',
    'nav.theme': 'Tema', 'footer.tag': 'Ritual diario de joyería, bóveda de valor en oro y guía internacional de tallas.',
    'hero.eyebrow': 'Ritual Diario · Bóveda de Oro · 14 Estudios',
    'hero.title': 'Tu ritual diario de joyería y bóveda de valor, en un estudio.',
    'hero.sub': 'Elige tus joyas en 10 segundos cada mañana, evita el deslustre, calcula el valor del oro y comparte tu pasaporte de tallas.',
    'hero.cta_ritual': 'Iniciar Ritual de Hoy →', 'hero.cta_vault': 'Abrir Mi Joyero', 'hero.cta_explore': 'Ver los 14 Estudios ↓',
    'habit.title': 'Diseñado para tu rutina diaria, semanal y mensual',
    'ritual.title': 'Ritual Diario de Joyería y Cuidado',
    'vault.title': 'Mi Joyero y Valor en Oro',
    'planner.title': 'Planificador Semanal y Coste por Uso',
    'loc.title': 'Moneda e Idioma', 'loc.apply': 'Aplicar y Traducir'
  },
  DE: {
    'nav.ritual': 'Tagesritual', 'nav.vault': 'Schmuckbox', 'nav.planner': 'Lookbook', 'nav.sizing': 'Größen',
    'nav.styling': 'Metall-Match', 'nav.gift': 'Geschenke', 'nav.more': 'Mehr', 'nav.login': 'Anmelden', 'nav.menu': 'Menü',
    'nav.theme': 'Design', 'hero.eyebrow': 'Tägliches Schmuckritual · Gold-Tresor · 14 Studios',
    'hero.title': 'Dein tägliches Schmuckritual & Wert-Tresor in einem Studio.',
    'hero.sub': 'Wähle deinen Morgen-Look in 10 Sekunden, schütze Schmuck vor Anlaufen und verfolge deinen Goldwert.',
    'hero.cta_ritual': 'Heutiges Ritual starten →', 'hero.cta_vault': 'Schmuckbox öffnen', 'hero.cta_explore': 'Alle 14 Studios ↓',
    'ritual.title': 'Tägliches Schmuckritual & Pflege', 'vault.title': 'Meine Schmuckbox & Goldwert', 'planner.title': 'Wochen-Lookbook & Trage-Planer',
    'loc.title': 'Währung & Sprache', 'loc.apply': 'Übernehmen & Übersetzen'
  },
  IT: {
    'nav.ritual': 'Rituale Giorno', 'nav.vault': 'Portagioie', 'nav.planner': 'Lookbook', 'nav.sizing': 'Misure',
    'nav.styling': 'Armonia Metalli', 'nav.gift': 'Regali', 'nav.more': 'Altro', 'nav.login': 'Accedi', 'nav.menu': 'Menu',
    'hero.title': 'Il tuo rituale quotidiano di gioielleria e caveau in uno studio.',
    'hero.cta_ritual': 'Inizia il Rituale di Oggi →', 'hero.cta_vault': 'Apri il Portagioie',
    'ritual.title': 'Rituale Quotidiano e Cura', 'vault.title': 'Il Mio Portagioie e Valore Oro', 'planner.title': 'Lookbook Settimanale',
    'loc.title': 'Valuta e Lingua', 'loc.apply': 'Applica e Traduci'
  },
  NL: {
    'nav.ritual': 'Dagritueel', 'nav.vault': 'Sieradendoos', 'nav.planner': 'Lookbook', 'nav.sizing': 'Maten',
    'nav.styling': 'Metaalmatch', 'nav.gift': 'Cadeaus', 'nav.more': 'Meer', 'nav.login': 'Inloggen', 'nav.menu': 'Menu',
    'hero.title': 'Jouw dagelijkse sieradenritueel & goudkluis in één studio.',
    'hero.cta_ritual': 'Start Ritueel van Vandaag →', 'hero.cta_vault': 'Open Sieradendoos',
    'loc.title': 'Valuta & Taal', 'loc.apply': 'Toepassen & Vertalen'
  },
  PT: {
    'nav.ritual': 'Ritual Diário', 'nav.vault': 'Porta-Joias', 'nav.planner': 'Lookbook', 'nav.sizing': 'Tamanhos',
    'nav.styling': 'Metais', 'nav.gift': 'Presentes', 'nav.more': 'Mais', 'nav.login': 'Entrar', 'nav.menu': 'Menu',
    'hero.title': 'O seu ritual diário de joalharia e cofre de valor num só estúdio.',
    'hero.cta_ritual': 'Iniciar Ritual de Hoje →', 'hero.cta_vault': 'Abrir Porta-Joias',
    'loc.title': 'Moeda e Idioma', 'loc.apply': 'Aplicar e Traduzir'
  },
  SV: {
    'nav.ritual': 'Daglig Ritual', 'nav.vault': 'Smyckeskrin', 'nav.planner': 'Veckoplan', 'nav.sizing': 'Storlekar',
    'nav.styling': 'Metallmatch', 'nav.gift': 'Presenter', 'nav.more': 'Mer', 'nav.login': 'Logga in', 'nav.menu': 'Meny',
    'hero.title': 'Din dagliga smyckesritual och värdevalv i en studio.',
    'hero.cta_ritual': 'Starta Dagens Ritual →', 'hero.cta_vault': 'Öppna Smyckeskrin',
    'loc.title': 'Valuta & Språk', 'loc.apply': 'Verkställ & Översätt'
  },
  NO: {
    'nav.ritual': 'Daglig Rituale', 'nav.vault': 'Smykkeskrin', 'nav.planner': 'Lookbook', 'nav.sizing': 'Størrelser',
    'nav.styling': 'Metallmatch', 'nav.gift': 'Gaver', 'nav.more': 'Mer', 'nav.login': 'Logg inn', 'nav.menu': 'Meny',
    'hero.title': 'Ditt daglige smykkerituale og verdihvelv i ett studio.',
    'hero.cta_ritual': 'Start Dagens Rituale →', 'hero.cta_vault': 'Åpne Smykkeskrin',
    'loc.title': 'Valuta & Språk', 'loc.apply': 'Bruk & Oversett'
  },
  DA: {
    'nav.ritual': 'Dagligt Ritual', 'nav.vault': 'Smykkeskrin', 'nav.planner': 'Lookbook', 'nav.sizing': 'Størrelser',
    'nav.styling': 'Metallmatch', 'nav.gift': 'Gaver', 'nav.more': 'Mere', 'nav.login': 'Log ind', 'nav.menu': 'Menu',
    'hero.title': 'Dit daglige smykkeritual og værdiboks i ét studio.',
    'hero.cta_ritual': 'Start Dagens Ritual →', 'hero.cta_vault': 'Åbn Smykkeskrin',
    'loc.title': 'Valuta & Sprog', 'loc.apply': 'Anvend & Oversæt'
  },
  AR: {
    'nav.ritual': 'الروتين اليومي', 'nav.vault': 'صندوق مجوهراتي', 'nav.planner': 'مخطط الإطلالات', 'nav.sizing': 'دليل المقاسات',
    'nav.styling': 'المعدن المناسب', 'nav.gift': 'مكتشف الهدايا', 'nav.more': 'المزيد', 'nav.login': 'دخول', 'nav.menu': 'القائمة',
    'nav.theme': 'المظهر', 'footer.tag': 'روتينك اليومي للمجوهرات، خزينة قيمة الذهب، ودليل المقاسات المتزامن عبر أجهزتك.',
    'hero.eyebrow': 'روتين المجوهرات اليومي · خزينة الذهب الحية · 14 استوديو',
    'hero.title': 'روتينكِ اليومي للمجوهرات وخزينة قيمتها، في استوديو واحد.',
    'hero.sub': 'اختاري تنسيق مجوهراتك في 10 ثوانٍ كل صباح، واحميها من البهتان، وتابعي قيمة الذهب اللحظية، وشاركي بطاقة مقاساتك.',
    'hero.cta_ritual': 'ابدئي روتين اليوم (10 ثوانٍ) ←', 'hero.cta_vault': 'افتحي صندوق مجوهراتي', 'hero.cta_explore': 'استكشفي 14 استوديو ↓',
    'habit.title': 'مصمم لروتينك اليومي والأسبوعي والشهري',
    'ritual.title': 'الروتين اليومي للمجوهرات والعناية',
    'vault.title': 'صندوق مجوهراتي وحاسبة القيمة',
    'planner.title': 'مخطط الإطلالات الأسبوعي وتكلفة الارتداء',
    'pro.badge': '✨ عضوية McGee Pro', 'pro.title_unlock': 'افتحي مساعدكِ اليومي للمجوهرات',
    'loc.title': 'العملة واللغة', 'loc.sub': 'اختاري عملتك ولغتك المفضلة. يتحدث الموقع ويُترجم فوراً.',
    'loc.apply': 'تطبيق وترجمة'
  }
};
window.MCGEE_I18N = MCGEE_I18N;

function t(key, fallback) {
  var lang = (currentLocale && currentLocale.lang) || 'EN';
  var dict = MCGEE_I18N[lang] || MCGEE_I18N.EN;
  return dict[key] || MCGEE_I18N.EN[key] || fallback || key;
}
window.t = t;

function applyDocumentLocale() {
  var lang = (currentLocale && currentLocale.lang) || 'EN';
  document.documentElement.lang = lang.toLowerCase();
  if (lang === 'AR') document.documentElement.setAttribute('dir', 'rtl');
  else document.documentElement.removeAttribute('dir');

  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key = el.getAttribute('data-i18n');
    if (!el.dataset.i18nDefault) el.dataset.i18nDefault = el.textContent;
    var val = t(key, el.dataset.i18nDefault);
    if (val) el.textContent = val;
  });

  if (window.formatPrice) {
    var lp = formatPrice(6);
    var dp = formatPrice(0.20);
    document.querySelectorAll('[data-pro-price]').forEach(function(el){ el.textContent = lp; });
    document.querySelectorAll('[data-daily-price]').forEach(function(el){ el.textContent = dp + '/day'; });
  }
}
window.applyMcGeeTranslations = applyDocumentLocale;

/* ---------- LIVE SITE CONFIG & META PIXEL ---------- */
window.__mcgeeSiteConfig = { meta_pixel_id: '', gold_usd_per_oz: '2650' };
try {
  var cachedCfg = JSON.parse(localStorage.getItem('mcgee_site_config'));
  if (cachedCfg) window.__mcgeeSiteConfig = Object.assign(window.__mcgeeSiteConfig, cachedCfg);
} catch(e){}

window.getMcGeeGoldPerGramUsd = function() {
  var oz = parseFloat(window.__mcgeeSiteConfig && window.__mcgeeSiteConfig.gold_usd_per_oz) || 2650;
  return oz / 31.1035;
};

var __pixelBootedId = '';
function bootMetaPixel(pixelId) {
  var cleanId = String(pixelId || '').replace(/[^0-9]/g, '');
  if (!cleanId || cleanId.length < 8 || __pixelBootedId === cleanId) return;
  __pixelBootedId = cleanId;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', cleanId);
  window.fbq('track', 'PageView');
}

function trackMcGeeEvent(eventName, params) {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, params || {});
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  } catch(e){}
}
window.trackMcGeeEvent = trackMcGeeEvent;

if (window.__mcgeeSiteConfig.meta_pixel_id) {
  bootMetaPixel(window.__mcgeeSiteConfig.meta_pixel_id);
}

/* ---------- LIVE CURRENCY FORMATTER ---------- */
function formatPrice(usdAmount) {
  var c = CURRENCIES[currentLocale.currency] || CURRENCIES.USD;
  var converted = usdAmount * c.rate;
  var formattedNumber;

  if (c.rate >= 40) {
    formattedNumber = Math.round(converted).toLocaleString();
  } else if (c.rate >= 3.5) {
    formattedNumber = Math.round(converted).toString();
  } else {
    formattedNumber = converted.toFixed(2);
  }

  var postfixCurrencies = ['MAD', 'AED', 'SAR', 'HUF', 'CZK', 'PLN', 'RON', 'BGN', 'SEK', 'NOK', 'DKK', 'ISK', 'RSD', 'TRY', 'UAH'];
  if (postfixCurrencies.indexOf(currentLocale.currency) >= 0) {
    return formattedNumber + ' ' + c.symbol;
  }
  return c.symbol + formattedNumber;
}
window.formatPrice = formatPrice;

function openLocaleModal() {
  var old = document.getElementById('mcgee-locale-dialog');
  if (old) old.remove();

  var dlg = document.createElement('div');
  dlg.id = 'mcgee-locale-dialog';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(18,10,14,0.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1.25rem;';

  var curOptions = Object.keys(CURRENCIES).map(function(k){
    var c = CURRENCIES[k];
    return '<option value="' + k + '"' + (currentLocale.currency === k ? ' selected' : '') + '>' + k + ' (' + c.symbol + ') - ' + c.name + '</option>';
  }).join('');

  var langOptions = Object.keys(LANGUAGES).map(function(l){
    return '<option value="' + l + '"' + (currentLocale.lang === l ? ' selected' : '') + '>' + LANGUAGES[l] + ' (' + l + ')</option>';
  }).join('');

  dlg.innerHTML = '<div class="glass glow p-6 md:p-8 rounded-3xl max-w-sm w-full relative" style="box-shadow:0 30px 60px rgba(0,0,0,0.5);border:1px solid rgba(243,226,179,0.25)">' +
                  '<button id="loc-close" style="position:absolute;top:1.2rem;right:1.2rem;width:2rem;height:2rem;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer" class="muted hover:text-white">✕</button>' +
                  '<span class="chip text-xs">Regional Settings</span>' +
                  '<h3 class="serif text-3xl gt mt-2">' + t('loc.title', 'Currency & Language') + '</h3>' +
                  '<p class="muted text-xs mt-1">' + t('loc.sub', 'Select your preferred currency and language. The website translates instantly.') + '</p>' +
                  '<div class="flex flex-col gap-3 mt-5">' +
                  '<label class="fld text-left"><span>Select Currency</span><select id="loc-sel-cur">' + curOptions + '</select></label>' +
                  '<label class="fld text-left"><span>Website Language</span><select id="loc-sel-lang">' + langOptions + '</select></label>' +
                  '<button id="loc-btn-save" class="btn btn-gold w-full mt-3">' + t('loc.apply', 'Apply & Translate') + '</button>' +
                  '</div>' +
                  '</div>';

  document.body.appendChild(dlg);

  var curSelect = document.getElementById('loc-sel-cur');
  if (curSelect) {
    curSelect.onchange = function() {
      var chosen = CURRENCIES[curSelect.value];
      if (chosen && chosen.defaultLang) {
        document.getElementById('loc-sel-lang').value = chosen.defaultLang;
      }
    };
  }

  var cl = document.getElementById('loc-close'); if (cl) cl.onclick = function(){ dlg.remove(); };
  var saveBtn = document.getElementById('loc-btn-save');
  if (saveBtn) {
    saveBtn.onclick = function(){
      var newCur = document.getElementById('loc-sel-cur').value;
      var newLang = document.getElementById('loc-sel-lang').value;
      currentLocale.currency = newCur;
      currentLocale.lang = newLang;
      try { localStorage.setItem('koo_user_locale', JSON.stringify(currentLocale)); } catch(e){}
      if (currentUser && sb) {
        sb.from('profiles').upsert({ user_id: currentUser.id, currency: newCur, language: newLang, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).then(function(){});
      }
      dlg.remove();
      location.reload();
    };
  }
  dlg.onclick = function(e){ if (e.target === dlg) dlg.remove(); };
}

/* ---------- NAV & PAGE BUILDER ---------- */
var TH=[['light','Blush','#fbf5f2'],['plum','Plum','#2a1426'],['midnight','Midnight','#020617']];
try{var st=localStorage.getItem('koo_theme');if(st==='plum'||st==='midnight')document.documentElement.dataset.theme=st}catch(e){}

function logo(id){return '<svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true" class="shrink-0"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e2b3"/><stop offset=".55" stop-color="#e8b4b8"/><stop offset="1" stop-color="#b76e79"/></linearGradient></defs><circle cx="20" cy="25" r="11" fill="none" stroke="url(#'+id+')" stroke-width="2.6"/><polygon points="14,5 26,5 31,10 20,19 9,10" fill="url(#'+id+')"/><g stroke="rgba(60,30,40,.45)" stroke-width=".8" fill="none"><polyline points="9,10 31,10"/><polyline points="14,5 17,10 20,19 23,10 26,5"/></g></svg>'}
function brand(id){return '<a href="index.html" class="brand shrink-0" aria-label="McGee Jewelry home">'+logo(id)+'<span><span class="serif gt brand-n">McGee</span><span class="brand-s hidden sm:inline">JEWELRY</span></span></a>'}

var guides=[["/how-to-measure-ring-size-at-home","Measure Ring Size at Home"],["/how-to-untangle-a-necklace","Untangle Fine Gold Chains"],["/shop/necklaces/14k-yellow-gold-necklace-with-devil-emoji-symbol","Devil emoji necklace"],["/how-to-clean-sterling-silver-at-home","Clean Sterling Silver Guide"],["/why-does-gold-turn-skin-green","Gold Turning Skin Green"],["/product-category/rings","Rings guide"],["/what-earrings-are-trending-now","Earring trends"],["/shop/rings/14k-white-and-rose-gold-doulbe-diamond-infinity-design-band-3-8-cttw","Diamond infinity band"]];

var pages=[
  ['index.html','Home'],
  ['ritual.html', t('nav.ritual', 'Daily Ritual')],
  ['vault.html', t('nav.vault', 'Jewelry Box')],
  ['planner.html', t('nav.planner', 'Look Planner')],
  ['sizing.html', t('nav.sizing', 'Size guide')],
  ['styling.html', t('nav.styling', 'Metal match')],
  ['care.html','Care'],
  ['gift.html', t('nav.gift', 'Gift finder')],
  ['blog.html','Blog'],
  ['wishlist.html','Wishlist'],
  ['layering.html','Layering'],
  ['anniversary.html','Anniversary gifts'],
  ['gold.html','Gold calculator'],
  ['diamond.html','Diamond size'],
  ['earrings.html','Earring finder'],
  ['beading.html','Beading board']
];

var rawPath = location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
var cleanSlug = rawPath.replace(/\.html$/, '');
var here = (cleanSlug || 'index') + '.html';
var isToolPage = ALL_TOOL_SLUGS.indexOf(cleanSlug) >= 0;

/* ---------- CLOUD-AWARE WISHLIST ENGINE ---------- */
var K = 'koo_wishlist';
var KOO = window.KOO = {
  get: function(){
    try { return JSON.parse(localStorage.getItem(K)) || []; } catch(e){ return []; }
  },
  set: function(a){
    try { localStorage.setItem(K, JSON.stringify(a)); } catch(e){}
    if (currentUser && sb) {
      if (a.length === 0) {
        sb.from('wishlist').delete().eq('user_id', currentUser.id).then(function(){});
      }
    }
  },
  has: function(id){
    return this.get().some(function(x){ return x.id === id; });
  },
  toggle: function(it){
    var a = this.get();
    var exists = a.some(function(x){ return x.id === it.id; });
    if (exists) {
      a = a.filter(function(x){ return x.id !== it.id; });
      if (currentUser && sb) {
        sb.from('wishlist').delete().eq('user_id', currentUser.id).filter('item->>id', 'eq', it.id).then(function(){});
      }
    } else {
      a.push(it);
      if (currentUser && sb) {
        sb.from('wishlist').insert({ user_id: currentUser.id, item: it }).then(function(){});
      }
    }
    try { localStorage.setItem(K, JSON.stringify(a)); } catch(e){}
    this.sync();
    return a;
  },
  btn: function(id, label, note){
    var e = function(s){ return String(s||'').replace(/"/g,'&quot;'); };
    return '<button class="save" data-save data-id="' + e(id) + '" data-label="' + e(label) + '" data-note="' + e(note) + '" aria-pressed="false">♡ Save</button>';
  },
  sync: function(){
    var n = this.get().length;
    document.querySelectorAll('[data-count]').forEach(function(e){ e.textContent = n; e.hidden = !n; });
    document.querySelectorAll('[data-save]').forEach(function(b){
      var on = KOO.has(b.dataset.id);
      b.setAttribute('aria-pressed', on);
      b.textContent = on ? '♥ Saved' : '♡ Save';
    });
  },
  loadFromCloud: async function(){
    if (!currentUser || !sb) return;
    try {
      var res = await sb.from('wishlist').select('id, item').eq('user_id', currentUser.id);
      if (!res.error && Array.isArray(res.data)) {
        var cloudItems = res.data.map(function(r){ return r.item; }).filter(Boolean);
        localStorage.setItem(K, JSON.stringify(cloudItems));
        this.sync();
      }
    } catch(e){}
  }
};

function lk(p){
  return '<a class="l whitespace-nowrap" href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '>' + p[1] + (p[0] === 'wishlist.html' ? ' <span data-count hidden class="ml-1 rounded-full px-1.5 text-xs" style="background:#b76e79;color:#fff"></span>' : '') + '</a>';
}

var curInfo = CURRENCIES[currentLocale.currency] || CURRENCIES.USD;
var locBtnHtml = '<button id="nav-locale-btn" class="l whitespace-nowrap flex items-center gap-1 font-medium text-xs py-1 px-2.5 rounded-full" style="cursor:pointer;color:#b76e79;background:rgba(243,226,179,0.15);border:1px solid rgba(183,110,121,0.25)" title="Change Currency & Language"><span>📍 ' + currentLocale.currency + ' (' + curInfo.symbol + ') ▾</span></button>';

var deskLinks = [
  pages[1], pages[2], pages[3], pages[4]
].map(lk).join('') + locBtnHtml + lk(pages[7]);

var moreLinks = [pages[5], pages[6], pages[8], pages[9], pages[10], pages[11], pages[12], pages[13], pages[14], pages[15]].map(lk).join('');
var desk = deskLinks + '<details class="more"><summary' + (here !== 'index.html' && ['ritual.html','vault.html','planner.html','sizing.html','gift.html'].indexOf(here) < 0 ? ' style="color:#f3e2b3"' : '') + '>' + t('nav.more', 'More') + '</summary><div class="more-menu">' + moreLinks + '</div></details>';

var mobLinks = pages.map(lk).join('') + 
  '<div class="pt-3 mt-2 border-t border-rose-200/20 flex flex-col gap-2">' +
  '<button id="m-nav-locale-btn" class="chip text-xs w-full text-center py-2">📍 ' + currentLocale.currency + ' (' + curInfo.symbol + ') · ' + (LANGUAGES[currentLocale.lang]||currentLocale.lang) + '</button>' +
  '<button id="m-th" class="btn btn-ghost text-xs w-full py-2">' + t('nav.theme', 'Theme') + '</button>' +
  '</div>';

var nav = document.getElementById('nav');
if(nav) nav.innerHTML = '<header class="nav"><div class="mx-auto max-w-7xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">' +
  brand('lg1') +
  '<nav class="hidden xl:flex gap-1 items-center" aria-label="Main">' + desk + '</nav>' +
  '<div class="flex items-center gap-1.5 sm:gap-2 shrink-0" id="nav-actions">' +
  '<button id="th" class="btn btn-ghost hidden sm:inline-flex text-xs py-1.5 px-3" aria-label="Change color theme"></button>' +
  '<span id="auth-slot" class="flex items-center gap-1.5 shrink-0"></span>' +
  '<button id="mb" class="xl:hidden btn btn-ghost py-1.5 px-3 text-xs" aria-expanded="false" aria-controls="mm">' + t('nav.menu', 'Menu') + '</button>' +
  '</div></div>' +
  '<nav id="mm" class="hidden xl:hidden px-4 pb-4 flex-col gap-1" aria-label="Mobile">' +
  '<div id="mm-auth" class="pb-2 mb-2 border-t border-rose-200/20"></div>' +
  mobLinks +
  '</nav></header>';

var bLocDesk = document.getElementById('nav-locale-btn'); if (bLocDesk) bLocDesk.onclick = openLocaleModal;
var bLocMob = document.getElementById('m-nav-locale-btn'); if (bLocMob) bLocMob.onclick = openLocaleModal;

var mb = document.getElementById('mb');
if(mb) mb.onclick = function(){ var m = document.getElementById('mm'), o = m.classList.toggle('hidden'); m.classList.toggle('flex', !o); mb.setAttribute('aria-expanded', !o); };

var f = document.getElementById('foot');
if(f) f.innerHTML = '<footer class="mx-auto max-w-6xl px-5 py-12 border-t" style="border-color:rgba(243,226,179,.1)"><div class="flex flex-wrap justify-between gap-6"><div>' + brand('lg2') + '<p class="muted text-sm mt-2 max-w-sm">' + t('footer.tag', 'Daily styling rituals, fine jewelry value vault & sizing precision across every device.') + '</p></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted" aria-label="Footer">' + pages.map(function(p){ return '<a href="' + p[0] + '" class="hover:text-white">' + p[1] + '</a>'; }).join('') + '<a href="privacy.html" class="hover:text-white">Privacy and ads</a></nav></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted mt-6" aria-label="Guides">' + guides.map(function(g){ return '<a href="' + g[0] + '" class="hover:text-white">' + g[1] + '</a>'; }).join('') + '</nav><p class="muted text-xs mt-8">' + t('footer.copy', '© 2026 McGee Jewelry. Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.') + '</p></footer>';

/* ---------- Theme switcher ---------- */
function thNow(){ return document.documentElement.dataset.theme || 'light'; }
function thLab(){
  var tEl = document.getElementById('th'), c = thNow(), r = TH.filter(function(x){ return x[0] === c; })[0] || TH[0];
  if(tEl) tEl.textContent = t('nav.theme', 'Theme') + ': ' + r[1];
  var mt = document.getElementById('m-th');
  if(mt) mt.textContent = t('nav.theme', 'Theme') + ': ' + r[1];
  var m = document.querySelector('meta[name="theme-color"]');
  if(m) m.content = r[2];
}
function cycleTheme(){
  var i = 0; TH.forEach(function(x, j){ if(x[0] === thNow()) i = j; });
  var n = TH[(i+1)%TH.length][0];
  if(n === 'light') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = n;
  try{ localStorage.setItem('koo_theme', n); }catch(e){}
  thLab();
}
var thb = document.getElementById('th'); if(thb) thb.onclick = cycleTheme;
var mthb = document.getElementById('m-th'); if(mthb) mthb.onclick = cycleTheme;
thLab();
KOO.sync();

/* ---------- Pro Auth, Unforgeable Pro Check, and Cloud Sync ---------- */
var sb = null;
var currentUser = null;
var authMode = 'login';

window.__isPro = false;
window.__isAdmin = false;

// UNFORGEABLE PRO CHECK
// Rule: Pro = active subscription in Supabase (status in 'active','trialing' and current_period_end > now())
// or listed in 'admins' table. Reads only from Supabase via RLS.
async function refreshProStatus() {
  if (!sb || !currentUser) {
    window.__isPro = false;
    window.__isAdmin = false;
    updateNavAuth();
    return false;
  }
  try {
    var nowIso = new Date().toISOString();
    var subRes = await sb
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', currentUser.id)
      .in('status', ['active', 'trialing'])
      .gt('current_period_end', nowIso)
      .maybeSingle();

    var isSubActive = !subRes.error && !!subRes.data;

    var adminRes = await sb
      .from('admins')
      .select('user_id')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    var isAdmin = !adminRes.error && !!adminRes.data;

    window.__isPro = isSubActive || isAdmin;
    window.__isAdmin = isAdmin;
  } catch (err) {
    console.warn('Error refreshing pro subscription status:', err);
    window.__isPro = false;
  }
  updateNavAuth();
  return window.__isPro;
}
window.refreshProStatus = refreshProStatus;

function isProUser() {
  return !!window.__isPro;
}
window.isProUser = isProUser;

function getStudioVisits() {
  try { return JSON.parse(localStorage.getItem('koo_studio_visits')) || {}; } catch(e){ return {}; }
}

function getUsedFeatures() {
  try { return JSON.parse(localStorage.getItem('koo_used_features')) || []; } catch(e){ return []; }
}

function hasUsedFeature(slug) {
  if (slug === 'ritual' || slug === 'vault' || slug === 'planner') return false;
  var visits = getStudioVisits();
  if (typeof visits[slug] === 'number') return visits[slug] >= 2;
  return getUsedFeatures().indexOf(slug) >= 0;
}

function markFeatureUsed(slug) {
  var visits = getStudioVisits();
  visits[slug] = (visits[slug] || 0) + 1;
  try { localStorage.setItem('koo_studio_visits', JSON.stringify(visits)); } catch(e){}
  var used = getUsedFeatures();
  if (used.indexOf(slug) < 0) {
    used.push(slug);
    try { localStorage.setItem('koo_used_features', JSON.stringify(used)); } catch(e){}
  }
}

function getRemainingTries() {
  var usedCount = ALL_TOOL_SLUGS.filter(function(s){
    return hasUsedFeature(s);
  }).length;
  var left = ALL_TOOL_SLUGS.length - usedCount;
  return left > 0 ? left : 0;
}

function getStripeUrl(overrideEmail) {
  var url = STRIPE_BASE;
  var params = [];
  var emailVal = overrideEmail || (currentUser && currentUser.email) || '';
  if (emailVal) params.push('prefilled_email=' + encodeURIComponent(emailVal));
  if (currentUser && currentUser.id) params.push('client_reference_id=' + encodeURIComponent(currentUser.id));
  if (params.length) {
    url += (url.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
  }
  return url;
}

function updateNavAuth() {
  var as = document.getElementById('auth-slot');
  var mma = document.getElementById('mm-auth');
  var pro = isProUser();
  var triesLeft = getRemainingTries();
  var priceLabel = formatPrice(6);
  var loginLabel = t('nav.login', 'Log in');

  var statusBadge = '';
  if (pro) {
    statusBadge = '<span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold text-xs whitespace-nowrap">⭐ Pro</span>';
  } else {
    statusBadge = '<span class="px-2 py-0.5 rounded-full text-xs whitespace-nowrap hidden sm:inline-block" style="background:rgba(243,226,179,0.2);color:#b76e79;border:1px solid rgba(183,110,121,0.25)">🎁 ' + triesLeft + '/' + ALL_TOOL_SLUGS.length + ' Free Tries</span>';
  }

  var html = '';
  var mHtml = '';

  if (currentUser) {
    var email = currentUser.email || 'Member';
    var shortEmail = email.length > 12 ? email.slice(0, 9) + '...' : email;
    html = statusBadge +
           '<button id="nav-btn-profile" class="btn btn-ghost text-xs py-1.5 px-2.5 whitespace-nowrap flex items-center gap-1" title="View Profile">' +
           '<span>' + shortEmail + '</span></button>' +
           (!pro ? '<button id="nav-btn-pro" class="btn btn-gold text-xs py-1.5 px-2.5 whitespace-nowrap">Upgrade (' + priceLabel + ')</button>' : '');
    
    mHtml = '<div class="flex items-center justify-between text-xs py-1">' +
            '<button id="m-btn-profile" class="text-left font-medium gt">' + email + '</button>' +
            '<button id="m-btn-logout" class="text-red-400">Log out</button>' +
            '</div>' +
            (!pro ? 
              '<div class="flex items-center justify-between gap-2 mt-2">' +
              '<span class="text-xs muted">🎁 ' + triesLeft + '/' + ALL_TOOL_SLUGS.length + ' Free Tries</span>' +
              '<button id="m-nav-btn-pro" class="btn btn-gold text-xs py-1.5 px-3">Upgrade (' + priceLabel + '/mo)</button>' +
              '</div>' 
              : '<span class="chip text-xs mt-1">⭐ Pro Member Active</span>');
  } else {
    html = statusBadge +
           '<button id="nav-btn-pro" class="btn btn-gold text-xs py-1.5 px-2.5 whitespace-nowrap">Pro ' + priceLabel + '</button>' +
           '<button id="btn-login" class="btn btn-ghost text-xs py-1.5 px-2.5 whitespace-nowrap">' + loginLabel + '</button>';

    mHtml = '<div class="flex items-center justify-between gap-2">' +
            '<button id="m-btn-login" class="btn btn-ghost flex-1 py-1.5 text-xs">' + loginLabel + '</button>' +
            '<button id="m-nav-btn-pro" class="btn btn-gold flex-1 text-center py-1.5 text-xs">Pro ' + priceLabel + '/mo</button>' +
            '</div>' +
            '<p class="text-xs muted text-center mt-2">🎁 ' + triesLeft + '/' + ALL_TOOL_SLUGS.length + ' Free Tries Remaining</p>';
  }

  if (as) as.innerHTML = html;
  if (mma) mma.innerHTML = mHtml;

  var bProf = document.getElementById('nav-btn-profile'); if (bProf) bProf.onclick = openProfileModal;
  var mbProf = document.getElementById('m-btn-profile'); if (mbProf) mbProf.onclick = openProfileModal;
  var bPro = document.getElementById('nav-btn-pro'); if (bPro) bPro.onclick = function(){ openProModal(false); };
  var mbPro = document.getElementById('m-nav-btn-pro'); if (mbPro) mbPro.onclick = function(){ openProModal(false); };
  var bLog = document.getElementById('btn-login'); if (bLog) bLog.onclick = function(){ authMode='login'; openAuthModal(); };
  var mbLog = document.getElementById('m-btn-login'); if (mbLog) mbLog.onclick = function(){ authMode='login'; openAuthModal(); };
  var mbOut = document.getElementById('m-btn-logout'); if (mbOut) mbOut.onclick = logoutUser;
}

function showToast(msg, isError) {
  var old = document.getElementById('mcgee-toast');
  if (old) old.remove();
  var el = document.createElement('div');
  el.id = 'mcgee-toast';
  el.setAttribute('role', 'status');
  el.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:100002;max-width:24rem;padding:.9rem 1.25rem;border-radius:1rem;box-shadow:0 20px 40px rgba(0,0,0,0.4);border:1px solid ' + (isError ? 'rgba(239,68,68,0.5)' : 'rgba(243,226,179,0.4)') + ';';
  el.className = 'glass fade text-sm flex items-center justify-between gap-3';
  el.innerHTML = '<span>' + msg + '</span><button type="button" onclick="this.parentElement.remove()" class="muted hover:text-white text-xs shrink-0" aria-label="Dismiss">✕</button>';
  document.body.appendChild(el);
  setTimeout(function(){ if (el && el.parentElement) el.remove(); }, 6000);
}
window.showMcGeeToast = showToast;

// Global specular spotlight tracking for .glow cards
document.addEventListener('pointermove', function(e) {
  var card = e.target && e.target.closest ? e.target.closest('.glow') : null;
  if (!card) return;
  var r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

// STRIPE RETURN HANDLING: Refetches DB subscription, fires deduped Meta Purchase conversion
async function handleStripeSuccess() {
  if (location.search.indexOf('payment=success') >= 0) {
    try {
      if (!sessionStorage.getItem('mcgee_purchase_tracked')) {
        sessionStorage.setItem('mcgee_purchase_tracked', '1');
        var curCfg = CURRENCIES[currentLocale.currency] || CURRENCIES.USD;
        trackMcGeeEvent('Purchase', {
          value: Number((6 * curCfg.rate).toFixed(2)),
          currency: currentLocale.currency || 'USD',
          content_name: 'McGee Jewelry Pro Monthly'
        });
      }
      var url = new URL(window.location);
      url.searchParams.delete('payment');
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
    } catch(e){}

    var attempts = 0;
    var maxAttempts = 3;
    var confirmed = false;

    while (attempts < maxAttempts) {
      attempts++;
      confirmed = await refreshProStatus();
      if (confirmed) break;
      await new Promise(function(r){ setTimeout(r, 1500); });
    }

    if (confirmed) {
      showToast('🎉 Payment confirmed! Your McGee Jewelry Pro membership is now active.');
    } else {
      showToast('Payment received! Your subscription is activating in Stripe — refresh in a few moments.');
    }

    updateNavAuth();
    var m = document.getElementById('mcgee-pro-modal');
    if (m) m.remove();
  }
}

/* ---------- LOCAL-TO-CLOUD MIGRATION HELPER (Runs once per user on login) ---------- */
var __syncInFlight = false;
async function syncLocalToCloud(user) {
  if (!user || !sb || __syncInFlight) return;
  var migrationKey = 'koo_migrated_' + user.id;
  if (localStorage.getItem(migrationKey) === 'true') return;

  var vaultData = [];
  var planData = {};
  var wearData = [];
  var wishData = [];
  try { vaultData = JSON.parse(localStorage.getItem('koo_jewelry_vault')) || []; } catch(e){}
  try { planData = JSON.parse(localStorage.getItem('koo_weekly_plan')) || {}; } catch(e){}
  try { wearData = JSON.parse(localStorage.getItem('koo_wear_history')) || []; } catch(e){}
  try { wishData = JSON.parse(localStorage.getItem('koo_wishlist')) || []; } catch(e){}

  var guestPieces = vaultData.filter(function(p){ return p && !p.id; });
  var guestWears = wearData.filter(function(w){ return w && !w.id; });
  var planDays = Object.keys(planData || {});

  if (!guestPieces.length && !planDays.length && !guestWears.length && !wishData.length) {
    try { localStorage.setItem(migrationKey, 'true'); } catch(e){}
    return;
  }

  __syncInFlight = true;
  var migratedAny = false;

  try {
    if (guestPieces.length > 0) {
      var existingPiecesRes = await sb.from('pieces').select('id').eq('user_id', user.id);
      var existingPieceCount = (!existingPiecesRes.error && existingPiecesRes.data) ? existingPiecesRes.data.length : 0;
      var pieceQuota = window.__isPro ? guestPieces.length : Math.max(0, 2 - existingPieceCount);
      var piecesToInsert = guestPieces.slice(0, pieceQuota).map(function(p){
        return {
          user_id: user.id,
          name: p.name || 'Fine Jewelry',
          category: p.cat || 'Other',
          karat: p.karat || '14k',
          weight_g: parseFloat(p.weight) || 0,
          paid_price: parseFloat(p.price) || 0,
          notes: p.notes || ''
        };
      });
      if (piecesToInsert.length > 0) {
        var insP = await sb.from('pieces').insert(piecesToInsert);
        if (!insP.error) migratedAny = true;
      }
    }

    if (planDays.length > 0) {
      var existingPlanRes = await sb.from('weekly_plan').select('day').eq('user_id', user.id);
      var existingDays = (!existingPlanRes.error && existingPlanRes.data) ? existingPlanRes.data.map(function(r){ return r.day; }) : [];
      for (var i = 0; i < planDays.length; i++) {
        var day = planDays[i];
        if (!window.__isPro && ['Monday', 'Tuesday'].indexOf(day) < 0) continue;
        if (existingDays.indexOf(day) >= 0) continue;
        var upRes = await sb.from('weekly_plan').upsert({
          user_id: user.id,
          day: day,
          piece_ids: [planData[day]]
        }, { onConflict: 'user_id,day' });
        if (!upRes.error) migratedAny = true;
      }
    }

    if (guestWears.length > 0) {
      var existingWearRes = await sb.from('wear_log').select('id').eq('user_id', user.id);
      var existingWearCount = (!existingWearRes.error && existingWearRes.data) ? existingWearRes.data.length : 0;
      var wearQuota = window.__isPro ? guestWears.length : Math.max(0, 3 - existingWearCount);
      var wearsToInsert = guestWears.slice(0, wearQuota).map(function(w){
        return {
          user_id: user.id,
          piece_name: w.piece,
          vibe: w.vibe || 'Everyday',
          worn_on: w.date || new Date().toISOString().slice(0,10)
        };
      });
      if (wearsToInsert.length > 0) {
        var insW = await sb.from('wear_log').insert(wearsToInsert);
        if (!insW.error) migratedAny = true;
      }
    }

    if (wishData.length > 0) {
      var existingWishRes = await sb.from('wishlist').select('item').eq('user_id', user.id);
      var existingIds = {};
      if (!existingWishRes.error && existingWishRes.data) {
        existingWishRes.data.forEach(function(r){
          if (r.item && r.item.id) existingIds[r.item.id] = true;
        });
      }
      var wishToInsert = wishData
        .filter(function(it){ return it && it.id && !existingIds[it.id]; })
        .map(function(it){ return { user_id: user.id, item: it }; });
      if (wishToInsert.length > 0) {
        var insWish = await sb.from('wishlist').insert(wishToInsert);
        if (!insWish.error) migratedAny = true;
      }
    }

    try { localStorage.setItem(migrationKey, 'true'); } catch(e){}
    if (migratedAny) {
      showToast('✨ Local items synced to your cloud account!');
    }
  } catch(err) {
    console.warn('Migration notice:', err);
  } finally {
    __syncInFlight = false;
  }
}

/* ---------- USER PROFILE & BILLING MODAL ---------- */
function openProfileModal() {
  if (!currentUser) return;
  var old = document.getElementById('mcgee-profile-dialog');
  if (old) old.remove();

  var pro = isProUser();
  var triesLeft = getRemainingTries();
  var email = currentUser.email || 'Member';
  var joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Active';
  var savedCount = KOO.get().length;
  var priceLabel = formatPrice(6);

  var dlg = document.createElement('div');
  dlg.id = 'mcgee-profile-dialog';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(18,10,14,0.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1.25rem;overflow-y:auto;';

  dlg.innerHTML = '<div class="glass glow p-6 md:p-8 rounded-3xl max-w-lg w-full relative my-auto" style="box-shadow:0 30px 60px rgba(0,0,0,0.5);border:1px solid rgba(243,226,179,0.25)">' +
                  '<button id="prof-close" style="position:absolute;top:1.2rem;right:1.2rem;width:2rem;height:2rem;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer" class="muted hover:text-white">✕</button>' +
                  '<div class="flex items-center gap-3">' +
                  '<div style="width:3.2rem;height:3.2rem;border-radius:50%;background:linear-gradient(135deg,#f3e2b3,#b76e79);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:bold;color:#3b1a22">' +
                  email.charAt(0).toUpperCase() + '</div>' +
                  '<div>' +
                  '<h2 class="serif text-2xl gt leading-tight">' + email + '</h2>' +
                  '<p class="muted text-xs">Member since ' + joinDate + '</p>' +
                  '</div></div>' +
                  '<div class="mt-6 p-4 rounded-2xl" style="background:rgba(255,255,255,0.04);border:1px solid rgba(243,226,179,0.15)">' +
                  '<div class="flex items-center justify-between">' +
                  '<div><span class="muted text-xs uppercase tracking-wider">Current Plan</span>' +
                  '<h3 class="serif text-2xl ' + (pro ? 'gt' : '') + '">' + (pro ? 'Pro Member ⭐' : 'Free Visitor') + '</h3></div>' +
                  '<span class="chip" style="font-size:0.75rem;padding:0.25rem 0.75rem;' + (pro ? 'background:rgba(243,226,179,0.2);color:#f3e2b3;border-color:#b76e79' : '') + '">' +
                  (pro ? priceLabel + ' / month' : triesLeft + '/' + ALL_TOOL_SLUGS.length + ' Free Tries Left') + '</span>' +
                  '</div>' +
                  (pro ? 
                    '<p class="muted text-xs mt-2">Unlimited access to all jewelry tools, lookbook planner, and gold tracker.</p>' +
                    '<div class="mt-4 pt-3 border-t border-rose-200/10 flex flex-col gap-2">' +
                    '<a href="' + STRIPE_PORTAL + '" target="_blank" rel="noopener" class="btn btn-ghost text-xs text-center w-full flex items-center justify-center gap-2">' +
                    '<span>Manage Billing & Invoices</span> &rarr;</a>' +
                    '<a href="' + STRIPE_PORTAL + '" target="_blank" rel="noopener" class="text-xs text-red-300 hover:text-red-400 text-center mt-1 underline">Cancel subscription in Stripe Portal</a>' +
                    '</div>'
                    :
                    '<p class="muted text-xs mt-2">You have ' + triesLeft + ' free studio tries left. Upgrade to unlock all features permanently.</p>' +
                    '<button id="prof-btn-upgrade" class="btn btn-gold w-full mt-3 text-sm">Upgrade to Pro (' + priceLabel + '/month)</button>'
                  ) +
                  '</div>' +
                  '<div class="mt-4 p-4 rounded-2xl flex items-center justify-between" style="background:rgba(255,255,255,0.02);border:1px solid rgba(243,226,179,0.08)">' +
                  '<div><span class="muted text-xs">Saved in Wishlist</span>' +
                  '<p class="text-sm font-semibold">' + savedCount + ' jewelry items</p></div>' +
                  '<a href="wishlist.html" class="btn btn-ghost text-xs" style="padding:.35rem .75rem">View Wishlist</a>' +
                  '</div>' +
                  '<div class="mt-6 flex items-center justify-between pt-4 border-t border-rose-200/10">' +
                  '<button id="prof-btn-logout" class="text-red-400 text-xs hover:underline">Log out of this device</button>' +
                  '<button id="prof-btn-done" class="btn btn-ghost text-xs" style="padding:.35rem .9rem">Done</button>' +
                  '</div>' +
                  '</div>';

  document.body.appendChild(dlg);

  var cl = document.getElementById('prof-close'); if (cl) cl.onclick = function(){ dlg.remove(); };
  var dn = document.getElementById('prof-btn-done'); if (dn) dn.onclick = function(){ dlg.remove(); };
  var lo = document.getElementById('prof-btn-logout'); if (lo) lo.onclick = logoutUser;
  var up = document.getElementById('prof-btn-upgrade'); if (up) up.onclick = function(){ dlg.remove(); openProModal(false); };
  dlg.onclick = function(e){ if (e.target === dlg) dlg.remove(); };
}

/* ---------- STYLISH PRO SUBSCRIPTION MODAL ---------- */
function openProModal(isPageLock) {
  if (isProUser()) return;
  var old = document.getElementById('mcgee-pro-modal');
  if (old) old.remove();

  var priceLabel = formatPrice(6);
  var dailyLabel = formatPrice(0.20);

  var features = [
    { icon: '✨', t: 'Daily 10s Stylist & Tarnish Alerts', d: 'Morning neckline stack guide, care rules & wear streak tracker' },
    { icon: '👑', t: 'Unlimited Jewelry Box & Cloud Vault', d: 'Encrypted photos, live 10k–24k melt value & insurance PDFs' },
    { icon: '🗓️', t: '7-Day Lookbook & Cost-Per-Wear', d: 'Sunday reset calendar alerts, CPW analytics & cleaning radar' },
    { icon: '💌', t: 'Partner Size & Gift Passport', d: 'Save US/UK/EU ring & wrist sizes and share gift hints in 1 tap' },
    { icon: '💍', t: 'All 14 Fine Jewelry Studios', d: 'Ring sizer, diamond carat scale, layering & gold calculator' },
    { icon: '🧿', t: 'Beading Board & Pattern Designer', d: 'Millimeter bracelet blueprints, bead counts & BOM CSV export' }
  ];

  var featHtml = features.map(function(f){
    return '<div class="flex items-start gap-3 p-2.5 rounded-xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(243,226,179,0.1)">' +
           '<span class="text-xl shrink-0">' + f.icon + '</span>' +
           '<div class="text-left"><p class="text-sm font-medium gt leading-tight">' + f.t + '</p><p class="muted text-xs mt-0.5 leading-snug">' + f.d + '</p></div>' +
           '</div>';
  }).join('');

  var emailCaptureHtml = currentUser ? '' : (
    '<label class="fld text-left w-full mb-1" style="margin-top:0">' +
    '<span class="text-xs muted">Your email (recommended so Stripe activates your account instantly)</span>' +
    '<input id="pro-checkout-email" type="email" placeholder="you@example.com" class="w-full text-sm">' +
    '</label>'
  );

  var m = document.createElement('div');
  m.id = 'mcgee-pro-modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(18,10,14,0.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.25rem;overflow-y:auto;';
  
  m.innerHTML = '<div class="glass glow p-6 md:p-8 rounded-3xl max-w-2xl w-full relative my-auto" style="box-shadow:0 30px 60px rgba(0,0,0,0.5);border:1px solid rgba(243,226,179,0.25)">' +
                '<button id="pro-close" style="position:absolute;top:1.2rem;right:1.2rem;width:2rem;height:2rem;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer" class="muted hover:text-white" aria-label="Close">✕</button>' +
                
                '<div class="text-center">' +
                '<span class="chip" style="font-size:0.75rem;padding:0.25rem 0.9rem;background:rgba(243,226,179,0.15);border-color:#b76e79;color:#f3e2b3">' + t('pro.badge', '✨ MCGEE JEWELRY PRO') + '</span>' +
                '<h2 class="serif text-3xl md:text-5xl gt mt-3">' + (isPageLock ? t('pro.title_lock', 'Free Preview Used — Keep Going with Pro') : t('pro.title_unlock', 'Unlock Your Daily Jewelry Concierge')) + '</h2>' +
                '<p class="muted text-sm md:text-base mt-2 max-w-lg mx-auto">' +
                'Just <b class="gt">' + dailyLabel + '/day</b> (<b class="gt">' + priceLabel + '/month</b>) &mdash; less than a single tarnish polish, for unlimited cloud vault, daily look check-ins, and all ' + ALL_TOOL_SLUGS.length + ' studios.' +
                '</p>' +
                '</div>' +

                '<div class="grid sm:grid-cols-2 gap-2.5 mt-5 max-h-[38vh] overflow-y-auto pr-1">' +
                featHtml +
                '</div>' +

                '<div class="mt-5 flex flex-col gap-2.5 items-center">' +
                emailCaptureHtml +
                '<a id="pro-checkout-link" href="' + getStripeUrl() + '" class="btn btn-gold w-full text-center py-3.5 text-base md:text-lg font-medium shadow-lg" style="letter-spacing:0.02em">' +
                'Continue to Secure Checkout &nbsp;&rarr;&nbsp; ' + priceLabel + '/mo' +
                '</a>' +
                '<p class="muted text-xs mt-0.5 text-center">' + t('pro.cancel', 'Instant activation via Stripe · Local currency checkout · Cancel in 1 click') + '</p>' +
                '</div>' +

                '<div class="text-center mt-3 pt-3 border-t border-rose-200/10">' +
                '<button id="pro-modal-login" class="text-xs muted hover:underline">Already subscribed? <b class="gt">Log in to your account</b></button>' +
                '</div>' +
                '</div>';

  document.body.appendChild(m);

  var emailInput = document.getElementById('pro-checkout-email');
  var checkoutLink = document.getElementById('pro-checkout-link');
  if (emailInput && checkoutLink) {
    emailInput.oninput = function(){
      checkoutLink.href = getStripeUrl(emailInput.value.trim());
    };
  }
  if (checkoutLink) {
    checkoutLink.onclick = function(){
      var curCfg = CURRENCIES[currentLocale.currency] || CURRENCIES.USD;
      trackMcGeeEvent('InitiateCheckout', {
        value: Number((6 * curCfg.rate).toFixed(2)),
        currency: currentLocale.currency || 'USD',
        content_name: 'McGee Jewelry Pro Monthly'
      });
    };
  }

  var cl = document.getElementById('pro-close');
  if (cl) {
    cl.onclick = function(){
      m.remove();
      if (isPageLock) { window.location.href = 'index.html'; }
    };
  }
  var pl = document.getElementById('pro-modal-login');
  if (pl) {
    pl.onclick = function(){
      m.remove();
      authMode='login';
      openAuthModal();
    };
  }
  m.onclick = function(e){
    if (e.target === m) {
      m.remove();
      if (isPageLock) { window.location.href = 'index.html'; }
    }
  };
}
window.openProModal = openProModal;

/* ---------- DIRECT URL & PAGE-LOAD PAYWALL CHECK ---------- */
function checkDirectPagePaywall() {
  if (!isToolPage) return;
  if (isProUser()) return;
  if (cleanSlug === 'ritual' || cleanSlug === 'vault' || cleanSlug === 'planner') return;

  var activeSessionKey = 'koo_active_session_' + cleanSlug;
  if (sessionStorage.getItem(activeSessionKey) === '1') {
    return;
  }

  var visits = getStudioVisits();
  var curCount = visits[cleanSlug] || 0;
  if (curCount < 2) {
    markFeatureUsed(cleanSlug);
    sessionStorage.setItem(activeSessionKey, '1');
    updateNavAuth();
    showFreeTryBanner(cleanSlug, 2 - (curCount + 1));
    return;
  }

  openProModal(true);
}

function showFreeTryBanner(slug, leftAfterThis) {
  var b = document.createElement('div');
  b.style.cssText = 'position:fixed;top:4.5rem;left:50%;transform:translateX(-50%);z-index:9999;max-width:90%;width:520px;padding:.6rem 1.2rem;border-radius:999px;font-size:.78rem;box-shadow:0 10px 25px rgba(0,0,0,0.18);';
  b.className = 'glass glow flex items-center justify-between gap-3 text-center';
  b.innerHTML = '<span>🎁 <b>Free Preview Active</b> (' + (leftAfterThis > 0 ? leftAfterThis + ' free visit left here' : 'last free preview for this studio') + ')</span>' +
                '<button onclick="this.parentElement.remove()" class="text-xs muted hover:text-white" style="cursor:pointer">✕</button>';
  document.body.appendChild(b);
  setTimeout(function(){ if(b) b.remove(); }, 5500);
}

/* ---------- Global Click Interceptor for Tool Links (Value-First: Homepage Widgets Always Free) ---------- */
document.addEventListener('click', function(e) {
  if (isProUser()) return;

  var a = e.target.closest('a');
  if (a && a.href) {
    var href = a.getAttribute('href') || '';
    for (var i = 0; i < ALL_TOOL_SLUGS.length; i++) {
      var s = ALL_TOOL_SLUGS[i];
      if (href === s || href === s + '.html' || href === '/' + s || href.indexOf('/' + s + '.html') >= 0) {
        if (!hasUsedFeature(s)) {
          return;
        }
        e.preventDefault();
        openProModal(false);
        return;
      }
    }
  }
}, true);

/* ---------- Auth Modal (Email + Password + Forgot/Recovery + Switch) ---------- */
function openAuthModal() {
  var old = document.getElementById('mcgee-auth-dialog');
  if (old) old.remove();

  var isSignUp = authMode === 'signup';
  var isForgot = authMode === 'forgot';
  var isRecovery = authMode === 'recovery';

  var heading = isRecovery ? 'Set a new password' : (isForgot ? 'Reset your password' : (isSignUp ? 'Create your account' : 'Welcome back'));
  var sub = isRecovery
    ? 'Enter a new password (at least 6 characters) for your McGee Jewelry account.'
    : (isForgot
      ? 'Enter your email address and we will send you a password reset link.'
      : (isSignUp ? 'Instant free access — save your vault, planner, and wishlist across devices.' : 'Log in to access your McGee Jewelry tools.'));

  var dlg = document.createElement('div');
  dlg.id = 'mcgee-auth-dialog';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(20,10,15,0.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1rem;';

  var oauthBlock = (isForgot || isRecovery) ? '' : (
    '<button id="btn-oauth-google" type="button" class="btn btn-ghost flex items-center justify-center gap-2 w-full" style="background:rgba(255,255,255,0.08)">' +
    '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/></svg>' +
    'Continue with Google</button>' +
    '<div class="flex items-center my-1"><div class="flex-1 border-t border-rose-200/20"></div><span class="px-3 text-xs muted">OR WITH EMAIL</span><div class="flex-1 border-t border-rose-200/20"></div></div>'
  );

  var formFields = '';
  if (isRecovery) {
    formFields = '<label class="fld text-left"><span>New password</span>' +
      '<input id="auth-password" type="password" autocomplete="new-password" required minlength="6" placeholder="••••••••" class="w-full">' +
      '</label>' +
      '<label class="fld text-left mt-3"><span>Confirm new password</span>' +
      '<input id="auth-password-confirm" type="password" autocomplete="new-password" required minlength="6" placeholder="••••••••" class="w-full">' +
      '</label>' +
      '<button id="btn-auth-submit" type="submit" class="btn btn-gold w-full mt-4">Update Password</button>';
  } else if (isForgot) {
    formFields = '<label class="fld text-left"><span>Email address</span>' +
      '<input id="auth-email" type="email" name="username" autocomplete="username" required placeholder="you@example.com" class="w-full">' +
      '</label>' +
      '<button id="btn-auth-submit" type="submit" class="btn btn-gold w-full mt-4">Send Reset Email</button>';
  } else {
    formFields = '<label class="fld text-left"><span>Email address</span>' +
      '<input id="auth-email" type="email" name="username" autocomplete="username" required placeholder="you@example.com" class="w-full">' +
      '</label>' +
      '<div class="mt-3">' +
      '<div class="flex items-center justify-between mb-1">' +
      '<label for="auth-password" class="text-sm">Password</label>' +
      (!isSignUp ? '<button id="btn-auth-forgot" type="button" class="text-xs underline gt bg-transparent border-0 cursor-pointer">Forgot password?</button>' : '') +
      '</div>' +
      '<label class="fld text-left" style="margin-top:0">' +
      '<input id="auth-password" type="password" name="password" ' + (isSignUp ? 'autocomplete="new-password"' : 'autocomplete="current-password"') + ' required minlength="6" placeholder="••••••••" class="w-full">' +
      '</label>' +
      '</div>' +
      '<button id="btn-auth-submit" type="submit" class="btn btn-gold w-full mt-4">' + (isSignUp ? 'Create Account' : 'Log In') + '</button>';
  }

  var footerHtml = isRecovery ? '' : (
    isForgot
      ? '<div class="text-center mt-3 pt-3 border-t border-rose-200/10 text-xs">' +
        '<button id="btn-auth-switch" type="button" class="underline gt font-semibold">&larr; Back to Log in</button>' +
        '</div>'
      : '<div class="text-center mt-3 pt-3 border-t border-rose-200/10 text-xs">' +
        '<span id="auth-switch-text" class="muted">' + (isSignUp ? 'Already have an account?' : 'New to McGee Jewelry?') + '</span> ' +
        '<button id="btn-auth-switch" type="button" class="underline gt font-semibold">' + (isSignUp ? 'Log in' : 'Create an account') + '</button>' +
        '</div>'
  );

  dlg.innerHTML = '<div class="glass p-6 md:p-8 rounded-2xl max-w-md w-full relative" style="box-shadow:0 25px 50px rgba(0,0,0,0.4)">' +
                  '<button id="auth-close" style="position:absolute;top:1rem;right:1rem;font-size:1.2rem;cursor:pointer" class="muted">✕</button>' +
                  '<h2 id="auth-heading" class="serif text-3xl gt text-center">' + heading + '</h2>' +
                  '<p id="auth-sub" class="muted text-sm text-center mt-1">' + sub + '</p>' +
                  '<div class="mt-5 flex flex-col gap-3">' +
                  oauthBlock +
                  '<form id="auth-form" autocomplete="on">' + formFields + '</form>' +
                  '<p id="auth-status" class="text-xs text-center mt-2 muted"></p>' +
                  footerHtml +
                  '</div>' +
                  '</div>';
  document.body.appendChild(dlg);

  var cl = document.getElementById('auth-close'); if (cl) cl.onclick = function(){ dlg.remove(); };
  var bg = document.getElementById('btn-oauth-google'); if (bg) bg.onclick = loginWithGoogle;
  var fg = document.getElementById('btn-auth-forgot'); if (fg) fg.onclick = function(){ authMode = 'forgot'; openAuthModal(); };
  var sw = document.getElementById('btn-auth-switch'); if (sw) sw.onclick = toggleAuthMode;
  var form = document.getElementById('auth-form'); if (form) form.onsubmit = handleFormSubmit;
}

function toggleAuthMode() {
  if (authMode === 'forgot') {
    authMode = 'login';
  } else {
    authMode = authMode === 'signup' ? 'login' : 'signup';
  }
  openAuthModal();
}

function handleFormSubmit(e) {
  e.preventDefault();
  var em = document.getElementById('auth-email');
  var pw = document.getElementById('auth-password');
  var pwc = document.getElementById('auth-password-confirm');
  var st = document.getElementById('auth-status');
  var btn = document.getElementById('btn-auth-submit');

  if (!st) return;
  if (!sb) {
    st.textContent = 'Connecting to database, please wait a moment...';
    return;
  }

  if (authMode === 'recovery') {
    var newPass = pw ? pw.value : '';
    var confirmPass = pwc ? pwc.value : '';
    if (newPass.length < 6) {
      st.textContent = 'Password must be at least 6 characters.';
      st.style.color = '#ef4444';
      return;
    }
    if (newPass !== confirmPass) {
      st.textContent = 'Passwords do not match.';
      st.style.color = '#ef4444';
      return;
    }
    btn.disabled = true;
    st.textContent = 'Updating password...';
    st.style.color = '';
    sb.auth.updateUser({ password: newPass }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else {
        st.textContent = 'Password updated! You are signed in.';
        st.style.color = '#10b981';
        setTimeout(function(){
          var dlg = document.getElementById('mcgee-auth-dialog');
          if (dlg) dlg.remove();
          showToast('🔒 Password updated successfully!');
        }, 700);
      }
    }).catch(function(err){
      btn.disabled = false;
      st.textContent = err.message;
      st.style.color = '#ef4444';
    });
    return;
  }

  var email = em ? em.value.trim() : '';
  if (!email) {
    st.textContent = 'Please enter your email address.';
    st.style.color = '#ef4444';
    return;
  }

  if (authMode === 'forgot') {
    btn.disabled = true;
    st.textContent = 'Sending reset email...';
    st.style.color = '';
    sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else {
        st.textContent = 'Password reset link sent! Check your email inbox and spam folder.';
        st.style.color = '#10b981';
      }
    }).catch(function(err){
      btn.disabled = false;
      st.textContent = err.message;
      st.style.color = '#ef4444';
    });
    return;
  }

  var password = pw ? pw.value.trim() : '';
  if (!password) {
    st.textContent = 'Please enter both email and password.';
    st.style.color = '#ef4444';
    return;
  }
  if (password.length < 6) {
    st.textContent = 'Password must be at least 6 characters.';
    st.style.color = '#ef4444';
    return;
  }

  btn.disabled = true;
  st.textContent = authMode === 'signup' ? 'Creating your account...' : 'Logging in...';
  st.style.color = '';

  if (authMode === 'signup') {
    var attr = getSavedAttribution();
    var tzCountry = '';
    try { tzCountry = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
    sb.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          currency: currentLocale.currency,
          language: currentLocale.lang,
          utm_source: attr.utm_source || '',
          utm_medium: attr.utm_medium || '',
          utm_campaign: attr.utm_campaign || '',
          utm_content: attr.utm_content || '',
          country_hint: tzCountry
        }
      }
    }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else if (res.data && res.data.session) {
        trackMcGeeEvent('CompleteRegistration', { currency: currentLocale.currency || 'USD', status: 'instant' });
        st.textContent = 'Welcome! Signing you in...';
        st.style.color = '#10b981';
        setTimeout(function(){
          var dlg = document.getElementById('mcgee-auth-dialog');
          if (dlg) dlg.remove();
          showToast('✨ Welcome to McGee Jewelry! Your account is ready.');
        }, 450);
      } else if (res.data && res.data.user && Array.isArray(res.data.user.identities) && res.data.user.identities.length === 0) {
        st.textContent = 'An account with this email already exists. Please log in instead.';
        st.style.color = '#f59e0b';
      } else {
        st.innerHTML = 'Account created! Check your email inbox to confirm (or disable "Confirm email" in Supabase for instant entry).';
        st.style.color = '#10b981';
      }
    }).catch(function(err){
      btn.disabled = false;
      st.textContent = err.message;
      st.style.color = '#ef4444';
    });
  } else {
    sb.auth.signInWithPassword({ email: email, password: password }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        var msg = res.error.message || 'Login failed.';
        if (/not confirmed/i.test(msg)) {
          st.innerHTML = 'Please confirm your email address first (check inbox/spam). <button type="button" id="btn-resend-confirm" class="underline gt font-semibold ml-1">Resend email</button>';
          st.style.color = '#f59e0b';
          var resendBtn = document.getElementById('btn-resend-confirm');
          if (resendBtn) {
            resendBtn.onclick = function(){
              resendBtn.disabled = true;
              sb.auth.resend({
                type: 'signup',
                email: email,
                options: { emailRedirectTo: window.location.origin }
              }).then(function(r){
                if (r.error) {
                  st.textContent = r.error.message;
                  st.style.color = '#ef4444';
                } else {
                  st.textContent = 'Confirmation email resent! Check your inbox and spam folder.';
                  st.style.color = '#10b981';
                }
              });
            };
          }
        } else {
          st.textContent = msg;
          st.style.color = '#ef4444';
        }
      } else {
        st.textContent = 'Logged in successfully!';
        st.style.color = '#10b981';
        setTimeout(function(){
          var dlg = document.getElementById('mcgee-auth-dialog');
          if (dlg) dlg.remove();
          showToast('✨ Signed in to McGee Jewelry.');
        }, 450);
      }
    }).catch(function(err){
      btn.disabled = false;
      st.textContent = err.message;
      st.style.color = '#ef4444';
    });
  }
}

function loginWithGoogle() {
  var st = document.getElementById('auth-status');
  if (!sb) {
    if (st) { st.textContent = 'Connecting to login service...'; st.style.color = '#f59e0b'; }
    else showToast('Connecting to login service...', true);
    return;
  }
  var inIframe = false;
  try { inIframe = window.self !== window.top; } catch(e) { inIframe = true; }
  if (inIframe) {
    var msg = 'Google sign-in requires opening this page in a full browser tab. You can also sign up with Email & Password here.';
    if (st) { st.textContent = msg; st.style.color = '#f59e0b'; }
    else showToast(msg, true);
    return;
  }
  sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  }).then(function(res){
    if (res && res.error) {
      if (st) { st.textContent = res.error.message; st.style.color = '#ef4444'; }
      else showToast('Google login error: ' + res.error.message, true);
    }
  }).catch(function(err){
    if (st) { st.textContent = err.message; st.style.color = '#ef4444'; }
    else showToast('Google login error: ' + err.message, true);
  });
}

async function logoutUser() {
  try {
    if (sb) await sb.auth.signOut();
  } catch(e){}
  currentUser = null;
  window.currentUser = null;
  window.__isPro = false;
  window.__isAdmin = false;
  try {
    localStorage.removeItem('koo_jewelry_vault');
    localStorage.removeItem('koo_weekly_plan');
    localStorage.removeItem('koo_wear_history');
    localStorage.removeItem('koo_wishlist');
    localStorage.removeItem('koo_pro_active');
  } catch(e){}
  updateNavAuth();
  location.reload();
}

function notifyAuthReady() {
  window.__mcgeeAuthReady = true;
  try {
    window.dispatchEvent(new CustomEvent('mcgee:auth-ready', {
      detail: { user: currentUser, isPro: !!window.__isPro }
    }));
  } catch(e){}
}

async function loadRemoteSiteConfig() {
  if (!sb) return;
  try {
    var res = await sb.from('site_config').select('key, value');
    if (!res.error && Array.isArray(res.data)) {
      res.data.forEach(function(row){
        if (row && row.key) window.__mcgeeSiteConfig[row.key] = row.value;
      });
      try { localStorage.setItem('mcgee_site_config', JSON.stringify(window.__mcgeeSiteConfig)); } catch(e){}
      if (window.__mcgeeSiteConfig.meta_pixel_id) {
        bootMetaPixel(window.__mcgeeSiteConfig.meta_pixel_id);
      }
      window.dispatchEvent(new CustomEvent('mcgee:config-ready', { detail: window.__mcgeeSiteConfig }));
    }
  } catch(e){}
}

async function syncUserProfileLocale(user) {
  if (!user || !sb) return;
  try {
    var attr = getSavedAttribution();
    var tzCountry = '';
    try { tzCountry = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
    var payload = {
      user_id: user.id,
      currency: currentLocale.currency,
      language: currentLocale.lang,
      country_hint: tzCountry,
      updated_at: new Date().toISOString()
    };
    if (attr.utm_source) payload.utm_source = attr.utm_source;
    if (attr.utm_medium) payload.utm_medium = attr.utm_medium;
    if (attr.utm_campaign) payload.utm_campaign = attr.utm_campaign;
    if (attr.utm_content) payload.utm_content = attr.utm_content;
    await sb.from('profiles').upsert(payload, { onConflict: 'user_id' });
  } catch(e){}
}

window.initMcGeeAuth = async function() {
  if (!window.supabase) return;
  sb = window.supabase.createClient(SB_URL, SB_KEY);
  window.sb = sb;

  var isRecoveryUrl = (window.location.hash || '').indexOf('type=recovery') >= 0;
  await loadRemoteSiteConfig();

  if (isToolPage) {
    trackMcGeeEvent('ViewContent', { content_name: cleanSlug, content_category: 'Jewelry Studio' });
  }

  try {
    var res = await sb.auth.getSession();
    if (res.data && res.data.session) {
      currentUser = res.data.session.user;
      window.currentUser = currentUser;
      await refreshProStatus();
      await syncUserProfileLocale(currentUser);
      await syncLocalToCloud(currentUser);
      await KOO.loadFromCloud();
    }
  } catch(e) {
    console.error('Session retrieval error:', e);
  }

  updateNavAuth();
  applyDocumentLocale();
  handleStripeSuccess();
  checkDirectPagePaywall();
  notifyAuthReady();

  if (isRecoveryUrl) {
    authMode = 'recovery';
    openAuthModal();
  }

  sb.auth.onAuthStateChange(async function(evt, session){
    currentUser = session ? session.user : null;
    window.currentUser = currentUser;
    await refreshProStatus();
    if (currentUser) {
      await syncUserProfileLocale(currentUser);
      await syncLocalToCloud(currentUser);
      await KOO.loadFromCloud();
    }
    updateNavAuth();
    applyDocumentLocale();
    handleStripeSuccess();
    notifyAuthReady();
    if (evt === 'PASSWORD_RECOVERY') {
      authMode = 'recovery';
      openAuthModal();
    }
  });
};

if (window.supabase) window.initMcGeeAuth();
updateNavAuth();
applyDocumentLocale();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyDocumentLocale);
}

setTimeout(function(){
  checkDirectPagePaywall();
}, 800);

})();
