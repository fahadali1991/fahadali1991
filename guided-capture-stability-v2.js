/* School Documentation Engine — Stability Guard V2
   Protect shared state/evidence during edit, back, rerender and regenerate flows. */
(function(){
  const vault={cur:null,evidence:[],errors:[]};
  function clone(v){try{return JSON.parse(JSON.stringify(v))}catch(e){return v}}
  function readCur(){try{return typeof cur!=='undefined'&&cur?cur:null}catch(e){return null}}
  function capture(){
    const c=readCur(); if(c)vault.cur=clone(c);
    if(Array.isArray(window._gcEvidence))vault.evidence=window._gcEvidence.slice();
  }
  function mergeSafe(){
    const c=readCur(),old=vault.cur;
    if(!c||!old)return;
    const same=(c.benchmarkDocId&&old.benchmarkDocId&&c.benchmarkDocId===old.benchmarkDocId)||(c.type&&old.type&&c.type===old.type);
    if(!same)return;
    ['executorName','count','workTitle','stage','domain','topic','scope','mode','subtype','benchmarkDocId'].forEach(k=>{if((c[k]===undefined||c[k]===null||c[k]==='')&&old[k]!==undefined&&old[k]!==null&&old[k]!=='')c[k]=clone(old[k])});
    ['audiences','grades','facts'].forEach(k=>{if((!Array.isArray(c[k])||!c[k].length)&&Array.isArray(old[k])&&old[k].length)c[k]=clone(old[k])});
    if((!c.answers||!Object.keys(c.answers).length)&&old.answers)c.answers=clone(old.answers);
    if((!c.docMeta||!Object.keys(c.docMeta).length)&&old.docMeta)c.docMeta=clone(old.docMeta);
  }
  function restoreEvidence(){
    if(!Array.isArray(window._gcEvidence))window._gcEvidence=[];
    if(!window._gcEvidence.length&&vault.evidence.length){window._gcEvidence.splice(0,window._gcEvidence.length,...vault.evidence);try{window.renderEvidence?.()}catch(e){}}
  }
  function guard(){mergeSafe();restoreEvidence();capture()}
  window.GC_STABILITY={capture,guard,vault,getSnapshot:()=>({cur:clone(vault.cur),evidenceCount:vault.evidence.length,errors:vault.errors.slice()})};
  capture();

  /* Capture before navigation/actions, restore non-destructively after rendering. */
  document.addEventListener('click',e=>{if(e.target.closest('button,a,label')){capture();setTimeout(guard,0);setTimeout(guard,120)}},true);
  document.addEventListener('change',()=>{setTimeout(capture,0)},true);
  document.addEventListener('input',()=>{setTimeout(capture,0)},true);

  ['guided','renderReady','renderParity','generate','start'].forEach(name=>{
    const fn=window[name]; if(typeof fn!=='function')return;
    window[name]=function(){capture();const r=fn.apply(this,arguments);setTimeout(guard,0);setTimeout(guard,80);return r};
  });

  /* Keep evidence vault synchronized with add/remove operations. */
  if(typeof window.addEvidenceFiles==='function'){
    const f=window.addEvidenceFiles;window.addEvidenceFiles=function(){const r=f.apply(this,arguments);setTimeout(capture,100);setTimeout(capture,400);return r};
  }
  if(typeof window.removeEvidence==='function'){
    const f=window.removeEvidence;window.removeEvidence=function(){const r=f.apply(this,arguments);setTimeout(capture,0);return r};
  }

  window.addEventListener('error',e=>{vault.errors.push({time:Date.now(),message:e.message||'error',source:e.filename||''});if(vault.errors.length>30)vault.errors.shift()});
  window.addEventListener('unhandledrejection',e=>{vault.errors.push({time:Date.now(),message:String(e.reason||'unhandled rejection'),source:'promise'});if(vault.errors.length>30)vault.errors.shift()});
})();