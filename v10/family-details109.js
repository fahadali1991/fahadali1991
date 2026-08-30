import {familyDetailsPage106} from './family-details106.js?v=133';
import {subjectSelector109,applySubject109,beginSubjectEdit109,cancelSubjectEdit109} from './subject-selector109.js?v=133';
import {familyMetaQuestion111,familyMetaPending111,bindFamilyMeta111} from './family-meta111.js?v=119.1';
import {bindAnalysisData131,renderAnalysisSlot131} from './analysis-data131.js?v=133';
import {analysisContextQuestion134,analysisContextPending134,bindAnalysisContext134} from './analysis-context134.js?v=134';
import {bindAnalysisTargetLevel134} from './analysis-target-level134.js?v=134';
let current=null;
const clean=v=>String(v??'').trim();
function copy134(state){const mode=state?.metadata?.directEntry134||'analysis';if(mode==='classification')return{page:'بيانات تصنيف الطلاب',ready:'مدخلات التصنيف جاهزة',action:'عرض تصنيف الطلاب'};if(mode==='remedial')return{page:'بيانات الخطة العلاجية',ready:'مدخلات الخطة العلاجية جاهزة',action:'إعداد الخطة العلاجية'};if(mode==='enrichment')return{page:'بيانات الخطة الإثرائية',ready:'مدخلات الخطة الإثرائية جاهزة',action:'إعداد الخطة الإثرائية'};return{page:'بيانات تحليل النتائج',ready:'مدخلات التحليل جاهزة',action:'عرض تحليل النتائج'}}
function isDirectPlan147(state){return['remedial','enrichment'].includes(state?.metadata?.directEntry134)}
function manualPlan147(state){state.metadata=state.metadata||{};state.metadata.manualPlan147=state.metadata.manualPlan147||{source:'scores',targetNames:'',skill:'',reason:''};return state.metadata.manualPlan147}
function planManualBlock147(state){
 if(!isDirectPlan147(state))return'';const m=manualPlan147(state),manual=m.source==='manual',label=state.metadata.directEntry134==='remedial'?'العلاجية':'الإثرائية';
 return `<section class="directPlanInput147" data-direct-plan147><div class="muted">طريقة إعداد الخطة ${label}</div><h2>اختر مصدر تحديد الطلاب</h2><div class="chips choiceGrid"><button type="button" class="chip ${manual?'':'on'}" data-plan-source147="scores">من نتائج أو درجات الطلاب</button><button type="button" class="chip ${manual?'on':''}" data-plan-source147="manual">تحديد الطلاب مباشرة دون درجات</button></div><div class="directPlanManual147" ${manual?'':'hidden'}><label><span>الطلاب المستهدفون</span><textarea rows="4" data-plan-manual147="targetNames" placeholder="اكتب اسم كل طالب في سطر، أو افصل الأسماء بفاصلة">${clean(m.targetNames)}</textarea><small>لا نحتاج درجات إذا كنت تعرف الفئة المستهدفة مباشرة.</small></label><label><span>${state.metadata.directEntry134==='remedial'?'المهارة أو ناتج التعلم المستهدف':'المجال أو المهارة المراد إثراؤها'} <small>(اختياري)</small></span><input type="text" data-plan-manual147="skill" value="${clean(m.skill)}" placeholder="مثال: التمييز بين المذكر والمؤنث"></label><label><span>سبب اختيار الفئة <small>(اختياري)</small></span><textarea rows="2" data-plan-manual147="reason" placeholder="مثال: أظهر التقويم الصفي حاجة هؤلاء الطلاب إلى دعم إضافي">${clean(m.reason)}</textarea></label></div></section>`;
}
function manualNames147(state){return clean(manualPlan147(state).targetNames).split(/[\n،,]+/).map(clean).filter(Boolean)}
function manualReady147(state){return isDirectPlan147(state)&&manualPlan147(state).source==='manual'&&Boolean(clean(state?.metadata?.familyDetails?.subject94||state?.metadata?.subjectHint101))&&manualNames147(state).length>0}
function directLabels134(state,html){const c=copy134(state);let out=html.replace(/محك الأداء/g,'مستوى الإتقان المستهدف').replace(/محكًا/g,'مستوى إتقان مستهدفًا');if(state?.classification?.type==='تحليل نتائج'){out=out.replace('بيانات تحليل النتائج',c.page).replace('مدخلات التحليل جاهزة',c.ready).replace('عرض تحليل النتائج',c.action)}return out}
function patchDirectDom134(){
 if(!current||current?.classification?.type!=='تحليل نتائج'||typeof document==='undefined')return;const c=copy134(current),root=document.querySelector('.familyDetailsStep');if(!root)return;
 const h=root.querySelector(':scope > h1');if(h&&/بيانات (?:تحليل النتائج|تصنيف الطلاب|الخطة العلاجية|الخطة الإثرائية)/.test(h.textContent||''))h.textContent=c.page;
 if(isDirectPlan147(current)){
  const m=manualPlan147(current),manual=m.source==='manual',slot=root.querySelector('[data-analysis-slot113]'),ctx=root.querySelector('[data-analysis-context134]');if(slot)slot.hidden=manual;if(ctx)ctx.hidden=manual;
  const box=root.querySelector('[data-direct-plan147]'),manualBox=box?.querySelector('.directPlanManual147');if(manualBox)manualBox.hidden=!manual;box?.querySelectorAll('[data-plan-source147]').forEach(b=>b.classList.toggle('on',b.dataset.planSource147===m.source));
 }
 const done=root.querySelector('.analysisFastDone133');
 if(done&&manualReady147(current)){
  const icon=done.querySelector('.adaptiveDoneIcon106');if(icon)icon.textContent='✓';
  const title=done.querySelector('h2');if(title)title.textContent=c.ready;
  const p=done.querySelector('.questionHelp');if(p)p.textContent='اكتملت البيانات اللازمة لهذه الوثيقة. لن يطلب النظام درجات غير موجودة، وسيستخدم فقط الطلاب والمعلومات التي أدخلتها.';
  let row=done.querySelector('.row');if(!row){row=document.createElement('div');row.className='row';done.appendChild(row)}row.innerHTML=`<button class="btn primary" data-action="finalize">${c.action}</button>`;
 }else{
  const title=done?.querySelector('h2');if(title&&/مدخلات .* جاهزة/.test(title.textContent||''))title.textContent=c.ready;
  const b=done?.querySelector('[data-action="finalize"]');if(b)b.textContent=c.action;
 }
 root.querySelectorAll('*').forEach(el=>{if(el.childElementCount===0&&el.textContent){el.textContent=el.textContent.replace(/محك الأداء/g,'مستوى الإتقان المستهدف').replace(/محكًا/g,'مستوى إتقان مستهدفًا')}})
}
function inject(html,state){const subject=subjectSelector109(state),meta=familyMetaQuestion111(state),metaPending=familyMetaPending111(state),manual=isDirectPlan147(state)&&manualPlan147(state).source==='manual',context=!metaPending&&!manual?analysisContextQuestion134(state):'',contextPending=!metaPending&&!manual&&analysisContextPending134(state),pending=metaPending||contextPending,marker='<div data-adaptive-zone>';let out=directLabels134(state,html);if(subject&&out.includes(marker))out=out.replace(marker,`${subject}${marker}`);if(out.includes(marker))out=out.replace(marker,`${planManualBlock147(state)}<div data-analysis-slot113 ${pending||manual?'hidden':''}></div>${marker}`);if(meta&&out.includes('<div data-analysis-slot113'))out=out.replace('<div data-analysis-slot113',`${meta}<div data-analysis-slot113`);else if(context&&out.includes('<div data-analysis-slot113'))out=out.replace('<div data-analysis-slot113',`${context}<div data-analysis-slot113`);if(pending)out=out.replace('<div data-adaptive-zone>','<div data-adaptive-zone hidden>');return out}
function rerenderSubject(){const old=document.querySelector('.subjectBlock109');if(old)old.outerHTML=subjectSelector109(current)}
document.addEventListener('click',e=>{
 if(!current)return;
 const source=e.target.closest('[data-plan-source147]');if(source&&isDirectPlan147(current)){manualPlan147(current).source=source.dataset.planSource147;document.dispatchEvent(new CustomEvent('analysis-data-change133'));queueMicrotask(patchDirectDom134);return}
 const edit=e.target.closest('[data-subject-edit109]');if(edit){beginSubjectEdit109(current);rerenderSubject();return}const cancel=e.target.closest('[data-subject-cancel109]');if(cancel){cancelSubjectEdit109(current);rerenderSubject();return}const b=e.target.closest('[data-subject109]');const g=e.target.closest('[data-subject-general109]');if(!b&&!g)return;if(g)applySubject109(current,'',{general:true});else applySubject109(current,b.dataset.subject109);rerenderSubject();renderAnalysisSlot131();const hidden=document.querySelector('.subjectBlock109 [data-family-field="subject94"]');if(hidden)hidden.dispatchEvent(new Event('input',{bubbles:true}))
},true);
document.addEventListener('input',e=>{if(!current||!e.target.matches?.('[data-plan-manual147]'))return;manualPlan147(current)[e.target.dataset.planManual147]=e.target.value;document.dispatchEvent(new CustomEvent('analysis-data-change133'));queueMicrotask(patchDirectDom134)},true);
document.addEventListener('click',()=>queueMicrotask(patchDirectDom134),true);
document.addEventListener('analysis-context-change134',()=>{if(!current)return;document.querySelector('[data-analysis-context134]')?.remove();const slot=document.querySelector('[data-analysis-slot113]');const zone=document.querySelector('[data-adaptive-zone]');if(slot)slot.hidden=isDirectPlan147(current)&&manualPlan147(current).source==='manual';if(zone)zone.hidden=false;renderAnalysisSlot131();queueMicrotask(()=>{bindAnalysisTargetLevel134(current);patchDirectDom134()})},true);
document.addEventListener('analysis-data-change133',()=>queueMicrotask(patchDirectDom134),true);
document.addEventListener('family-meta-change111',()=>queueMicrotask(patchDirectDom134),true);
export function familyDetailsPage109(state){current=state;bindFamilyMeta111(state);bindAnalysisContext134(state);bindAnalysisData131(state);bindAnalysisTargetLevel134(state);const html=inject(familyDetailsPage106(state),state);queueMicrotask(patchDirectDom134);return html}
