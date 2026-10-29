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
var STRIPE_PORTAL = 'https://billing.stripe.com/p/login/5kQ00kb7pgWc8p8c6Y0ZW00'; // Replace with your activated Stripe Portal link

var TH=[['light','Blush','#fbf5f2'],['plum','Plum','#2a1426'],['midnight','Midnight','#020617']];
try{var st=localStorage.getItem('koo_theme');if(st==='plum'||st==='midnight')document.documentElement.dataset.theme=st}catch(e){}

function logo(id){return '<svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e2b3"/><stop offset=".55" stop-color="#e8b4b8"/><stop offset="1" stop-color="#b76e79"/></linearGradient></defs><circle cx="20" cy="25" r="11" fill="none" stroke="url(#'+id+')" stroke-width="2.6"/><polygon points="14,5 26,5 31,10 20,19 9,10" fill="url(#'+id+')"/><g stroke="rgba(60,30,40,.45)" stroke-width=".8" fill="none"><polyline points="9,10 31,10"/><polyline points="14,5 17,10 20,19 23,10 26,5"/></g></svg>'}
function brand(id){return '<a href="index.html" class="brand" aria-label="McGee Jewelry home">'+logo(id)+'<span><span class="serif gt brand-n">McGee</span><span class="brand-s">JEWELRY</span></span></a>'}

var guides=[["/how-to-measure-ring-size-at-home","Measure Ring Size at Home"],["/how-to-untangle-a-necklace","Untangle Fine Gold Chains"],["/shop/necklaces/14k-yellow-gold-necklace-with-devil-emoji-symbol","Devil emoji necklace"],["/how-to-clean-sterling-silver-at-home","Clean Sterling Silver Guide"],["/why-does-gold-turn-skin-green","Gold Turning Skin Green"],["/product-category/rings","Rings guide"],["/what-earrings-are-trending-now","Earring trends"],["/shop/rings/14k-white-and-rose-gold-doulbe-diamond-infinity-design-band-3-8-cttw","Diamond infinity band"]];
var pages=[['index.html','Home'],['vault.html','Jewelry Box'],['sizing.html','Size guide'],['styling.html','Metal match'],['care.html','Care'],['gift.html','Gift finder'],['blog.html','Blog'],['wishlist.html','Wishlist'],['layering.html','Layering'],['anniversary.html','Anniversary gifts'],['gold.html','Gold calculator'],['diamond.html','Diamond size'],['earrings.html','Earring finder']],MAIN=6;

var here=location.pathname.replace(/\/+$/,'').split('/').pop()||'index.html';if(here.indexOf('.')<0)here+='.html';
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

function lk(p){return '<a class="l" href="'+p[0]+'"'+(p[0]===here?' aria-current="page"':'')+'>'+p[1]+(p[0]==='wishlist.html'?' <span data-count hidden class="ml-1 rounded-full px-1.5 text-xs" style="background:#b76e79;color:#fff"></span>':'')+'</a>'}
var links=pages.map(lk).join(''),more=pages.slice(MAIN+1),desk=pages.slice(1,MAIN+1).map(lk).join('')+'<details class="more"><summary'+(more.some(function(p){return p[0]===here})?' style="color:#f3e2b3"':'')+'>More</summary><div class="more-menu">'+more.map(lk).join('')+'</div></details>';

var nav=document.getElementById('nav');
if(nav)nav.innerHTML='<header class="nav"><div class="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">'+brand('lg1')+'<nav class="hidden lg:flex gap-1" aria-label="Main">'+desk+'</nav><div class="flex items-center gap-2" id="nav-actions"><button id="th" class="btn btn-ghost" style="padding:.35rem .9rem" aria-label="Change color theme"></button><span id="auth-slot"></span><button id="mb" class="lg:hidden btn btn-ghost" style="padding:.4rem 1rem" aria-expanded="false" aria-controls="mm">Menu</button></div></div><nav id="mm" class="hidden lg:hidden px-5 pb-4 flex-col gap-1" aria-label="Mobile">'+links+'<div id="mm-auth" class="pt-2 border-t border-rose-200/20 mt-2"></div></nav></header>';

