/* McGee Jewelry feature showcase banner. Use: <div data-showcase data-pick="sizing,care"></div> */
(function(){
var T=[
['sizing','fit','Ring & Bracelet Sizer','Slide to your size. US, UK, EU and Japan sizes at once.','sizing.html','Find my size','ring'],
['diamond','fit','Diamond Size Visualizer','See any carat weight at scale on a finger.','diamond.html','See the carat','gem'],
['styling','style','Metal & Undertone Matcher','Metals and gems that glow against your skin.','styling.html','Match my metal','palette'],
['layering','style','Necklace Layering Guide','Chain lengths that sit right with your neckline.','layering.html','Layer my chains','layers'],
['earrings','style','Earring Face-Shape Finder','Earrings that flatter, plus sensitive-ear tips.','earrings.html','Find my earrings','drop'],
['photo','style','Jewelry Photo Analyzer','Upload a photo to estimate its metal and stone color.','index.html#photo','Analyze a photo','camera'],
['care','care','Jewelry Care Guide','Clean and store gold, silver, pearls and more.','care.html','Care for mine','sparkle'],
['gift','gift','Gift Finder Quiz','Four questions, three gift ideas she will wear.','gift.html','Find a gift','gift'],
['anniversary','gift','Anniversary Gifts by Year','Traditional gifts and gemstones for years 1 to 60.','anniversary.html','Find my year','calendar'],
['birth','gift','Birthstone Finder','Pick a month to see its stone and meaning.','index.html#birth','Find the stone','star'],
['wishlist','gift','Wishlist','Save ideas from any tool. Stays on your device.','wishlist.html','Open wishlist','heart'],
['gold','value','Gold Karat & Value Calculator','Compare karats and estimate melt value.','gold.html','Calculate','coins']];
var C=[['all','All tools'],['fit','Size & fit'],['style','Style'],['care','Care'],['gift','Gifts'],['value','Value']];
var IC={ring:'<circle cx="12" cy="15" r="6"/><path d="M9 4l3-2 3 2-3 4z"/>',gem:'<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 18 3-18"/>',palette:'<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-1 1.2-1.8-.4-1 .2-2.2 1.6-2.2H17a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15.5" cy="7.5" r="1"/>',layers:'<path d="M12 2L2 7l10 5 10-5z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',drop:'<circle cx="12" cy="4.5" r="2"/><path d="M12 7v3M12 10c-3.5 3.5-3.5 9 0 10.5 3.5-1.5 3.5-7 0-10.5z"/>',camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16v4M17 18h4"/>',gift:'<rect x="3" y="8" width="18" height="4"/><rect x="5" y="12" width="14" height="9"/><path d="M12 8v13M12 8c-2-4-6-3-5 0 .7 1.5 3 1 5 0zM12 8c2-4 6-3 5 0-.7 1.5-3 1-5 0z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',star:'<path d="M12 2l3 7 7 .6-5.4 4.6 1.9 7L12 17.3 5.5 21.2l1.9-7L2 9.6 9 9z"/>',heart:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>',coins:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'};
function ic(n){return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>'}
document.querySelectorAll('[data-showcase]').forEach(function(el){
var pick=(el.dataset.pick||'').split(','),cur='all',title=el.dataset.title||'Put this guide to work',sub=el.dataset.sub||'Twelve free tools, built for jewelry. Pick one and try it right now.';
el.className=(el.className+' sc my-14 mx-auto max-w-5xl').trim();
function draw(){
var list=T.filter(function(t){return cur==='all'||t[1]===cur}).sort(function(a,b){return (pick.indexOf(b[0])>-1)-(pick.indexOf(a[0])>-1)});
el.innerHTML='<div class="glass sc-in"><div class="flex flex-wrap items-end justify-between gap-4"><div><h2 class="text-4xl md:text-5xl gt">'+title+'</h2><p class="muted mt-2 max-w-xl">'+sub+'</p></div><a class="btn btn-gold" href="index.html#th">Browse all tools</a></div>'
+'<div role="tablist" aria-label="Tool categories" class="flex flex-wrap gap-2 mt-6">'+C.map(function(c){return '<button class="chip" style="padding:.35rem .95rem" role="tab" aria-selected="'+(c[0]===cur)+'" data-c="'+c[0]+'">'+c[1]+'</button>'}).join('')+'</div>'
+'<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5" role="tabpanel">'+list.map(function(t){return '<a class="sc-card fade" href="'+t[4]+'">'+(pick.indexOf(t[0])>-1?'<span class="sc-pick">For this guide</span>':'')+'<span class="sc-ic">'+ic(t[6])+'</span><span><b class="serif block" style="font-size:1.3rem;font-weight:500;line-height:1.2">'+t[2]+'</b><span class="muted text-sm block mt-1">'+t[3]+'</span><span class="sc-cta">'+t[5]+' &rarr;</span></span></a>'}).join('')+'</div></div>';
el.querySelectorAll('[data-c]').forEach(function(b){b.onclick=function(){cur=b.dataset.c;draw()}})}
draw()})})();
