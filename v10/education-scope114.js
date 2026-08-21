import {SUBJECTS94} from './subject-registry94.js?v=110.2';

const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const norm=v=>clean(v).normalize('NFKC').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
const STAGE_ADJ={ابتدائي:'الابتدائي',متوسط:'المتوسط',ثانوي:'الثانوي'};

export function ordinal114(v=''){
 const n=norm(v);
 const aliases=[['الأول',['الاول','اول']],['الثاني',['الثاني','ثاني']],['الثالث',['الثالث','ثالث']],['الرابع',['الرابع','رابع']],['الخامس',['الخامس','خامس']],['السادس',['السادس','سادس']]];
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
   // الأول الثانوي = السنة الأولى المشتركة. في الصفين الثاني والثالث لا نعرض مسارًا بعينه قبل معرفته.
   if(ord==='الأول'||!ord)return SUBJECTS94.ثانوي?.['الأولى المشتركة']||[];
   return uniq(Object.entries(SUBJECTS94.ثانوي||{}).filter(([k])=>k!=='الأولى المشتركة').flatMap(([,v])=>v||[]));
 }
 return SUBJECTS94[st]?.[ord||'الأول']||[];
}
export function allStageSubjects114(state={}){const st=clean(state.stage||state.metadata?.semantic101?.stage||'');if(st==='ثانوي')return allSecondarySubjects();if(!st)return[];return uniq(Object.values(SUBJECTS94[st]||{}).flatMap(v=>v||[]))}

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
const looseToken=t=>norm(t).replace(/\bال(?=\S)/g,'');
function containsSubject(raw,subject){const r=` ${norm(raw)} `,s=` ${norm(subject)} `;if(r.includes(s))return true;const rt=looseToken(raw).split(' '),st=looseToken(subject).split(' ').filter(x=>x&&!/^\d+$/.test(x));return st.length>0&&st.every(x=>rt.includes(x))}
export function resolveSubject114(state={}){
 const explicit=String(state.metadata?.familyDetails?.subject94||'').split('|||').map(clean).filter(Boolean);if(explicit.length)return{name:explicit[0],all:explicit,source:'user',confidence:1};
 const selectable=curriculumSubjects114(state),searchable=allStageSubjects114(state),raw=state.raw||'';
 // نبحث في سجل المرحلة الكامل حتى تتعرف المواد التخصصية أيضًا، ثم يستخدم المحدد قائمة الصف المناسبة للعرض.
 const exact=[...searchable].sort((a,b)=>b.length-a.length).find(x=>containsSubject(raw,x));if(exact)return{name:exact,all:[exact],source:'curriculum-inference',confidence:.99};
 const inferred=clean(state.metadata?.subjectHint101||state.metadata?.semantic101?.subject?.name);if(!inferred)return null;
 const candidates=GENERIC_MAP[norm(inferred)]||[inferred];
 const mapped=candidates.find(x=>selectable.includes(x))||candidates.find(x=>searchable.includes(x));if(mapped)return{name:mapped,all:[mapped],source:'curriculum-inference',confidence:Math.max(.8,Number(state.metadata?.subjectConfidence101||0)/100)};
 const science=searchable.filter(x=>['الأحياء 1','الأحياء','الكيمياء 1','الكيمياء','الفيزياء 1','الفيزياء','علم البيئة','علوم الأرض والفضاء'].includes(x));
 const scienceExact=science.find(x=>containsSubject(raw,x.replace(/ 1$/,''))||containsSubject(raw,x));if(scienceExact)return{name:scienceExact,all:[scienceExact],source:'curriculum-inference',confidence:.97};
 return{name:inferred,all:[inferred],source:'inference',confidence:Number(state.metadata?.subjectConfidence101||state.metadata?.semantic101?.subject?.confidence||0)/100};
}
export function normalizeEducationState114(state={}){
 state.metadata=state.metadata||{};const sm=state.metadata.semantic101||{},stage=clean(state.stage||sm.stage),grades=canonicalGrades114(stage,(state.grades?.length?state.grades:sm.grades)||[]);
 if(stage)state.stage=stage;if(grades.length)state.grades=grades;
 if(state.classification?.type==='تحليل نتائج'&&!(state.audiences||[]).length)state.audiences=['الطلاب'];
 const subject=resolveSubject114(state);if(subject&&subject.source==='curriculum-inference'){state.metadata.subjectHint101=subject.name;state.metadata.subjectConfidence101=Math.round(subject.confidence*100);state.metadata.subjectResolved114=true}
 return state;
}
