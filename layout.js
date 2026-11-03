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

var PRO_EMAILS = [
  'ibrahimihamid77@gmail.com',
  'said.cpge24@gmail.com'
];

var ALL_TOOL_SLUGS = ['sizing', 'styling', 'care', 'gift', 'layering', 'anniversary', 'gold', 'diamond', 'earrings', 'wishlist', 'vault', 'planner'];

/* ---------- CURRENCIES & MATCHING LANGUAGES ---------- */
var CURRENCIES = {
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
  AUD: { symbol: 'A$', name: 'Australian Dollar (Australia)', rate: 1.52, defaultLang: 'EN' }
};

var LANGUAGES = {
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
  EL: 'Ελληνικά'
};

function detectLocale() {
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem('koo_user_locale')); } catch(e){}
  if (saved && saved.currency && saved.lang) return saved;

  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
  var navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();

  var cur = 'EUR';
  var lang = 'FR';

  if (tz.indexOf('Stockholm') >= 0 || navLang.indexOf('sv') >= 0) {
    cur = 'SEK'; lang = 'SV';
  } else if (tz.indexOf('Oslo') >= 0 || navLang.indexOf('no') >= 0 || navLang.indexOf('nb') >= 0) {
    cur = 'NOK'; lang = 'NO';
  } else if (tz.indexOf('Copenhagen') >= 0 || navLang.indexOf('da') >= 0) {
    cur = 'DKK'; lang = 'DA';
  } else if (tz.indexOf('London') >= 0 || navLang.indexOf('gb') >= 0) {
    cur = 'GBP'; lang = 'EN';
  } else if (tz.indexOf('Zurich') >= 0) {
    cur = 'CHF'; lang = 'FR';
  } else if (tz.indexOf('Berlin') >= 0 || navLang.indexOf('de') >= 0) {
    cur = 'EUR'; lang = 'DE';
  } else if (tz.indexOf('Madrid') >= 0 || navLang.indexOf('es') >= 0) {
    cur = 'EUR'; lang = 'ES';
  } else if (tz.indexOf('Rome') >= 0 || navLang.indexOf('it') >= 0) {
    cur = 'EUR'; lang = 'IT';
  } else if (tz.indexOf('Warsaw') >= 0 || navLang.indexOf('pl') >= 0) {
    cur = 'PLN'; lang = 'PL';
  } else if (tz.indexOf('Prague') >= 0 || navLang.indexOf('cs') >= 0) {
    cur = 'CZK'; lang = 'CS';
  } else if (tz.indexOf('Budapest') >= 0 || navLang.indexOf('hu') >= 0) {
    cur = 'HUF'; lang = 'HU';
  } else if (tz.indexOf('Bucharest') >= 0 || navLang.indexOf('ro') >= 0) {
    cur = 'RON'; lang = 'RO';
  } else if (tz.indexOf('Sofia') >= 0 || navLang.indexOf('bg') >= 0) {
    cur = 'BGN'; lang = 'BG';
  } else if (tz.indexOf('Istanbul') >= 0 || navLang.indexOf('tr') >= 0) {
    cur = 'TRY'; lang = 'TR';
  } else if (tz.indexOf('Kyiv') >= 0 || navLang.indexOf('uk') >= 0) {
    cur = 'UAH'; lang = 'UK';
  } else if (tz.indexOf('Casablanca') >= 0 || navLang.indexOf('ma') >= 0) {
    cur = 'MAD'; lang = navLang.indexOf('ar') >= 0 ? 'AR' : 'FR';
  } else if (tz.indexOf('Dubai') >= 0 || tz.indexOf('Riyadh') >= 0 || navLang.indexOf('ar') >= 0) {
    cur = tz.indexOf('Riyadh') >= 0 ? 'SAR' : 'AED'; lang = 'AR';
  } else if (tz.indexOf('America') >= 0 || navLang.indexOf('us') >= 0) {
    cur = 'USD'; lang = 'EN';
  }

  var detected = { currency: cur, lang: lang };
  try { localStorage.setItem('koo_user_locale', JSON.stringify(detected)); } catch(e){}
  return detected;
}

