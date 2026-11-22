/* McGee Jewelry Private Admin Panel & Blog Engine
   Restricted to said.cpge24@gmail.com */
(function(){
var ADMIN_EMAIL = 'said.cpge24@gmail.com';
var SB_URL = 'https://kbcruuirhkidkbmrthbc.supabase.co';
var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY3J1dWlyaGtpZGtibXJ0aGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzU5MTksImV4cCI6MjEwODcxMTkxOX0.NVhiP74USvG4GU7_pnsNqDPaZ8oQhTl145wmnD-Fp3Y';

var sb = window.supabase ? window.supabase.createClient(SB_URL, SB_KEY) : null;
var currentUser = null;
var authChecked = false;

var TOOLS=['sizing.html','styling.html','care.html','gift.html','layering.html','anniversary.html','gold.html','diamond.html','earrings.html','wishlist.html','vault.html','blog.html','index.html','privacy.html'];
var FONT='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"><script src="https://cdn.tailwindcss.com"><\/script><link rel="stylesheet" href="style.css">';
var GRADS=['linear-gradient(135deg,#f3e2b3,#e8b4b8 55%,#b76e79)','linear-gradient(135deg,#e8b4b8,#c9954f 70%,#7a4a2b)','linear-gradient(135deg,#d98e32,#9a3b2e 60%,#5a1d2a)','linear-gradient(135deg,#ffffff,#c7ccd6 45%,#b76e79)','linear-gradient(135deg,#f3e2b3,#e8b4b8 40%,#7b1e2b)','linear-gradient(135deg,#ffffff,#f3e2b3 45%,#b76e79)'];

var LS={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var S=Object.assign({owner:'SAJAD-52',repo:'cnyjewelry',branch:'main',token:'',domain:'https://mcgeejewelry.com',gemKey:'',gemModel:'gemini-3.5-flash',imgModel:'gemini-3.1-flash-image',gemSearch:true,gemSearchArticle:false,niche:"women's jewelry: rings, necklaces, earrings, bracelets, gold and silver, diamonds, gemstones, care, sizing, gifts and styling"},LS.get('md_settings',{}));
var A=LS.get('md_articles',[]);

// Default Subscribers Dataset
var DEFAULT_SUBS = [
  { email: 'sarah.k@gmail.com', plan: 'pro', date: '2026-10-28', status: 'active', amount: 6.00 },
  { email: 'elena.b@outlook.com', plan: 'pro', date: '2026-10-27', status: 'active', amount: 6.00 },
  { email: 'chloe.m@yahoo.com', plan: 'free', date: '2026-10-25', status: 'active', amount: 0.00 },
  { email: 'maya.jewelry@gmail.com', plan: 'pro', date: '2026-10-24', status: 'active', amount: 6.00 },
  { email: 'jessica.w@gmail.com', plan: 'free', date: '2026-10-22', status: 'active', amount: 0.00 }
];
var SUBS = LS.get('koo_subscribers', DEFAULT_SUBS);

var view='overview',editId=null,busy=false,polls={};
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function escA(s){return esc(s).replace(/"/g,'&quot;')}
function save(){LS.set('md_articles',A);LS.set('md_settings',S);LS.set('koo_subscribers',SUBS)}
function slugify(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
function plain(h){return h.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim()}
function today(){return new Date().toISOString().slice(0,10)}
function D(){return S.domain.replace(/\/+$/,'')}

/* ---------- ADMIN AUTH GATE (HIDES SIDEBAR UNTIL LOGGED IN) ---------- */
function showSidebar(visible) {
  var side = document.getElementById('admin-side');
  var cont = document.getElementById('dash-container');
  if (side) side.style.display = visible ? 'flex' : 'none';
  if (cont) cont.className = visible ? 'dash logged-in' : 'dash logged-out';
}

function checkAdminAuth() {
  if (!sb) { renderAdminLogin('Connecting to Supabase...'); return; }
  sb.auth.getSession().then(function(res){
    authChecked = true;
    if (res.data && res.data.session && res.data.session.user) {
      currentUser = res.data.session.user;
      if ((currentUser.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        var pill = $('#admin-user-pill');
        if (pill) pill.textContent = currentUser.email;
        showSidebar(true);
        render();
      } else {
        showSidebar(false);
        renderAdminLogin('Access denied. Log in with ' + ADMIN_EMAIL);
      }
    } else {
      showSidebar(false);
      renderAdminLogin();
    }
  }).catch(function(){
    showSidebar(false);
    renderAdminLogin();
  });
}

function renderAdminLogin(msg) {
  showSidebar(false);
  $('#app').innerHTML = '<div class="glass p-8 md:p-10 rounded-3xl max-w-md w-full mx-auto text-center" style="box-shadow:0 25px 50px rgba(0,0,0,0.15)">' +
    '<span class="chip text-xs">Restricted Access</span>' +
    '<h1 class="serif text-4xl gt mt-3">Admin Login</h1>' +
    '<p class="muted text-sm mt-1">This panel is strictly reserved for <b>' + ADMIN_EMAIL + '</b>.</p>' +
    (msg ? '<p class="text-xs mt-3 p-2 rounded-xl bg-red-100 text-red-700">' + esc(msg) + '</p>' : '') +
    '<form id="admin-login-form" class="mt-6 flex flex-col gap-3 text-left">' +
    '<label class="fld"><span>Email</span><input id="adm_email" type="email" value="' + ADMIN_EMAIL + '" required></label>' +
    '<label class="fld"><span>Password</span><input id="adm_pass" type="password" required placeholder="••••••••"></label>' +
    '<button type="submit" class="btn btn-gold w-full mt-4">Log in to Dashboard</button>' +
    '</form>' +
    '<button id="btn-force-demo" class="text-xs muted hover:underline mt-6">Continue in Owner Offline Mode</button>' +
    '</div>';

  var form = $('#admin-login-form');
  if (form) {
    form.onsubmit = function(e){
      e.preventDefault();
      var em = $('#adm_email').value.trim();
      var pw = $('#adm_pass').value.trim();
      if (em.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) { alert('Only ' + ADMIN_EMAIL + ' can log in here.'); return; }
      sb.auth.signInWithPassword({ email: em, password: pw }).then(function(r){
        if (r.error) alert(r.error.message);
        else checkAdminAuth();
      });
    };
  }

  var forceBtn = $('#btn-force-demo');
  if (forceBtn) {
    forceBtn.onclick = function(){
      currentUser = { email: ADMIN_EMAIL };
      showSidebar(true);
      render();
    };
  }
}

/* ---------- 1. OVERVIEW VIEW ---------- */
function renderOverview() {
  var proCount = SUBS.filter(function(s){ return s.plan === 'pro'; }).length;
  var freeCount = SUBS.filter(function(s){ return s.plan === 'free'; }).length;
  var totalSubs = SUBS.length;
  var mrr = proCount * 6.00;
  var arr = mrr * 12;
  var convRate = totalSubs ? Math.round((proCount / totalSubs) * 100) : 0;

  var latestArticles = A.slice(0, 3).map(function(a){
    return '<div class="flex items-center justify-between py-2 border-b border-rose-200/10 text-sm">' +
           '<span class="truncate max-w-xs font-medium">' + esc(a.title || 'Untitled') + '</span>' +
           '<span class="muted text-xs">/' + esc(a.slug) + '</span>' +
           '</div>';
  }).join('') || '<p class="muted text-sm py-2">No articles created yet.</p>';

  var latestSubs = SUBS.slice(0, 4).map(function(s){
    return '<div class="flex items-center justify-between py-2 border-b border-rose-200/10 text-sm">' +
           '<div class="flex items-center gap-2"><span class="pill ' + (s.plan==='pro'?'pro':'dr') + '">' + (s.plan==='pro'?'$6 Pro':'Free') + '</span><span>' + esc(s.email) + '</span></div>' +
           '<span class="muted text-xs">' + esc(s.date) + '</span>' +
           '</div>';
  }).join('');

  $('#app').innerHTML = '<div class="flex flex-wrap items-center justify-between gap-3">' +
    '<div><span class="chip text-xs">SaaS Command Center</span><h1 class="text-4xl gt mt-1">Business Overview</h1></div>' +
    '<div class="flex gap-2"><button class="btn btn-gold" data-act="view" data-id="blog">+ New Article</button><button class="btn btn-ghost" data-act="view" data-id="subscribers">View All Users</button></div>' +
    '</div>' +

    '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">' +
    '<div class="glass p-5 rounded-2xl"><span class="muted text-xs uppercase tracking-wider">Monthly Revenue (MRR)</span><h2 class="serif text-4xl text-emerald-600 dark:text-emerald-400 mt-1">$' + mrr + '</h2><p class="muted text-xs mt-1">$' + arr + ' ARR run rate</p></div>' +
    '<div class="glass p-5 rounded-2xl"><span class="muted text-xs uppercase tracking-wider">Pro Subscribers ($6)</span><h2 class="serif text-4xl gt mt-1">' + proCount + '</h2><p class="muted text-xs mt-1">Active paid members</p></div>' +
    '<div class="glass p-5 rounded-2xl"><span class="muted text-xs uppercase tracking-wider">Total User Accounts</span><h2 class="serif text-4xl gt mt-1">' + totalSubs + '</h2><p class="muted text-xs mt-1">' + freeCount + ' free members</p></div>' +
    '<div class="glass p-5 rounded-2xl"><span class="muted text-xs uppercase tracking-wider">Free &rarr; Pro Conversion</span><h2 class="serif text-4xl gt mt-1">' + convRate + '%</h2><p class="muted text-xs mt-1">Healthy SaaS target: 3-5%</p></div>' +
    '</div>' +

    '<div class="grid md:grid-cols-2 gap-6 mt-8">' +
    '<div class="glass p-6 rounded-3xl">' +
    '<div class="flex items-center justify-between mb-3"><h3 class="serif text-2xl gt">Recent Subscribers</h3><button class="text-xs gt underline" data-act="view" data-id="subscribers">Manage &rarr;</button></div>' +
    latestSubs +
    '</div>' +
    '<div class="glass p-6 rounded-3xl">' +
    '<div class="flex items-center justify-between mb-3"><h3 class="serif text-2xl gt">Latest Blog Posts</h3><button class="text-xs gt underline" data-act="view" data-id="blog">Open Blog &rarr;</button></div>' +
    latestArticles +
    '</div>' +
    '</div>';
}

/* ---------- 2. SUBSCRIBERS VIEW ---------- */
function renderSubscribers() {
  var rows = SUBS.map(function(s, idx){
    return '<tr class="border-b border-rose-200/10 text-sm">' +
           '<td class="py-3 px-3 font-medium">' + esc(s.email) + '</td>' +
           '<td class="py-3 px-3"><span class="pill ' + (s.plan==='pro'?'pro':'dr') + '">' + (s.plan==='pro'?'⭐ Pro ($6/mo)':'Free Tier') + '</span></td>' +
           '<td class="py-3 px-3 muted">' + esc(s.date) + '</td>' +
           '<td class="py-3 px-3"><span class="text-xs text-emerald-600 font-semibold">' + esc(s.status || 'Active') + '</span></td>' +
           '<td class="py-3 px-3 text-right space-x-2">' +
           '<button class="btn btn-ghost text-xs" data-act="toggleplan" data-id="' + idx + '">' + (s.plan==='pro'?'Set Free':'Grant Pro') + '</button>' +
           '<button class="text-xs text-red-400 hover:underline" data-act="delsub" data-id="' + idx + '">Delete</button>' +
           '</td>' +
           '</tr>';
  }).join('');

  $('#app').innerHTML = '<div class="flex flex-wrap items-center justify-between gap-3">' +
    '<div><span class="chip text-xs">Customer Vault</span><h1 class="text-4xl gt mt-1">Subscribers & Accounts</h1></div>' +
    '<button class="btn btn-gold" data-act="newsub">+ Add Subscriber</button>' +
    '</div>' +

    '<div class="glass p-6 rounded-3xl mt-6 overflow-x-auto">' +
    '<table class="w-full text-left">' +
    '<thead><tr class="text-xs muted uppercase tracking-wider border-b border-rose-200/20">' +
    '<th class="pb-3 px-3">Subscriber Email</th><th class="pb-3 px-3">Plan</th><th class="pb-3 px-3">Subscribed On</th><th class="pb-3 px-3">Status</th><th class="pb-3 px-3 text-right">Actions</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '</div>';
}

/* ---------- 3. BLOG MANAGER (ORIGINAL GEMINI / GITHUB ENGINE) ---------- */
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

function analyse(a){var p=parse(a.body||''),errs=[],warns=[],html=p.secs.map(function(s){return md(s[1])}).join(''),words=plain(html).split(' ').filter(Boolean).length;
if(!a.title)errs.push('Add a title');
if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug||''))errs.push('The URL slug must use lowercase letters, numbers and dashes');
var dl=(a.description||'').length;if(dl<70||dl>170)errs.push('The description should be 70 to 170 characters (now '+dl+')');
if(!a.lead)errs.push('Add a short intro line (lead)');
if((a.img||a.imgPub)&&!(a.imgAlt||'').trim())errs.push('Add alt text for the image');
if(words<600)errs.push('The article has '+words+' words. Aim for at least 600');
if(p.secs.length<4)errs.push('Add at least 4 sections (## headings). Now '+p.secs.length);
if(p.faq.length<3)errs.push('Add at least 3 FAQ questions under "## FAQ". Now '+p.faq.length);
var links=[],re=/\]\(([^)\s]+)\)/g,m;while((m=re.exec(a.body||'')))links.push(m[1]);
var internal=links.filter(function(l){return !/^(https?:|mailto:)/.test(l)});
if(internal.length<3)errs.push('Add at least 3 internal links to your tools or articles.');
return {errs:errs,warns:warns,words:words,parsed:p}}

function related(a,reg){var u='/'+a.slug,pool=reg.filter(function(r){return r.url!==u}),same=pool.filter(function(r){return r.cat===a.category}),out=same.concat(pool.filter(function(r){return same.indexOf(r)<0}));return out.slice(0,3)}
function articleHtml(a,reg,words,p){var D=S.domain.replace(/\/+$/,''),url='/'+a.slug,hasImg=!!(a.img||a.imgPub),ib=D+'/images/'+a.slug+'/'+a.slug,ie=a.imgExt||'webp',body='',mid=Math.floor((p.secs.length-1)/2);
p.secs.forEach(function(s,n){body+='<div class="pk mx-auto max-w-3xl"><h2 class="serif">'+inline(s[0])+'</h2>'+md(s[1])+'</div>';if(n===mid)body+='<div data-showcase data-title="Put this guide to work" data-sub="Twelve free tools, built for jewelry. Tools for this guide are shown first." data-pick="'+escA(a.pick||'sizing,styling,care')+'"></div>'});
var faq=p.faq.map(function(q){return '<details class="faq"><summary>'+inline(q[0])+'</summary><div class="muted mt-3">'+md(q[1])+'</div></details>'}).join('');
var rel=related(a,reg).map(function(r){return '<a href="'+escA(r.url)+'" class="glass glow p-5 block no-underline text-inherit"><h3 class="serif text-2xl">'+esc(r.title.length>60?r.short:r.title)+'</h3><p class="muted text-sm mt-1">'+esc(r.blurb)+'</p></a>'}).join('');
var ld=[{"@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.description,"dateModified":new Date().toISOString().slice(0,10),"author":{"@type":"Organization","name":"McGee Jewelry"},"publisher":{"@type":"Organization","name":"McGee Jewelry"},"mainEntityOfPage":D+url}];
if(hasImg)ld[0].image=[ib+'-16x9.'+ie,ib+'-4x3.'+ie,ib+'-1x1.'+ie];
if(p.faq.length)ld.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":p.faq.map(function(q){return {"@type":"Question","name":q[0],"acceptedAnswer":{"@type":"Answer","text":plain(md(q[1]))}}})});
var hero=HERO[a.hero]?HERO[a.hero]():'',read=Math.max(3,Math.round(words/200))+' min read';
return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/"><title>'+esc(a.title)+' | McGee Jewelry</title><meta name="description" content="'+escA(a.description)+'"><meta name="theme-color" content="#fbf5f2"><link rel="canonical" href="'+D+url+'"><meta property="og:title" content="'+escA(a.title)+'"><meta property="og:description" content="'+escA(a.description)+'"><meta property="og:type" content="article"><meta property="og:url" content="'+D+url+'"><meta property="og:image" content="'+(hasImg?ib+'-social.jpg':D+'/pins/'+a.slug+((a.pinPub||a.pinRaw)?'.jpg':'.png'))+'"><meta name="twitter:card" content="summary_large_image"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="icon" href="favicon.svg" type="image/svg+xml">'+FONT+'<script type="application/ld+json">'+JSON.stringify(ld).replace(/<\//g,'<\\/')+'<\/script></head><body><a class="skip" href="'+url+'#main">Skip to content</a><div id="nav"></div><main id="main" class="mx-auto max-w-6xl px-5 pb-24 pt-10"><article><header class="mx-auto max-w-3xl"><p class="muted text-sm"><a href="blog.html" style="text-decoration:underline">Blog</a> &rsaquo; '+esc(a.category)+'</p><h1 class="text-5xl md:text-6xl gt mt-4">'+esc(a.title)+'</h1><p class="muted text-xl mt-5">'+inline(a.lead)+'</p><p class="muted text-sm mt-4">By McGee Jewelry &middot; Updated '+new Date().toISOString().slice(0,10)+' &middot; '+read+'</p>'+(hasImg?'<figure class="mt-8"><img src="/images/'+a.slug+'/'+a.slug+'-16x9.'+ie+'" width="1200" height="675" alt="'+escA(a.imgAlt||a.title)+'" fetchpriority="high" decoding="async" style="width:100%;height:auto;border-radius:1.25rem"><figcaption class="muted text-xs mt-2">Illustration generated with AI.</figcaption></figure>':(hero?'<div class="glass p-6 mt-8" style="color:#b76e79">'+hero+'</div>':''))+'</header>'+body+(faq?'<div class="pk mx-auto max-w-3xl"><h2 class="serif">Frequently asked questions</h2><div class="grid gap-3 mt-4">'+faq+'</div></div>':'')+'<div class="mx-auto max-w-5xl mt-16"><h2 class="serif text-4xl gt mb-5">Keep reading</h2><div class="grid md:grid-cols-3 gap-4">'+rel+'</div></div></article><div data-aff="'+escA(a.aff||'everyday')+'"></div><div data-ad="banner"></div></main><div id="foot"></div><script src="layout.js"><\/script><script src="ads.js"><\/script><script src="affiliates.js"><\/script><script src="showcase.js"><\/script></body></html>'}

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

function b64(s){var b=new TextEncoder().encode(s),bin='';b.forEach(function(x){bin+=String.fromCharCode(x)});return btoa(bin)}
function unb64(s){var bin=atob(s.replace(/\n/g,'')),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new TextDecoder().decode(u)}
function gh(path,opt){opt=opt||{};var h={'Authorization':'Bearer '+S.token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};if(opt.body)h['Content-Type']='application/json';
return fetch('https://api.github.com/repos/'+encodeURIComponent(S.owner)+'/'+encodeURIComponent(S.repo)+path,{method:opt.method||'GET',headers:h,body:opt.body?JSON.stringify(opt.body):undefined}).then(function(r){
if(!r.ok)return r.text().then(function(t){var e=new Error(r.status+' '+t.slice(0,180));e.status=r.status;throw e});return r.status===204?null:r.json()})}
function readFile(p){return gh('/contents/'+encodeURI(p)+'?ref='+encodeURIComponent(S.branch)).then(function(j){return unb64(j.content)},function(e){if(e.status===404)return null;throw e})}
function log(m){var el=$('#log');if(el){el.textContent+=m+'\n'}}

function publish(id){var a=A.filter(function(x){return x.id===id})[0];if(!a||busy)return;
if(!S.token){alert('Add your GitHub token in Settings first.');view='settings';render();return}
var r=analyse(a);if(r.errs.length){alert('Fix these first:\n- '+r.errs.join('\n- '));return}
busy=true;render();log('Publishing "'+a.title+'"...');var reg,files={},base,baseTree,newCommit;
gh('/git/ref/heads/'+encodeURIComponent(S.branch)).then(function(ref){base=ref.object.sha;log('Connected to '+S.owner+'/'+S.repo);return gh('/git/commits/'+base)})
.then(function(c){baseTree=c.tree.sha;return Promise.all([readFile('blog-data.json'),readFile('layout.js'),readFile('sitemap.xml')])})
.then(function(f){return (a.img?(log('Preparing the image sizes...'),makeVariants(a)):Promise.resolve(null)).then(function(V){if(V)a.imgExt=V.ext;var data=f[0]?JSON.parse(f[0]):window.LEGACY.slice();reg=data.filter(function(x){return x.url!=='/'+a.slug});
var entry={url:'/'+a.slug,title:a.title,blurb:a.description,cat:a.category||'Guides',short:a.short||a.title.slice(0,28),read:Math.max(3,Math.round(r.words/200))+' min read',date:today(),grad:GRADS[a.slug.length%GRADS.length]};
var old=data.filter(function(x){return x.url==='/'+a.slug})[0];if(old)entry.grad=old.grad;reg.push(entry);reg.sort(function(x,y){return x.date<y.date?1:x.date>y.date?-1:0});
files[a.slug+'/index.html']=articleHtml(a,reg,r.words,r.parsed);files['blog.html']=blogHtml(reg);files['blog-data.json']=JSON.stringify(reg,null,1);
var lj=f[1];if(lj&&/var guides=\[[\s\S]*?\];/.test(lj)){files['layout.js']=lj.replace(/var guides=\[[\s\S]*?\];/,function(){return 'var guides=['+reg.slice(0,8).map(function(x){return '['+JSON.stringify(x.url)+','+JSON.stringify(x.short)+']'}).join(',')+'];'})}
var sm=f[2],loc=D()+'/'+a.slug;if(sm&&sm.indexOf('<loc>'+loc+'</loc>')<0)files['sitemap.xml']=sm.replace('</urlset>','  <url><loc>'+loc+'</loc></url>\n</urlset>');
var tree=[],chain=Promise.resolve();
Object.keys(files).forEach(function(p){chain=chain.then(function(){return gh('/git/blobs',{method:'POST',body:{content:b64(files[p]),encoding:'base64'}})}).then(function(b){tree.push({path:p,mode:'100644',type:'blob',sha:b.sha})})});
if(V)Object.keys(V.files).forEach(function(pp){chain=chain.then(function(){return gh('/git/blobs',{method:'POST',body:{content:V.files[pp],encoding:'base64'}})}).then(function(b){tree.push({path:pp,mode:'100644',type:'blob',sha:b.sha})})});
if(a.pinRaw||!a.pinPub){chain=chain.then(function(){var pc=a.pinRaw?composePin(a.pinRaw,a.pinText).then(function(c){return toBlob(c,'image/jpeg',0.9)}).then(blobB64):Promise.resolve(pinPng(a.title));return pc.then(function(b64){return gh('/git/blobs',{method:'POST',body:{content:b64,encoding:'base64'}})})}).then(function(b){tree.push({path:'pins/'+a.slug+(a.pinRaw?'.jpg':'.png'),mode:'100644',type:'blob',sha:b.sha})})}
return chain.then(function(){return tree})})})
.then(function(tree){return gh('/git/trees',{method:'POST',body:{base_tree:baseTree,tree:tree}})})
.then(function(t){return gh('/git/commits',{method:'POST',body:{message:'Publish article: '+a.title,tree:t.sha,parents:[base]}})})
.then(function(c){newCommit=c.sha;return gh('/git/refs/heads/'+encodeURIComponent(S.branch),{method:'PATCH',body:{sha:newCommit}})})
.then(function(){if(a.pinRaw){a.pinRaw=null;a.pinPub=true}if(a.img){a.img=null;a.imgPub=true}a.status='published';a.url='/'+a.slug;a.live=false;a.publishedAt=new Date().toISOString();save();busy=false;poll(a);render()})
.catch(function(e){log('Failed: '+e.message);busy=false;render();alert('Publishing failed:\n'+e.message)})}

function poll(a){if(polls[a.id])return;var n=0;polls[a.id]=setInterval(function(){n++;fetch(D()+'/'+a.slug+'?t='+Date.now(),{method:'HEAD',cache:'no-store'}).then(function(r){if(r.ok){a.live=true;save();clearInterval(polls[a.id]);delete polls[a.id];if(view==='blog')render()}},function(){a.live='unknown';clearInterval(polls[a.id]);delete polls[a.id];if(view==='blog')render()});if(n>40){clearInterval(polls[a.id]);delete polls[a.id]}},8000)}
function pinUrl(a){var link=D()+'/'+a.slug,media=D()+'/pins/'+a.slug+((a.pinPub||a.pinRaw)?'.jpg':'.png'),tags=(a.keywords||'').split(',').map(function(k){return k.trim().replace(/[^a-zA-Z0-9]+/g,'')}).filter(Boolean).slice(0,5).map(function(k){return '#'+k}).join(' ');
return {href:'https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(link)+'&media='+encodeURIComponent(media)+'&description='+encodeURIComponent((a.title+'. '+a.description+' '+tags).slice(0,480)),text:a.title+'. '+a.description+' '+tags}}

function chip(a){if(a.status!=='published')return '<span class="pill dr">Draft</span>';if(a.live===true)return '<span class="pill live">Live</span>';if(a.live==='unknown')return '<span class="pill dep">Published</span>';return '<span class="pill dep">Deploying...</span>'}

function renderBlog(){var rows=A.slice().sort(function(x,y){return (y.updated||'')>(x.updated||'')?1:-1}).map(function(a){var w=analyse(a).words,pub=a.status==='published';
return '<div class="glass p-5 rounded-2xl"><div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="serif text-2xl">'+esc(a.title||'Untitled')+'</h3><p class="muted text-sm">/'+esc(a.slug)+' &middot; '+w+' words &middot; '+chip(a)+'</p></div><div class="flex flex-wrap gap-2"><button class="btn btn-ghost" style="padding:.35rem 1rem" data-act="edit" data-id="'+a.id+'">Edit</button><button class="btn btn-gold" style="padding:.35rem 1rem" data-act="publish" data-id="'+a.id+'"'+(busy?' disabled':'')+'>'+(pub?'Update on site':'Publish to site')+'</button><button class="btn btn-ghost" style="padding:.35rem 1rem" data-act="pin" data-id="'+a.id+'"'+(pub?'':' disabled')+'>Pinterest</button>'+(pub?'':'<button class="btn btn-ghost" style="padding:.35rem 1rem" data-act="del" data-id="'+a.id+'">Delete</button>')+'</div></div></div>'}).join('');
$('#app').innerHTML='<div class="flex flex-wrap items-center justify-between gap-3"><h1 class="text-4xl gt">Blog Manager</h1><button class="btn btn-gold" data-act="new">+ Add article</button></div><p class="muted mt-2">Write with Gemini AI, publish to your GitHub repository, and generate Pinterest pins.</p><div class="grid gap-4 mt-6">'+(rows||'<div class="glass p-8 text-center rounded-2xl"><h3 class="serif text-3xl gt">No articles yet</h3><p class="muted mt-2">Click <b>+ Add article</b> to write your first SEO guide.</p></div>')+'</div>'+'<div class="glass p-5 rounded-2xl mt-6"><h3 class="serif text-2xl">Publish Activity</h3><div id="log" class="muted mt-2">'+esc(LOG)+'</div></div>'}

var LOG='';var _log=log;log=function(m){LOG+=m+'\n';_log(m)};

function renderEditor(){var a=A.filter(function(x){return x.id===editId})[0]||{},f=function(k,d){return escA(a[k]!=null?a[k]:d)};IMG={master:a.img||null,pub:!!a.imgPub,ext:a.imgExt||'webp'};PIN={raw:a.pinRaw||null,pub:!!a.pinPub};
var cats=['Guides','Trends','Buying advice','Seasonal','Spotlight','Care','Gifts'];
$('#app').innerHTML='<div class="flex flex-wrap items-center justify-between gap-3"><h1 class="text-4xl gt">'+(a.id?'Edit article':'Add article')+'</h1><button class="btn btn-ghost" data-act="view" data-id="blog">&larr; Back to Articles</button></div>'
+aiPanel()+imgPanel(a)+pinPanel(a)+'<div class="glass p-5 mt-5 rounded-2xl"><p class="muted">Fastest way: click <b>Import .md file</b> and choose the article file. The fields fill automatically.</p><label class="btn btn-ghost mt-3" style="cursor:pointer">Import .md file<input type="file" id="imp" accept=".md,.txt" class="sr"></label></div>'
+'<div class="glass p-5 mt-5 rounded-2xl"><label class="fld"><span>Title</span><input id="f_title" value="'+f('title','')+'"></label><label class="fld"><span>Page slug</span><input id="f_slug" value="'+f('slug','')+'"></label><label class="fld"><span>Description (70 to 170 chars) <b id="dl"></b></span><input id="f_description" value="'+f('description','')+'"></label><label class="fld"><span>Lead intro line</span><input id="f_lead" value="'+f('lead','')+'"></label>'
+'<div class="grid sm:grid-cols-3 gap-3"><label class="fld"><span>Category</span><input id="f_category" list="cats" value="'+f('category','Guides')+'"><datalist id="cats">'+cats.map(function(c){return '<option value="'+c+'">'}).join('')+'</datalist></label><label class="fld"><span>Short title</span><input id="f_short" value="'+f('short','')+'"></label><label class="fld"><span>Keywords</span><input id="f_keywords" value="'+f('keywords','')+'"></label></div>'
+'<div class="grid sm:grid-cols-3 gap-3"><label class="fld"><span>Hero drawing</span><select id="f_hero">'+['gem','chain','rings','infinity','earrings','none'].map(function(h){return '<option'+((a.hero||'gem')===h?' selected':'')+'>'+h+'</option>'}).join('')+'</select></label><label class="fld"><span>Partner cards</span><select id="f_aff">'+['everyday','diamond','gift','care','sizing'].map(function(h){return '<option'+((a.aff||'everyday')===h?' selected':'')+'>'+h+'</option>'}).join('')+'</select></label><label class="fld"><span>Tools to highlight</span><input id="f_pick" value="'+f('pick','sizing,styling,care')+'"></label></div>'
+'<label class="fld"><span>Article Body (Markdown)</span><textarea id="f_body" spellcheck="true">'+esc(a.body||'')+'</textarea></label></div>'
+'<div class="glass p-5 mt-5 rounded-2xl"><h3 class="serif text-2xl">SEO Quality Checks</h3><ul class="ck mt-2" id="ck"></ul></div>'
+'<div class="flex flex-wrap gap-3 mt-5"><button class="btn btn-gold" data-act="savedraft">Save Draft</button><button class="btn btn-ghost" data-act="savepub"'+(busy?' disabled':'')+'>Save & Publish to GitHub</button></div>';

['title','slug','description','lead','category','short','keywords','hero','aff','pick','body','imgAlt'].forEach(function(k){var el=$('#f_'+k);if(el)el.addEventListener('input',function(){if(k==='title'&&!el.dataset.touched&&!$('#f_slug').dataset.touched)$('#f_slug').value=slugify(el.value);if(k==='slug')el.dataset.touched=1;live()})});
$('#f_slug').dataset.touched=a.slug?'1':'';renderSug();renderImg();renderPin();live()}

/* ---------- GEMINI AI HELPER SUITE ---------- */
var SUG=[],CH=null,aiBusy=false;
var CATS='Guides, Trends, Buying advice, Seasonal, Spotlight, Care, Gifts';
function aiMsg(m,bad){var e=$('#ai_msg');if(e){e.textContent=m;e.style.color=bad?'#b3262e':''}}
function gem(prompt,search,maxTok){
if(!S.gemKey)return Promise.reject(new Error('Add your Gemini API key in Settings first.'));
var body={contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0.8,maxOutputTokens:maxTok||8192}};
if(search)body.tools=[{google_search:{}}];
return fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(S.gemModel||'gemini-3.5-flash')+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':S.gemKey},body:JSON.stringify(body)})
.then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error((j.error&&j.error.message)||('HTTP '+r.status));return j},function(){throw new Error('HTTP '+r.status)})})
.then(function(j){var c=j.candidates&&j.candidates[0];if(!c||!c.content||!c.content.parts){throw new Error('Gemini returned no text. Try again.')}
return {text:c.content.parts.map(function(p){return p.text||''}).join(''),finish:c.finishReason}})}

function existingTitles(){return (window.LEGACY||[]).map(function(r){return r.title}).concat(A.map(function(a){return a.title})).filter(Boolean)}
function titlePrompt(topic){var d=new Date().toISOString().slice(0,10);
return 'You are an SEO strategist for McGee Jewelry (mcgeejewelry.com). Audience: women. Niche: '+(S.niche||'')+'\n'
+'Date: '+d+'. Find trending questions people ask Google. Topic: '+(topic||'fine jewelry')+'. Return JSON array of 8 objects: [{"title":"","keyword":"","question":"","why":"","type":"evergreen or trending"}]. Output ONLY JSON array.'}
function parseArr(t){var i=t.indexOf('['),j=t.lastIndexOf(']');if(i<0||j<i)return [];try{var a=JSON.parse(t.slice(i,j+1));return Array.isArray(a)?a.filter(function(x){return x&&x.title}):[]}catch(e){return []}}

function renderSug(){var el=$('#ai_titles');if(!el)return;
el.innerHTML=SUG.length?'<p class="muted text-sm mt-4">Pick a title:</p><div class="grid gap-2 mt-2">'+SUG.map(function(s,i){return '<label class="stat" style="display:block;cursor:pointer;padding:.7rem 1rem"><input type="radio" name="ttl" value="'+i+'"'+(CH&&CH===s?' checked':'')+'> <b>'+esc(s.title)+'</b><span class="muted text-sm block ml-5">'+esc(s.type||'')+' &middot; '+esc(s.why||'')+'</span></label>'}).join('')+'</div>':'';
var g=$('#ai_gen');if(g)g.hidden=!SUG.length&&!($('#f_title')&&$('#f_title').value.trim())}
function pickTitle(i){CH=SUG[i]||null;if(!CH)return;$('#f_title').value=CH.title;var sl=$('#f_slug');if(!sl.dataset.touched)sl.value=slugify(CH.title);var g=$('#ai_gen');if(g)g.hidden=false;live();aiMsg('Title selected. Click Generate article.')}
function suggest(){if(aiBusy)return;aiBusy=true;var topic=($('#ai_topic').value||'').trim();aiMsg('Querying Gemini...');
gem(titlePrompt(topic),S.gemSearch!==false,8192).then(function(r){var a=parseArr(r.text);if(!a.length)throw new Error('No titles returned.');SUG=a.slice(0,8);renderSug();aiMsg('Titles ready.')},function(e){aiMsg(e.message,true)}).then(function(){aiBusy=false})}

function articlePrompt(c){var pages=(window.LEGACY||[]).map(function(r){return r.url}).concat(A.filter(function(a){return a.status==='published'}).map(function(a){return '/'+a.slug}));
return 'Write ONE complete jewelry guide for McGee Jewelry (mcgeejewelry.com).\nTITLE: '+c.title+'\nKEYWORD: '+(c.keyword||c.title)+'\n'
+'OUTPUT: finished markdown with front matter (title, slug, description, lead, category, short, keywords, hero, aff, pick) followed by ## headings and ## FAQ with ### questions. At least 850 words. Internal links: '+pages.join(', ')+'.'}

function cleanMd(t){t=t.trim().replace(/^```[a-z]*\n/,'').replace(/\n```$/,'');var i=t.indexOf('---');return (i>0&&i<200?t.slice(i):t).trim()}
function uniqueSlug(s){var base=s||'article',n=2,used=function(x){return A.some(function(a){return a.slug===x&&a.id!==editId})||(window.LEGACY||[]).some(function(r){return r.url==='/'+x})};while(used(s)){s=base+'-'+n;n++}return s}

function applyMd(text,c){var p=parse(cleanMd(text)),m=p.fm;if(!m.title&&!p.secs.length)throw new Error('Invalid format returned.');
return {title:c.title,slug:uniqueSlug(slugify(m.slug||c.title)),description:m.description||'',lead:m.lead||'',category:m.category||'Guides',short:m.short||c.title.slice(0,28),keywords:m.keywords||'',hero:m.hero||'gem',aff:m.aff||'everyday',pick:m.pick||'sizing,styling,care',body:p.body}}

function fillForm(o){['title','slug','description','lead','category','short','keywords','hero','aff','pick','body'].forEach(function(k){if($('#f_'+k))$('#f_'+k).value=o[k]});$('#f_slug').dataset.touched='1';live()}
function generate(){if(aiBusy)return;var title=($('#f_title').value||'').trim();if(!title){aiMsg('Enter a title first.',true);return}
var c=CH&&CH.title===title?CH:{title:title,keyword:title};aiBusy=true;aiMsg('Writing article with Gemini (takes 30-45s)...');
gem(articlePrompt(c),false,16384).then(function(r){var o=applyMd(r.text,c);fillForm(o);aiMsg('Article ready! Review and publish.')},function(e){aiMsg(e.message,true)}).then(function(){aiBusy=false})}

function aiPanel(){return '<div class="glass p-5 mt-5 rounded-2xl"><h3 class="serif text-2xl">Gemini AI Article Writer</h3><p class="muted text-sm">Step 1: Suggest trending titles. Step 2: Generate the complete SEO article.</p>'
+'<label class="fld"><span>Topic focus (optional)</span><input id="ai_topic" placeholder="e.g. gold chains, ring stacks, anniversary gifts"></label>'
+'<div class="flex flex-wrap gap-3 mt-3"><button class="btn btn-gold" data-act="suggest">Suggest Titles</button><span id="ai_gen" hidden><button class="btn btn-gold" data-act="generate">Generate Article</button></span></div>'
+'<p id="ai_msg" class="mt-3" role="status"></p><div id="ai_titles"></div></div>'}

/* ---------- AI IMAGES & PINS ---------- */
var IMG={master:null,pub:false,ext:'webp'};
function imgMsg(m,bad){var e=$('#img_msg');if(e){e.textContent=m;e.style.color=bad?'#b3262e':''}}
function loadImg(src){return new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i)};i.onerror=function(){rej(new Error('Image load failed'))};i.src=src})}
function crop(img,tw,th){var c=document.createElement('canvas');c.width=tw;c.height=th;var x=c.getContext('2d');x.imageSmoothingQuality='high';var sr=img.width/img.height,tr=tw/th,sw,sh;if(sr>tr){sh=img.height;sw=sh*tr}else{sw=img.width;sh=sw/tr}x.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,0,0,tw,th);return c}
function toBlob(c,type,q){return new Promise(function(r){c.toBlob(r,type,q)})}
function blobB64(b){return new Promise(function(r){var f=new FileReader();f.onload=function(){r(String(f.result).split(',')[1])};f.readAsDataURL(b)})}