var mb=document.getElementById('mb');
if(mb)mb.onclick=function(){var m=document.getElementById('mm'),o=m.classList.toggle('hidden');m.classList.toggle('flex',!o);mb.setAttribute('aria-expanded',!o)};

var f=document.getElementById('foot');
if(f)f.innerHTML='<footer class="mx-auto max-w-6xl px-5 py-12 border-t" style="border-color:rgba(243,226,179,.1)"><div class="flex flex-wrap justify-between gap-6"><div>'+brand('lg2')+'<p class="muted text-sm mt-2 max-w-sm">Fine jewelry tools and style guides. Upgrade to Pro for unlimited access.</p></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted" aria-label="Footer">'+pages.map(function(p){return '<a href="'+p[0]+'" class="hover:text-white">'+p[1]+'</a>'}).join('')+'<a href="privacy.html" class="hover:text-white">Privacy and ads</a></nav></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted mt-6" aria-label="Guides">'+guides.map(function(g){return '<a href="'+g[0]+'" class="hover:text-white">'+g[1]+'</a>'}).join('')+'</nav><p class="muted text-xs mt-8">© 2026 McGee Jewelry. Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.</p></footer>';

/* ---------- Theme switcher ---------- */
function thNow(){return document.documentElement.dataset.theme||'light'}
function thLab(){var t=document.getElementById('th'),c=thNow(),r=TH.filter(function(x){return x[0]===c})[0]||TH[0];if(t)t.textContent='Theme: '+r[1];var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=r[2]}
var thb=document.getElementById('th');
if(thb)thb.onclick=function(){var i=0;TH.forEach(function(x,j){if(x[0]===thNow())i=j});var n=TH[(i+1)%TH.length][0];if(n==='light')document.documentElement.removeAttribute('data-theme');else document.documentElement.dataset.theme=n;try{localStorage.setItem('koo_theme',n)}catch(e){}thLab()};
thLab();
KOO.sync();

/* ---------- Pro Auth & Membership ---------- */
var TOOL_FILES = ['sizing.html','styling.html','care.html','gift.html','layering.html','anniversary.html','gold.html','diamond.html','earrings.html','wishlist.html','vault.html'];

var sb = null;
var currentUser = null;
var authMode = 'login';

