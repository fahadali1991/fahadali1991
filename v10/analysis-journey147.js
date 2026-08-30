import {analysisDocumentAvailability147,ANALYSIS_DOCUMENTS147} from './analysis-documents147.js?v=147';
import {analysisFinalPanel147,analysisOutputPanel147} from './analysis-render147.js?v=147';

const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
let lastState=null,bound=false;

export function analysisJourneyPanel147(state){
 const a=analysisDocumentAvailability147(state);if(!a.next.length)return'';
 return `<section class="card analysisJourney147" data-analysis-journey147><div class="muted">وثائق متاحة من نفس البيانات</div><h2>ماذا تريد أن تنشئ بعد ذلك؟</h2><p class="questionHelp">لن نطلب منك إعادة إدخال البيانات الموجودة. سيستخدم النظام المادة والصف والشعبة والأسماء والدرجات ومستوى الإتقان من العمل الحالي، ويسأل فقط عن أي معلومة جديدة تحتاجها الوثيقة التالية.</p><div class="analysisNextGrid147">${a.next.map(d=>`<button type="button" class="analysisNext147 ${d.id}" data-analysis-next147="${d.id}"><span><b>${esc(d.title)}</b><small>${esc(d.reason)}</small></span>${Number(d.count)>0?`<em>${d.count}</em>`:''}</button>`).join('')}</div></section>`;
}
function rerender147(){
 if(!lastState)return;
 const result=document.querySelector('.analysisResult134');if(result)result.outerHTML=analysisFinalPanel147(lastState);
 const out=document.querySelector('[data-analysis-output-host134]');if(out)out.outerHTML=analysisOutputPanel147(lastState);
 const journey=document.querySelector('[data-analysis-journey147]');if(journey)journey.outerHTML=analysisJourneyPanel147(lastState);
}
export function bindAnalysisJourney147(state){
 lastState=state;if(bound||typeof document==='undefined')return;bound=true;
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-analysis-next147]');if(!b||!lastState)return;
  const id=b.dataset.analysisNext147;if(!ANALYSIS_DOCUMENTS147[id])return;
  lastState.metadata=lastState.metadata||{};lastState.metadata.directEntry134=id;
  rerender147();
  document.querySelector('.analysisResult134')?.scrollIntoView({behavior:'smooth',block:'start'});
 },true);
}