var currentLocale = detectLocale();

/* ---------- TRANSLATION ENGINE & RTL SETUP ---------- */
function applyTranslation(langCode) {
  var code = (langCode || 'EN').toLowerCase();
  
  // RTL for Arabic
  if (code === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.removeAttribute('dir');
  }

  // Set Google Translate cookie
  var host = location.hostname;
  var rootHost = host.replace(/^www\./, '');
  if (code === 'en') {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + host + "; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + rootHost + "; path=/;";
  } else {
    var cookieVal = "/en/" + code;
    document.cookie = "googtrans=" + cookieVal + "; path=/;";
    document.cookie = "googtrans=" + cookieVal + "; domain=" + host + "; path=/;";
    document.cookie = "googtrans=" + cookieVal + "; domain=." + rootHost + "; path=/;";
  }
}

// Inject Google Translate script & hide its default banner
(function() {
  // Suppress Google Translate default top banner with luxury CSS
  var st = document.createElement('style');
  st.textContent = '.goog-te-banner-frame, .skiptranslate iframe { display:none !important; } body { top:0px !important; } #goog-gt-tt, .goog-te-balloon-frame { display:none !important; } .goog-text-highlight { background:none !important; box-shadow:none !important; }';
  document.head.appendChild(st);

  // Hidden translate element
  var gDiv = document.createElement('div');
  gDiv.id = 'google_translate_element';
  gDiv.style.display = 'none';
  document.body.appendChild(gDiv);

  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      autoDisplay: false
    }, 'google_translate_element');
  };

  var gScript = document.createElement('script');
  gScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  gScript.async = true;
  document.head.appendChild(gScript);

  applyTranslation(currentLocale.lang);
})();

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
                  '<h3 class="serif text-3xl gt mt-2">Currency & Language</h3>' +
                  '<p class="muted text-xs mt-1">Select your preferred currency and language. The website translates instantly.</p>' +
                  '<div class="flex flex-col gap-3 mt-5">' +
                  '<label class="fld text-left"><span>Select Currency</span><select id="loc-sel-cur">' + curOptions + '</select></label>' +
                  '<label class="fld text-left"><span>Website Language</span><select id="loc-sel-lang">' + langOptions + '</select></label>' +
                  '<button id="loc-btn-save" class="btn btn-gold w-full mt-3">Apply & Translate</button>' +
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
      applyTranslation(newLang);
      dlg.remove();
      // Reload to let translation apply cleanly
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
  ['vault.html','Jewelry Box'],
  ['planner.html','Look Planner'],
  ['sizing.html','Size guide'],
  ['styling.html','Metal match'],
  ['care.html','Care'],
  ['gift.html','Gift finder'],
  ['blog.html','Blog'],
  ['wishlist.html','Wishlist'],
  ['layering.html','Layering'],
  ['anniversary.html','Anniversary gifts'],
  ['gold.html','Gold calculator'],
  ['diamond.html','Diamond size'],
  ['earrings.html','Earring finder']
];

var rawPath = location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
var cleanSlug = rawPath.replace(/\.html$/, '');
var here = (cleanSlug || 'index') + '.html';
var isToolPage = ALL_TOOL_SLUGS.indexOf(cleanSlug) >= 0;