function isProUser() {
  if (localStorage.getItem('koo_pro_active') === 'true') return true;
  if (currentUser && currentUser.user_metadata && currentUser.user_metadata.is_pro === true) return true;
  return false;
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
  var html = '';
  var mHtml = '';

  if (currentUser) {
    var email = currentUser.email || 'Member';
    var shortEmail = email.length > 14 ? email.slice(0, 11) + '...' : email;
    html = '<button id="nav-btn-profile" class="btn btn-ghost text-xs flex items-center gap-1.5" style="padding:.35rem .75rem" title="View Profile">' +
           (pro ? '<span class="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">⭐ Pro</span>' : '') +
           '<span>' + shortEmail + '</span></button>' +
           (!pro ? '<button id="nav-btn-pro" class="btn btn-gold text-xs" style="padding:.35rem .75rem">Upgrade ($6)</button>' : '');
    
    mHtml = '<div class="flex items-center justify-between text-sm py-2">' +
            '<button id="m-btn-profile" class="text-left font-medium gt">' + email + (pro ? ' ⭐ Pro' : '') + '</button>' +
            '<button id="m-btn-logout" class="text-red-400 text-xs">Log out</button></div>' +
            (!pro ? '<button id="m-nav-btn-pro" class="btn btn-gold block w-full text-center mt-2">Upgrade to Pro ($6/mo)</button>' : '');
  } else {
    html = '<button id="nav-btn-pro" class="btn btn-gold text-xs hidden sm:inline-block" style="padding:.35rem .75rem">Pro $6/mo</button>' +
           '<button id="btn-login" class="btn btn-ghost text-xs" style="padding:.35rem .75rem">Log in</button>';
    mHtml = '<div class="flex gap-2 mt-2"><button id="m-btn-login" class="btn btn-ghost flex-1">Log in</button><button id="m-nav-btn-pro" class="btn btn-gold flex-1 text-center">Pro $6/mo</button></div>';
  }

  if (as) as.innerHTML = html;
  if (mma) mma.innerHTML = mHtml;

  var bProf = document.getElementById('nav-btn-profile'); if (bProf) bProf.onclick = openProfileModal;
  var mbProf = document.getElementById('m-btn-profile'); if (mbProf) mbProf.onclick = openProfileModal;
  var bPro = document.getElementById('nav-btn-pro'); if (bPro) bPro.onclick = openProModal;
  var mbPro = document.getElementById('m-nav-btn-pro'); if (mbPro) mbPro.onclick = openProModal;
  var bLog = document.getElementById('btn-login'); if (bLog) bLog.onclick = function(){ authMode='login'; openAuthModal(); };
  var mbLog = document.getElementById('m-btn-login'); if (mbLog) mbLog.onclick = function(){ authMode='login'; openAuthModal(); };
  var mbOut = document.getElementById('m-btn-logout'); if (mbOut) mbOut.onclick = logoutUser;
}

function handleStripeSuccess() {
  if (location.search.indexOf('payment=success') >= 0) {
    localStorage.setItem('koo_pro_active', 'true');
    if (sb && currentUser) {
      sb.auth.updateUser({ data: { is_pro: true } }).catch(function(){});
    }
    alert('🎉 Welcome to McGee Jewelry Pro! All tools are now fully unlocked.');
    try {
      var url = new URL(window.location);
      url.searchParams.delete('payment');
      window.history.replaceState({}, document.title, url.pathname);
    } catch(e){}
    updateNavAuth();
  }
}

/* ---------- USER PROFILE & BILLING MODAL ---------- */
function openProfileModal() {
  if (!currentUser) return;
  var old = document.getElementById('mcgee-profile-dialog');
  if (old) old.remove();

  var pro = isProUser();
  var email = currentUser.email || 'Member';
  var joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Active';
  var savedCount = KOO.get().length;

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
                  '<h3 class="serif text-2xl ' + (pro ? 'gt' : '') + '">' + (pro ? 'Pro Member ⭐' : 'Free Account') + '</h3></div>' +
                  '<span class="chip" style="font-size:0.75rem;padding:0.25rem 0.75rem;' + (pro ? 'background:rgba(243,226,179,0.2);color:#f3e2b3;border-color:#b76e79' : '') + '">' +
                  (pro ? '$6 / month' : 'Free') + '</span>' +
                  '</div>' +

                  (pro ? 
                    '<p class="muted text-xs mt-2">Unlimited access to all 12 sizing, styling, and gold tools.</p>' +
                    '<div class="mt-4 pt-3 border-t border-rose-200/10 flex flex-col gap-2">' +
                    '<a href="' + STRIPE_PORTAL + '" target="_blank" rel="noopener" class="btn btn-ghost text-xs text-center w-full flex items-center justify-center gap-2">' +
                    '<span>Manage Billing & Invoices</span> &rarr;</a>' +
                    '<a href="' + STRIPE_PORTAL + '" target="_blank" rel="noopener" class="text-xs text-red-300 hover:text-red-400 text-center mt-1 underline">Cancel subscription in Stripe Portal</a>' +
                    '</div>'
                    :
                    '<p class="muted text-xs mt-2">You are currently using free preview tools. Upgrade to unlock all features.</p>' +
                    '<button id="prof-btn-upgrade" class="btn btn-gold w-full mt-3 text-sm">Upgrade to Pro ($6/month)</button>'
                  ) +
                  '</div>' +

                  '<div class="mt-4 p-4 rounded-2xl flex items-center justify-between" style="background:rgba(255,255,255,0.02);border:1px solid rgba(243,226,179,0.08)">' +
                  '<div><span class="muted text-xs">Saved in Wishlist</span>' +
                  '<p class="text-sm font-semibold">' + savedCount + ' jewelry items</p></div>' +
                  '<a href="wishlist.html" class="btn btn-ghost text-xs" style="padding:.35rem .75rem">View Wishlist</a>' +
                  '</div>' +

                  '<div class="mt-6 flex items-center justify-between pt-4 border-t border-rose-200/10">' +
                  '<button id="prof-btn-logout" class="text-xs text-red-400 hover:underline">Log out of this device</button>' +
                  '<button id="prof-btn-done" class="btn btn-ghost text-xs" style="padding:.35rem .9rem">Done</button>' +
                  '</div>' +
                  '</div>';

  document.body.appendChild(dlg);

  var cl = document.getElementById('prof-close'); if (cl) cl.onclick = function(){ dlg.remove(); };
  var dn = document.getElementById('prof-btn-done'); if (dn) dn.onclick = function(){ dlg.remove(); };
  var lo = document.getElementById('prof-btn-logout'); if (lo) lo.onclick = logoutUser;
  var up = document.getElementById('prof-btn-upgrade'); if (up) up.onclick = function(){ dlg.remove(); openProModal(); };
  dlg.onclick = function(e){ if (e.target === dlg) dlg.remove(); };
}