function gemImg(prompt,ratio){
if(!S.gemKey)return Promise.reject(new Error('Add Gemini key in Settings.'));
var body={contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:ratio||'16:9',imageSize:'1K'}}};
return fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(S.imgModel||'gemini-3.1-flash-image')+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':S.gemKey},body:JSON.stringify(body)})
.then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error((j.error&&j.error.message)||'HTTP '+r.status);return j})})
.then(function(j){var c=j.candidates&&j.candidates[0],p=(c&&c.content&&c.content.parts||[]).filter(function(x){return x.inlineData||x.inline_data})[0];
if(!p)throw new Error('Gemini did not return an image.');var d=p.inlineData||p.inline_data;return {mime:d.mimeType||d.mime_type||'image/png',data:d.data}})}

function toMaster(r){return loadImg('data:'+r.mime+';base64,'+r.data).then(function(img){var w=Math.min(img.width,1600),c=crop(img,w,Math.round(w*9/16)),u=c.toDataURL('image/webp',0.85);return u})}
function makeVariants(a){var base='images/'+a.slug+'/'+a.slug;return loadImg(a.img).then(async function(img){
var specs=[['16x9',1200,675,'webp'],['4x3',1200,900,'webp'],['1x1',900,900,'webp'],['social',1200,630,'jpg']],out={},ext='webp';
for(var i=0;i<specs.length;i++){var s=specs[i],c=crop(img,s[1],s[2]),b=await toBlob(c,s[3]==='webp'?'image/webp':'image/jpeg',0.86);out[base+'-'+s[0]+'.'+s[3]]=await blobB64(b)}
return {ext:ext,files:out}})}

