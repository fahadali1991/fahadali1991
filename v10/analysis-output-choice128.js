import {analysisSummary113} from './analysis-data113.js?v=128';
import {analysisDecisionModel127} from './analysis-decision127.js?v=127';

const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const ORDER=['classification','remedial','enrichment'];
const LABELS={classification:'تصنيف الطلاب حسب مستوياتهم',remedial:'الخطة العلاجية',enrichment:'الخطة الإثرائية'};

function applicable(state){
 const m=analysisDecisionModel127(state);
 return {
  classification:Boolean(m.ready),
  remedial:Boolean(m.ready&&m.groupMap?.support?.count>0),
  enrichment:Boolean(m.ready&&m.groupMap?.advanced?.count>0),
  model:m
 };
}

function syncWorkflow(state,selected){
 state.metadata=state.metadata||{};state.metadata.familyDetails=state.metadata.familyDetails||{};
 const f=state.metadata.familyDetails;
 if(f.actionStatus&&!state.metadata.analysisWorkflowDerived128)return;
 const plans=selected.filter(x=>x==='remedial'||x==='enrichment');
 if(plans.length){
  f.actionStatus='مخطط للتنفيذ';
  const actions=[];if(plans.includes('remedial'))actions.push('مخطط: إعداد خطة علاجية');if(plans.includes('enrichment'))actions.push('مخطط: إعداد خطة إثرائية');
  f.action=actions.join('|||');
  f.follow='إعادة القياس بعد تنفيذ الخطة ومقارنة أداء الطلاب بخط الأساس قبل الحكم على التحسن أو الأثر.';
 }else{
  f.actionStatus='لم يحدد بعد';delete f.action;
  f.follow='متابعة مستويات الطلاب في القياسات اللاحقة، ولا يسجل تحسن أو أثر دون نتيجة قياس جديدة.';
 }
 state.metadata.analysisWorkflowDerived128=true;
}

function ensure(state){
 state.metadata=state.metadata||{};
 const sum=analysisSummary113(state);
 if(state?.classification?.type!=='تحليل نتائج'||!sum.ready)return[];
 if(state.metadata.directEntry128==='classification'){
  state.metadata.analysisOutputs128=['classification'];
  state.metadata.analysisOutputsInitialized128=true;
  syncWorkflow(state,state.metadata.analysisOutputs128);
  return state.metadata.analysisOutputs128;
 }
 if(!Array.isArray(state.metadata.analysisOutputs128)||!state.metadata.analysisOutputsInitialized128){
  const a=applicable(state),initial=['classification'];
  if(a.remedial)initial.push('remedial');
  if(a.enrichment)initial.push('enrichment');
  state.metadata.analysisOutputs128=initial;
  state.metadata.analysisOutputsInitialized128=true;
 }
 const selected=state.metadata.analysisOutputs128.filter(x=>ORDER.includes(x));syncWorkflow(state,selected);return selected;
}

export function analysisOutputSelection128(state){return [...ensure(state)]}
export function hasAnalysisOutput128(state,id){return analysisOutputSelection128(state).includes(id)}

function option(id,on,enabled,detail){
 return `<button type="button" class="analysisOutputOption128 ${on?'on':''} ${enabled?'':'disabled'}" data-analysis-output128="${id}" ${enabled?'':'disabled'} aria-pressed="${on?'true':'false'}"><span class="analysisOutputCheck128">${on?'✓':'○'}</span><span><b>${esc(LABELS[id])}</b><small>${esc(detail)}</small></span></button>`;
}

export function analysisOutputChoicePanel128(state){
 if(state?.classification?.type!=='تحليل نتائج'||state?.metadata?.editAnalysisData113)return'';
 const sum=analysisSummary113(state);if(!sum.ready)return'';
 const selected=analysisOutputSelection128(state),a=applicable(state),m=a.model;
 if(state.metadata?.directEntry128==='classification')return `<section class="analysisOutputDirect128"><b>المخرج المطلوب: تصنيف الطلاب حسب مستوياتهم</b><span>سيستخدم المحرك الدرجات نفسها ويُخرج وثيقة التصنيف مباشرة دون إنشاء خطة علاجية أو إثرائية.</span></section>`;
 return `<section class="analysisOutputChoice128"><div class="adaptiveKicker106">بعد اعتماد الدرجات</div><h2>ماذا تريد إنشاءه من هذه النتائج؟</h2><p class="questionHelp">يمكن اختيار أكثر من مخرج. تقرير تحليل النتائج يبقى الصفحة الأساسية، ويُضاف كل مخرج تختاره في صفحة PDF مستقلة.</p><div class="analysisOutputGrid128">${option('classification',selected.includes('classification'),a.classification,'تصنيف كل طالب من نفس الدرجات')}${option('remedial',selected.includes('remedial'),a.remedial,a.remedial?`${m.groupMap.support.count} من الطلاب دون حد الإتقان`:'لا يوجد طلاب دون حد الإتقان في الدرجات الحالية')}${option('enrichment',selected.includes('enrichment'),a.enrichment,a.enrichment?`${m.groupMap.advanced.count} من الطلاب في مستوى متقدم`:'لا يوجد طلاب في مستوى الإثراء في الدرجات الحالية')}</div><div class="analysisOutputNote128"><b>إدخال واحد</b><span>لن يطلب منك النظام إعادة كتابة أسماء الطلاب أو درجاتهم عند إنشاء هذه المخرجات.</span></div></section>`;
}

