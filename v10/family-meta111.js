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
  {id:'section',label:'الشعبة',q:'ما الشعبة أو رقم الفصل؟ (اختياري)',type:'text',placeholder:'مثال: أ أو ب أو 1 أو 2',optional:true,help:'هذه امتداد للصف الذي اخترته، لذلك نسأل عنها أولًا. تجاوزها إذا كان التحليل للصف كاملًا.'},
  {id:'period',label:'الفصل الدراسي',q:'في أي فصل دراسي نُفذ الاختبار أو التقويم؟',type:'periodChoice',opts:[
   {v:'الفصل الدراسي الأول',i:'١',s:'فصل دراسي'}, {v:'الفصل الدراسي الثاني',i:'٢',s:'فصل دراسي'}
  ]},
  {id:'assessmentType',label:'نوع الاختبار',q:'ما نوع الاختبار أو التقويم الذي حُللت نتائجه؟',type:'choice',opts:['اختبار تشخيصي','اختبار الفترة الأولى','اختبار الفترة الثانية','اختبار قبلي','اختبار بعدي','اختبار نهائي','تقويم تكويني','تقويم مستمر','اختبار وطني أو مركزي']},
  {id:'expectedCount',label:'عدد الطلاب المتوقع',q:'كم عدد طلاب الفصل؟ (اختياري)',type:'number',placeholder:'مثال: 20',optional:true,help:'اكتب العدد إذا أردت أن يتحقق النظام من اكتمال الدرجات. إن تركته فارغًا سيحسب العدد تلقائيًا من الدرجات المدخلة.'}
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
 if(def.type==='periodChoice')return `<div class="periodChoice114">${def.opts.map(x=>`<button type="button" class="periodTile114 ${value===x.v?'on':''}" data-family-meta-choice111="${esc(x.v)}"><b>${esc(x.i)}</b><span>${esc(x.v)}</span><small>${esc(x.s)}</small></button>`).join('')}</div><input type="hidden" data-family-meta111="${esc(def.id)}" value="${esc(value)}">`;
 return `<input data-family-meta111="${esc(def.id)}" type="${esc(def.type||'text')}" value="${esc(value)}" ${def.type==='number'?'inputmode="numeric" min="0"':''} placeholder="${esc(def.placeholder||'')}">`;
}
export function familyMetaQuestion111(state){const def=nextFamilyMeta111(state);if(!def)return'';const value=String(meta(state)[def.id]??''),help=def.help||(def.type==='periodChoice'?'حدد الفصل الدراسي أولًا، ثم سيطلب النظام نوع الاختبار في الخطوة التالية.':'اختر ما ينطبق على هذا التحليل.');return `<div class="familyMeta111" data-family-meta-host111 data-field111="${esc(def.id)}"><div class="adaptiveKicker106">${def.optional?'بيانات اختيارية':'بيانات ستظهر في الوثيقة'}</div><h2>${esc(def.q)}</h2><p class="questionHelp">${esc(help)}</p>${control(def,value)}<div class="row adaptiveActions106" style="margin-top:12px"><button type="button" class="btn primary" data-family-meta-next111 ${value?'':'disabled'}>التالي</button><button type="button" class="btn" data-family-meta-skip111>${def.optional?'تجاوز':'لا ينطبق / تجاوز'}</button></div></div>`}
export function familyMetaPending111(state){return Boolean(nextFamilyMeta111(state))}

let current=null;
export function bindFamilyMeta111(state){current=state}
function syncDerived111(){if(!current)return;current.metadata=current.metadata||{};current.metadata.familyDetails=current.metadata.familyDetails||{};if(current.classification?.type==='تحليل نتائج'){const m=meta(current),basis=[m.period,m.assessmentType].filter(Boolean).join(' — ');if(basis)current.metadata.familyDetails.basis=basis;if(m.section)current.metadata.section111=m.section;else delete current.metadata.section111;if(m.expectedCount)current.metadata.expectedCount111=String(m.expectedCount);else delete current.metadata.expectedCount111}}
function signalPersist(){if(typeof document==='undefined')return;syncDerived111();const carrier=document.querySelector('[data-adaptive-zone] [data-family-field]');if(carrier)carrier.dispatchEvent(new Event('input',{bubbles:true}))}
function notify(){if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('family-meta-change111',{bubbles:true}))}
function refresh(){if(!current||typeof document==='undefined')return;const host=document.querySelector('[data-family-meta-host111]'),next=familyMetaQuestion111(current),zone=document.querySelector('[data-adaptive-zone]');if(next){if(host)host.outerHTML=next;else if(zone)zone.insertAdjacentHTML('beforebegin',next);if(zone)zone.hidden=true}else{host?.remove();if(zone)zone.hidden=false}notify()}
if(typeof document!=='undefined'){
 document.addEventListener('input',e=>{if(!current)return;const el=e.target.closest?.('[data-family-meta111]');if(!el)return;meta(current)[el.dataset.familyMeta111]=(el.value||'').trim();syncDerived111();const host=el.closest('[data-family-meta-host111]');const next=host?.querySelector('[data-family-meta-next111]');if(next)next.disabled=!String(el.value||'').trim()},true);
 document.addEventListener('click',e=>{if(!current)return;const choice=e.target.closest('[data-family-meta-choice111]');if(choice){const host=choice.closest('[data-family-meta-host111]'),el=host?.querySelector('[data-family-meta111]');if(el){el.value=choice.dataset.familyMetaChoice111;meta(current)[el.dataset.familyMeta111]=el.value;syncDerived111();host.querySelectorAll('[data-family-meta-choice111]').forEach(b=>b.classList.toggle('on',b===choice));const next=host.querySelector('[data-family-meta-next111]');if(next)next.disabled=false}return}const skip=e.target.closest('[data-family-meta-skip111]');if(skip){const id=skip.closest('[data-family-meta-host111]')?.dataset.field111;if(id){current.metadata.familyMeta111Skipped=[...new Set([...(current.metadata.familyMeta111Skipped||[]),id])];if(id==='section')delete current.metadata.section111;if(id==='expectedCount')delete current.metadata.expectedCount111}signalPersist();refresh();return}const next=e.target.closest('[data-family-meta-next111]');if(next&&!next.disabled){signalPersist();refresh()}},true);
}
if(typeof document!=='undefined'&&!document.getElementById('period-choice114-style')){const s=document.createElement('style');s.id='period-choice114-style';s.textContent='.periodChoice114{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:10px}.periodTile114{border:1px solid #d9e6e1;background:#fff;border-radius:15px;padding:12px 7px;display:flex;flex-direction:column;align-items:center;gap:3px;color:#173f38;min-height:88px}.periodTile114 b{font-size:22px;color:#0da9a6}.periodTile114 span{font-weight:800;font-size:13px}.periodTile114 small{color:#788984;font-size:10px}.periodTile114.on{border:2px solid #07a869;background:#f1faf6;box-shadow:0 5px 18px rgba(7,168,105,.12)}@media(max-width:600px){.periodChoice114{grid-template-columns:1fr 1fr}}';document.head.appendChild(s)}