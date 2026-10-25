/* McGee Jewelry dashboard. Runs entirely in your browser.
   Publishing writes files to your GitHub repo with your token; Vercel then deploys the site. */
(function(){
var TOOLS=['sizing.html','styling.html','care.html','gift.html','layering.html','anniversary.html','gold.html','diamond.html','earrings.html','wishlist.html','blog.html','index.html','privacy.html'];
var FONT='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"><script src="https://cdn.tailwindcss.com"><\/script><link rel="stylesheet" href="style.css">';
var GRADS=['linear-gradient(135deg,#f3e2b3,#e8b4b8 55%,#b76e79)','linear-gradient(135deg,#e8b4b8,#c9954f 70%,#7a4a2b)','linear-gradient(135deg,#d98e32,#9a3b2e 60%,#5a1d2a)','linear-gradient(135deg,#ffffff,#c7ccd6 45%,#b76e79)','linear-gradient(135deg,#f3e2b3,#e8b4b8 40%,#7b1e2b)','linear-gradient(135deg,#ffffff,#f3e2b3 45%,#b76e79)'];
var LS={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var S=Object.assign({owner:'SAJAD-52',repo:'cnyjewelry',branch:'main',token:'',domain:'https://mcgeejewelry.com',gemKey:'',gemModel:'gemini-3.5-flash',gemSearch:true,gemSearchArticle:false,niche:"women's jewelry: rings, necklaces, earrings, bracelets, gold and silver, diamonds, gemstones, care, sizing, gifts and styling"},LS.get('md_settings',{}));
var A=LS.get('md_articles',[]);
var view='blog',editId=null,busy=false,polls={};
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escA(s){return esc(s).replace(/"/g,'&quot;')}
function save(){LS.set('md_articles',A);LS.set('md_settings',S)}
function slugify(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
function plain(h){return h.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim()}
/* ---------- markdown ---------- */
function inline(s){s=esc(s);s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,function(m,t,u){return '<a href="'+u+'">'+t+'</a>'});s=s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');return s.replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g,'$1<i>$2</i>')}
var LI=/^(-|\*|\d+\.)\s+/;
function md(body){var L=body.replace(/^\n+|\n+$/g,'').split('\n'),i=0,out=[];
while(i<L.length){var l=L[i];
if(!l.trim()){i++;continue}
if(l.indexOf(':::note')===0){var b=[];i++;while(i<L.length&&L[i].indexOf(':::')!==0){b.push(L[i]);i++}i++;out.push('<p class="note">'+inline(b.join(' '))+'</p>');continue}
if(l.indexOf('### ')===0){out.push('<h3 class="serif">'+inline(l.slice(4))+'</h3>');i++;continue}
if(l.charAt(0)==='|'){var rows=[];while(i<L.length&&L[i].charAt(0)==='|'){rows.push(L[i]);i++}
var cells=rows.filter(function(r){return !/^\|[\s:|-]+\|?$/.test(r)}).map(function(r){return r.trim().replace(/^\||\|$/g,'').split('|').map(function(c){return c.trim()})});
if(cells.length){out.push('<div class="overflow-x-auto"><table><thead><tr>'+cells[0].map(function(c){return '<th>'+inline(c)+'</th>'}).join('')+'</tr></thead><tbody>'+cells.slice(1).map(function(r){return '<tr>'+r.map(function(c){return '<td>'+inline(c)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>')}continue}
if(LI.test(l)){var ord=/^\d/.test(l),it=[];while(i<L.length&&LI.test(L[i])){it.push(L[i].replace(LI,''));i++}var t=ord?'ol':'ul';out.push('<'+t+'>'+it.map(function(x){return '<li>'+inline(x)+'</li>'}).join('')+'</'+t+'>');continue}
var p=[];while(i<L.length&&L[i].trim()&&!/^(#{2,3} |\||:::|(-|\*|\d+\.)\s+)/.test(L[i])){p.push(L[i]);i++}
if(!p.length){p.push(L[i]);i++}
out.push('<p>'+inline(p.join(' '))+'</p>')}
return out.join('')}
function parse(t){t=t.replace(/\r\n/g,'\n');var m=t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/),fm={},body=t;
if(m){m[1].split('\n').forEach(function(l){var i=l.indexOf(':');if(i>0&&l.charAt(0)!=='#')fm[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim().replace(/^"|"$/g,'')});body=m[2]}
var parts=body.split(/^## (.+)$/m),secs=[],faq=[];
for(var j=1;j<parts.length;j+=2){var h=parts[j].trim(),b=parts[j+1]||'';
if(/^(faq|frequently asked questions)$/i.test(h)){b.split(/^### /m).slice(1).forEach(function(q){var k=q.indexOf('\n');faq.push([q.slice(0,k<0?q.length:k).trim(),k<0?'':q.slice(k+1).trim()])})}else secs.push([h,b])}
return {fm:fm,body:body.trim(),secs:secs,faq:faq}}
/* ---------- hero art ---------- */
function defs(id){return '<defs><linearGradient id="g'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e2b3"/><stop offset=".5" stop-color="#e8b4b8"/><stop offset="1" stop-color="#b76e79"/></linearGradient></defs>'}
function wrapSvg(label,d){return '<svg viewBox="0 0 400 190" class="w-full" role="img" aria-label="'+label+'">'+d+'</svg>'}
var HERO={
chain:function(){var d=defs('c');for(var i=0;i<38;i++){var t=i/37,x=40+320*t,y=20+130*(1-Math.pow(2*t-1,2)),a=Math.atan2(-520*(2*t-1),320)*180/Math.PI+(i%2?38:-38);d+='<rect x="-10" y="-3.4" width="20" height="6.8" rx="3.4" fill="url(#gc)" stroke="rgba(60,30,40,.35)" stroke-width=".6" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+a.toFixed(1)+')"/>'}return wrapSvg('Illustration of a chain necklace',d)},
rings:function(){return wrapSvg('Illustration of rings',defs('r')+'<circle cx="85" cy="112" r="40" fill="none" stroke="url(#gr)" stroke-width="10"/><polygon points="70,48 100,48 110,60 85,80 60,60" fill="#fde7ec" stroke="#b76e79"/><circle cx="205" cy="105" r="42" fill="none" stroke="#cfd5de" stroke-width="11"/><circle cx="320" cy="108" r="40" fill="none" stroke="url(#gr)" stroke-width="7"/><circle cx="320" cy="108" r="30" fill="none" stroke="#cfd5de" stroke-width="7"/><circle cx="320" cy="108" r="21" fill="none" stroke="url(#gr)" stroke-width="5"/>')},
infinity:function(){function pt(t){var s=1+Math.pow(Math.sin(t),2);return [200+130*Math.cos(t)/s,85+130*Math.sin(t)*Math.cos(t)/s]}
var p1=[],p2=[],d=defs('i'),i,q;for(i=0;i<=60;i++){q=pt(Math.PI*i/60);p1.push(q[0].toFixed(1)+','+q[1].toFixed(1));q=pt(Math.PI+Math.PI*i/60);p2.push(q[0].toFixed(1)+','+q[1].toFixed(1))}
d+='<polyline points="'+p1.join(' ')+'" fill="none" stroke="url(#gi)" stroke-width="9" stroke-linecap="round"/><polyline points="'+p2.join(' ')+'" fill="none" stroke="#cfd5de" stroke-width="9" stroke-linecap="round"/>';
for(i=0;i<28;i++){q=pt(2*Math.PI*i/28);d+='<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="3.1" fill="#fff" stroke="#b76e79" stroke-width=".8"/>'}
return wrapSvg('Illustration of an infinity band',d)},
earrings:function(){return wrapSvg('Illustration of earrings',defs('e')+'<circle cx="100" cy="95" r="50" fill="none" stroke="url(#ge)" stroke-width="12"/><circle cx="290" cy="26" r="6" fill="url(#ge)"/><path d="M290 32v34" stroke="url(#ge)" stroke-width="4" stroke-linecap="round"/><ellipse cx="290" cy="108" rx="30" ry="40" fill="#efe3da" stroke="rgba(120,90,70,.35)" transform="rotate(-8 290 108)"/>')},
gem:function(){return wrapSvg('Illustration of a diamond',defs('m')+'<polygon points="150,50 250,50 290,95 200,170 110,95" fill="url(#gm)" opacity=".95"/><g stroke="rgba(60,30,40,.45)" stroke-width="1.2" fill="none"><polyline points="110,95 290,95"/><polyline points="150,50 175,95 200,170 225,95 250,50"/></g><g fill="#f3e2b3"><path d="M320 40l4 11 11 4-11 4-4 11-4-11-11-4 11-4z"/><path d="M70 60l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/></g>')}};
/* ---------- checks ---------- */
function analyse(a){var p=parse(a.body||''),errs=[],warns=[],html=p.secs.map(function(s){return md(s[1])}).join(''),words=plain(html).split(' ').filter(Boolean).length;
if(!a.title)errs.push('Add a title');
if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug||''))errs.push('The URL slug must use lowercase letters, numbers and dashes');
var dl=(a.description||'').length;if(dl<70||dl>170)errs.push('The description should be 70 to 170 characters (now '+dl+')');
if(!a.lead)errs.push('Add a short intro line (lead)');
if(words<600)errs.push('The article has '+words+' words. Aim for at least 600');
if(p.secs.length<4)errs.push('Add at least 4 sections (## headings). Now '+p.secs.length);
if(p.faq.length<3)errs.push('Add at least 3 FAQ questions under "## FAQ". Now '+p.faq.length);
if(/TODO|lorem ipsum|\[insert/i.test(a.body||''))errs.push('Remove placeholder text');
var links=[],re=/\]\(([^)\s]+)\)/g,m;while((m=re.exec(a.body||'')))links.push(m[1]);
var internal=links.filter(function(l){return !/^(https?:|mailto:)/.test(l)});
if(internal.length<3)errs.push('Add at least 3 internal links to your tools or articles. Now '+internal.length);
internal.forEach(function(l){var f=l.split('#')[0];if(/\.html$/.test(f)&&TOOLS.indexOf(f)<0)errs.push('Unknown page: '+l)});
return {errs:errs,warns:warns,words:words,parsed:p}}
/* ---------- templates ---------- */
function related(a,reg){var u='/'+a.slug,pool=reg.filter(function(r){return r.url!==u}),same=pool.filter(function(r){return r.cat===a.category}),out=same.concat(pool.filter(function(r){return same.indexOf(r)<0}));return out.slice(0,3)}
function articleHtml(a,reg,words,p){var D=S.domain.replace(/\/+$/,''),url='/'+a.slug,body='',mid=Math.floor((p.secs.length-1)/2);
p.secs.forEach(function(s,n){body+='<div class="pk mx-auto max-w-3xl"><h2 class="serif">'+inline(s[0])+'</h2>'+md(s[1])+'</div>';if(n===mid)body+='<div data-showcase data-title="Put this guide to work" data-sub="Twelve free tools, built for jewelry. Tools for this guide are shown first." data-pick="'+escA(a.pick||'sizing,styling,care')+'"></div>'});
var faq=p.faq.map(function(q){return '<details class="faq"><summary>'+inline(q[0])+'</summary><div class="muted mt-3">'+md(q[1])+'</div></details>'}).join('');
var rel=related(a,reg).map(function(r){return '<a href="'+escA(r.url)+'" class="glass glow p-5 block no-underline text-inherit"><h3 class="serif text-2xl">'+esc(r.title.length>60?r.short:r.title)+'</h3><p class="muted text-sm mt-1">'+esc(r.blurb)+'</p></a>'}).join('');
var ld=[{"@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.description,"dateModified":new Date().toISOString().slice(0,10),"author":{"@type":"Organization","name":"McGee Jewelry"},"publisher":{"@type":"Organization","name":"McGee Jewelry"},"mainEntityOfPage":D+url}];
if(p.faq.length)ld.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":p.faq.map(function(q){return {"@type":"Question","name":q[0],"acceptedAnswer":{"@type":"Answer","text":plain(md(q[1]))}}})});
var hero=HERO[a.hero]?HERO[a.hero]():'',read=Math.max(3,Math.round(words/200))+' min read';
return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/"><title>'+esc(a.title)+' | McGee Jewelry</title><meta name="description" content="'+escA(a.description)+'"><meta name="theme-color" content="#fbf5f2"><link rel="canonical" href="'+D+url+'"><meta property="og:title" content="'+escA(a.title)+'"><meta property="og:description" content="'+escA(a.description)+'"><meta property="og:type" content="article"><meta property="og:url" content="'+D+url+'"><meta property="og:image" content="'+D+'/pins/'+a.slug+'.png"><link rel="icon" href="favicon.svg" type="image/svg+xml">'+FONT+'<script type="application/ld+json">'+JSON.stringify(ld).replace(/<\//g,'<\\/')+'<\/script></head><body><a class="skip" href="'+url+'#main">Skip to content</a><div id="nav"></div><main id="main" class="mx-auto max-w-6xl px-5 pb-24 pt-10"><article><header class="mx-auto max-w-3xl"><p class="muted text-sm"><a href="blog.html" style="text-decoration:underline">Blog</a> &rsaquo; '+esc(a.category)+'</p><h1 class="text-5xl md:text-6xl gt mt-4">'+esc(a.title)+'</h1><p class="muted text-xl mt-5">'+inline(a.lead)+'</p><p class="muted text-sm mt-4">By McGee Jewelry &middot; Updated '+new Date().toISOString().slice(0,10)+' &middot; '+read+'</p>'+(hero?'<div class="glass p-6 mt-8" style="color:#b76e79">'+hero+'</div>':'')+'</header>'+body+(faq?'<div class="pk mx-auto max-w-3xl"><h2 class="serif">Frequently asked questions</h2><div class="grid gap-3 mt-4">'+faq+'</div></div>':'')+'<div class="mx-auto max-w-5xl mt-16"><h2 class="serif text-4xl gt mb-5">Keep reading</h2><div class="grid md:grid-cols-3 gap-4">'+rel+'</div></div></article><div data-aff="'+escA(a.aff||'everyday')+'"></div><div data-ad="banner"></div></main><div id="foot"></div><script src="layout.js"><\/script><script src="ads.js"><\/script><script src="affiliates.js"><\/script><script src="showcase.js"><\/script></body></html>'}
function blogHtml(reg){var cats=[];reg.forEach(function(r){if(cats.indexOf(r.cat)<0)cats.push(r.cat)});
var P=reg.map(function(r){return [r.cat,r.title,r.blurb,r.read,r.url,r.grad]});
var js='var P='+JSON.stringify(P).replace(/<\//g,'<\\/')+',CT=[[\'all\',\'All posts\']].concat('+JSON.stringify(cats)+'.map(function(c){return [c,c]})),cur=\'all\';'
+"function draw(){document.getElementById('bf').innerHTML=CT.map(function(c){return '<button class=\"chip\" style=\"padding:.35rem .95rem\" role=\"tab\" aria-selected=\"'+(c[0]===cur)+'\" data-c=\"'+c[0]+'\">'+c[1]+'</button>'}).join('');"
+"var l=P.filter(function(p){return cur==='all'||p[0]===cur});"
+"document.getElementById('bg').innerHTML=l.map(function(p,i){var big=i===0&&cur==='all';return '<a href=\"'+p[4]+'\" class=\"glass glow block no-underline text-inherit fade'+(big?' md:col-span-2':'')+'\" style=\"padding:0\"><div style=\"height:'+(big?'11rem':'7.5rem')+';background:'+p[5]+';display:flex;align-items:flex-end;padding:1rem\"><span class=\"chip\" style=\"padding:.2rem .8rem;font-size:.8rem;background:rgba(255,255,255,.85);color:#3b1a22;border-color:transparent\">'+p[0]+'</span></div><div style=\"padding:1.5rem\"><h2 class=\"serif\" style=\"font-size:'+(big?'2.4rem':'1.9rem')+'\">'+p[1]+'</h2><p class=\"muted mt-2\">'+p[2]+'</p><p class=\"mt-4 text-sm\"><span class=\"muted\">'+p[3]+'</span> &nbsp; <b class=\"gt\">Read the guide &rarr;</b></p></div></a>'}).join('');"
+"document.querySelectorAll('#bf [data-c]').forEach(function(b){b.onclick=function(){cur=b.dataset.c;draw()}})}draw();";
var D=S.domain.replace(/\/+$/,'');
return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog: jewelry guides and style advice | McGee Jewelry</title><meta name="description" content="Guides from McGee Jewelry on chains, rings, earrings, plating, seasonal style and gifts."><meta name="theme-color" content="#fbf5f2"><link rel="canonical" href="'+D+'/blog"><link rel="icon" href="favicon.svg" type="image/svg+xml">'+FONT+'</head><body><a class="skip" href="#main">Skip to content</a><div id="nav"></div><main id="main" class="mx-auto max-w-6xl px-5 pb-24 pt-10"><div class="max-w-2xl mb-10"><h1 class="text-5xl md:text-6xl gt">The McGee Jewelry blog</h1><p class="muted text-lg mt-4">Practical guides on chains, rings, earrings, plating, seasonal style and gifts.</p></div><div id="bf" class="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Blog categories"></div><div id="bg" class="grid md:grid-cols-2 gap-5"></div><div data-showcase data-title="Try the tools behind the guides" data-sub="Every article links to free tools. Open one now." data-pick="sizing,care,styling"></div><div data-ad="banner"></div></main><div id="foot"></div><script src="layout.js"><\/script><script src="ads.js"><\/script><script src="showcase.js"><\/script><script>'+js+'<\/script></body></html>'}
function pinPng(title){var c=document.createElement('canvas');c.width=1000;c.height=1500;var x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,1500);g.addColorStop(0,'#fbebec');g.addColorStop(1,'#bd8ca6');x.fillStyle=g;x.fillRect(0,0,1000,1500);x.strokeStyle='#b76e79';x.lineWidth=4;x.strokeRect(40,40,920,1420);x.textAlign='center';
var F='Georgia, "Times New Roman", serif';x.fillStyle='#8a4b57';x.font='34px '+F;x.fillText('McGee Jewelry',500,160);x.fillStyle='#3b1a22';x.font='76px '+F;
var lines=[],cur='';title.split(' ').forEach(function(w){var t=(cur+' '+w).trim();if(x.measureText(t).width>840&&cur){lines.push(cur);cur=w}else cur=t});lines.push(cur);
var y=750-lines.length*50;lines.forEach(function(l){x.fillText(l,500,y);y+=100});x.fillStyle='#b76e79';x.fillRect(410,y+10,180,4);x.fillStyle='#8a4b57';x.font='38px '+F;x.fillText('Read the guide at mcgeejewelry.com',500,1310);return c.toDataURL('image/png').split(',')[1]}
/* ---------- GitHub ---------- */
function b64(s){var b=new TextEncoder().encode(s),bin='';b.forEach(function(x){bin+=String.fromCharCode(x)});return btoa(bin)}
function unb64(s){var bin=atob(s.replace(/\n/g,'')),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new TextDecoder().decode(u)}
function gh(path,opt){opt=opt||{};var h={'Authorization':'Bearer '+S.token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};if(opt.body)h['Content-Type']='application/json';
return fetch('https://api.github.com/repos/'+encodeURIComponent(S.owner)+'/'+encodeURIComponent(S.repo)+path,{method:opt.method||'GET',headers:h,body:opt.body?JSON.stringify(opt.body):undefined}).then(function(r){
if(!r.ok)return r.text().then(function(t){var e=new Error(r.status+' '+t.slice(0,180));e.status=r.status;throw e});return r.status===204?null:r.json()})}
function readFile(p){return gh('/contents/'+encodeURI(p)+'?ref='+encodeURIComponent(S.branch)).then(function(j){return unb64(j.content)},function(e){if(e.status===404)return null;throw e})}
function log(m){var el=$('#log');if(el){el.textContent+=m+'\n'}}
function today(){return new Date().toISOString().slice(0,10)}
function publish(id){var a=A.filter(function(x){return x.id===id})[0];if(!a||busy)return;
if(!S.token){alert('Add your GitHub token in Settings first.');view='settings';render();return}
var r=analyse(a);if(r.errs.length){alert('Fix these first:\n- '+r.errs.join('\n- '));return}
busy=true;render();log('Publishing "'+a.title+'"...');var reg,files={},base,baseTree,newCommit;
gh('/git/ref/heads/'+encodeURIComponent(S.branch)).then(function(ref){base=ref.object.sha;log('Connected to '+S.owner+'/'+S.repo);return gh('/git/commits/'+base)})
.then(function(c){baseTree=c.tree.sha;return Promise.all([readFile('blog-data.json'),readFile('layout.js'),readFile('sitemap.xml')])})
.then(function(f){var data=f[0]?JSON.parse(f[0]):window.LEGACY.slice();reg=data.filter(function(x){return x.url!=='/'+a.slug});
var entry={url:'/'+a.slug,title:a.title,blurb:a.description,cat:a.category||'Guides',short:a.short||a.title.slice(0,28),read:Math.max(3,Math.round(r.words/200))+' min read',date:today(),grad:GRADS[a.slug.length%GRADS.length]};
var old=data.filter(function(x){return x.url==='/'+a.slug})[0];if(old)entry.grad=old.grad;reg.push(entry);reg.sort(function(x,y){return x.date<y.date?1:x.date>y.date?-1:0});
files[a.slug+'/index.html']=articleHtml(a,reg,r.words,r.parsed);files['blog.html']=blogHtml(reg);files['blog-data.json']=JSON.stringify(reg,null,1);
var lj=f[1];if(lj&&/var guides=\[[\s\S]*?\];/.test(lj)){files['layout.js']=lj.replace(/var guides=\[[\s\S]*?\];/,function(){return 'var guides=['+reg.slice(0,8).map(function(x){return '['+JSON.stringify(x.url)+','+JSON.stringify(x.short)+']'}).join(',')+'];'})}else log('Note: layout.js footer list not found, skipped.');
var sm=f[2],loc=D()+'/'+a.slug;if(sm&&sm.indexOf('<loc>'+loc+'</loc>')<0)files['sitemap.xml']=sm.replace('</urlset>','  <url><loc>'+loc+'</loc></url>\n</urlset>');
log('Built the article, blog page and footer link.');
var tree=[],chain=Promise.resolve();
Object.keys(files).forEach(function(p){chain=chain.then(function(){return gh('/git/blobs',{method:'POST',body:{content:b64(files[p]),encoding:'base64'}})}).then(function(b){tree.push({path:p,mode:'100644',type:'blob',sha:b.sha})})});
chain=chain.then(function(){log('Creating the social pin image...');return gh('/git/blobs',{method:'POST',body:{content:pinPng(a.title),encoding:'base64'}})}).then(function(b){tree.push({path:'pins/'+a.slug+'.png',mode:'100644',type:'blob',sha:b.sha})});
return chain.then(function(){return tree})})
.then(function(tree){return gh('/git/trees',{method:'POST',body:{base_tree:baseTree,tree:tree}})})
.then(function(t){return gh('/git/commits',{method:'POST',body:{message:'Publish article: '+a.title,tree:t.sha,parents:[base]}})})
.then(function(c){newCommit=c.sha;return gh('/git/refs/heads/'+encodeURIComponent(S.branch),{method:'PATCH',body:{sha:newCommit}})})
.then(function(){a.status='published';a.url='/'+a.slug;a.live=false;a.publishedAt=new Date().toISOString();save();log('Done. Saved to GitHub. Vercel is deploying the site (usually 1 to 2 minutes).');busy=false;poll(a);render()})
.catch(function(e){log('Failed: '+e.message);busy=false;render();alert('Publishing failed:\n'+e.message)})}
function D(){return S.domain.replace(/\/+$/,'')}
function poll(a){if(polls[a.id])return;var n=0;polls[a.id]=setInterval(function(){n++;fetch(D()+'/'+a.slug+'?t='+Date.now(),{method:'HEAD',cache:'no-store'}).then(function(r){if(r.ok){a.live=true;save();clearInterval(polls[a.id]);delete polls[a.id];if(view==='blog')render()}},function(){a.live='unknown';clearInterval(polls[a.id]);delete polls[a.id];if(view==='blog')render()});if(n>40){clearInterval(polls[a.id]);delete polls[a.id]}},8000)}
function pinUrl(a){var link=D()+'/'+a.slug,media=D()+'/pins/'+a.slug+'.png',tags=(a.keywords||'').split(',').map(function(k){return k.trim().replace(/[^a-zA-Z0-9]+/g,'')}).filter(Boolean).slice(0,5).map(function(k){return '#'+k}).join(' ');
return {href:'https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(link)+'&media='+encodeURIComponent(media)+'&description='+encodeURIComponent((a.title+'. '+a.description+' '+tags).slice(0,480)),text:a.title+'. '+a.description+' '+tags}}
/* ---------- views ---------- */
function chip(a){if(a.status!=='published')return '<span class="pill dr">Draft</span>';if(a.live===true)return '<span class="pill live">Live</span>';if(a.live==='unknown')return '<span class="pill dep">Published (check the link)</span>';return '<span class="pill dep">Deploying...</span>'}
function renderBlog(){var rows=A.slice().sort(function(x,y){return (y.updated||'')>(x.updated||'')?1:-1}).map(function(a){var w=analyse(a).words,pub=a.status==='published';
return '<div class="glass p-5"><div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="serif text-2xl">'+esc(a.title||'Untitled')+'</h3><p class="muted text-sm">/'+esc(a.slug)+' &middot; '+w+' words &middot; '+chip(a)+'</p></div><div class="flex flex-wrap gap-2"><button class="btn btn-ghost" style="padding:.35rem 1rem" data-act="edit" data-id="'+a.id+'">Edit</button><button class="btn btn-gold" style="padding:.35rem 1rem" data-act="publish" data-id="'+a.id+'"'+(busy?' disabled':'')+'>'+(pub?'Update on site':'Publish to site')+'</button><button class="btn btn-ghost" style="padding:.35rem 1rem" data-act="pin" data-id="'+a.id+'"'+(pub?'':' disabled')+'>Publish to Pinterest</button>'+(pub?'':'<button class="btn btn-ghost" style="padding:.35rem 1rem" data-act="del" data-id="'+a.id+'">Delete</button>')+'</div></div></div>'}).join('');
$('#app').innerHTML='<div class="flex flex-wrap items-center justify-between gap-3"><h1 class="text-4xl gt">Blog</h1><button class="btn btn-gold" data-act="new">+ Add article</button></div><p class="muted mt-2">Add an article, publish it to the site, then send it to Pinterest.</p><div class="grid gap-4 mt-6">'+(rows||'<div class="glass p-8 text-center"><h3 class="serif text-3xl gt">No articles yet</h3><p class="muted mt-2">Click <b>Add article</b> and paste the article you got from Claude.</p></div>')+'</div>'+'<div class="glass p-5 mt-6"><h3 class="serif text-2xl">Activity</h3><div id="log" class="muted mt-2">'+esc(LOG)+'</div></div>'}
var LOG='';var _log=log;log=function(m){LOG+=m+'\n';_log(m)};
function renderEditor(){var a=A.filter(function(x){return x.id===editId})[0]||{},f=function(k,d){return escA(a[k]!=null?a[k]:d)};
var cats=['Guides','Trends','Buying advice','Seasonal','Spotlight','Care','Gifts'];
$('#app').innerHTML='<div class="flex flex-wrap items-center justify-between gap-3"><h1 class="text-4xl gt">'+(a.id?'Edit article':'Add article')+'</h1><button class="btn btn-ghost" data-act="view" data-id="blog">&larr; Back</button></div>'
+aiPanel()+'<div class="glass p-5 mt-5"><p class="muted">Fastest way: click <b>Import .md file</b> and choose the article file from Claude. The fields fill in automatically.</p><label class="btn btn-ghost mt-3" style="cursor:pointer">Import .md file<input type="file" id="imp" accept=".md,.txt" class="sr"></label></div>'
+'<div class="glass p-5 mt-5"><label class="fld"><span>Title</span><input id="f_title" value="'+f('title','')+'"></label><label class="fld"><span>Page address (slug)</span><input id="f_slug" value="'+f('slug','')+'" placeholder="how-to-stack-rings"></label><label class="fld"><span>Description for Google (70 to 170 characters) <b id="dl"></b></span><input id="f_description" value="'+f('description','')+'"></label><label class="fld"><span>Intro line (shown under the title)</span><input id="f_lead" value="'+f('lead','')+'"></label>'
+'<div class="grid sm:grid-cols-3 gap-3"><label class="fld"><span>Category</span><input id="f_category" list="cats" value="'+f('category','Guides')+'"><datalist id="cats">'+cats.map(function(c){return '<option value="'+c+'">'}).join('')+'</datalist></label><label class="fld"><span>Short footer title</span><input id="f_short" value="'+f('short','')+'"></label><label class="fld"><span>Keywords (for Pinterest tags)</span><input id="f_keywords" value="'+f('keywords','')+'"></label></div>'
+'<div class="grid sm:grid-cols-3 gap-3"><label class="fld"><span>Header drawing</span><select id="f_hero">'+['gem','chain','rings','infinity','earrings','none'].map(function(h){return '<option'+((a.hero||'gem')===h?' selected':'')+'>'+h+'</option>'}).join('')+'</select></label><label class="fld"><span>Partner cards</span><select id="f_aff">'+['everyday','diamond','gift','care','sizing'].map(function(h){return '<option'+((a.aff||'everyday')===h?' selected':'')+'>'+h+'</option>'}).join('')+'</select></label><label class="fld"><span>Tools to highlight</span><input id="f_pick" value="'+f('pick','sizing,styling,care')+'"></label></div>'
+'<label class="fld"><span>Article text (## sections, then ## FAQ with ### questions)</span><textarea id="f_body" spellcheck="true">'+esc(a.body||'')+'</textarea></label></div>'
+'<div class="glass p-5 mt-5"><h3 class="serif text-2xl">Checks</h3><ul class="ck mt-2" id="ck"></ul></div>'
+'<div class="flex flex-wrap gap-3 mt-5"><button class="btn btn-gold" data-act="savedraft">Save article</button><button class="btn btn-ghost" data-act="savepub"'+(busy?' disabled':'')+'>Save and publish to site</button></div>';
['title','slug','description','lead','category','short','keywords','hero','aff','pick','body'].forEach(function(k){var el=$('#f_'+k);el.addEventListener('input',function(){if(k==='title'&&!el.dataset.touched&&!$('#f_slug').dataset.touched)$('#f_slug').value=slugify(el.value);if(k==='slug')el.dataset.touched=1;live()})});
$('#f_slug').dataset.touched=a.slug?'1':'';$('#imp').addEventListener('change',function(e){var fl=e.target.files[0];if(!fl)return;var rd=new FileReader();rd.onload=function(){var p=parse(rd.result),m=p.fm;
var set=function(k,v){if(v!=null)$('#f_'+k).value=v};set('title',m.title);set('slug',m.slug||(m.title?slugify(m.title):''));set('description',m.description);set('lead',m.lead);set('category',m.category||'Guides');set('short',m.short);set('keywords',m.keywords);set('hero',m.hero||'gem');set('aff',m.aff||'everyday');set('pick',m.pick||'sizing,styling,care');$('#f_body').value=p.body;$('#f_slug').dataset.touched='1';live()};rd.readAsText(fl)});renderSug();live()}
/* ---------- Gemini AI writer ---------- */
var SUG=[],CH=null,aiBusy=false;
var CATS='Guides, Trends, Buying advice, Seasonal, Spotlight, Care, Gifts';
function aiMsg(m,bad){var e=$('#ai_msg');if(e){e.textContent=m;e.style.color=bad?'#b3262e':''}}
function gem(prompt,search,maxTok){
if(!S.gemKey)return Promise.reject(new Error('Add your Gemini API key in Settings first.'));
var body={contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0.8,maxOutputTokens:maxTok||8192}};
if(search)body.tools=[{google_search:{}}];
return fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(S.gemModel||'gemini-3.5-flash')+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':S.gemKey},body:JSON.stringify(body)})
.then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error((j.error&&j.error.message)||('HTTP '+r.status));return j},function(){throw new Error('HTTP '+r.status)})})
.then(function(j){var c=j.candidates&&j.candidates[0];if(!c||!c.content||!c.content.parts){var br=j.promptFeedback&&j.promptFeedback.blockReason;throw new Error(br?'Gemini blocked the request: '+br:'Gemini returned no text. Try again.')}
return {text:c.content.parts.map(function(p){return p.text||''}).join(''),finish:c.finishReason}})}
function existingTitles(){return (window.LEGACY||[]).map(function(r){return r.title}).concat(A.map(function(a){return a.title})).filter(Boolean)}
function titlePrompt(topic){var d=new Date().toISOString().slice(0,10);
return 'You are an SEO strategist for McGee Jewelry (mcgeejewelry.com), a free jewelry tools and guides website. Audience: women. Niche: '+(S.niche||'')+'.\n'
+'Today is '+d+'. Use Google Search now to find (1) the questions people actually ask Google about jewelry, such as "People also ask" questions, autocomplete-style searches and forum questions, and (2) jewelry topics, styles and products that are trending right now.\n'
+'Owner focus for this batch: '+(topic?'"'+topic+'"':'none, cover the whole niche')+'.\n\n'
+'Return exactly 8 article title ideas that match what people really search for.\nRULES:\n'
+'- Each title is 45 to 65 characters and written the way people search: questions, "how to", "what is", "best", "vs", "is it worth", "which".\n'
+'- At least 5 are evergreen, high-volume questions. At least 2 are about what is trending now.\n'
+'- Each must be answerable by an honest, useful guide. No clickbait, no unverifiable claims, no brand names unless the topic needs them.\n'
+'- Do not repeat or closely overlap these existing articles: '+existingTitles().join(' | ')+'.\n'
+'- Prefer specific long-tail questions over broad topics.\n\n'
+'OUTPUT: only a JSON array, with no markdown fence and no commentary. Exactly 8 objects shaped like {"title":"","keyword":"main search keyword","question":"the real question people ask","why":"short reason it is popular or trending now","type":"evergreen or trending"}.'}
function parseArr(t){var i=t.indexOf('['),j=t.lastIndexOf(']');if(i<0||j<i)return [];try{var a=JSON.parse(t.slice(i,j+1));return Array.isArray(a)?a.filter(function(x){return x&&x.title}):[]}catch(e){return []}}
function renderSug(){var el=$('#ai_titles');if(!el)return;
el.innerHTML=SUG.length?'<p class="muted text-sm mt-4">Pick one title. You can still edit it in the Title field.</p><div class="grid gap-2 mt-2">'+SUG.map(function(s,i){return '<label class="stat" style="display:block;cursor:pointer;padding:.7rem 1rem"><input type="radio" name="ttl" value="'+i+'"'+(CH&&CH===s?' checked':'')+'> <b>'+esc(s.title)+'</b><span class="muted text-sm" style="display:block;margin-left:1.4rem">'+esc(s.type||'')+(s.question?' &middot; people ask: '+esc(s.question):'')+(s.why?' &middot; '+esc(s.why):'')+'</span></label>'}).join('')+'</div><p class="muted text-xs mt-2">Titles are based on what Gemini finds in Google Search. For exact search volumes, check Google Trends and Search Console.</p>':'';
var g=$('#ai_gen');if(g)g.hidden=!SUG.length&&!($('#f_title')&&$('#f_title').value.trim())}
function pickTitle(i){CH=SUG[i]||null;if(!CH)return;$('#f_title').value=CH.title;var sl=$('#f_slug');if(!sl.dataset.touched)sl.value=slugify(CH.title);var g=$('#ai_gen');if(g)g.hidden=false;live();aiMsg('Title chosen. Click Generate article.')}
function suggest(){if(aiBusy)return;aiBusy=true;var topic=($('#ai_topic').value||'').trim(),useS=S.gemSearch!==false;
aiMsg(useS?'Searching Google for common questions and trends with Gemini...':'Asking Gemini for title ideas...');
var run=function(s){return gem(titlePrompt(topic),s,8192).then(function(r){var a=parseArr(r.text);if(!a.length)throw new Error('Gemini did not return usable titles. Click Suggest again.');return a})};
run(useS).catch(function(e){if(useS&&/tool|search|ground/i.test(e.message)){aiMsg('Search is not available for this key or model. Trying without it...');return run(false)}throw e})
.then(function(a){SUG=a.slice(0,8);CH=null;renderSug();aiMsg('Done. Pick one of the '+SUG.length+' titles.')},function(e){aiMsg(e.message,true)}).then(function(){aiBusy=false})}
function articlePrompt(c,problems){var pages=(window.LEGACY||[]).map(function(r){return r.url}).concat(A.filter(function(a){return a.status==='published'}).map(function(a){return '/'+a.slug}));
return 'Write ONE complete article for McGee Jewelry (mcgeejewelry.com), a free jewelry tools and guides website for women. It must be genuinely helpful, original and written for people first, while following good on-page SEO.\n\n'
+'TITLE (use exactly): '+c.title+'\nMAIN KEYWORD: '+(c.keyword||c.title)+'\nTHE QUESTION IT ANSWERS: '+(c.question||c.title)+'\nSITE NICHE: '+(S.niche||'')+'\n\n'
+'OUTPUT: ONLY the finished markdown file, with no code fences and no commentary. It starts with a front matter block between --- lines, exactly with these keys:\n'
+'title: (the exact title)\nslug: (3 to 6 lowercase words with dashes, containing the main keyword)\ndescription: (120 to 160 characters, includes the main keyword, gives a reason to click)\nlead: (1 or 2 sentences shown under the title)\ncategory: (one of: '+CATS+')\nshort: (22 to 28 character footer title)\nkeywords: (5 to 8 comma-separated search terms)\nhero: (one of: gem, chain, rings, infinity, earrings, none)\naff: (one of: everyday, diamond, gift, care, sizing)\npick: (3 tool ids from: sizing, diamond, styling, layering, earrings, photo, care, gift, anniversary, birth, wishlist, gold)\n\n'
+'Then the body in this format:\n## Section heading\nParagraphs. **bold**, *italic*, [link text](target)\n- bullet lines, 1. numbered lines, and | table | rows | with a | --- | --- | divider line\n:::note\nA highlighted note.\n:::\n## FAQ\n### Question?\nAnswer.\n\n'
+'SEO AND QUALITY RULES\n- Answer the main question directly in the first paragraph of the first section (40 to 60 words), then go deeper.\n- 850 to 1100 words across 6 to 8 sections (## headings). Make at least 3 headings read like questions people ask. Use the main keyword naturally in the title, lead, first paragraph and one heading, plus related terms and synonyms. No keyword stuffing.\n- Short paragraphs of 2 to 4 sentences. Use bullet lists, and one table where a comparison helps.\n- End with ## FAQ containing 5 real questions as ### lines, each answered in 1 to 3 sentences.\n- Include at least 5 internal links with natural anchor text, spread through the article, using ONLY these targets: sizing.html, styling.html, care.html, gift.html, layering.html, anniversary.html, gold.html, diamond.html, earrings.html, wishlist.html, and these articles: '+pages.join(', ')+'.\n- Accuracy: use widely accepted jewelry knowledge. Do NOT invent statistics, prices, studies, brand claims, awards or medical claims. If something varies by country or maker, say so. No made-up personal experiences. Do not mention AI. Do not copy phrasing from any source.\n- Do not include date, publish_at or draft lines.\n'
+(problems?'\nFIX THESE PROBLEMS FROM THE LAST ATTEMPT: '+problems+'\n':'')}
function cleanMd(t){t=t.trim().replace(/^```[a-z]*\n/,'').replace(/\n```$/,'');var i=t.indexOf('---');return (i>0&&i<200?t.slice(i):t).trim()}
function uniqueSlug(s){var base=s||'article',n=2,used=function(x){return A.some(function(a){return a.slug===x&&a.id!==editId})||(window.LEGACY||[]).some(function(r){return r.url==='/'+x})};while(used(s)){s=base+'-'+n;n++}return s}
function applyMd(text,c){var p=parse(cleanMd(text)),m=p.fm;if(!m.title&&!p.secs.length)throw new Error('Gemini did not return the article format. Try again.');
var o={title:c.title,slug:uniqueSlug(slugify(m.slug||c.title)),description:m.description||'',lead:m.lead||'',category:m.category||'Guides',short:m.short||c.title.slice(0,28),keywords:m.keywords||'',hero:m.hero||'gem',aff:m.aff||'everyday',pick:m.pick||'sizing,styling,care',body:p.body};
if(['gem','chain','rings','infinity','earrings','none'].indexOf(o.hero)<0)o.hero='gem';if(['everyday','diamond','gift','care','sizing'].indexOf(o.aff)<0)o.aff='everyday';return o}
function fillForm(o){['title','slug','description','lead','category','short','keywords','hero','aff','pick','body'].forEach(function(k){$('#f_'+k).value=o[k]});$('#f_slug').dataset.touched='1';live()}
function generate(){if(aiBusy)return;var title=($('#f_title').value||'').trim();if(!title){aiMsg('Choose a title first, or type one in the Title field.',true);return}
var c=CH&&CH.title===title?CH:{title:title,keyword:title,question:title};aiBusy=true;aiMsg('Writing the article with Gemini. This usually takes 30 to 60 seconds...');
var useS=S.gemSearchArticle===true;
function attempt(problems){return gem(articlePrompt(c,problems),useS,16384).then(function(r){var o=applyMd(r.text,c);fillForm(o);return {o:o,res:analyse(o),finish:r.finish}})}
attempt('').then(function(x){if(x.res.errs.length){aiMsg('Improving the draft ('+x.res.errs.length+' issue'+(x.res.errs.length>1?'s':'')+')...');return attempt(x.res.errs.join('; '))}return x})
.then(function(x){var e=x.res.errs;aiMsg(e.length?'Draft ready, but check the list below: '+e.join('; '):'Article ready. Review every field, then click Save and publish to site.',e.length>0)},function(e){aiMsg(e.message,true)}).then(function(){aiBusy=false})}
function aiPanel(){return '<div class="glass p-5 mt-5"><h3 class="serif text-2xl">AI writer (Gemini)</h3><p class="muted text-sm">Step 1: suggest titles people actually search for. Step 2: pick one and generate the article, its metadata and FAQ. Everything stays editable.</p>'
+'<label class="fld"><span>Topic or focus (optional)</span><input id="ai_topic" placeholder="e.g. earrings, ring sizing, gold care, gifts"></label>'
+'<div class="flex flex-wrap gap-3 mt-3"><button class="btn btn-gold" data-act="suggest">Suggest a title</button><span id="ai_gen" hidden><button class="btn btn-gold" data-act="generate">Generate article</button></span></div>'
+'<p id="ai_msg" class="mt-3" role="status"></p><div id="ai_titles"></div></div>'}
function form(){var g=function(k){return $('#f_'+k).value.trim()};return {title:g('title'),slug:g('slug'),description:g('description'),lead:g('lead'),category:g('category')||'Guides',short:g('short'),keywords:g('keywords'),hero:g('hero'),aff:g('aff'),pick:g('pick'),body:$('#f_body').value.replace(/\s+$/,'')}}
function live(){var a=form(),r=analyse(a);$('#dl').textContent='('+a.description.length+')';
$('#ck').innerHTML=(r.errs.length?r.errs.map(function(e){return '<li class="bad">&#10007; '+esc(e)+'</li>'}):['<li class="ok">&#10003; Ready to publish</li>']).join('')+'<li class="muted">'+r.words+' words, '+r.parsed.secs.length+' sections, '+r.parsed.faq.length+' FAQ items</li>'}
function saveForm(){var d=form(),a=A.filter(function(x){return x.id===editId})[0];if(A.some(function(x){return x.slug===d.slug&&x!==a})){alert('Another article already uses the address /'+d.slug+'. Change the slug.');return null}if(!a){a={id:'a'+Date.now(),status:'draft'};A.push(a)}
if(a.status==='published'&&a.slug!==d.slug){alert('This article is already live at /'+a.slug+'. To use a new address, add it as a new article.');d.slug=a.slug}
for(var k in d)a[k]=d[k];a.updated=new Date().toISOString();editId=a.id;save();return a}
function render(){document.querySelectorAll('.nv').forEach(function(b){b.setAttribute('aria-current',String((b.dataset.id==='blog'&&(view==='blog'||view==='editor'))||b.dataset.id===view))});
if(view==='blog')renderBlog();else if(view==='editor')renderEditor();else renderSettings()}
function renderSettings(){$('#app').innerHTML='<h1 class="text-4xl gt">Settings</h1><div class="glass p-5 mt-5"><p class="muted">The dashboard publishes by saving files to your GitHub repository with a personal access token. The token stays in this browser only.</p>'
+'<div class="grid sm:grid-cols-3 gap-3"><label class="fld"><span>GitHub user</span><input id="s_owner" value="'+escA(S.owner)+'"></label><label class="fld"><span>Repository</span><input id="s_repo" value="'+escA(S.repo)+'"></label><label class="fld"><span>Branch</span><input id="s_branch" value="'+escA(S.branch)+'"></label></div>'
+'<label class="fld"><span>Website address</span><input id="s_domain" value="'+escA(S.domain)+'"></label><label class="fld"><span>GitHub token</span><input id="s_token" type="password" autocomplete="off" value="'+escA(S.token)+'" placeholder="github_pat_..."></label>'
+'<div class="flex flex-wrap gap-3 mt-5"><button class="btn btn-gold" data-act="savesettings">Save and test connection</button><button class="btn btn-ghost" data-act="cleartoken">Remove token from this browser</button></div><p id="sm" class="mt-3"></p></div>'
+'<div class="glass p-5 mt-5"><h3 class="serif text-2xl">Gemini AI writer</h3><p class="muted text-sm">Powers the Suggest a title and Generate article buttons. Click Save and test connection above to store these values.</p><label class="fld"><span>Gemini API key</span><input id="s_gemkey" type="password" autocomplete="off" value="'+escA(S.gemKey)+'" placeholder="AIza..."></label><label class="fld"><span>Model name</span><input id="s_gemmodel" value="'+escA(S.gemModel)+'"></label><label class="fld"><span>Your niche (used in every prompt)</span><input id="s_niche" value="'+escA(S.niche)+'"></label><label style="display:block;margin-top:.8rem"><input type="checkbox" id="s_gs"'+(S.gemSearch!==false?' checked':'')+'> Use Google Search when suggesting titles (recommended)</label><label style="display:block;margin-top:.4rem"><input type="checkbox" id="s_ga"'+(S.gemSearchArticle===true?' checked':'')+'> Also use Google Search while writing the article</label><div class="flex flex-wrap gap-3 mt-4"><button class="btn btn-ghost" data-act="testgem">Test Gemini only</button><button class="btn btn-ghost" data-act="clearkey">Remove Gemini key from this browser</button></div><p id="sm2" class="mt-3"></p><p class="muted text-sm mt-3">Get a key from Google AI Studio. In Google Cloud, restrict the key to your website address and set a spending limit. Model names change, so check the current name in Google&rsquo;s Gemini API docs. Searching Google may be billed separately, so check the pricing page.</p></div><div class="glass p-5 mt-5"><h3 class="serif text-2xl">How to create the GitHub token (one time)</h3><ol class="mt-2" style="padding-left:1.2rem;list-style:decimal"><li>On GitHub open Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token.</li><li>Under Repository access choose Only select repositories, and pick your site repository.</li><li>Under Permissions, set <b>Contents</b> to Read and write.</li><li>Set an expiry date, create the token, copy it and paste it above.</li></ol><p class="muted mt-3">Use this dashboard only on your own computer. Anyone who has the token can change the repository.</p></div>'}
function act(k,id){
if(k==='view'){view=id;render()}
else if(k==='new'){editId=null;view='editor';render()}
else if(k==='edit'){editId=id;view='editor';render()}
else if(k==='del'){if(confirm('Delete this draft?')){A=A.filter(function(x){return x.id!==id});save();render()}}
else if(k==='publish'){view='blog';publish(id)}
else if(k==='savedraft'){var a=saveForm();if(!a)return;view='blog';render()}
else if(k==='savepub'){var b=saveForm();if(!b)return;view='blog';render();publish(b.id)}
else if(k==='pin'){var a2=A.filter(function(x){return x.id===id})[0],p=pinUrl(a2);if(a2.live!==true&&!confirm('The article may not be live yet, so Pinterest might not find the image. Open Pinterest anyway?'))return;window.open(p.href,'_blank','noopener')}
else if(k==='savesettings'){S.owner=$('#s_owner').value.trim();S.repo=$('#s_repo').value.trim();S.branch=$('#s_branch').value.trim()||'main';S.domain=$('#s_domain').value.trim()||'https://mcgeejewelry.com';S.token=$('#s_token').value.trim();S.gemKey=$('#s_gemkey').value.trim();S.gemModel=$('#s_gemmodel').value.trim()||'gemini-3.5-flash';S.niche=$('#s_niche').value.trim();S.gemSearch=$('#s_gs').checked;S.gemSearchArticle=$('#s_ga').checked;save();$('#sm').textContent='Testing...';
gh('').then(function(r){$('#sm').textContent='Connected to '+r.full_name+(r.permissions&&r.permissions.push===false?' (this token cannot write)':'')},function(e){$('#sm').textContent='Could not connect: '+e.message})}
else if(k==='cleartoken'){S.token='';save();renderSettings()}
else if(k==='clearkey'){S.gemKey='';save();renderSettings()}
else if(k==='suggest')suggest();else if(k==='generate')generate();
else if(k==='testgem'){S.gemKey=$('#s_gemkey').value.trim();S.gemModel=$('#s_gemmodel').value.trim()||'gemini-3.5-flash';save();$('#sm2').textContent='Testing Gemini...';gem('Reply with the single word OK.',false,64).then(function(r){$('#sm2').textContent='Gemini replied: '+r.text.trim().slice(0,40)},function(e){$('#sm2').textContent='Could not connect: '+e.message})}}
document.addEventListener('change',function(e){if(e.target&&e.target.name==='ttl')pickTitle(+e.target.value)});
document.addEventListener('click',function(e){var b=e.target.closest('[data-act]');if(b&&!b.disabled)act(b.dataset.act,b.dataset.id)});
render();A.forEach(function(a){if(a.status==='published'&&a.live!==true&&a.live!=='unknown')poll(a)});
})();
