import {SUBJECTS94} from './subject-registry94.js?v=110.2';

const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const norm=v=>clean(v).normalize('NFKC').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
const ORDINALS=['الأول','الثاني','الثالث','الرابع','الخامس','السادس'];
const STAGE_ADJ={ابتدائي:'الابتدائي',متوسط:'المتوسط',ثانوي:'الثانوي'};

export function ordinal114(v=''){
 const n=norm(v);
 const aliases=[['الأول',['الاول','اول']],['الثاني',['الثاني','ثاني']],['الثالث',['الثالث','ثالث']],['الرابع',['الرابع','رابع']],['الخامس',['الخامس','خامس']],['السادس',['السادس','سادس']]];
 for(const [canonical,arr] of aliases)if(arr.some(x=>n===norm(x)||n.includes(norm(x))))return canonical;
 return'';
}
export function stageFromGrade114(v=''){
 const n=norm(v);if(n.includes('ابتدائي'))return'ابتدائي';if(n.includes('متوسط'))return'متوسط';if(n.includes('ثانوي'))return'ثانوي';return'';
}
export function canonicalGrades114(stage='',grades=[]){
 const input=uniq(grades),resolvedStage=clean(stage)||input.map(stageFromGrade114).find(Boolean)||'';
 const out=[];
 for(const g of input){const ord=ordinal114(g);if(!ord)continue;const gst=stageFromGrade114(g)||resolvedStage;const full=gst?`${ord} ${STAGE_ADJ[gst]}`:ord;if(!out.includes(full))out.push(full)}
 // إذا وصل تمثيلان لنفس الصف (الأول + الأول المتوسط) نحتفظ بالصيغة الكاملة فقط.
 return out.filter((g,i,a)=>!a.some((x,j)=>j!==i&&ordinal114(x)===ordinal114(g)&&stageFromGrade114(x)&&!stageFromGrade114(g)));
}
export function educationScopeLabel114(stage='',grades=[]){const gs=canonicalGrades114(stage,grades);if(gs.length)return gs.join(' و');return clean(stage)||''}
export function analysisAudienceOptions114(){return['الطلاب','مستفيدون آخرون']}

function stageSubjects(stage='',grade=''){
 const st=clean(stage);if(!st)return[];
 if(st==='ثانوي'){
   // لا يوجد اختيار مسار في DocumentState حتى الآن؛ لذلك نستخدم اتحاد مواد المرحلة ونقدّم مواد الأولى المشتركة أولًا.
   const groups=SUBJECTS94.ثانوي||{},first=groups['الأولى المشتركة']||[],rest=Object.entries(groups).filter(([k])=>k!=='الأولى المشتركة').flatMap(([,v])=>v||[]);
   return uniq([...first,...rest]);
 }
 const ord=ordinal114(grade)||'الأول';return SUBJECTS94[st]?.[ord]||[];
}
export function curriculumSubjects114(state={}){return stageSubjects(state.stage||state.metadata?.semantic101?.stage||'',(state.grades||state.metadata?.semantic101?.grades||[])[0]||'')}

const GENERIC_MAP={
 'القران الكريم والدراسات الاسلاميه':['القرآن الكريم والدراسات الإسلامية','قرآن ودراسات إسلامية','القرآن الكريم وتفسيره','القرآن الكريم'],
 'القران الكريم':['القرآن الكريم','القرآن الكريم وتفسيره','قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية'],
 'اللغه العربيه':['اللغة العربية','الكفايات اللغوية 1','الكفايات اللغوية'],
 'الرياضيات':['الرياضيات','الرياضيات 1'],
 'العلوم':['العلوم'],
 'اللغه الانجليزيه':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'المهارات الرقميه':['المهارات الرقمية','التقنية الرقمية 1','التقنية الرقمية'],
 'الدراسات الاجتماعيه':['الدراسات الاجتماعية']
};
function containsPhrase(raw,subject){const r=` ${norm(raw)} `,s=` ${norm(subject)} `;return r.includes(s)}
export function resolveSubject114(state={}){
 const explicit=String(state.metadata?.familyDetails?.subject94||'').split('|||').map(clean).filter(Boolean);if(explicit.length)return{name:explicit[0],all:explicit,source:'user',confidence:1};
 const available=curriculumSubjects114(state),raw=state.raw||'';
 // الاسم المطابِق للمقرر كما هو يتقدم على أي تصنيف عام؛ وهذا يغطي كل مواد السجل، لا سبع مواد فقط.
 const exact=[...available].sort((a,b)=>b.length-a.length).find(x=>containsPhrase(raw,x));if(exact)return{name:exact,all:[exact],source:'curriculum-inference',confidence:.99};
 const inferred=clean(state.metadata?.subjectHint101||state.metadata?.semantic101?.subject?.name);if(!inferred)return null;
 const candidates=GENERIC_MAP[norm(inferred)]||[inferred];
 const mapped=candidates.find(x=>available.includes(x));if(mapped)return{name:mapped,all:[mapped],source:'curriculum-inference',confidence:Math.max(.8,Number(state.metadata?.subjectConfidence101||0)/100)};
 // تخصصات العلوم في الثانوي: الكلمة المحددة في النص أهم من التصنيف العام «العلوم».
 const science=available.filter(x=>['الأحياء 1','الأحياء','الكيمياء 1','الكيمياء','الفيزياء 1','الفيزياء','علم البيئة','علوم الأرض والفضاء'].includes(x));
 const scienceExact=science.find(x=>containsPhrase(raw,x.replace(/ 1$/,''))||containsPhrase(raw,x));if(scienceExact)return{name:scienceExact,all:[scienceExact],source:'curriculum-inference',confidence:.97};
 return{name:inferred,all:[inferred],source:'inference',confidence:Number(state.metadata?.subjectConfidence101||state.metadata?.semantic101?.subject?.confidence||0)/100};
}
export function normalizeEducationState114(state={}){
 state.metadata=state.metadata||{};const sm=state.metadata.semantic101||{};
 const stage=clean(state.stage||sm.stage);const grades=canonicalGrades114(stage,(state.grades?.length?state.grades:sm.grades)||[]);if(stage)state.stage=stage;if(grades.length)state.grades=grades;
 if(state.classification?.type==='تحليل نتائج'&&!(state.audiences||[]).length)state.audiences=['الطلاب'];
 const subject=resolveSubject114(state);if(subject&&subject.source==='curriculum-inference'){
   state.metadata.subjectHint101=subject.name;state.metadata.subjectConfidence101=Math.round(subject.confidence*100);state.metadata.subjectResolved114=true;
 }
 return state;
}