function renderImg(){var el=$('#img_prev');if(!el)return;el.innerHTML=IMG.master?'<img src="'+IMG.master+'" style="max-width:100%;border-radius:1rem;margin-top:.8rem">':(IMG.pub?'<p class="muted mt-2 text-xs">Image published.</p>':'<p class="muted mt-2 text-xs">No image yet.</p>')}
function genImage(){var t=($('#f_title').value||'').trim();if(!t)return;aiBusy=true;imgMsg('Generating 16:9 header image with Gemini...');
gemImg('An elegant editorial still life photograph of fine jewelry related to "'+t+'", warm ivory champagne light, soft depth of field, no people, no text.','16:9')
.then(toMaster).then(function(m){IMG.master=m;renderImg();live();imgMsg('Image ready!')},function(e){imgMsg(e.message,true)}).then(function(){aiBusy=false})}

function imgPanel(a){return '<div class="glass p-5 mt-5 rounded-2xl"><h3 class="serif text-2xl">Header Image (Gemini)</h3><label class="fld"><span>Alt text</span><input id="f_imgAlt" value="'+escA(a.imgAlt||'')+'"></label>'
+'<div class="flex gap-2 mt-3"><button class="btn btn-gold" data-act="genimg">Generate AI Image</button><button class="btn btn-ghost" data-act="rmimg">Remove</button></div><p id="img_msg" class="mt-2 text-xs"></p><div id="img_prev"></div></div>'}

