import {analysisState113,analysisSummary113,bindAnalysisData113,renderAnalysisSlot113} from './analysis-data113.js?v=120.1';
import {finiteNumber120} from './input-normalization120.js?v=120.1';

let current=null,patching=false,observer=null;
const clean=v=>String(v??'').trim();
const setText=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text};
const setHtml=(el,html)=>{if(el&&el.innerHTML!==html)el.innerHTML=html};
const announce133=()=>{if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('analysis-data-change133'))};

export function explicitCriterion131(state){
 const raw=clean(state?.metadata?.analysis?.masteryPercent);
 const n=finiteNumber120(raw);
 return raw!==''&&n!==null&&n>0&&n<=100?{defined:true,value:n,raw}: {defined:false,value:null,raw:''};
}

function neutralFinding(state){
 const a=analysisState113(state),scores=(a.scores||[]).map(finiteNumber120).filter(x=>x!==null),max=finiteNumber120(a.maxScore)||0;
 if(!scores.length||!max)return'';
 const avg=scores.reduce((x,y)=>x+y,0)/scores.length,achievement=avg/max*100;
 return `شمل التحليل ${scores.length} طالبًا، وبلغ متوسط الدرجات ${avg.toFixed(2)} من ${max} بنسبة تحصيل ${achievement.toFixed(1)}٪. لم يحدد المعلم مستوى الإتقان المستهدف لهذا الاختبار؛ لذلك تقتصر القراءة على المؤشرات الكمية دون إصدار حكم إتقان أو تدخل آلي.`;
}

function initializeCriterionSource(state){
 const a=analysisState113(state);state.metadata=state.metadata||{};
 if(a.criterionSource131)return;
 const raw=clean(a.masteryPercent);
 if(!a.updatedAt&&raw==='70'){a.masteryPercent='';a.criterionSource131='none';return}
 a.criterionSource131=raw?'legacy_or_user':'none';
}

function syncNoCriterion(state){
 if(!state)return;const a=analysisState113(state),c=explicitCriterion131(state);
 if(c.defined)return;
 if(a.masteryPercent!=='')a.masteryPercent='';
 state.metadata.familyDetails=state.metadata.familyDetails||{};
 const finding=neutralFinding(state);if(finding){if(state.metadata.familyDetails.finding!==finding)state.metadata.familyDetails.finding=finding;a.findingSource='derived-quantitative-no-criterion'}
}

function patchReadyCard(host,state){
 const b=host.querySelector('.analysisDataReady113 b');if(!b)return;
 const c=explicitCriterion131(state),old=b.textContent;
 const next=!c.defined?old.replace(/ · حد الإتقان:\s*70(?:\.0)?٪/,' · مستوى الإتقان المستهدف: غير محدد').replace(/ · حد الإتقان:\s*[^·]+/,' · مستوى الإتقان المستهدف: غير محدد').replace(/ · محك الأداء:\s*[^·]+/,' · مستوى الإتقان المستهدف: غير محدد'):old.replace('حد الإتقان:','مستوى الإتقان المستهدف:').replace('محك الأداء:','مستوى الإتقان المستهدف:');
 if(next!==old)b.textContent=next;
}

function patchEditor(host,state){
 const input=host.querySelector('[data-analysis-mastery120]'),expected=host.querySelector('[data-analysis-expected118]');
 if(expected){expected.setAttribute('type','text');expected.setAttribute('inputmode','numeric');expected.removeAttribute('min');expected.removeAttribute('step')}
 if(!input)return;
 const label=input.closest('label'),title=label?.querySelector(':scope > span'),help=label?.querySelector(':scope > small');
 setHtml(title,'مستوى الإتقان المستهدف <small>(اختياري)</small>');
 setText(help,'يمكنك تحديده كنسبة مئوية لهذا الاختبار. إذا لم يكن للاختبار مستوى مستهدف محدد فاتركه فارغًا؛ سيستمر التحليل دون تصنيف علاج أو إثراء آلي.');
 if(input.placeholder!=='مثال: 80')input.placeholder='مثال: 80';
 const c=explicitCriterion131(state);if(!c.defined&&input.value==='70')input.value='';
 const intro=host.querySelector('.questionHelp');setText(intro,'سيُحسب عدد الطلاب والمؤشرات الكمية من الدرجات. مستوى الإتقان المستهدف اختياري، ولا يضع النظام نسبة افتراضية نيابة عن المعلم.');
}

export function patchAnalysisData131(){
 if(patching||!current||typeof document==='undefined')return;patching=true;
 try{
  initializeCriterionSource(current);
  if(current.metadata?.analysis?.criterionSource131==='none')syncNoCriterion(current);
  document.querySelectorAll('.analysisData113').forEach(host=>{patchReadyCard(host,current);patchEditor(host,current)});
 }finally{patching=false}
}

function installObserver(){
 if(typeof document==='undefined'||observer)return;
 observer=new MutationObserver(()=>queueMicrotask(patchAnalysisData131));
 observer.observe(document.documentElement,{subtree:true,childList:true});
 document.addEventListener('input',e=>{
  if(!current||!e.target.matches?.('[data-analysis-mastery120],[data-analysis-max113],[data-analysis-expected118],[data-analysis-rows113],[data-analysis-name114],[data-analysis-score114]'))return;
  const criterion=document.querySelector('[data-analysis-mastery120]');
  if(criterion){const raw=clean(criterion.value);current.metadata.analysis.criterionSource131=raw?'user':'none';if(!raw)current.metadata.analysis.masteryPercent=''}
  queueMicrotask(()=>{if(current.metadata.analysis.criterionSource131==='none')syncNoCriterion(current);patchAnalysisData131();announce133()});
 },true);
 document.addEventListener('change',e=>{if(e.target.matches?.('[data-analysis-file114]'))setTimeout(()=>{if(current?.metadata?.analysis?.criterionSource131==='none')syncNoCriterion(current);patchAnalysisData131();announce133()},150)},true);
}

export function bindAnalysisData131(state){
 current=state;initializeCriterionSource(state);if(state.metadata.analysis.criterionSource131==='none')syncNoCriterion(state);installObserver();bindAnalysisData113(state);queueMicrotask(()=>{patchAnalysisData131();announce133()})
}
export function renderAnalysisSlot131(){renderAnalysisSlot113();queueMicrotask(()=>{patchAnalysisData131();announce133()})}
export function analysisSummary131(state){
 const base=analysisSummary113(state),criterion=explicitCriterion131(state);
 if(!base.ready)return{...base,criterionDefined:criterion.defined,masteryPercent:criterion.value};
 if(criterion.defined)return{...base,criterionDefined:true,masteryPercent:criterion.value};
 return{...base,criterionDefined:false,masteryPercent:null,weak:null,monitor:null,advanced:null};
}
