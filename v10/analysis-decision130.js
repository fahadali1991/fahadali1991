import {analysisDecisionModel127} from './analysis-decision127.js?v=127';
import {evaluationPolicy129,cohortTeachingDecision129} from './evaluation-rules129.js?v=129';

const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const esc=v=>clean(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const pct=v=>`${Number(v).toFixed(1).replace(/\.0$/,'')}٪`;
const studentName=s=>s.name||`الطالب رقم ${s.i+1}`;

function context130(state){
 const meta=state?.metadata||{},family=meta.familyDetails||{},fm=meta.familyMeta111||{};
 return {
  stage:state?.stage||state?.classification?.stage||'',
  grade:state?.grades?.[0]||state?.grade||'',
  subject:family.subject94||family.subjectHint101||'',
  purpose:fm.assessmentType||family.assessmentType||'',
  resultScope:'single_assessment'
 };
}
function purposeLabel(id){return id==='diagnostic'?'تشخيصي / قبلي':id==='formative'?'تكويني':id==='summative'?'ختامي':'غير محدد'}
function decisionLabel130(student,purpose){
 if(student.decisionId==='support')return purpose==='diagnostic'?'يحتاج دعمًا من خط الأساس':'يحتاج دعمًا';
 if(student.decisionId==='advanced')return'محقق للمحك — مرشح للإثراء';
 return'محقق للمحك';
}
function decisionNote130(student,purpose){
 if(purpose==='diagnostic')return'النتيجة التشخيصية تحدد نقطة البداية ولا تعني نجاحًا أو رسوبًا.';
 if(student.decisionId==='advanced')return'الدرجة المرتفعة من اختبار واحد ترشيح للإثراء وليست وحدها دليلًا على إتقان كل ناتج تعلم.';
 return student.decisionNote||'';
}
function groupTitle(id,purpose){if(id==='support')return purpose==='diagnostic'?'يحتاج دعمًا من خط الأساس':'يحتاج دعمًا';if(id==='advanced')return'مرشح للإثراء';return'محقق للمحك'}
function groupAction(id){if(id==='support')return'تدخل علاجي/دعم موجه ثم إعادة قياس';if(id==='advanced')return'تحدٍ أو إثراء مناسب بعد التحقق من نواتج التعلم';return'استمرار التعلم والمتابعة'}

export function analysisDecisionModel130(state){
 const legacy=analysisDecisionModel127(state);
 if(!legacy.ready)return{ready:false,legacy};
 const ctx=context130(state),policy=evaluationPolicy129(ctx),achieved=legacy.total-legacy.groupMap.support.count;
 const cohort=cohortTeachingDecision129({achievedCount:achieved,totalCount:legacy.total});
 const students=legacy.students.map(s=>({...s,decisionLabel130:decisionLabel130(s,policy.purpose),decisionNote130:decisionNote130(s,policy.purpose)}));
 const groups=legacy.groups.map(g=>({...g,label130:groupTitle(g.id,policy.purpose),action130:groupAction(g.id)}));
 return{ready:true,...legacy,students,groups,policy,context:ctx,cohort,achievedCount:achieved,systemGradeEnabled:policy.gradeScale.enabled};
}

function groupCard(g){return`<article class="decisionCard130 ${g.id}130"><div><small>${esc(g.id==='support'?'دعم':g.id==='advanced'?'إثراء':'إتقان')}</small><h3>${esc(g.label130)}</h3><p>${esc(g.action130)}</p></div><b>${g.count}</b></article>`}
function rows(m){return`<div class="decisionRows130"><div class="decisionHead130"><b>الطالب</b><b>الدرجة</b><b>النسبة</b><b>القرار التربوي</b></div>${m.students.map(s=>`<div class="decisionRow130"><b>${esc(studentName(s))}</b><span>${esc(`${s.score} / ${m.maxScore}`)}</span><span>${esc(pct(s.pct))}</span><strong class="${s.decisionId}130">${esc(s.decisionLabel130)}</strong>${s.decisionNote130?`<small>${esc(s.decisionNote130)}</small>`:''}</div>`).join('')}</div>`}
function cohortCard(m){if(!m.cohort?.ready)return'';return`<section class="cohortDecision130"><div><small>قراءة على مستوى الشعبة</small><h3>${esc(m.cohort.label)}</h3><p>حقق المحك ${esc(pct(m.cohort.rate))} من الطلاب. القرار هنا يصف طريقة التدريس للشعبة، ولا يغيّر قرار الطالب الفردي.</p></div><ul>${m.cohort.actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`}
function details(m){return`<details class="decisionDetails130"><summary>تفاصيل القراءة</summary><div class="decisionDetailGrid130"><div><small>نوع التقويم</small><b>${esc(purposeLabel(m.policy.purpose))}</b></div><div><small>متوسط الشعبة</small><b>${esc(pct(m.meanPct))}</b></div><div><small>التقدير النظامي</small><b>${m.systemGradeEnabled?'متاح في سياق نتيجة المادة النظامية':'لا يطبّق على هذا الاختبار المنفرد'}</b></div><div><small>الموقع النسبي</small><b>معلومة تفسيرية فقط</b></div></div><div class="decisionRelative130">${m.students.map(s=>`<span><b>${esc(studentName(s))}</b> — ${esc(s.relativeLabel)}</span>`).join('')}</div></details>`}

export function analysisDecisionPanel130(state){
 const m=analysisDecisionModel130(state);if(!m.ready)return'';
 const diagnostic=m.policy.purpose==='diagnostic';
 return`<section class="card analysisDecision130"><div class="muted">قراءة تربوية وفق سياق التقويم</div><h2>${diagnostic?'القراءة التشخيصية وتصنيف الطلاب':'تصنيف الطلاب واتخاذ القرار'}</h2><p class="questionHelp">${diagnostic?'تُعامل هذه النتيجة كخط أساس لتحديد الاحتياج؛ لا تُعرض كنجاح أو رسوب.':'يعتمد القرار الفردي على محك الاختبار الذي حدده المعلم، بينما يحدد معدل تحقيق المحك قرار التدريس على مستوى الشعبة.'}</p><div class="decisionGrid130">${m.groups.map(groupCard).join('')}</div>${cohortCard(m)}<h3 class="decisionStudentsTitle130">الطلاب</h3>${rows(m)}${details(m)}<div class="decisionGuard130"><b>ضبط الاستنتاج</b><span>لا يستنتج النظام من الدرجة الكلية وحدها مهارة الضعف أو سببها أو نمط تعلم الطالب، ولا يسجل أثرًا قبل إعادة القياس.</span></div></section>`}

if(typeof document!=='undefined'&&!document.getElementById('analysis-decision130-style')){const s=document.createElement('style');s.id='analysis-decision130-style';s.textContent='.decisionGrid130{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0}.decisionCard130{display:flex;justify-content:space-between;gap:10px;border:1px solid #dfe9e6;border-radius:14px;padding:13px;background:#fff}.decisionCard130 h3{margin:3px 0;color:#234f43}.decisionCard130 p{margin:4px 0;color:#687a75;font-size:11px;line-height:1.5}.decisionCard130 small{color:#7b8985}.decisionCard130>b{background:#eef7f4;color:#17694f;border-radius:999px;padding:6px 10px;height:max-content}.decisionCard130.support130{border-right:4px solid #b66a27}.decisionCard130.advanced130{border-right:4px solid #17694f}.cohortDecision130{display:grid;grid-template-columns:1.4fr 1fr;gap:12px;border:1px solid #d5e5df;border-radius:14px;padding:13px;background:#f8fcfa}.cohortDecision130 h3{margin:3px 0;color:#174f42}.cohortDecision130 p,.cohortDecision130 li{font-size:11px;color:#657873;line-height:1.6}.decisionStudentsTitle130{margin:18px 0 7px;color:#174f42}.decisionRows130{border:1px solid #dde8e4;border-radius:13px;overflow:hidden}.decisionHead130,.decisionRow130{display:grid;grid-template-columns:1.25fr .75fr .65fr 1.3fr;gap:7px;align-items:center}.decisionHead130{padding:9px 10px;background:#eef7f4;color:#36574f;font-size:11px}.decisionRow130{padding:9px 10px;border-top:1px solid #edf2f0;font-size:12px}.decisionRow130>small{grid-column:1/-1;color:#7b8985}.decisionRow130 strong{padding:6px 8px;border-radius:8px;background:#f2f7f5;color:#17694f;text-align:center}.decisionRow130 strong.support130{background:#fff5e9;color:#8a5a21}.decisionDetails130{margin-top:12px;border:1px solid #dce8e4;border-radius:12px}.decisionDetails130 summary{padding:11px 12px;font-weight:850;color:#17694f;cursor:pointer}.decisionDetailGrid130{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 12px 10px}.decisionDetailGrid130 div{padding:8px;background:#f7faf9;border-radius:9px}.decisionDetailGrid130 small{display:block;color:#7b8985}.decisionDetailGrid130 b{font-size:11px;color:#31574d}.decisionRelative130{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:0 12px 12px}.decisionRelative130 span{font-size:11px;color:#687a75}.decisionGuard130{display:flex;gap:8px;margin-top:12px;padding:10px 12px;border-radius:11px;background:#fff8e8;border:1px solid #ecd9ac;font-size:12px}.decisionGuard130 b{white-space:nowrap;color:#8a620f}@media(max-width:650px){.decisionGrid130,.cohortDecision130,.decisionDetailGrid130,.decisionRelative130{grid-template-columns:1fr}.decisionHead130{display:none}.decisionRows130{border:0;display:grid;gap:8px}.decisionRow130{grid-template-columns:1fr 1fr;border:1px solid #dde8e4;border-radius:12px}.decisionRow130>b,.decisionRow130>small{grid-column:1/-1}.decisionGuard130{display:block}.decisionGuard130 b{display:block;margin-bottom:4px}}';document.head.appendChild(s)}