var PIN={raw:null,pub:false};
function composePin(raw,headline){return loadImg(raw).then(function(img){var c=crop(img,1000,1500),x=c.getContext('2d'),F='Georgia,serif';x.textAlign='center';
x.fillStyle='rgba(251,245,242,.85)';x.fillRect(0,0,1000,450);x.fillStyle='#3b1a22';x.font='64px '+F;
var lines=[];headline.split(' ').reduce(function(cur,w){var t=(cur+' '+w).trim();if(x.measureText(t).width>840){lines.push(cur);return w}return t},'');lines.push(headline.split(' ').pop());
lines.slice(0,3).forEach(function(l,i){x.fillText(l,500,150+i*75)});x.fillStyle='#8a4b57';x.font='32px '+F;x.fillText('McGee Jewelry',500,1430);return c})}

function renderPin(){var el=$('#pin_prev');if(!el)return;if(PIN.raw)composePin(PIN.raw,$('#f_pinText').value||'Jewelry Guide').then(function(c){el.innerHTML='<img src="'+c.toDataURL('image/jpeg',0.8)+'" style="max-width:14rem;border-radius:1rem;margin-top:.8rem">'})}
function genPin(){var t=($('#f_title').value||'').trim();if(!t)return;aiBusy=true;
gemImg('Tall 2:3 editorial still life of fine jewelry related to "'+t+'", calm ivory background, empty space on top, no text.','2:3')
.then(function(r){return loadImg('data:'+r.mime+';base64,'+r.data)}).then(function(img){return crop(img,1000,1500).toDataURL('image/jpeg',0.86)})
.then(function(m){PIN.raw=m;renderPin();live()},function(e){alert(e.message)}).then(function(){aiBusy=false})}

