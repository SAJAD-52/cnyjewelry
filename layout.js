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
(function(){
var TH=[['light','Blush','#fbf5f2'],['plum','Plum','#2a1426'],['midnight','Midnight','#020617']];
try{var st=localStorage.getItem('koo_theme');if(st==='plum'||st==='midnight')document.documentElement.dataset.theme=st}catch(e){}
function logo(id){return '<svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e2b3"/><stop offset=".55" stop-color="#e8b4b8"/><stop offset="1" stop-color="#b76e79"/></linearGradient></defs><circle cx="20" cy="25" r="11" fill="none" stroke="url(#'+id+')" stroke-width="2.6"/><polygon points="14,5 26,5 31,10 20,19 9,10" fill="url(#'+id+')"/><g stroke="rgba(60,30,40,.45)" stroke-width=".8" fill="none"><polyline points="9,10 31,10"/><polyline points="14,5 17,10 20,19 23,10 26,5"/></g></svg>'}
function brand(id){return '<a href="index.html" class="brand" aria-label="McGee Jewelry home">'+logo(id)+'<span><span class="serif gt brand-n">McGee</span><span class="brand-s">JEWELRY</span></span></a>'}
var guides=[["/shop/necklaces/14k-yellow-gold-necklace-with-devil-emoji-symbol","Devil emoji necklace"],["/how-to-clean-sterling-silver-at-home","Clean Sterling Silver Guide"],["/why-does-gold-turn-skin-green","Gold Turning Skin Green"],["/product-category/rings","Rings guide"],["/what-earrings-are-trending-now","Earring trends"],["/shop/rings/14k-white-and-rose-gold-doulbe-diamond-infinity-design-band-3-8-cttw","Diamond infinity band"],["/jewelry-to-wear-this-upcoming-fall","Fall jewelry guide"],["/is-it-worth-buying-gold-plated-jewelry","Gold-plated jewelry"]];
var pages=[['index.html','Home'],['sizing.html','Size guide'],['styling.html','Metal match'],['care.html','Care'],['gift.html','Gift finder'],['blog.html','Blog'],['wishlist.html','Wishlist'],['layering.html','Layering'],['anniversary.html','Anniversary gifts'],['gold.html','Gold calculator'],['diamond.html','Diamond size'],['earrings.html','Earring finder']],MAIN=6;
var here=location.pathname.replace(/\/+$/,'').split('/').pop()||'index.html';if(here.indexOf('.')<0)here+='.html';var K='koo_wishlist';
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
if(nav)nav.innerHTML='<header class="nav"><div class="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">'+brand('lg1')+'<nav class="hidden lg:flex gap-1" aria-label="Main">'+desk+'</nav><div class="flex items-center gap-2"><button id="th" class="btn btn-ghost" style="padding:.35rem .9rem" aria-label="Change color theme"></button><button id="mb" class="lg:hidden btn btn-ghost" style="padding:.4rem 1rem" aria-expanded="false" aria-controls="mm">Menu</button></div></div><nav id="mm" class="hidden lg:hidden px-5 pb-4 flex-col gap-1" aria-label="Mobile">'+links+'</nav></header>';
var mb=document.getElementById('mb');
if(mb)mb.onclick=function(){var m=document.getElementById('mm'),o=m.classList.toggle('hidden');m.classList.toggle('flex',!o);mb.setAttribute('aria-expanded',!o)};
var f=document.getElementById('foot');
if(f)f.innerHTML='<footer class="mx-auto max-w-6xl px-5 py-12 border-t" style="border-color:rgba(243,226,179,.1)"><div class="flex flex-wrap justify-between gap-6"><div>'+brand('lg2')+'<p class="muted text-sm mt-2 max-w-sm">Free jewelry tools. Nothing you enter leaves your device.</p></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted" aria-label="Footer">'+pages.map(function(p){return '<a href="'+p[0]+'" class="hover:text-white">'+p[1]+'</a>'}).join('')+'<a href="privacy.html" class="hover:text-white">Privacy and ads</a></nav></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted mt-6" aria-label="Guides">'+guides.map(function(g){return '<a href="'+g[0]+'" class="hover:text-white">'+g[1]+'</a>'}).join('')+'</nav><p class="muted text-xs mt-8">© 2026 McGee Jewelry. Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.</p></footer>';
document.addEventListener('click',function(e){var b=e.target.closest('[data-save]');if(b)KOO.toggle({id:b.dataset.id,label:b.dataset.label,note:b.dataset.note})});
document.addEventListener('mousemove',function(e){var g=e.target.closest&&e.target.closest('.glow');if(g){var r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')}});
document.addEventListener('click',function(e){document.querySelectorAll('details.more[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')})});
function thNow(){return document.documentElement.dataset.theme||'light'}
function thLab(){var t=document.getElementById('th'),c=thNow(),r=TH.filter(function(x){return x[0]===c})[0]||TH[0];if(t)t.textContent='Theme: '+r[1];var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=r[2]}
var thb=document.getElementById('th');
if(thb)thb.onclick=function(){var i=0;TH.forEach(function(x,j){if(x[0]===thNow())i=j});var n=TH[(i+1)%TH.length][0];if(n==='light')document.documentElement.removeAttribute('data-theme');else document.documentElement.dataset.theme=n;try{localStorage.setItem('koo_theme',n)}catch(e){}thLab()};
thLab();
KOO.sync();
})();
