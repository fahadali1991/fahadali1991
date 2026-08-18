import {esc} from './engine.js';

const DEFINITIONS111={
 'برنامج / فعالية':[],
 'اجتماع / متابعة إدارية':[
  {id:'meetingChair',label:'رئيس الاجتماع',q:'من رئيس الاجتماع؟',type:'text',placeholder:'اسم رئيس الاجتماع'},
  {id:'minutesWriter',label:'معد المحضر',q:'من أعد محضر الاجتماع؟',type:'text',placeholder:'اسم معد المحضر'},
  {id:'startTime',label:'وقت البداية',q:'متى بدأ الاجتماع؟',type:'time'},
  {id:'endTime',label:'وقت النهاية',q:'متى انتهى الاجتماع؟',type:'time'},
  {id:'attendees',label:'الحضور',q:'من حضر الاجتماع؟',type:'text',placeholder:'مثال: أعضاء اللجنة أو 8 معلمين'}
 ],
 'تحليل نتائج':[
  {id:'assessmentType',label:'نوع الاختبار',q:'ما نوع الاختبار أو التقويم الذي حُللت نتائجه؟',type:'choice',opts:['اختبار تشخيصي','اختبار قبلي','اختبار بعدي','اختبار فترة','اختبار نهائي','تقويم مستمر','اختبار وطني أو مركزي']},
  {id:'period',label:'الفترة',q:'ما الفترة التي تمثلها النتائج؟',type:'text',placeholder:'مثال: الفترة الأولى أو الفصل الدراسي الأول'},
  {id:'testedCount',label:'عدد الطلاب/المختبرين',q:'كم عدد الطلاب الذين شملهم التحليل؟',type:'number',placeholder:'عدد الطلاب'}
 ],
 'خطة':[
  {id:'startDate',label:'البداية',q:'متى يبدأ تنفيذ الخطة؟',type:'date'},
  {id:'endDate',label:'النهاية',q:'متى تنتهي الخطة؟',type:'date'},
  {id:'team',label:'الفريق',q:'من يشارك في تنفيذ الخطة؟',type:'text',placeholder:'مثال: معلم المادة والموجه الطلابي'}
 ],
 'إجراء متابعة':[
  {id:'period',label:'الفترة',q:'ما فترة المتابعة؟',type:'text',placeholder:'مثال: أسبوعيًا لمدة شهر'},
  {id:'casesCount',label:'الحالات/العدد',q:'كم حالة أو سجل شملته المتابعة؟',type:'number',placeholder:'العدد'}
 ],
 'تطوير مهني':[
  {id:'provider',label:'الجهة',q:'ما الجهة المقدمة أو المنظمة للتطوير المهني؟',type:'text',placeholder:'اسم الجهة'},
  {id:'hours',label:'الساعات',q:'كم عدد ساعات التطوير المهني؟',type:'number',placeholder:'عدد الساعات'},
  {id:'deliveryMode',label:'نمط التنفيذ',q:'كيف تم تنفيذ التطوير المهني؟',type:'choice',opts:['حضوري','عن بُعد مباشر','عن بُعد غير متزامن','مدمج']},
  {id:'certificateOrPresenter',label:'الشهادة أو مقدم النشاط',q:'ما بيانات الشهادة أو مقدم النشاط؟',type:'text',placeholder:'مثال: شهادة حضور أو اسم مقدم الورشة'}
 ]
};

const meta=s=>{s.metadata=s.metadata||{};s.metadata.familyMeta111=s.metadata.familyMeta111||{};s.metadata.familyMeta111Skipped=s.metadata.familyMeta111Skipped||[];return s.metadata.familyMeta111};
const skipped=s=>new Set(s?.metadata?.familyMeta111Skipped||[]);
export function familyMetaDefinitions111(family){return DEFINITIONS111[family]||[]}
export function nextFamilyMeta111(state){const defs=familyMetaDefinitions111(state?.classification?.type),m=meta(state),skip=skipped(state);return defs.find(x=>!String(m[x.id]??'').trim()&&!skip.has(x.id))||null}
function control(def,value=''){
 if(def.type==='choice')return `<div class="chips choiceGrid familyMetaChoices111">${def.opts.map(x=>`<button type="button" class="chip ${value===x?'on':''}" data-family-meta-choice111="${esc(x)}">${esc(x)}</button>`).join('')}</div><input type="hidden" data-family-meta111="${esc(def.id)}" value="${esc(value)}">`;
 return `<input data-family-meta111="${esc(def.id)}" type="${esc(def.type||'text')}" value="${esc(value)}" ${def.type==='number'?'inputmode="numeric" min="0"':''} placeholder="${esc(def.placeholder||'')}">`;
}
export function familyMetaQuestion111(state){const def=nextFamilyMeta111(state);if(!def)return'';const value=String(meta(state)[def.id]??'');return `<div class="familyMeta111" data-family-meta-host111 data-field111="${esc(def.id)}"><div class="adaptiveKicker106">بيانات ستظهر في الوثيقة</div><h2>${esc(def.q)}</h2><p class="questionHelp">${esc(def.label)} سيظهر ضمن بيانات التنفيذ في المخرج النهائي. يمكنك تجاوزه إذا لم ينطبق.</p>${control(def,value)}<div class="row adaptiveActions106" style="margin-top:12px"><button type="button" class="btn primary" data-family-meta-next111 ${value?'':'disabled'}>التالي</button><button type="button" class="btn" data-family-meta-skip111>لا ينطبق / تجاوز</button></div></div>`}
export function familyMetaPending111(state){return Boolean(nextFamilyMeta111(state))}

let current=null;
export function bindFamilyMeta111(state){current=state}
function refresh(){if(!current||typeof document==='undefined')return;const host=document.querySelector('[data-family-meta-host111]'),next=familyMetaQuestion111(current),zone=document.querySelector('[data-adaptive-zone]');if(next){if(host)host.outerHTML=next;else if(zone)zone.insertAdjacentHTML('beforebegin',next);if(zone)zone.hidden=true}else{host?.remove();if(zone)zone.hidden=false}}
if(typeof document!=='undefined'){
 document.addEventListener('input',e=>{if(!current)return;const el=e.target.closest?.('[data-family-meta111]');if(!el)return;meta(current)[el.dataset.familyMeta111]=(el.value||'').trim();const host=el.closest('[data-family-meta-host111]');const next=host?.querySelector('[data-family-meta-next111]');if(next)next.disabled=!String(el.value||'').trim()},true);
 document.addEventListener('click',e=>{if(!current)return;const choice=e.target.closest('[data-family-meta-choice111]');if(choice){const host=choice.closest('[data-family-meta-host111]'),el=host?.querySelector('[data-family-meta111]');if(el){el.value=choice.dataset.familyMetaChoice111;meta(current)[el.dataset.familyMeta111]=el.value;host.querySelectorAll('[data-family-meta-choice111]').forEach(b=>b.classList.toggle('on',b===choice));const next=host.querySelector('[data-family-meta-next111]');if(next)next.disabled=false}return}const skip=e.target.closest('[data-family-meta-skip111]');if(skip){const id=skip.closest('[data-family-meta-host111]')?.dataset.field111;if(id)current.metadata.familyMeta111Skipped=[...new Set([...(current.metadata.familyMeta111Skipped||[]),id])];refresh();return}const next=e.target.closest('[data-family-meta-next111]');if(next&&!next.disabled){refresh()}},true);
}
