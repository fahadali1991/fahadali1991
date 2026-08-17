const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const sem=s=>s?.metadata?.semantic101||{};
const fd=s=>s?.metadata?.familyDetails||{};
const family=s=>clean(s?.classification?.type||sem(s)?.family?.type||'');
const subject=s=>clean(s?.metadata?.subjectHint101||sem(s)?.subject?.name||'');
const raw=s=>clean(s?.raw||'');
const hasValue=(s,id)=>Boolean(clean(fd(s)[id]));
const FACT_MAP={reason:s=>sem(s)?.intent||'',purpose:s=>sem(s)?.purpose||'',finding:s=>sem(s)?.finding||'',skillFocus:s=>s?.topic||sem(s)?.topic||'',basis:s=>'',method:s=>'',participation:s=>'',goal:s=>'',action:s=>'',follow:s=>'',product:s=>'',work:s=>'',need:s=>'',application:s=>''};
const IMPACT={skillFocus:10,basis:9,finding:10,cause:7,action:10,follow:9,reason:8,goal:9,method:8,participation:6,purpose:9,work:6,product:10,need:9,application:9};
const FAMILY_PRIORITY={
 'تحليل نتائج':['finding','action','follow','cause','basis'],
 'خطة':['basis','goal','method','follow'],
 'إجراء متابعة':['goal','method','action','follow'],
 'اجتماع / متابعة إدارية':['purpose','product','follow','work'],
 'تطوير مهني':['need','application','follow','method'],
 'برنامج / فعالية':['reason','goal','method','participation'],
 'شراكة مجتمعية':['reason','method','participation'],
 'صيانة وتجهيزات':['reason','method','participation']
};
function isKnown(s,q){if(hasValue(s,q.id))return true;const fn=FACT_MAP[q.id];return Boolean(fn&&clean(fn(s)))}
function rank(s,q,index){let score=(IMPACT[q.id]||5)+(q.importance||0)*2;const pri=FAMILY_PRIORITY[family(s)]||[];const p=pri.indexOf(q.id);if(p>=0)score+=Math.max(0,8-p*2);if(q.kind==='MeasuredResult')score+=3;if(q.kind==='Observation')score-=1;if(q.kind==='Inference')score-=1;if(isKnown(s,q))score-=20;if(q.prefill?.length)score-=6;if(index===0&&q.id==='skillFocus')score+=4;return score}
function limitFor(s){const f=family(s);if(f==='تحليل نتائج'||f==='خطة')return 4;if(f==='برنامج / فعالية')return 3;if(f==='اجتماع / متابعة إدارية'||f==='تطوير مهني')return 3;return 3}
function measurementQuestion(s){const f=family(s);if(!['برنامج / فعالية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني'].includes(f))return null;if(hasValue(s,'measurement'))return null;return{id:'measurement',q:'كيف تحققت من النتيجة أو ستتحقق منها؟',help:'اختر أداة حقيقية. وإذا لم يتم القياس بعد فاختر ذلك صراحةً.',opts:['اختبار أو تقويم قصير','مقارنة قبل وبعد','ملاحظة أداء مباشرة','منتج أو عمل من المستفيدين','سجل متابعة','استبانة أو تغذية راجعة','لم يتم القياس بعد'],max:2,kind:'MeasuredResult',importance:5,prefill:[],known:false}}
function operationalQuestion(s){const f=family(s);if(f==='اجتماع / متابعة إدارية'&&!hasValue(s,'owner'))return{id:'owner',q:'من المسؤول عن تنفيذ القرار أو المتابعة؟',help:'اختر فقط إذا تم تحديد مسؤول.',opts:['قائد المدرسة','وكيل المدرسة','معلم أو مجموعة معلمين','منسق أو لجنة','الموجه الطلابي','رائد النشاط','جهة أو شريك خارجي'],max:2,kind:'Fact',importance:4,prefill:[],known:false};if(f==='صيانة وتجهيزات'&&!hasValue(s,'status'))return{id:'status',q:'ما حالة الإجراء الآن؟',help:'اختر الحالة الحالية فقط.',opts:['مكتمل','قيد التنفيذ','يحتاج متابعة','بانتظار جهة مختصة'],max:1,kind:'Fact',importance:5,prefill:[],known:false};return null}
export function routeQuestions104(s,matrix){let candidates=(matrix.questions||[]).map((q,i)=>({...q,routeScore:rank(s,q,i)})).filter(q=>q.routeScore>0);const mq=measurementQuestion(s);if(mq)candidates.push({...mq,routeScore:family(s)==='تحليل نتائج'||family(s)==='خطة'?18:13});const oq=operationalQuestion(s);if(oq)candidates.push({...oq,routeScore:15});candidates.sort((a,b)=>b.routeScore-a.routeScore);const selected=candidates.slice(0,limitFor(s));return{...matrix,questions:selected,router104:{candidateCount:candidates.length,shownCount:selected.length,hiddenCount:Math.max(0,candidates.length-selected.length),family:family(s),subject:subject(s),raw:raw(s)}}}
