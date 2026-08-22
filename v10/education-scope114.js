import {SUBJECTS94} from './subject-registry94.js?v=110.2';

const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const norm=v=>clean(v).normalize('NFKC').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
const STAGE_ADJ={ابتدائي:'الابتدائي',متوسط:'المتوسط',ثانوي:'الثانوي'};

export function ordinal114(v=''){
 const n=norm(v);
 const aliases=[['الأول',['الاول','اول','اولي','اولى']],['الثاني',['الثاني','ثاني','ثانيه']],['الثالث',['الثالث','ثالث','ثالثه']],['الرابع',['الرابع','رابع','رابعه']],['الخامس',['الخامس','خامس','خامسه']],['السادس',['السادس','سادس','سادسه']]];
 for(const [canonical,arr] of aliases)if(arr.some(x=>n===norm(x)||n.includes(norm(x))))return canonical;
 return'';
}
export function stageFromGrade114(v=''){const n=norm(v);if(n.includes('ابتدائي'))return'ابتدائي';if(n.includes('متوسط'))return'متوسط';if(n.includes('ثانوي'))return'ثانوي';return''}
export function canonicalGrades114(stage='',grades=[]){
 const input=uniq(grades),resolvedStage=clean(stage)||input.map(stageFromGrade114).find(Boolean)||'',out=[];
 for(const g of input){const ord=ordinal114(g);if(!ord)continue;const gst=stageFromGrade114(g)||resolvedStage,full=gst?`${ord} ${STAGE_ADJ[gst]}`:ord;if(!out.includes(full))out.push(full)}
 return out.filter((g,i,a)=>!a.some((x,j)=>j!==i&&ordinal114(x)===ordinal114(g)&&stageFromGrade114(x)&&!stageFromGrade114(g)));
}
export function educationScopeLabel114(stage='',grades=[]){const gs=canonicalGrades114(stage,grades);return gs.length?gs.join(' و'):clean(stage)||''}
export function analysisAudienceOptions114(){return['الطلاب','مستفيدون آخرون']}

function allSecondarySubjects(){return uniq(Object.values(SUBJECTS94.ثانوي||{}).flatMap(v=>v||[]))}
export function curriculumSubjects114(state={}){
 const st=clean(state.stage||state.metadata?.semantic101?.stage||''),grade=(state.grades||state.metadata?.semantic101?.grades||[])[0]||'',ord=ordinal114(grade);
 if(!st)return[];
 if(st==='ثانوي'){
   if(ord==='الأول'||!ord)return SUBJECTS94.ثانوي?.['الأولى المشتركة']||[];
   return uniq(Object.entries(SUBJECTS94.ثانوي||{}).filter(([k])=>k!=='الأولى المشتركة').flatMap(([,v])=>v||[]));
 }
 return SUBJECTS94[st]?.[ord||'الأول']||[];
}
export function allStageSubjects114(state={}){const st=clean(state.stage||state.metadata?.semantic101?.stage||'');if(st==='ثانوي')return allSecondarySubjects();if(!st)return[];return uniq(Object.values(SUBJECTS94[st]||{}).flatMap(v=>v||[]))}

