/* McGee Jewelry Interactive Tool Showcase Strip */
(function(){
  var TOOLS = {
    sizing: { href: 'sizing.html', title: 'Ring & Bracelet Sizer', desc: 'Convert US, UK, EU & Japan sizes with live millimeter scaling.' },
    styling: { href: 'styling.html', title: 'Metal & Undertone Match', desc: 'Match yellow gold, white gold, silver, or rose gold to your complexion.' },
    care: { href: 'care.html', title: 'Jewelry Care Vault', desc: 'Safe cleaning routines for gold, silver, pearls, and diamonds.' },
    vault: { href: 'vault.html', title: 'My Jewelry Box Vault', desc: 'Catalog pieces, track pure gold grams, and calculate melt value.' },
    planner: { href: 'planner.html', title: 'Lookbook & Wear Planner', desc: 'Plan weekly looks and track 30-day Cost-Per-Wear.' }
  };

  function renderShowcases() {
    document.querySelectorAll('[data-showcase]').forEach(function(el) {
      var title = el.dataset.title || 'Explore McGee Jewelry Studios';
      var sub = el.dataset.sub || 'Interactive tools crafted for collectors.';
      var picks = (el.dataset.pick || 'sizing,care,styling').split(',').map(function(s){ return s.trim(); });
      var cards = picks.map(function(k){
        var t = TOOLS[k];
        if (!t) return '';
        return '<a href="' + t.href + '" class="glass glow p-5 rounded-2xl block no-underline text-inherit tool-card">' +
               '<h3 class="serif text-2xl gt">' + t.title + '</h3>' +
               '<p class="muted text-xs mt-1.5">' + t.desc + '</p>' +
               '<span class="inline-block mt-3 text-xs font-medium gt">Open Studio &rarr;</span>' +
               '</a>';
      }).join('');

      el.innerHTML = '<section class="mt-14 mb-6">' +
                     '<h2 class="serif text-3xl gt">' + title + '</h2>' +
                     '<p class="muted text-sm mt-1 mb-5">' + sub + '</p>' +
                     '<div class="grid md:grid-cols-3 gap-4">' + cards + '</div>' +
                     '</section>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderShowcases);
  } else {
    renderShowcases();
  }
})();
