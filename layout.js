(function(){
var pages=[['index.html','Home'],['sizing.html','Size guide'],['styling.html','Metal match'],['care.html','Care'],['gift.html','Gift finder'],['wishlist.html','Wishlist'],['layering.html','Layering'],['anniversary.html','Anniversary gifts'],['gold.html','Gold calculator'],['diamond.html','Diamond size'],['earrings.html','Earring finder']],MAIN=6;
var here=location.pathname.split('/').pop()||'index.html',K='koo_wishlist';
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
var links=pages.map(lk).join(''),more=pages.slice(MAIN),desk=pages.slice(0,MAIN).map(lk).join('')+'<details class="more"><summary'+(more.some(function(p){return p[0]===here})?' style="color:#f3e2b3"':'')+'>More</summary><div class="more-menu">'+more.map(lk).join('')+'</div></details>';
var nav=document.getElementById('nav');
if(nav)nav.innerHTML='<header class="nav"><div class="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between"><a href="index.html" class="serif text-2xl gt" style="text-decoration:none">koojewelry</a><nav class="hidden lg:flex gap-1" aria-label="Main">'+desk+'</nav><button id="mb" class="lg:hidden btn btn-ghost" style="padding:.4rem 1rem" aria-expanded="false" aria-controls="mm">Menu</button></div><nav id="mm" class="hidden lg:hidden px-5 pb-4 flex-col gap-1" aria-label="Mobile">'+links+'</nav></header>';
var mb=document.getElementById('mb');
if(mb)mb.onclick=function(){var m=document.getElementById('mm'),o=m.classList.toggle('hidden');m.classList.toggle('flex',!o);mb.setAttribute('aria-expanded',!o)};
var f=document.getElementById('foot');
if(f)f.innerHTML='<footer class="mx-auto max-w-6xl px-5 py-12 border-t" style="border-color:rgba(243,226,179,.1)"><div class="flex flex-wrap justify-between gap-6"><div><div class="serif text-2xl gt">koojewelry</div><p class="muted text-sm mt-2 max-w-sm">Free jewelry tools. Nothing you enter leaves your device.</p></div><nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm muted" aria-label="Footer">'+pages.map(function(p){return '<a href="'+p[0]+'" class="hover:text-white">'+p[1]+'</a>'}).join('')+'<a href="privacy.html" class="hover:text-white">Privacy and ads</a></nav></div><p class="muted text-xs mt-8">Sizes and care advice are general guidance. For fine or antique pieces, check with a jeweler.</p></footer>';
document.addEventListener('click',function(e){var b=e.target.closest('[data-save]');if(b)KOO.toggle({id:b.dataset.id,label:b.dataset.label,note:b.dataset.note})});
document.addEventListener('mousemove',function(e){var g=e.target.closest&&e.target.closest('.glow');if(g){var r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')}});
document.addEventListener('click',function(e){document.querySelectorAll('details.more[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')})});
KOO.sync();
})();