/* ---------- STYLISH PRO SUBSCRIPTION BANNER (BLUR / FLOU) ---------- */
function openProModal() {
  var old = document.getElementById('mcgee-pro-modal');
  if (old) old.remove();

  var features = [
    { icon: '💍', t: 'Ring & Bracelet Sizer', d: 'US, UK, EU and Japan sizes with life-scale preview' },
    { icon: '🪙', t: 'Gold Karat & Value Calculator', d: 'Real-time 10k–24k melt values and investment estimates' },
    { icon: '💎', t: 'Diamond Carat Visualizer', d: 'Exact millimeter-to-carat finger scale on hand simulator' },
    { icon: '✨', t: 'Photo & Undertone Analyzer', d: 'Browser-based metal detection & gem color matching' },
    { icon: '📿', t: 'Necklace Layering Studio', d: 'Recommended chain lengths and spacing for 6 necklines' },
    { icon: '🎨', t: 'Metal & Skin Undertone Match', d: 'Gold, silver and rose gold flattering guide' },
    { icon: '🎁', t: '4-Question Smart Gift Finder', d: 'Custom jewelry gift recommendations by style and budget' },
    { icon: '🫧', t: 'Complete Jewelry Care Vault', d: 'Cleaning and protection formulas for all stones & metals' },
    { icon: '📅', t: 'Anniversary & Birthstones', d: 'Complete milestone gem vault from year 1 to 60' },
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
  m.style.cssText = 'position:fixed;inset:0;background:rgba(18,10,14,0.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.25rem;overflow-y:auto;';
  
  m.innerHTML = '<div class="glass glow p-6 md:p-8 rounded-3xl max-w-2xl w-full relative my-auto" style="box-shadow:0 30px 60px rgba(0,0,0,0.5);border:1px solid rgba(243,226,179,0.25)">' +
                '<button id="pro-close" style="position:absolute;top:1.2rem;right:1.2rem;width:2rem;height:2rem;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer" class="muted hover:text-white" aria-label="Close">✕</button>' +
                
                '<div class="text-center">' +
                '<span class="chip" style="font-size:0.75rem;padding:0.25rem 0.9rem;background:rgba(243,226,179,0.15);border-color:#b76e79;color:#f3e2b3">✨ MCGEE JEWELRY PRO</span>' +
                '<h2 class="serif text-3xl md:text-5xl gt mt-3">Unlock All Jewelry Tools</h2>' +
                '<p class="muted text-sm md:text-base mt-2 max-w-lg mx-auto">Get unlimited, instant access to all professional sizing, styling, diamond, and gold tools for <b class="gt" style="font-size:1.15rem">only $6 a month</b>.</p>' +
                '</div>' +

                '<div class="grid sm:grid-cols-2 gap-2.5 mt-5 max-h-[46vh] overflow-y-auto pr-1">' +
                featHtml +
                '</div>' +

                '<div class="mt-6 flex flex-col gap-2.5 items-center">' +
                '<a href="' + getStripeUrl() + '" class="btn btn-gold w-full text-center py-3.5 text-base md:text-lg font-medium shadow-lg" style="letter-spacing:0.02em">' +
                'Unlock All Features Now &nbsp;&rarr;&nbsp; $6/month</a>' +
                '<p class="muted text-xs mt-1 text-center">Instant access &middot; Secure checkout via Stripe &middot; Cancel anytime in 1 click</p>' +
                '</div>' +

                '<div class="text-center mt-3 pt-3 border-t border-rose-200/10">' +
                '<button id="pro-modal-login" class="text-xs muted hover:underline">Already subscribed? <b class="gt">Log in to your account</b></button>' +
                '</div>' +
                '</div>';

  document.body.appendChild(m);

  var cl = document.getElementById('pro-close'); if (cl) cl.onclick = function(){ m.remove(); };
  var pl = document.getElementById('pro-modal-login'); if (pl) pl.onclick = function(){ m.remove(); authMode='login'; openAuthModal(); };
  m.onclick = function(e){ if (e.target === m) m.remove(); };
}
window.openProModal = openProModal;

/* ---------- Global Click Interceptor for Tools ---------- */
document.addEventListener('click', function(e) {
  if (isProUser()) return;

  var a = e.target.closest('a');
  if (a && a.href) {
    var href = a.getAttribute('href') || '';
    for (var i = 0; i < TOOL_FILES.length; i++) {
      if (href === TOOL_FILES[i] || href.indexOf('/' + TOOL_FILES[i]) >= 0) {
        e.preventDefault();
        openProModal();
        return;
      }
    }
    if (here === 'index.html' && (href === '#size' || href === '#photo' || href === '#layer' || href === '#birth')) {
      e.preventDefault();
      openProModal();
      return;
    }
  }

  if (here === 'index.html') {
    var widget = e.target.closest('#ms, #dz, #nl button, #bm button, #file');
    if (widget) {
      e.preventDefault();
      openProModal();
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

  if (authMode === 'signup') {
    sb.auth.signUp({
      email: email,
      password: password
    }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else {
        if (res.data.user && (!res.data.session)) {
          st.textContent = 'Account created! Please check your email to confirm.';
          st.style.color = '#10b981';
        } else {
          st.textContent = 'Account created successfully!';
          st.style.color = '#10b981';
          setTimeout(function(){
            var dlg = document.getElementById('mcgee-auth-dialog');
            if (dlg) dlg.remove();
          }, 1000);
        }
      }
    }).catch(function(err){
      btn.disabled = false;
      st.textContent = err.message;
      st.style.color = '#ef4444';
    });
  } else {
    sb.auth.signInWithPassword({
      email: email,
      password: password
    }).then(function(res){
      btn.disabled = false;
      if (res.error) {
        st.textContent = res.error.message;
        st.style.color = '#ef4444';
      } else {
        st.textContent = 'Logged in successfully!';
        st.style.color = '#10b981';
        setTimeout(function(){
          var dlg = document.getElementById('mcgee-auth-dialog');
          if (dlg) dlg.remove();
        }, 800);
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
    }
    updateNavAuth();
    handleStripeSuccess();
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

})();
