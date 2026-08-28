import {esc} from './engine.js';

export function isStudentPlan128(state){const s=String(state?.classification?.subtype||'');return state?.classification?.type==='خطة'&&(/علاج/.test(s)||/إثراء/.test(s))}
export function studentPlanKind128(state){return /إثراء/.test(String(state?.classification?.subtype||''))?'enrichment':'remedial'}
export function studentPlanTargetPanel128(state){
 if(!isStudentPlan128(state))return'';
 const kind=studentPlanKind128(state),f=state?.metadata?.familyDetails||{},value=String(f.targetStudents128||'');
 return `<section class="studentPlanTarget128"><div class="adaptiveKicker106">الفئة المستهدفة</div><h2>${kind==='remedial'?'من الطلاب الذين تستهدفهم الخطة العلاجية؟':'من الطلاب الذين تستهدفهم الخطة الإثرائية؟'}</h2><p class="questionHelp">اكتب الأسماء أو وصف الفئة. إذا كانت الخطة مبنية من تحليل نتائج فسيتولى النظام نقل الأسماء تلقائيًا ولن يطلبها مرة أخرى.</p><label class="fullField"><span>الطلاب / الفئة المستهدفة</span><textarea data-family-field="targetStudents128" rows="3" placeholder="مثال: أحمد، خالد، سعد أو: الطلاب الذين لم يحققوا إتقان المهارة">${esc(value)}</textarea></label></section>`;
}

if(typeof document!=='undefined'&&!document.getElementById('student-plan-target128-style')){const s=document.createElement('style');s.id='student-plan-target128-style';s.textContent='.studentPlanTarget128{margin:12px 0;padding:13px;border:1px solid #dce8e4;border-radius:14px;background:#fbfefd}.studentPlanTarget128 h2{margin:5px 0}.studentPlanTarget128 textarea{min-height:78px}';document.head.appendChild(s)}