const GENERIC_MAP={
 'القران الكريم والدراسات الاسلاميه':['القرآن الكريم والدراسات الإسلامية','قرآن ودراسات إسلامية','القرآن الكريم وتفسيره','القرآن الكريم'],
 'اسلاميه':['قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية','القرآن الكريم وتفسيره','التوحيد','الفقه','الحديث 1','الحديث'],
 'اسلامي':['قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية','القرآن الكريم وتفسيره','التوحيد','الفقه','الحديث 1','الحديث'],
 'دين':['قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية','القرآن الكريم وتفسيره','التوحيد','الفقه','الحديث 1'],
 'قران':['القرآن الكريم','القرآن الكريم وتفسيره','قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية'],
 'القران الكريم':['القرآن الكريم','القرآن الكريم وتفسيره','قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية'],
 'اللغه العربيه':['اللغة العربية','لغتي','لغتي الخالدة','الكفايات اللغوية 1','الكفايات اللغوية'],
 'لغه عربيه':['اللغة العربية','لغتي','لغتي الخالدة','الكفايات اللغوية 1','الكفايات اللغوية'],
 'عربي':['اللغة العربية','لغتي','لغتي الخالدة','الكفايات اللغوية 1','الكفايات اللغوية'],
 'عربيه':['اللغة العربية','لغتي','لغتي الخالدة','الكفايات اللغوية 1','الكفايات اللغوية'],
 'العربي':['اللغة العربية','لغتي','لغتي الخالدة','الكفايات اللغوية 1','الكفايات اللغوية'],
 'لغتي':['لغتي','لغتي الخالدة','اللغة العربية','الكفايات اللغوية 1'],
 'لغتي الخالده':['لغتي الخالدة','اللغة العربية'],
 'كفايات':['الكفايات اللغوية 1','الكفايات اللغوية'],
 'رياضيات':['الرياضيات','الرياضيات 1'],
 'حساب':['الرياضيات','الرياضيات 1'],
 'الرياضيات':['الرياضيات','الرياضيات 1'],
 'علوم':['العلوم'],
 'العلوم':['العلوم'],
 'احياء':['الأحياء 1','الأحياء'],
 'كيمياء':['الكيمياء 1','الكيمياء'],
 'فيزياء':['الفيزياء 1','الفيزياء'],
 'انجليزي':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'انجليز':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'انجليش':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'انقلش':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'انقليزي':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'اغليز':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'انجليزيه':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'الانجليزي':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'اللغه الانجليزيه':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'english':['اللغة الإنجليزية','اللغة الإنجليزية 1'],
 'رقميه':['المهارات الرقمية','التقنية الرقمية 1','التقنية الرقمية'],
 'تقنيه رقميه':['التقنية الرقمية 1','التقنية الرقمية','المهارات الرقمية'],
 'تقنيه':['التقنية الرقمية 1','التقنية الرقمية','المهارات الرقمية'],
 'حاسب':['المهارات الرقمية','التقنية الرقمية 1','التقنية الرقمية'],
 'المهارات الرقميه':['المهارات الرقمية','التقنية الرقمية 1','التقنية الرقمية'],
 'اجتماعيات':['الدراسات الاجتماعية'],
 'اجتماعيه':['الدراسات الاجتماعية'],
 'الاجتماعيات':['الدراسات الاجتماعية'],
 'الدراسات الاجتماعيه':['الدراسات الاجتماعية'],
 'فنيه':['التربية الفنية','الفنون'],
 'تربيه فنيه':['التربية الفنية','الفنون'],
 'رسم':['التربية الفنية','الفنون'],
 'بدنيه':['التربية البدنية والدفاع عن النفس','التربية الصحية والبدنية 1','التربية الصحية والبدنية','اللياقة والثقافة الصحية'],
 'تربيه بدنيه':['التربية البدنية والدفاع عن النفس','التربية الصحية والبدنية 1','التربية الصحية والبدنية','اللياقة والثقافة الصحية'],
 'رياضه':['التربية البدنية والدفاع عن النفس','التربية الصحية والبدنية 1','التربية الصحية والبدنية','اللياقة والثقافة الصحية'],
 'رياضه بدنيه':['التربية البدنية والدفاع عن النفس','التربية الصحية والبدنية 1','التربية الصحية والبدنية','اللياقة والثقافة الصحية'],
 'مهارات حياتيه':['المهارات الحياتية والأسرية'],
 'اسريه':['المهارات الحياتية والأسرية'],
 'تفكير ناقد':['التفكير الناقد'],
 'ماليه':['المعرفة المالية'],
 'علم بيانات':['علم البيانات'],
 'امن سيبراني':['الأمن السيبراني']
 ,'هندسه برمجيات':['هندسة البرمجيات']
 ,'مواطنه رقميه':['المواطنة الرقمية']
 ,'اداره ماليه':['الإدارة المالية']
};
const PHRASE_ALIASES=Object.entries(GENERIC_MAP).sort((a,b)=>b[0].length-a[0].length);
const looseToken=t=>norm(t).replace(/\bال(?=\S)/g,'');
function strictContainsSubject(raw,subject){const r=` ${norm(raw)} `,s=` ${norm(subject)} `;return r.includes(s)}
function looseContainsSubject(raw,subject){
 const rt=looseToken(raw).split(' '),rawNums=new Set(rt.filter(x=>/^\d+$/.test(x))),st=looseToken(subject).split(' ').filter(Boolean),subjectNums=st.filter(x=>/^\d+$/.test(x));
 if(subjectNums.some(x=>!rawNums.has(x)))return false;
 const words=st.filter(x=>!/^\d+$/.test(x));return words.length>0&&words.every(x=>rt.includes(x));
}
function shorthandSubject(raw,selectable,searchable){
 const nraw=` ${norm(raw)} `,maps=[];
 for(const [alias,candidates] of PHRASE_ALIASES){const needle=` ${norm(alias)} `;if(nraw.includes(needle))maps.push(...candidates)}
 const tokens=norm(raw).split(/\s+/).filter(Boolean);for(const token of tokens){const candidates=GENERIC_MAP[token];if(candidates)maps.push(...candidates)}
 for(const candidate of uniq(maps)){if(selectable.includes(candidate))return candidate}
 for(const candidate of uniq(maps)){if(searchable.includes(candidate))return candidate}
 return'';
}
export function subjectFamily114(value=''){
 const n=norm(value);
 if(/لغتي|عربي|كفايات لغويه/.test(n))return'اللغة العربية';
 if(/انجليزي|انقليزي|انقلش|english/.test(n))return'اللغة الإنجليزية';
 if(/قران|اسلام|دين|توحيد|فقه|حديث|تفسير|تجويد/.test(n))return'الدراسات الإسلامية';
 if(/رياضيات|حساب/.test(n))return'الرياضيات';
 if(/علوم|احياء|كيمياء|فيزياء|بيئه|ارض/.test(n))return'العلوم';
 if(/اجتماع|تاريخ|جغرافيا/.test(n))return'الدراسات الاجتماعية';
 if(/رقمي|حاسب|تقنيه|كمبيوتر/.test(n))return'المهارات الرقمية';
 if(/بدني|رياضه|لياقه/.test(n))return'التربية البدنية';
 if(/فني|فنون|رسم/.test(n))return'التربية الفنية';
 if(/حياتي|اسري/.test(n))return'المهارات الحياتية والأسرية';
 if(/تفكير ناقد/.test(n))return'التفكير الناقد';
 return clean(value);
}
export function resolveSubject114(state={}){
 const explicit=String(state.metadata?.familyDetails?.subject94||'').split('|||').map(clean).filter(Boolean);if(explicit.length)return{name:explicit[0],all:explicit,family:subjectFamily114(explicit[0]),source:'user',confidence:1};
 const selectable=curriculumSubjects114(state),searchable=allStageSubjects114(state),raw=state.raw||'';
 const strict=[...selectable].sort((a,b)=>b.length-a.length).find(x=>strictContainsSubject(raw,x));if(strict)return{name:strict,all:[strict],family:subjectFamily114(strict),source:'curriculum-inference',confidence:.99};
 const loose=[...selectable].sort((a,b)=>b.length-a.length).find(x=>looseContainsSubject(raw,x));if(loose)return{name:loose,all:[loose],family:subjectFamily114(loose),source:'curriculum-inference',confidence:.96};
 const shorthand=shorthandSubject(raw,selectable,selectable);if(shorthand)return{name:shorthand,all:[shorthand],family:subjectFamily114(shorthand),source:'curriculum-inference',confidence:.94};
 const inferred=clean(state.metadata?.subjectHint101||state.metadata?.semantic101?.subject?.name);if(!inferred)return null;
 const candidates=GENERIC_MAP[norm(inferred)]||[inferred];
 const mapped=candidates.find(x=>selectable.includes(x));if(mapped)return{name:mapped,all:[mapped],family:subjectFamily114(mapped),source:'curriculum-inference',confidence:Math.max(.8,Number(state.metadata?.subjectConfidence101||0)/100)};
 return null;
}
export function normalizeEducationState114(state={}){
 state.metadata=state.metadata||{};const sm=state.metadata.semantic101||{},stage=clean(state.stage||sm.stage),grades=canonicalGrades114(stage,(state.grades?.length?state.grades:sm.grades)||[]);
 if(stage)state.stage=stage;if(grades.length)state.grades=grades;
 if(state.classification?.type==='تحليل نتائج'&&!(state.audiences||[]).length)state.audiences=['الطلاب'];
 const subject=resolveSubject114(state);if(subject){state.metadata.subjectFamily114=subject.family||subjectFamily114(subject.name)}if(subject&&subject.source==='curriculum-inference'){state.metadata.subjectHint101=subject.name;state.metadata.subjectConfidence101=Math.round(subject.confidence*100);state.metadata.subjectResolved114=true}
 return state;
}
