/* School Documentation Engine — Stability Guard V2.2
   Protect shared state/evidence during edit, back, rerender and regenerate flows. */
(function(){
  const vault={cur:null,evidence:[],errors:[]};
  function clone(v){try{return JSON.parse(JSON.stringify(v))}catch(e){return v}}
  function readCur(){try{return typeof cur!=='undefined'&&cur?cur:null}catch(e){return null}}
  function syncEvidence(){
    if(!Array.isArray(window._gcEvidence))window._gcEvidence=[];
    vault.evidence=window._gcEvidence.slice();
    return vault.evidence.length;
  }
  function capture(){
    const c=readCur(); if(c)vault.cur=clone(c);
    syncEvidence();
    return getSnapshot();
  }
  function mergeInto(current,old){
    if(!current||!old)return current;
    const same=(current.benchmarkDocId&&old.benchmarkDocId&&current.benchmarkDocId===old.benchmarkDocId)||(current.type&&old.type&&current.type===old.type);
    if(!same)return current;
    ['executorName','count','workTitle','stage','domain','topic','scope','mode','subtype','benchmarkDocId'].forEach(k=>{if((current[k]===undefined||current[k]===null||current[k]==='')&&old[k]!==undefined&&old[k]!==null&&old[k]!=='')current[k]=clone(old[k])});
    ['audiences','grades','facts'].forEach(k=>{if((!Array.isArray(current[k])||!current[k].length)&&Array.isArray(old[k])&&old[k].length)current[k]=clone(old[k])});
    if((!current.answers||!Object.keys(current.answers).length)&&old.answers)current.answers=clone(old.answers);
    if((!current.docMeta||!Object.keys(current.docMeta).length)&&old.docMeta)current.docMeta=clone(old.docMeta);
    return current;
  }
  function mergeSafe(){const c=readCur();if(c&&vault.cur)mergeInto(c,vault.cur)}
  function restoreEvidence(){
    if(!Array.isArray(window._gcEvidence))window._gcEvidence=[];
    if(!window._gcEvidence.length&&vault.evidence.length){
      window._gcEvidence.splice(0,window._gcEvidence.length,...vault.evidence);
      try{window.renderEvidence?.()}catch(e){}
    }
    return window._gcEvidence.length;
  }
  function guard(){mergeSafe();restoreEvidence();capture();return getSnapshot()}
  function getSnapshot(){return {cur:clone(vault.cur),evidenceCount:vault.evidence.length,errors:vault.errors.slice()}}
  function selfTest(){
    const old={type:'برنامج / فعالية',executorName:'معلم',count:'20',workTitle:'عنوان',audiences:['طلاب'],grades:['الأول المتوسط'],answers:{place:'الفصل'},facts:['حقيقة']};
    const current={type:'برنامج / فعالية',executorName:'',count:'',workTitle:'',audiences:[],grades:[],answers:{},facts:[]};
    mergeInto(current,old);
    const stateOk=current.executorName==='معلم'&&current.count==='20'&&current.workTitle==='عنوان'&&current.audiences[0]==='طلاب'&&current.grades[0]==='الأول المتوسط'&&current.answers.place==='الفصل'&&current.facts[0]==='حقيقة';
    const different={type:'تحليل نتائج',executorName:''};mergeInto(different,old);
    const isolationOk=different.executorName==='';
    const result={passed:stateOk&&isolationOk,stateOk,isolationOk,timestamp:new Date().toISOString()};
    window.GC_STABILITY_SELF_TEST=result;return result;
  }
  window.GC_STABILITY={capture,guard,syncEvidence,restoreEvidence,vault,getSnapshot,selfTest};
  capture(); selfTest();

  document.addEventListener('click',e=>{if(e.target.closest('button,a,label')){capture();setTimeout(guard,0);setTimeout(guard,120)}},true);
  document.addEventListener('change',()=>{setTimeout(capture,0)},true);
  document.addEventListener('input',()=>{setTimeout(capture,0)},true);

  ['guided','renderReady','renderParity','generate','start'].forEach(name=>{
    const fn=window[name]; if(typeof fn!=='function')return;
    window[name]=function(){capture();const r=fn.apply(this,arguments);setTimeout(guard,0);setTimeout(guard,80);return r};
  });
  if(typeof window.addEvidenceFiles==='function'){
    const f=window.addEvidenceFiles;window.addEvidenceFiles=function(){const r=f.apply(this,arguments);setTimeout(syncEvidence,100);setTimeout(syncEvidence,400);return r};
  }
  if(typeof window.removeEvidence==='function'){
    const f=window.removeEvidence;window.removeEvidence=function(){const r=f.apply(this,arguments);setTimeout(syncEvidence,0);return r};
  }

  window.addEventListener('error',e=>{vault.errors.push({time:Date.now(),message:e.message||'error',source:e.filename||''});if(vault.errors.length>30)vault.errors.shift()});
  window.addEventListener('unhandledrejection',e=>{vault.errors.push({time:Date.now(),message:String(e.reason||'unhandled rejection'),source:'promise'});if(vault.errors.length>30)vault.errors.shift()});
})();