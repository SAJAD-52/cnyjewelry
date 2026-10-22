/* koojewelry ad slots. Edit ONLY the ADS block below, then redeploy.
   provider 'none'  -> every slot shows an on-site promo (no empty boxes).
   provider 'adsense' -> after approval, paste your publisher ID and slot IDs. */
(function(){
var ADS={provider:'none',client:'ca-pub-0000000000000000',slots:{banner:'0000000000',inline:'0000000000'}};
var HOUSE=[
{t:'Not sure what to give her?',d:'Four questions, three gift ideas matched to her style.',h:'gift.html',c:'Find a gift'},
{t:'Which metal suits your skin?',d:'Match gold, silver and rose gold to your undertone.',h:'styling.html',c:'Match my metal'},
{t:'Keep it shining',d:'Cleaning and storage steps for every material.',h:'care.html',c:'Open the care guide'}];
var KC='koo_consent';
function cons(){try{return localStorage.getItem(KC)}catch(e){return null}}
function setc(v){try{localStorage.setItem(KC,v)}catch(e){}}
var live=ADS.provider==='adsense'&&/^ca-pub-\d{16}$/.test(ADS.client)&&ADS.client!=='ca-pub-0000000000000000';
function house(el,i){var p=HOUSE[i%HOUSE.length];el.innerHTML='<div class="ad-in"><div><div class="serif text-2xl gt">'+p.t+'</div><p class="muted text-sm">'+p.d+'</p></div><a class="btn btn-ghost" style="padding:.4rem 1.1rem" href="'+p.h+'">'+p.c+'</a></div>'}
function render(){var slots=document.querySelectorAll('[data-ad]'),ok=live&&cons()==='yes',n=0;
if(ok&&!document.getElementById('adsjs')){var s=document.createElement('script');s.id='adsjs';s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+ADS.client;document.head.appendChild(s)}
slots.forEach(function(el,i){var type=el.dataset.ad,id=ADS.slots[type];el.innerHTML='';el.classList.add('ad','ad-'+type);
el.setAttribute('aria-label','Advertisement');
if(ok&&/^\d{10}$/.test(id)&&id!=='0000000000'){var ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';ins.setAttribute('data-ad-client',ADS.client);ins.setAttribute('data-ad-slot',id);ins.setAttribute('data-ad-format','auto');ins.setAttribute('data-full-width-responsive','true');el.appendChild(ins);try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}}
else house(el,n++)})}
function banner(){if(!live||cons())return;var b=document.createElement('div');b.id='cb';b.setAttribute('role','dialog');b.setAttribute('aria-label','Ads and cookies');
b.innerHTML='<p>We show ads to keep these tools free. Allow ad cookies?</p><div><button class="btn btn-gold" id="cy" style="padding:.4rem 1.2rem">Allow</button><button class="btn btn-ghost" id="cn" style="padding:.4rem 1.2rem">No thanks</button></div><a href="privacy.html" class="muted text-sm">Privacy and ads</a>';document.body.appendChild(b);
document.getElementById('cy').onclick=function(){setc('yes');b.remove();render()};document.getElementById('cn').onclick=function(){setc('no');b.remove();render()}}
render();banner();
})();
