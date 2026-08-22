import {buildCanonicalContext106} from './canonical-context106.js?v=106';
const family=ctx=>ctx.document.family.value;
const has=(ctx,key)=>Boolean(ctx.details[key]?.value);
const byId=m=>Object.fromEntries((m.questions||[]).map(q=>[q.id,q]));
const ORDER={
 'برنامج / فعالية':['skillFocus','reason','goal','method','participation'],
 'تحليل نتائج':['basis','finding','cause','actionStatus','action','follow'],
 'خطة':['skillFocus','basis','goal','method','follow','owner'],
 'اجتماع / متابعة إدارية':['purpose','work','product','owner','follow'],
 'إجراء متابعة':['skillFocus','goal','method','action','follow'],
 'تطوير مهني':['need','method','application','follow'],
 'شراكة مجتمعية':['reason','method','participation'],
 'صيانة وتجهيزات':['reason','method','status','follow']
};
function answerKey(id){return id==='participation'?'observation':id}
function resolved(ctx,id,matrix,state){if(id==='skillFocus')return Boolean(ctx.education.skill.value)||!(matrix.questions||[]).some(q=>q.id==='skillFocus');if(family(ctx)==='تحليل نتائج'&&id==='basis'&&state?.metadata?.familyMeta111?.assessmentType)return true;if(family(ctx)==='تحليل نتائج'&&id==='finding')return true;return has(ctx,answerKey(id))}
function extras(id,f=''){
 if(id==='actionStatus'&&f==='تحليل نتائج')return{id:'actionStatus',q:'هل نُفذ إجراء بعد هذا التحليل؟',help:'اختر الحالة الحقيقية حتى لا تظهر الخطة المستقبلية وكأنها نُفذت.',opts:['نُفذ فعلًا','مخطط للتنفيذ','لم يحدد بعد'],max:1,kind:'Fact'};
 if(id==='owner')return{id:'owner',q:f==='خطة'?'من المسؤول عن تنفيذ إجراءات الخطة؟':'من المسؤول عن تنفيذ القرار أو الإجراء؟',help:'حدد المسؤولية الفعلية حتى تكون المتابعة قابلة للتنفيذ.',opts:['قائد المدرسة','وكيل المدرسة','معلم أو مجموعة معلمين','منسق أو لجنة','الموجه الطلابي','رائد النشاط','جهة أو شريك خارجي'],max:2,kind:'Fact'};
 if(id==='status')return{id:'status',q:'ما حالة الإجراء الآن؟',help:'اختر الحالة الحالية فقط.',opts:['مكتمل','قيد التنفيذ','يحتاج متابعة','بانتظار جهة مختصة'],max:1,kind:'Fact'};
 if(id==='follow'&&f==='صيانة وتجهيزات')return{id:'follow',q:'كيف ستتم متابعة حالة الصيانة أو التجهيز؟',help:'المصدر يؤكد المتابعة الدورية؛ اختر الإجراء الذي سيحدث فعلًا.',opts:['إعادة فحص الحالة','متابعة دورية','إغلاق البلاغ بعد التحقق','رفع طلب لجهة مختصة'],max:2,kind:'FollowUpPlan'};
 return null;
}
function makesOutcomeClaim(ctx){const x=[ctx.details.observation.value,ctx.details.finding.value,ctx.details.action.value,ctx.details.application.value].join(' ');return /تحسن|ارتفاع|انخفاض|إتقان|وعي|دقة|تقدم|نجاح|حقق|انجاز|إنجاز/.test(x)}
function measurementQuestion(){return{id:'measurement',q:'كيف تحققت من هذه النتيجة؟',help:'اختر كل أدوات التحقق التي استخدمتها فعلًا. وإذا لم يتم القياس بعد فاختر ذلك وحده.',opts:['اختبار أو تقويم قصير','مقارنة قبل وبعد','ملاحظة أداء مباشرة','منتج أو عمل من المستفيدين','سجل متابعة','استبانة أو تغذية راجعة','لم يتم القياس بعد'],max:0,kind:'MeasuredResult'}}
export function routeNextQuestion106(state,matrix){const ctx=buildCanonicalContext106(state),index=byId(matrix),f=family(ctx),order=ORDER[f]||['reason','method','participation'];for(const id of order){if(resolved(ctx,id,matrix,state))continue;let q=index[id]||extras(id,f);if(f==='تحليل نتائج'&&id==='action'){const status=ctx.details.actionStatus?.value;if(status==='لم يحدد بعد')continue;if(q){const prefix=status==='نُفذ فعلًا'?'تم التنفيذ: ':'مخطط: ';q={...q,q:status==='نُفذ فعلًا'?'ما الإجراء الذي نُفذ فعلًا بعد التحليل؟':'ما الإجراء المخطط لتنفيذه بعد التحليل؟',help:status==='نُفذ فعلًا'?'اختر فقط ما تم تنفيذه فعليًا.':'اختر ما ستنفذه؛ سيظهر في الوثيقة بصفته مخططًا لا منجزًا.',opts:(q.opts||[]).map(x=>prefix+x)}}}if(q)return{question:q,gap:id,done:false,context:ctx}}if(makesOutcomeClaim(ctx)&&!has(ctx,'measurement'))return{question:measurementQuestion(),gap:'measurement',done:false,context:ctx};return{question:null,gap:'',done:true,context:ctx}}
export function routeSequence106(state,matrix,limit=12){const seen=[],shadow=JSON.parse(JSON.stringify(state));shadow.metadata=shadow.metadata||{};shadow.metadata.familyDetails=shadow.metadata.familyDetails||{};for(let i=0;i<limit;i++){const r=routeNextQuestion106(shadow,matrix);if(r.done)break;seen.push(r.gap);shadow.metadata.familyDetails[r.question.id]=`__answered_${i}__`;if(r.question.id==='skillFocus')shadow.metadata.familyDetails.skillFocus=`__skill_${i}__`}return seen}
export function questionIsNecessary106(state,matrix,id){const r=routeNextQuestion106(state,matrix);return !r.done&&r.question?.id===id}