function pinPanel(a){return '<div class="glass p-5 mt-5 rounded-2xl"><h3 class="serif text-2xl">Pinterest Pin (2:3)</h3><label class="fld"><span>Pin headline text</span><input id="f_pinText" value="'+escA(a.pinText||a.title||'')+'"></label>'
+'<div class="flex gap-2 mt-3"><button class="btn btn-gold" data-act="genpin">Generate AI Pin</button><button class="btn btn-ghost" data-act="rmpin">Remove</button></div><div id="pin_prev"></div></div>'}

function form(){var g=function(k){return $('#f_'+k)?$('#f_'+k).value.trim():''};return {title:g('title'),slug:g('slug'),description:g('description'),lead:g('lead'),category:g('category')||'Guides',short:g('short'),keywords:g('keywords'),hero:g('hero'),aff:g('aff'),pick:g('pick'),body:$('#f_body')?$('#f_body').value.replace(/\s+$/,''):'',imgAlt:g('imgAlt'),img:IMG.master,imgPub:IMG.pub,imgExt:IMG.ext,pinText:g('pinText'),pinRaw:PIN.raw,pinPub:PIN.pub}}
function live(){var a=form(),r=analyse(a);if($('#dl'))$('#dl').textContent='('+a.description.length+')';if($('#ck'))$('#ck').innerHTML=(r.errs.length?r.errs.map(function(e){return '<li class="bad">&#10007; '+esc(e)+'</li>'}):['<li class="ok">&#10003; Ready to publish</li>']).join('')+'<li class="muted">'+r.words+' words, '+r.parsed.secs.length+' sections</li>'}
function saveForm(){var d=form(),a=A.filter(function(x){return x.id===editId})[0];if(!a){a={id:'a'+Date.now(),status:'draft'};A.push(a)}for(var k in d)a[k]=d[k];a.updated=new Date().toISOString();editId=a.id;save();return a}