let current=null;
export function bindAnalysisOutputChoice128(state){current=state;queueMicrotask(renderAnalysisOutputChoice128Slot)}
export function renderAnalysisOutputChoice128Slot(){
 if(!current||typeof document==='undefined')return;
 const slot=document.querySelector('[data-analysis-output-choice128]');if(!slot)return;
 slot.innerHTML=analysisOutputChoicePanel128(current);
}
function signal(){const el=document.querySelector('[data-family-field]');if(el)el.dispatchEvent(new Event('input',{bubbles:true}));document.dispatchEvent(new CustomEvent('analysis-output-change128',{detail:{outputs:analysisOutputSelection128(current)}}))}

if(typeof document!=='undefined'){
 document.addEventListener('click',e=>{
  if(!current)return;
  const b=e.target.closest?.('[data-analysis-output128]');if(!b||b.disabled)return;
  const id=b.dataset.analysisOutput128,a=applicable(current);if(!a[id])return;
  const set=new Set(analysisOutputSelection128(current));if(set.has(id))set.delete(id);else set.add(id);
  current.metadata.analysisOutputs128=ORDER.filter(x=>set.has(x));
  current.metadata.analysisOutputsInitialized128=true;syncWorkflow(current,current.metadata.analysisOutputs128);
  renderAnalysisOutputChoice128Slot();signal();
 },true);
 document.addEventListener('family-meta-change111',()=>queueMicrotask(renderAnalysisOutputChoice128Slot),true);
 document.addEventListener('input',e=>{if(e.target.closest?.('[data-analysis-host113]'))queueMicrotask(renderAnalysisOutputChoice128Slot)},true);
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-analysis-next113],[data-analysis-edit113],[data-analysis-cancel113]'))queueMicrotask(renderAnalysisOutputChoice128Slot)},true);
}

if(typeof document!=='undefined'&&!document.getElementById('analysis-output-choice128-style')){
 const s=document.createElement('style');s.id='analysis-output-choice128-style';s.textContent='.analysisOutputChoice128{margin-top:14px;padding:14px;border:1px solid #dce8e4;border-radius:15px;background:#fbfefd}.analysisOutputChoice128 h2{margin:5px 0}.analysisOutputGrid128{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:12px}.analysisOutputOption128{display:flex;gap:9px;align-items:flex-start;text-align:right;border:1px solid #dce7e3;background:#fff;border-radius:13px;padding:12px;min-height:84px}.analysisOutputOption128.on{border:2px solid #078c63;background:#effaf5}.analysisOutputOption128.disabled{opacity:.55;cursor:not-allowed}.analysisOutputOption128 b{display:block;color:#244e43}.analysisOutputOption128 small{display:block;margin-top:4px;color:#71807c;font-size:10px;line-height:1.45}.analysisOutputCheck128{width:24px;height:24px;border-radius:8px;background:#eef7f4;color:#087b5d;display:grid;place-items:center;font-weight:900;flex:0 0 auto}.analysisOutputOption128.on .analysisOutputCheck128{background:#087b5d;color:#fff}.analysisOutputNote128,.analysisOutputDirect128{display:flex;gap:8px;align-items:flex-start;margin-top:10px;padding:9px 11px;border-radius:10px;background:#eef7f4;color:#365b51;font-size:12px}.analysisOutputNote128 b,.analysisOutputDirect128 b{white-space:nowrap;color:#17694f}.analysisOutputDirect128{margin:12px 0}@media(max-width:650px){.analysisOutputGrid128{grid-template-columns:1fr}.analysisOutputNote128,.analysisOutputDirect128{display:block}.analysisOutputNote128 b,.analysisOutputDirect128 b{display:block;margin-bottom:3px}}';document.head.appendChild(s)
}
