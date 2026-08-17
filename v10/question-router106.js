import {buildCanonicalContext106,known106} from './canonical-context106.js?v=106';
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const family=ctx=>ctx.document.family.value;
const has=(ctx,key)=>Boolean(ctx.details[key]?.value);
const byId=m=>Object.fromEntries((m.questions||[]).map(q=>[q.id,q]));

const ORDER={
 'برنامج / فعالية':['skillFocus','reason','goal','method','participation'],
 'تحليل نتائج':['skillFocus','basis','finding','cause','action','follow'],
 'خطة':['skillFocus','basis','goal','method','follow'],
 'اجتماع / متابعة إدارية':['purpose','work','product','owner','follow'],
 'إجراء متابعة':['skillFocus','goal','method','action','follow'],
 'تطوير مهني':['need','method','application','follow'],
 'شراكة مجتمعية':['reason','method','participation'],
 'صيانة وتجهيزات':['reason','method','status']
};
function answerKey(id){return id==='participation'?'observation':id}
function resolved(ctx,id,matrix){if(id==='skillFocus')return Boolean(ctx.education.skill.value)||!(matrix.questions||[]).some(q=>q.id==='skillFocus');if(id==='status')return has(ctx,'status');return has(ctx,answerKey(id));}
function extras(id){
 if(id==='owner')return{id:'owner',q:'من المسؤول عن تنفيذ القرار أو الإجراء؟',help:'يظهر هذا السؤال فقط عندما تحتاج الوثيقة إلى مسؤولية تنفيذ واضحة.',opts:['قائد المدرسة','وكيل المدرسة','معلم أو مجموعة معلمين','منسق أو لجنة','الموجه الطلابي','رائد النشاط','جهة أو شريك خارجي'],max:2,kind:'Fact'};
 if(id==='status')return{id:'status',q:'ما حالة الإجراء الآن؟',help:'اختر الحالة الحالية فقط.',opts:['مكتمل','قيد التنفيذ','يحتاج متابعة','بانتظار جهة مختصة'],max:1,kind:'Fact'};
 return null;
}
function makesOutcomeClaim(ctx){const x=[ctx.details.observation.value,ctx.details.finding.value,ctx.details.action.value,ctx.details.application.value].join(' ');return /تحسن|ارتفاع|انخفاض|إتقان|وعي|دقة|تقدم|نجاح|حقق|انجاز|إنجاز/.test(x)}
function measurementQuestion(){return{id:'measurement',q:'كيف تحققت من هذه النتيجة؟',help:'اختر أداة حقيقية، أو صرّح بأن القياس لم يتم بعد.',opts:['اختبار أو تقويم قصير','مقارنة قبل وبعد','ملاحظة أداء مباشرة','منتج أو عمل من المستفيدين','سجل متابعة','استبانة أو تغذية راجعة','لم يتم القياس بعد'],max:2,kind:'MeasuredResult'}}
function validationGap(ctx){const f=family(ctx);if(f==='خطة'&&ctx.details.follow.value&&!ctx.details.owner.value)return'owner';if(f==='اجتماع / متابعة إدارية'&&ctx.details.product.value&&!ctx.details.owner.value)return'owner';if(f==='صيانة وتجهيزات'&&!ctx.details.status.value)return'status';return''}
export function routeNextQuestion106(state,matrix){const ctx=buildCanonicalContext106(state),index=byId(matrix),order=ORDER[family(ctx)]||['reason','method','participation'];for(const id of order){if(resolved(ctx,id,matrix))continue;const q=index[id]||extras(id);if(q)return{question:q,gap:id,done:false,context:ctx};}
 const vg=validationGap(ctx);if(vg){const q=index[vg]||extras(vg);if(q)return{question:q,gap:vg,done:false,context:ctx};}
 if(makesOutcomeClaim(ctx)&&!has(ctx,'measurement'))return{question:measurementQuestion(),gap:'measurement',done:false,context:ctx};
 return{question:null,gap:'',done:true,context:ctx};
}
export function routeSequence106(state,matrix,limit=12){const seen=[],shadow=JSON.parse(JSON.stringify(state));shadow.metadata=shadow.metadata||{};shadow.metadata.familyDetails=shadow.metadata.familyDetails||{};for(let i=0;i<limit;i++){const r=routeNextQuestion106(shadow,matrix);if(r.done)break;seen.push(r.gap);shadow.metadata.familyDetails[r.question.id]=`__answered_${i}__`;if(r.question.id==='skillFocus')shadow.metadata.familyDetails.skillFocus=`__skill_${i}__`;}return seen;}
export function questionIsNecessary106(state,matrix,id){const r=routeNextQuestion106(state,matrix);return !r.done&&r.question?.id===id;}
