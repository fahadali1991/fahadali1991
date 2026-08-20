/* School Documentation Engine — G0 Diagnostics
   Runtime checks for blocking defects. No UI unless explicitly invoked. */
(function(){
  function fnExists(name){return typeof window[name]==='function'}
  function onclickNames(){
    const names=[];document.querySelectorAll('[onclick]').forEach(el=>{const s=el.getAttribute('onclick')||'';const m=s.match(/^\s*([A-Za-z_$][\w$]*)\s*\(/);if(m)names.push({name:m[1],text:(el.textContent||'').trim().slice(0,40)})});return names;
  }
  function duplicateIds(){const seen=new Set(),dup=[];document.querySelectorAll('[id]').forEach(el=>{if(seen.has(el.id))dup.push(el.id);seen.add(el.id)});return [...new Set(dup)]}
  function run(){
    const missing=[];onclickNames().forEach(x=>{if(!fnExists(x.name)&&!['window'].includes(x.name))missing.push(x)});
    const required=['start','generate','guided','gcPrintV2'];const requiredMissing=required.filter(x=>!fnExists(x));
    const state=window.GC_STABILITY?.getSnapshot?.()||null;
    const errors=state?.errors||[];
    const result={
      passed:missing.length===0&&requiredMissing.length===0&&duplicateIds().length===0&&errors.length===0,
      timestamp:new Date().toISOString(),
      missingHandlers:missing,
      requiredMissing,
      duplicateIds:duplicateIds(),
      runtimeErrors:errors,
      evidenceCount:state?.evidenceCount??(window._gcEvidence?.length||0),
      hasCurrentState:(()=>{try{return typeof cur!=='undefined'&&!!cur}catch(e){return false}})(),
      v2:{registry:!!window.GC_V2,outputFamily:window.gcV2OutputFamily?.()||'generic',print:fnExists('gcPrintV2')}
    };
    window.GC_LAST_G0_DIAGNOSTICS=result;return result;
  }
  window.gcRunG0Diagnostics=run;
  window.gcShowG0Diagnostics=function(){const r=run();alert((r.passed?'G0 PASS':'G0 CHECK')+'\nMissing handlers: '+r.missingHandlers.length+'\nRequired missing: '+r.requiredMissing.length+'\nDuplicate IDs: '+r.duplicateIds.length+'\nRuntime errors: '+r.runtimeErrors.length+'\nEvidence: '+r.evidenceCount)};

  /* Passive audit after each major DOM rewrite. */
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,150)}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(run,400);
})();