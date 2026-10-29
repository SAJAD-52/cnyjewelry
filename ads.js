/* McGee Jewelry Ads & In-House Promotions Engine
   Provider: 'none' (Disables low-quality third-party networks) */
(function(){
  var PROVIDER = 'none'; // Third-party ads disabled for a luxury brand experience

  function renderPromoSlots() {
    var slots = document.querySelectorAll('[data-ad]');
    slots.forEach(function(el) {
      var type = el.dataset.ad;
      if (PROVIDER === 'none') {
        // Replace scam ads with an elegant in-house Pro promotion
        if (type === 'banner' || type === 'inline') {
          el.innerHTML = '<div class="glass glow p-6 md:p-8 my-8 rounded-3xl text-center max-w-4xl mx-auto" style="border:1px solid rgba(243,226,179,0.25)">' +
            '<span class="chip text-xs" style="background:rgba(243,226,179,0.15);color:#b76e79">✨ MCGEE JEWELRY PRO</span>' +
            '<h3 class="serif text-2xl md:text-4xl gt mt-2">Elevate Your Jewelry Collection</h3>' +
            '<p class="muted text-sm md:text-base mt-2 max-w-lg mx-auto">Get unlimited access to the Jewelry Box value tracker, live metal calculators, and styling guides for only <b class="gt">$6 a month</b>.</p>' +
            '<div class="flex flex-wrap justify-center gap-3 mt-5">' +
            '<button onclick="if(window.openProModal)window.openProModal(false)" class="btn btn-gold text-xs shadow-md" style="padding:.45rem 1.3rem">Upgrade to Pro ($6/mo) &rarr;</button>' +
            '<a href="vault.html" class="btn btn-ghost text-xs" style="padding:.45rem 1.3rem">Open Jewelry Box</a>' +
            '</div>' +
            '</div>';
        } else {
          el.style.display = 'none';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPromoSlots);
  } else {
    renderPromoSlots();
  }
})();