var K='koo_wishlist';
var KOO=window.KOO={
  get:function(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}},
  set:function(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}},
  has:function(id){return this.get().some(function(x){return x.id===id})},
  toggle:function(it){var a=this.get();if(a.some(function(x){return x.id===it.id}))a=a.filter(function(x){return x.id!==it.id});else a.push(it);this.set(a);this.sync();return a},
  btn:function(id,label,note){var e=function(s){return String(s||'').replace(/"/g,'&quot;')};return '<button class="save" data-save data-id="'+e(id)+'" data-label="'+e(label)+'" data-note="'+e(note)+'" aria-pressed="false">♡ Save</button>'},
  sync:function(){var n=this.get().length;document.querySelectorAll('[data-count]').forEach(function(e){e.textContent=n;e.hidden=!n});
  document.querySelectorAll('[data-save]').forEach(function(b){var on=KOO.has(b.dataset.id);b.setAttribute('aria-pressed',on);b.textContent=on?'♥ Saved':'♡ Save'})}
};

function lk(p){return '<a class="l whitespace-nowrap" href="'+p[0]+'"'+(p[0]===here?' aria-current="page"':'')+'>'+p[1]+(p[0]==='wishlist.html'?' <span data-count hidden class="ml-1 rounded-full px-1.5 text-xs" style="background:#b76e79;color:#fff"></span>':'')+'</a>'}

var curInfo = CURRENCIES[currentLocale.currency] || CURRENCIES.EUR;
var locBtnHtml = '<button id="nav-locale-btn" class="l whitespace-nowrap flex items-center gap-1 font-medium text-xs py-1 px-2.5 rounded-full" style="cursor:pointer;color:#b76e79;background:rgba(243,226,179,0.15);border:1px solid rgba(183,110,121,0.25)" title="Change Currency & Language"><span>📍 ' + currentLocale.currency + ' (' + curInfo.symbol + ') ▾</span></button>';

// Desktop Menu: Jewelry Box | Look Planner | Size guide | Metal match | Currency Switch | Gift finder | More ▾
var deskLinks = [
  pages[1], pages[2], pages[3], pages[4]
].map(lk).join('') + locBtnHtml + lk(pages[6]);

var moreLinks = [pages[5], pages[7], pages[8], pages[9], pages[10], pages[11], pages[12], pages[13]].map(lk).join('');
var desk = deskLinks + '<details class="more"><summary'+(here!=='index.html'&&['vault.html','planner.html','sizing.html','styling.html','gift.html'].indexOf(here)<0?' style="color:#f3e2b3"':'')+'>More</summary><div class="more-menu">'+moreLinks+'</div></details>';

var mobLinks = pages.map(lk).join('') + 
  '<div class="pt-3 mt-2 border-t border-rose-200/20 flex flex-col gap-2">' +
  '<button id="m-nav-locale-btn" class="chip text-xs w-full text-center py-2">📍 Currency & Language: ' + currentLocale.currency + ' (' + curInfo.symbol + ') · ' + (LANGUAGES[currentLocale.lang]||currentLocale.lang) + '</button>' +
  '<button id="m-th" class="btn btn-ghost text-xs w-full py-2">Switch Theme</button>' +
  '</div>';

var nav=document.getElementById('nav');
if(nav)nav.innerHTML='<header class="nav"><div class="mx-auto max-w-7xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">' +
  brand('lg1') +
  '<nav class="hidden xl:flex gap-1 items-center" aria-label="Main">' + desk + '</nav>' +
  '<div class="flex items-center gap-1.5 sm:gap-2 shrink-0" id="nav-actions">' +
  '<button id="th" class="btn btn-ghost hidden sm:inline-flex text-xs py-1.5 px-3" aria-label="Change color theme"></button>' +
  '<span id="auth-slot" class="flex items-center gap-1.5 shrink-0"></span>' +
  '<button id="mb" class="xl:hidden btn btn-ghost py-1.5 px-3 text-xs" aria-expanded="false" aria-controls="mm">Menu</button>' +
  '</div></div>' +
  '<nav id="mm" class="hidden xl:hidden px-4 pb-4 flex-col gap-1" aria-label="Mobile">' +
  '<div id="mm-auth" class="pb-2 mb-2 border-b border-rose-200/20"></div>' +
  mobLinks +
  '</nav></header>';

var bLocDesk = document.getElementById('nav-locale-btn'); if (bLocDesk) bLocDesk.onclick = openLocaleModal;
var bLocMob = document.getElementById('m-nav-locale-btn'); if (bLocMob) bLocMob.onclick = openLocaleModal;

var mb=document.getElementById('mb');
if(mb)mb.onclick=function(){var m=document.getElementById('mm'),o=m.classList.toggle('hidden');m.classList.toggle('flex',!o);mb.setAttribute('aria-expanded',!o)};

var f=document.getElementById('foot');
if(f)f.innerHTML='<footer class="mx-auto max-w-6xl px-5 py-12 border-t" style="border-color:rgba(243,226,179,.1)"><div class="flex flex-wrap justify-between gap-6"><div>'+brand('lg2')+'<p class="muted text-sm mt-2 max-w-sm">Fine jewelry tools and style guides. Upgrade to Pro for unlimited access.</p></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted" aria-label="Footer">'+pages.map(function(p){return '<a href="'+p[0]+'" class="hover:text-white">'+p[1]+'</a>'}).join('')+'<a href="privacy.html" class="hover:text-white">Privacy and ads</a></nav></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted mt-6" aria-label="Guides">'+guides.map(function(g){return '<a href="'+g[0]+'" class="hover:text-white">'+g[1]+'</a>'}).join('')+'</nav><p class="muted text-xs mt-8">© 2026 McGee Jewelry. Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.</p></footer>';

/* ---------- Theme switcher ---------- */
function thNow(){return document.documentElement.dataset.theme||'light'}
function thLab(){
  var t=document.getElementById('th'),c=thNow(),r=TH.filter(function(x){return x[0]===c})[0]||TH[0];
  if(t)t.textContent='Theme: '+r[1];
  var mt=document.getElementById('m-th');
  if(mt)mt.textContent='Theme: '+r[1];
  var m=document.querySelector('meta[name="theme-color"]');
  if(m)m.content=r[2];
}
function cycleTheme(){
  var i=0;TH.forEach(function(x,j){if(x[0]===thNow())i=j});
  var n=TH[(i+1)%TH.length][0];
  if(n==='light')document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme=n;
  try{localStorage.setItem('koo_theme',n)}catch(e){}
  thLab();
}
var thb=document.getElementById('th'); if(thb) thb.onclick = cycleTheme;
var mthb=document.getElementById('m-th'); if(mthb) mthb.onclick = cycleTheme;
thLab();
KOO.sync();

/* ---------- Pro Auth & 12 Free Tries Engine ---------- */
var sb = null;
var currentUser = null;
var authMode = 'login';

function isProUser() {
  if (currentUser && currentUser.email) {
    var em = currentUser.email.toLowerCase().trim();
    if (PRO_EMAILS.indexOf(em) >= 0) return true;
    if (currentUser.user_metadata && currentUser.user_metadata.is_pro === true) return true;
  }
  if (localStorage.getItem('koo_pro_active') === 'true') return true;
  return false;
}

function getUsedFeatures() {
  try { return JSON.parse(localStorage.getItem('koo_used_features')) || []; } catch(e){ return []; }
}

function hasUsedFeature(slug) {
  return getUsedFeatures().indexOf(slug) >= 0;
}

function markFeatureUsed(slug) {
  var used = getUsedFeatures();
  if (used.indexOf(slug) < 0) {
    used.push(slug);
    try { localStorage.setItem('koo_used_features', JSON.stringify(used)); } catch(e){}
  }
}

function getRemainingTries() {
  var usedCount = getUsedFeatures().filter(function(s){
    return ALL_TOOL_SLUGS.indexOf(s) >= 0;
  }).length;
  var left = ALL_TOOL_SLUGS.length - usedCount;
  return left > 0 ? left : 0;
}

function getStripeUrl() {
  if (currentUser && currentUser.email) {
    return STRIPE_BASE + '?prefilled_email=' + encodeURIComponent(currentUser.email);
  }
  return STRIPE_BASE;
}

function updateNavAuth() {
  var as = document.getElementById('auth-slot');
  var mma = document.getElementById('mm-auth');
  var pro = isProUser();
  var triesLeft = getRemainingTries();
  var priceLabel = formatPrice(6);

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
              '<span class="text-xs muted">🎁 ' + triesLeft + '/12 Free Tries</span>' +
              '<button id="m-nav-btn-pro" class="btn btn-gold text-xs py-1.5 px-3">Upgrade (' + priceLabel + '/mo)</button>' +
              '</div>' 
              : '<span class="chip text-xs mt-1">⭐ Pro Member Active</span>');
  } else {
    html = statusBadge +
           '<button id="nav-btn-pro" class="btn btn-gold text-xs py-1.5 px-2.5 whitespace-nowrap">Pro ' + priceLabel + '</button>' +
           '<button id="btn-login" class="btn btn-ghost text-xs py-1.5 px-2.5 whitespace-nowrap">Log in</button>';

    mHtml = '<div class="flex items-center justify-between gap-2">' +
            '<button id="m-btn-login" class="btn btn-ghost flex-1 py-1.5 text-xs">Log in</button>' +
            '<button id="m-nav-btn-pro" class="btn btn-gold flex-1 text-center py-1.5 text-xs">Pro ' + priceLabel + '/mo</button>' +
            '</div>' +
            '<p class="text-xs muted text-center mt-2">🎁 ' + triesLeft + '/12 Free Tries Remaining</p>';
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

function handleStripeSuccess() {
  if (location.search.indexOf('payment=success') >= 0) {
    localStorage.setItem('koo_pro_active', 'true');
    localStorage.setItem('koo_pending_pro', 'true');
    if (sb && currentUser) {
      sb.auth.updateUser({ data: { is_pro: true } }).catch(function(){});
    }
    alert('🎉 Payment confirmed! Your account is now upgraded to McGee Jewelry Pro.');
    try {
      var url = new URL(window.location);
      url.searchParams.delete('payment');
      window.history.replaceState({}, document.title, url.pathname);
    } catch(e){}
    updateNavAuth();
    var m = document.getElementById('mcgee-pro-modal');
    if (m) m.remove();
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

/* ---------- STYLISH PRO SUBSCRIPTION BANNER (BLUR / FLOU) ---------- */
function openProModal(isPageLock) {
  if (isProUser()) return;
  var old = document.getElementById('mcgee-pro-modal');
  if (old) old.remove();

  var triesLeft = getRemainingTries();
  var priceLabel = formatPrice(6);

  var features = [
    { icon: '👑', t: 'My Jewelry Box & Value Vault', d: 'Track collection weight, gold melt value & insurance dossiers' },
    { icon: '🗓️', t: 'Lookbook & Outfit Planner', d: 'Weekly 7-day look planning & 30-day Cost-Per-Wear analysis' },
    { icon: '💍', t: 'Ring & Bracelet Sizer', d: 'US, UK, EU and Japan sizes with life-scale preview' },
    { icon: '🪙', t: 'Gold Karat & Value Calculator', d: 'Real-time 10k–24k melt values and investment estimates' },
    { icon: '💎', t: 'Diamond Carat Visualizer', d: 'Exact millimeter-to-carat finger scale on hand simulator' },
    { icon: '✨', t: 'Photo & Undertone Analyzer', d: 'Browser-based metal detection & gem color matching' },
    { icon: '📿', t: 'Necklace Layering Studio', d: 'Recommended chain lengths and spacing for 6 necklines' },
    { icon: '🎨', t: 'Metal & Skin Undertone Match', d: 'Gold, silver and rose gold flattering guide' },
    { icon: '🎁', t: '4-Question Smart Gift Finder', d: 'Custom jewelry gift recommendations by style and budget' },
    { icon: '♡', t: 'Synced Pro Wishlist', d: 'Save unlimited pieces and styling sets across devices' }
  ];

  var featHtml = features.map(function(f){
    return '<div class="flex items-start gap-3 p-2.5 rounded-xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(243,226,179,0.1)">' +
           '<span class="text-xl shrink-0">' + f.icon + '</span>' +
           '<div class="text-left"><p class="text-sm font-medium gt leading-tight">' + f.t + '</p><p class="muted text-xs mt-0.5 leading-snug">' + f.d + '</p></div>' +
           '</div>';
  }).join('');

  var m = document.createElement('div');
  m.id = 'mcgee-pro-modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(18,10,14,0.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.25rem;overflow-y:auto;';
  
  m.innerHTML = '<div class="glass glow p-6 md:p-8 rounded-3xl max-w-2xl w-full relative my-auto" style="box-shadow:0 30px 60px rgba(0,0,0,0.5);border:1px solid rgba(243,226,179,0.25)">' +
                '<button id="pro-close" style="position:absolute;top:1.2rem;right:1.2rem;width:2rem;height:2rem;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer" class="muted hover:text-white" aria-label="Close">✕</button>' +
                
                '<div class="text-center">' +
                '<span class="chip" style="font-size:0.75rem;padding:0.25rem 0.9rem;background:rgba(243,226,179,0.15);border-color:#b76e79;color:#f3e2b3">✨ MCGEE JEWELRY PRO</span>' +
                '<h2 class="serif text-3xl md:text-5xl gt mt-3">Free Try Used For This Studio</h2>' +
                '<p class="muted text-sm md:text-base mt-2 max-w-lg mx-auto">' +
                'You have used your 1 free try for this feature (' + triesLeft + '/' + ALL_TOOL_SLUGS.length + ' total tries remaining). Subscribe for <b class="gt">' + priceLabel + '/month</b> to unlock all 12 tools with unlimited access.' +
                '</p>' +
                '</div>' +

                '<div class="grid sm:grid-cols-2 gap-2.5 mt-5 max-h-[44vh] overflow-y-auto pr-1">' +
                featHtml +
                '</div>' +

                '<div class="mt-6 flex flex-col gap-2.5 items-center">' +
                '<a href="' + getStripeUrl() + '" class="btn btn-gold w-full text-center py-3.5 text-base md:text-lg font-medium shadow-lg" style="letter-spacing:0.02em">' +
                'Unlock All 12 Studios &nbsp;&rarr;&nbsp; ' + priceLabel + '/month' +
                '</a>' +
                '<p class="muted text-xs mt-0.5 text-center">Instant access &middot; Secure checkout via Stripe &middot; Cancel anytime in 1 click</p>' +
                '</div>' +

                '<div class="text-center mt-3 pt-3 border-t border-rose-200/10">' +
                '<button id="pro-modal-login" class="text-xs muted hover:underline">Already subscribed? <b class="gt">Log in to your account</b></button>' +
                '</div>' +
                '</div>';

  document.body.appendChild(m);

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

/* ---------- DIRECT URL & GOOGLE PAGE-LOAD PAYWALL CHECK ---------- */
function checkDirectPagePaywall() {
  if (!isToolPage) return;
  if (isProUser()) return;

  var activeSessionKey = 'koo_active_session_' + cleanSlug;
  if (sessionStorage.getItem(activeSessionKey) === '1') {
    return;
  }

  if (!hasUsedFeature(cleanSlug)) {
    markFeatureUsed(cleanSlug);
    sessionStorage.setItem(activeSessionKey, '1');
    updateNavAuth();
    showFreeTryBanner(cleanSlug);
    return;
  }

  openProModal(true);
}

function showFreeTryBanner(slug) {
  var b = document.createElement('div');
  b.style.cssText = 'position:fixed;top:4.5rem;left:50%;transform:translateX(-50%);z-index:9999;max-width:90%;width:520px;padding:.6rem 1.2rem;border-radius:999px;font-size:.78rem;box-shadow:0 10px 25px rgba(0,0,0,0.18);';
  b.className = 'glass glow flex items-center justify-between gap-3 text-center';
  b.innerHTML = '<span>🎁 <b>1 Free Try Active</b> for this studio (' + getRemainingTries() + '/' + ALL_TOOL_SLUGS.length + ' remaining)</span>' +
                '<button onclick="this.parentElement.remove()" class="text-xs muted hover:text-white" style="cursor:pointer">✕</button>';
  document.body.appendChild(b);
  setTimeout(function(){ if(b) b.remove(); }, 6000);
}

/* ---------- Global Click Interceptor for Tool Links ---------- */
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
    if (cleanSlug === 'index' && (href === '#size' || href === '#photo' || href === '#layer' || href === '#birth')) {
      e.preventDefault();
      openProModal(false);
      return;
    }
  }

  if (cleanSlug === 'index') {
    var widget = e.target.closest('#ms, #dz, #nl button, #bm button, #file');
    if (widget) {
      e.preventDefault();
      openProModal(false);
    }
  }
}, true);

/* ---------- Auth Modal (Email + Password + Switch) ---------- */
function openAuthModal() {
  var old = document.getElementById('mcgee-auth-dialog');
  if (old) old.remove();

  var isSignUp = authMode === 'signup';
  var dlg = document.createElement('div');
  dlg.id = 'mcgee-auth-dialog';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(20,10,15,0.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  
  dlg.innerHTML = '<div class="glass p-6 md:p-8 rounded-2xl max-w-md w-full relative" style="box-shadow:0 25px 50px rgba(0,0,0,0.4)">' +
                  '<button id="auth-close" style="position:absolute;top:1rem;right:1rem;font-size:1.2rem;cursor:pointer" class="muted">✕</button>' +
                  '<h2 id="auth-heading" class="serif text-3xl gt text-center">' + (isSignUp ? 'Create your account' : 'Welcome back') + '</h2>' +
                  '<p id="auth-sub" class="muted text-sm text-center mt-1">' + (isSignUp ? 'Sign up to access Pro tools and save your wishlist.' : 'Log in to access your McGee Jewelry tools.') + '</p>' +
                  '<div class="mt-5 flex flex-col gap-3">' +
                  '<button id="btn-oauth-google" type="button" class="btn btn-ghost flex items-center justify-center gap-2 w-full" style="background:rgba(255,255,255,0.08)">' +
                  '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/></svg>' +
                  'Continue with Google</button>' +
                  '<div class="flex items-center my-1"><div class="flex-1 border-t border-rose-200/20"></div><span class="px-3 text-xs muted">OR WITH EMAIL</span><div class="flex-1 border-t border-rose-200/20"></div></div>' +
                  '<form id="auth-form" autocomplete="on">' +
                  '<label class="fld text-left"><span>Email address</span>' +
                  '<input id="auth-email" type="email" name="username" autocomplete="username" required placeholder="you@example.com" class="w-full">' +
                  '</label>' +
                  '<label class="fld text-left mt-3"><span>Password</span>' +
                  '<input id="auth-password" type="password" name="password" ' + (isSignUp ? 'autocomplete="new-password"' : 'autocomplete="current-password"') + ' required minlength="6" placeholder="••••••••" class="w-full">' +
                  '</label>' +
                  '<button id="btn-auth-submit" type="submit" class="btn btn-gold w-full mt-4">' + (isSignUp ? 'Create Account' : 'Log In') + '</button>' +
                  '</form>' +
                  '<p id="auth-status" class="text-xs text-center mt-2 muted"></p>' +
                  '<div class="text-center mt-3 pt-3 border-t border-rose-200/10 text-xs">' +
                  '<span id="auth-switch-text" class="muted">' + (isSignUp ? 'Already have an account?' : 'New to McGee Jewelry?') + '</span> ' +
                  '<button id="btn-auth-switch" type="button" class="underline gt font-semibold">' + (isSignUp ? 'Log in' : 'Create an account') + '</button>' +
                  '</div>' +
                  '</div>' +
                  '</div>';
  document.body.appendChild(dlg);

  var cl = document.getElementById('auth-close'); if (cl) cl.onclick = function(){ dlg.remove(); };
  var bg = document.getElementById('btn-oauth-google'); if (bg) bg.onclick = loginWithGoogle;
  var sw = document.getElementById('btn-auth-switch'); if (sw) sw.onclick = toggleAuthMode;
  var form = document.getElementById('auth-form'); if (form) form.onsubmit = handleFormSubmit;
}

function toggleAuthMode() {
  authMode = authMode === 'signup' ? 'login' : 'signup';
  openAuthModal();
}

function handleFormSubmit(e) {
  e.preventDefault();
  var em = document.getElementById('auth-email');
  var pw = document.getElementById('auth-password');
  var st = document.getElementById('auth-status');
  var btn = document.getElementById('btn-auth-submit');

  if (!em || !pw || !st) return;
  var email = em.value.trim();
  var password = pw.value.trim();

  if (!email || !password) {
    st.textContent = 'Please enter both email and password.';
    st.style.color = '#ef4444';
    return;
  }
  if (password.length < 6) {
    st.textContent = 'Password must be at least 6 characters.';
    st.style.color = '#ef4444';
    return;
  }
  if (!sb) {
    st.textContent = 'Connecting to database, please wait a moment...';
    return;
  }

  btn.disabled = true;
  st.textContent = authMode === 'signup' ? 'Creating your account...' : 'Logging in...';
  st.style.color = '';

  var hadPendingPro = localStorage.getItem('koo_pending_pro') === 'true';

  if (authMode === 'signup') {
    sb.auth.signUp({
      email: email,
      password: password,
      options: { data: { is_pro: hadPendingPro || (PRO_EMAILS.indexOf(email.toLowerCase()) >= 0) } }
    }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else {
        localStorage.removeItem('koo_pending_pro');
        st.textContent = 'Account created successfully!';
        st.style.color = '#10b981';
        setTimeout(function(){ location.reload(); }, 800);
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
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else {
        if (hadPendingPro && sb) {
          sb.auth.updateUser({ data: { is_pro: true } }).catch(function(){});
          localStorage.removeItem('koo_pending_pro');
        }
        st.textContent = 'Logged in successfully!';
        st.style.color = '#10b981';
        setTimeout(function(){ location.reload(); }, 800);
      }
    }).catch(function(err){
      btn.disabled = false;
      st.textContent = err.message;
      st.style.color = '#ef4444';
    });
  }
}

function loginWithGoogle() {
  if (!sb) { alert('Connecting to login service...'); return; }
  sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  }).catch(function(err){
    alert('Google login error: ' + err.message);
  });
}

function logoutUser() {
  if (sb) sb.auth.signOut();
  currentUser = null;
  localStorage.removeItem('koo_pro_active');
  updateNavAuth();
  location.reload();
}

window.initMcGeeAuth = function() {
  if (!window.supabase) return;
  sb = window.supabase.createClient(SB_URL, SB_KEY);

  sb.auth.getSession().then(function(res){
    if (res.data && res.data.session) {
      currentUser = res.data.session.user;
      if (currentUser && currentUser.email && PRO_EMAILS.indexOf(currentUser.email.toLowerCase()) >= 0) {
        if (!currentUser.user_metadata || currentUser.user_metadata.is_pro !== true) {
          sb.auth.updateUser({ data: { is_pro: true } }).catch(function(){});
        }
      }
    }
    updateNavAuth();
    handleStripeSuccess();
    checkDirectPagePaywall();
  });

  sb.auth.onAuthStateChange(function(evt, session){
    currentUser = session ? session.user : null;
    updateNavAuth();
    handleStripeSuccess();
  });
};

if (window.supabase) window.initMcGeeAuth();
updateNavAuth();
handleStripeSuccess();

setTimeout(function(){
  checkDirectPagePaywall();
}, 800);

})();