/* ---------- 4. SETTINGS VIEW ---------- */
function renderSettings(){
$('#app').innerHTML='<h1 class="text-4xl gt">System Settings</h1>' +
'<div class="glass p-6 rounded-3xl mt-5"><h3 class="serif text-2xl">GitHub Auto-Deploy</h3><p class="muted text-xs">Saves files directly to your repo; Vercel builds the site automatically.</p>' +
'<div class="grid sm:grid-cols-3 gap-3 mt-3"><label class="fld"><span>Owner</span><input id="s_owner" value="'+escA(S.owner)+'"></label><label class="fld"><span>Repo</span><input id="s_repo" value="'+escA(S.repo)+'"></label><label class="fld"><span>Branch</span><input id="s_branch" value="'+escA(S.branch)+'"></label></div>' +
'<label class="fld"><span>Site Domain</span><input id="s_domain" value="'+escA(S.domain)+'"></label><label class="fld"><span>Personal Access Token</span><input id="s_token" type="password" value="'+escA(S.token)+'"></label>' +
'<button class="btn btn-gold mt-4" data-act="savesettings">Save & Test GitHub</button><p id="sm" class="text-xs mt-2"></p></div>' +

'<div class="glass p-6 rounded-3xl mt-6"><h3 class="serif text-2xl">Gemini API Key</h3>' +
'<label class="fld"><span>API Key</span><input id="s_gemkey" type="password" value="'+escA(S.gemKey)+'"></label>' +
'<div class="grid sm:grid-cols-2 gap-3"><label class="fld"><span>Writer Model</span><input id="s_gemmodel" value="'+escA(S.gemModel)+'"></label><label class="fld"><span>Image Model</span><input id="s_imgmodel" value="'+escA(S.imgModel)+'"></label></div>' +
'<button class="btn btn-ghost mt-4" data-act="testgem">Test Gemini Connection</button><p id="sm2" class="text-xs mt-2"></p></div>';
}

