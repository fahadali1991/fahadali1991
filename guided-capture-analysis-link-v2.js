/* Analysis Context Link V2 — persist only reusable analysis inputs/results for next documents */
(function(){
 const KEY='gc_analysis_last_v2';
 const val=k=>document.querySelector(`[data-a2="${k}"]`)?.value||'';
 const digits=v=>String(v||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.');
 function save(){
  if(!document.getElementById('analysisCaptureV2'))return null;
  const maxScore=Number(digits(val('maxScore')))||0;
  const raw=val('scores');
  const scores=window.GC_ANALYSIS_V2?.parseScores?.(raw,maxScore)||[];
  const names=window.GC_ANALYSIS_V2?.parseNames?.(val('names'))||[];
  const data={subject:val('subject').trim(),examType:val('examType').trim(),stageClass:val('stageClass').trim(),termYear:val('termYear').trim(),maxScore,scores,names,savedAt:new Date().toISOString()};
  try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}
  window.GC_ANALYSIS_LAST=data;return data;
 }
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
 document.addEventListener('input',e=>{if(e.target.closest('#analysisCaptureV2'))setTimeout(save,0)},true);
 document.addEventListener('change',e=>{if(e.target.closest('#analysisCaptureV2'))setTimeout(save,0)},true);
 document.addEventListener('click',e=>{if(e.target.closest('#analysisCaptureV2 button'))setTimeout(save,0)},true);
 window.GC_ANALYSIS_LINK_V2={version:'2.0',key:KEY,save,load};
 window.GC_ANALYSIS_LAST=load();
})();