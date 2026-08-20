/* G0/G1 Acceptance Audit V2.2 — silent structural/runtime checks */
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
    const stabilityContract=!!(window.GC_STABILITY&&typeof GC_STABILITY.capture==='function'&&typeof GC_STABILITY.guard==='function'&&typeof GC_STABILITY.syncEvidence==='function'&&typeof GC_STABILITY.restoreEvidence==='function');
    const stabilityTest=window.GC_STABILITY?.selfTest?.()||{passed:false};
    const registryAudit=window.GC_V2?.validateRegistry?.()||{passed:false,count:0,problems:['registry-unavailable']};
    const requiredFamilies=['event','minutes','analysis','plan'];
    const outputFamilies=window.GC_V2_OUTPUT?.renderers||[];
    const missingRenderers=requiredFamilies.filter(f=>!outputFamilies.includes(f));
    const dups=duplicateIds();
    const result={
      passed:tiles.length>=7&&entryInline.length===0&&missingIntent.length===0&&missingFunctions.length===0&&dups.length===0&&stabilityContract&&stabilityTest.passed&&registryAudit.passed&&missingRenderers.length===0,
      entryTiles:tiles.length,
      inlineHandlers:entryInline.length,
      missingIntent:missingIntent.length,
      missingFunctions,
      duplicateIds:dups,
      stabilityContract,
      stabilityTest,
      evidenceCount:window.GC_STABILITY?.getSnapshot?.().evidenceCount??null,
      registryAudit,
      outputFamilies,
      missingRenderers,
      timestamp:new Date().toISOString()
    };
    window.GC_G0_ACCEPTANCE=result;
    window.GC_G1_ACCEPTANCE={passed:registryAudit.passed&&missingRenderers.length===0,registryAudit,outputFamilies,missingRenderers,timestamp:result.timestamp};
    if(!result.passed)console.warn('[G0/G1 acceptance]',result);
    return result;
  }
  window.gcRunG0Acceptance=run;
  window.gcRunG1Acceptance=()=>{run();return window.GC_G1_ACCEPTANCE};
  let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(run,120)}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(run,250);
})();