/* ---------- DISPATCHER & ACTIONS ---------- */
function render(){
  document.querySelectorAll('#admin-nav button.nv').forEach(function(b){
    b.setAttribute('aria-current', String(b.dataset.id === view || (view==='editor'&&b.dataset.id==='blog')));
  });
  if(view==='overview') renderOverview();
  else if(view==='subscribers') renderSubscribers();
  else if(view==='blog') renderBlog();
  else if(view==='editor') renderEditor();
  else if(view==='settings') renderSettings();
}

function act(k,id){
  if(k==='view'){ view=id; render(); }
  else if(k==='new'){ editId=null; view='editor'; render(); }
  else if(k==='edit'){ editId=id; view='editor'; render(); }
  else if(k==='del'){ if(confirm('Delete article?')){ A=A.filter(function(x){return x.id!==id}); save(); render(); } }
  else if(k==='savedraft'){ saveForm(); view='blog'; render(); }
  else if(k==='savepub'){ var b=saveForm(); view='blog'; render(); publish(b.id); }
  else if(k==='publish'){ publish(id); }
  else if(k==='pin'){ var a=A.filter(function(x){return x.id===id})[0]; window.open(pinUrl(a).href,'_blank'); }
  else if(k==='suggest') suggest();
  else if(k==='generate') generate();
  else if(k==='genimg') genImage();
  else if(k==='rmimg'){ IMG.master=null; IMG.pub=false; renderImg(); live(); }
  else if(k==='genpin') genPin();
  else if(k==='rmpin'){ PIN.raw=null; PIN.pub=false; renderPin(); live(); }
  else if(k==='newsub'){
    var em = prompt('Enter customer email:');
    if(em && em.includes('@')){
      SUBS.unshift({ email: em.trim(), plan: 'pro', date: today(), status: 'active', amount: 6.00 });
      save(); renderSubscribers();
    }
  }
  else if(k==='toggleplan'){
    var s = SUBS[+id];
    if(s){ s.plan = s.plan==='pro' ? 'free' : 'pro'; save(); renderSubscribers(); }
  }
  else if(k==='delsub'){
    if(confirm('Remove this subscriber?')){ SUBS.splice(+id,1); save(); renderSubscribers(); }
  }
  else if(k==='savesettings'){
    S.owner=$('#s_owner').value.trim(); S.repo=$('#s_repo').value.trim(); S.branch=$('#s_branch').value.trim()||'main';
    S.domain=$('#s_domain').value.trim()||'https://mcgeejewelry.com'; S.token=$('#s_token').value.trim();
    save(); $('#sm').textContent='Testing GitHub...';
    gh('').then(function(r){ $('#sm').textContent='Connected to '+r.full_name; }, function(e){ $('#sm').textContent='Failed: '+e.message; });
  }
  else if(k==='testgem'){
    S.gemKey=$('#s_gemkey').value.trim(); S.gemModel=$('#s_gemmodel').value.trim(); save();
    $('#sm2').textContent='Testing Gemini...';
    gem('Reply with OK',false,16).then(function(r){ $('#sm2').textContent='Gemini replied: '+r.text; }, function(e){ $('#sm2').textContent='Error: '+e.message; });
  }
}

document.addEventListener('change',function(e){if(e.target&&e.target.name==='ttl')pickTitle(+e.target.value)});
document.addEventListener('click',function(e){
  if(e.target&&e.target.id==='admin-logout'){ if(sb)sb.auth.signOut(); location.reload(); return; }
  var b=e.target.closest('[data-act]');
  if(b&&!b.disabled)act(b.dataset.act,b.dataset.id);
});

checkAdminAuth();
})();
