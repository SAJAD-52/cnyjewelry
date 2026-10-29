/* McGee Jewelry Private Admin Panel
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

// Default sample subscribers
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

/* ---------- ADMIN AUTH GATE ---------- */
function checkAdminAuth() {
  if (!sb) { renderAdminLogin('Connecting to authentication service...'); return; }
  sb.auth.getSession().then(function(res){
    authChecked = true;
    if (res.data && res.data.session && res.data.session.user) {
      currentUser = res.data.session.user;
      if ((currentUser.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        $('#admin-user-pill').textContent = currentUser.email;
        render();
      } else {
        renderAdminLogin('Access denied. Log in with ' + ADMIN_EMAIL);
      }
    } else {
      renderAdminLogin();
    }
  }).catch(function(){
    renderAdminLogin();
  });
}

function renderAdminLogin(msg) {
  $('#app').innerHTML = '<div class="glass p-8 md:p-10 rounded-3xl max-w-md mx-auto mt-12 text-center" style="box-shadow:0 25px 50px rgba(0,0,0,0.15)">' +
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

/* ---------- 3. BLOG MANAGER (ORIGINAL GEMINI / GITHUB SUITE) ---------- */
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
return '<!DOCTYPE html><html lang="en"><head><meta
