/* McGee Jewelry Curated Recommendation Slots */
(function(){
  var slots = document.querySelectorAll('[data-aff]');
  if (!slots.length) return;
  slots.forEach(function(el){
    el.innerHTML = '';
  });
})();
