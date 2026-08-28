import {analysisDecisionModel130,analysisDecisionPanel130} from './analysis-decision130.js?v=130';
import {analysisState113} from './analysis-data113.js?v=120.1';
import {explicitCriterion131} from './analysis-data131.js?v=131';
import {finiteNumber120} from './input-normalization120.js?v=120.1';

const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const esc=v=>clean(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const pct=v=>`${Number(v).toFixed(1).replace(/\.0$/,'')}٪`;
const studentName=s=>s.name||`الطالب رقم ${s.i+1}`;
function relation(p,mean){const d=p-mean;if(Math.abs(d)<.0001)return'عند متوسط الشعبة';return d>0?'أعلى من متوسط الشعبة':'أقل من متوسط الشعبة'}

function quantitative131(state){
 const a=analysisState113(state),max=finiteNumber120(a.maxScore)||0,names=a.names||[],scores=(a.scores||[]).map(finiteNumber120);
 const rows=scores.map((score,i)=>({i,score,name:clean(names[i]||'')})).filter(x=>x.score!==null);
 if(!max||!rows.length)return{ready:false,students:[]};
 const students=rows.map(x=>({...x,pct:x.score/max*100})),meanPct=students.reduce((s,x)=>s+x.pct,0)/students.length;
 students.forEach(x=>x.relativeLabel=relation(x.pct,meanPct));
 return{ready:true,total:students.length,maxScore:max,meanPct,students,high:Math.max(...students.map(x=>x.score)),low:Math.min(...students.map(x=>x.score))};
}

export function analysisDecisionModel131(state){
 const criterion=explicitCriterion131(state);
 if(criterion.defined)return{...analysisDecisionModel130(state),criterionDefined:true};
 const q=quantitative131(state);if(!q.ready)return{ready:false,criterionDefined:false,students:[]};
 return{...q,criterionDefined:false,decisionAvailable:false,cohort:null,groups:[]};
}

function neutralRows(m){return`<div class="decisionRows131"><div class="decisionHead131"><b>الطالب</b><b>الدرجة</b><b>النسبة</b><b>موقعه من متوسط الشعبة</b></div>${m.students.map(s=>`<div class="decisionRow131"><b>${esc(studentName(s))}</b><span>${esc(`${s.score} / ${m.maxScore}`)}</span><span>${esc(pct(s.pct))}</span><strong>${esc(s.relativeLabel)}</strong></div>`).join('')}</div>`}

export function analysisDecisionPanel131(state){
 const criterion=explicitCriterion131(state);if(criterion.defined)return analysisDecisionPanel130(state);
 const m=analysisDecisionModel131(state);if(!m.ready)return'';
 return`<section class="card analysisDecision131"><div class="muted">تحليل كمي من الدرجات — دون افتراض محك</div><h2>قراءة النتائج</h2><p class="questionHelp">لم يحدد محك أداء لهذا الاختبار؛ لذلك يحسب النظام المؤشرات الكمية وموقع الطالب من متوسط الشعبة فقط، ولا يصدر حكم «متقن/يحتاج دعمًا» ولا ينشئ تدخلًا علاجيًا أو إثرائيًا تلقائيًا.</p><div class="quantMetrics131"><div><small>الطلاب</small><b>${m.total}</b></div><div><small>متوسط الشعبة</small><b>${esc(pct(m.meanPct))}</b></div><div><small>أعلى درجة</small><b>${esc(m.high)}</b></div><div><small>أدنى درجة</small><b>${esc(m.low)}</b></div></div>${neutralRows(m)}<div class="decisionGuard131"><b>إذا كان للاختبار محك أداء معتمد</b><span>عدّل بيانات الدرجات وأدخل المحك؛ عندها يستطيع النظام تحديد من حققه، واقتراح الدعم أو الإثراء وفق البيانات المتاحة.</span></div></section>`}

if(typeof document!=='undefined'&&!document.getElementById('analysis-decision131-style')){const s=document.createElement('style');s.id='analysis-decision131-style';s.textContent='.quantMetrics131{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0}.quantMetrics131>div{border:1px solid #dce9e4;border-radius:12px;padding:10px;background:#f9fcfb}.quantMetrics131 small{display:block;color:#7b8985;font-size:10px}.quantMetrics131 b{color:#174f42}.decisionRows131{border:1px solid #dde8e4;border-radius:13px;overflow:hidden}.decisionHead131,.decisionRow131{display:grid;grid-template-columns:1.2fr .7fr .65fr 1.35fr;gap:7px;align-items:center;padding:9px 10px}.decisionHead131{background:#eef7f4;color:#36574f;font-size:11px}.decisionRow131{border-top:1px solid #edf2f0;font-size:12px}.decisionRow131 strong{color:#31574d;font-weight:750}.decisionGuard131{display:flex;gap:8px;margin-top:12px;padding:10px 12px;border-radius:11px;background:#fff8e8;border:1px solid #ecd9ac;font-size:12px}.decisionGuard131 b{white-space:nowrap;color:#8a620f}@media(max-width:650px){.quantMetrics131{grid-template-columns:1fr 1fr}.decisionHead131{display:none}.decisionRows131{border:0;display:grid;gap:8px}.decisionRow131{grid-template-columns:1fr 1fr;border:1px solid #dde8e4;border-radius:12px}.decisionRow131>b,.decisionRow131>strong{grid-column:1/-1}.decisionGuard131{display:block}.decisionGuard131 b{display:block;margin-bottom:4px}}';document.head.appendChild(s)}
