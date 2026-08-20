/* G0 Acceptance Audit V2 — silent structural/runtime checks */
(function(){
  function duplicateIds(){
    const seen=new Set(),dups=[];
    document.querySelectorAll('[id]').forEach(el=>{if(seen.has(el.id))dups.push(el.id);else seen.add(el.id)});
    return [...new Set(dups)];
  }
  function run(){
    const tiles=[...document.querySelectorAll('[data-entry-intent]')];
    const entryInline=tiles.filter(x=>x.hasAttribute('onclick'));
    const missingIntent=tiles.filter(x=>!x.dataset.entryIntent);
    const missingFunctions=[];
    ['openEntry','start','gcCreateDocumentV2','gcPrintV2'].forEach(n=>{if(typeof window[n]!=='function')missingFunctions.push(n)});
    if(!window.GC_STABILITY)missingFunctions.push('GC_STABILITY');
    const dups=duplicateIds();
    const result={
      passed:tiles.length>=7&&entryInline.length===0&&missingIntent.length===0&&missingFunctions.length===0&&dups.length===0,
      entryTiles:tiles.length,
      inlineHandlers:entryInline.length,
      missingIntent:missingIntent.length,
      missingFunctions,
      duplicateIds:dups,
      timestamp:new Date().toISOString()
    };
    window.GC_G0_ACCEPTANCE=result;
    if(!result.passed)console.warn('[G0 acceptance]',result);
    return result;
  }
  window.gcRunG0Acceptance=run;
  let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(run,120)}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(run,250);
})();