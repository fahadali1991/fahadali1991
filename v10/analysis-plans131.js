import {analysisPlansPanel125,bindAnalysisPlans125} from './analysis-plans125.js?v=125';
import {explicitCriterion131} from './analysis-data131.js?v=133';

let current=null;
export function analysisPlansPanel131(state){
 if(state?.classification?.type!=='تحليل نتائج')return'';
 if(explicitCriterion131(state).defined)return analysisPlansPanel125(state);
 return`<section class="card analysisPlans131"><div class="muted">الخطط التعليمية</div><h2>لا توجد خطة آلية دون محك أداء</h2><p class="questionHelp">تم تحليل الدرجات كميًا فقط. لم يحدد محك أداء لهذا الاختبار، لذلك لا يحدد النظام طلابًا للعلاج أو الإثراء من تلقاء نفسه.</p><div class="planGuard131"><b>لماذا؟</b><span>الدرجة الكلية وحدها لا تكفي للحكم على إتقان ناتج تعلم أو لتشخيص مهارة ضعيفة. يمكنك تعديل بيانات الاختبار وإدخال محك صريح، أو إنشاء خطة مستقلة لاحقًا بطلاب تحددهم أنت.</span></div></section>`;
}
export function bindAnalysisPlans131(state){current=state;if(explicitCriterion131(state).defined)bindAnalysisPlans125(state)}
if(typeof document!=='undefined'&&!document.getElementById('analysis-plans131-style')){const s=document.createElement('style');s.id='analysis-plans131-style';s.textContent='.planGuard131{display:flex;gap:8px;align-items:flex-start;padding:11px 12px;border:1px solid #ecd9ac;background:#fff8e8;border-radius:11px;font-size:12px}.planGuard131 b{color:#8a620f;white-space:nowrap}.planGuard131 span{color:#6d644f;line-height:1.7}@media(max-width:650px){.planGuard131{display:block}.planGuard131 b{display:block;margin-bottom:4px}}';document.head.appendChild(s)}
