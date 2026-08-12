/* UI fix: remove duplicated legacy work-family card after subtype enhancement */
(function(){
  const prev = typeof understandingView === 'function' ? understandingView : null;
  if(!prev) return;
  understandingView = function(){
    let h = prev();
    h = h.replace(/<div class="fact"><small>عائلة العمل · اقتراح النظام<\/small><b>[^<]*<\/b><\/div>/,'');
    return h;
  };
})();
