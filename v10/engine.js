import {FAMILIES,INTENT_TO_TYPE} from './config.js';

export const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export const uniq=a=>[...new Set((a||[]).filter(Boolean))];
export const joinAr=a=>{a=uniq(a);if(!a.length)return'';if(a.length===1)return a[0];if(a.length===2)return`${a[0]} و${a[1]}`;return`${a.slice(0,-1).join('، ')} و${a.at(-1)}`};
export function norm(s){return String(s||'').toLowerCase().replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim()}
export const has=(n,...xs)=>xs.some(x=>n.includes(norm(x)));

function gradeFrom(n){
  const re=/(اول|الأول|ثاني|الثاني|ثالث|الثالث|رابع|الرابع|خامس|الخامس|سادس|السادس)\s*(ابتدائي|متوسط|ثانوي)/g;
  const ord={اول:'الأول',الأول:'الأول',ثاني:'الثاني',الثاني:'الثاني',ثالث:'الثالث',الثالث:'الثالث',رابع:'الرابع',الرابع:'الرابع',خامس:'الخامس',الخامس:'الخامس',سادس:'السادس',السادس:'السادس'};
  const st={ابتدائي:'الابتدائي',متوسط:'المتوسط',ثانوي:'الثانوي'};
  let m,stage='',grades=[];
  while((m=re.exec(n))){stage=stage||m[2];grades.push(`${ord[m[1]]} ${st[m[2]]}`)}
  if(!stage)stage=has(n,'ابتدائي')?'ابتدائي':has(n,'متوسط')?'متوسط':has(n,'ثانوي')?'ثانوي':'';
  return {stage,grades:uniq(grades)};
}

function extractFacts(raw){
  const n=norm(raw),g=gradeFrom(n),audiences=[];
  if(has(n,'طلاب','طالب','الطلاب','الطالبات','عيال'))audiences.push('الطلاب');
  if(has(n,'معلمين','معلمون','معلمات','معلم','هيئه تعليميه'))audiences.push('المعلمون');
  if(has(n,'اولياء','ولي الامر','اهالي','الاسر','اسر'))audiences.push('أولياء الأمور');
  if(has(n,'اداريين','اداريون','اداره'))audiences.push('الإداريون');
  let topic='';
  if(has(n,'قراءه','قرائي','لغويه','املاء','خط'))topic=has(n,'خط')?'تحسين الخط والمهارات الكتابية':'القراءة والمهارات اللغوية';
  else if(has(n,'تقنيه','رقمي','ذكاء اصطناعي'))topic='التقنية والممارسات الرقمية';
  else if(has(n,'امن','سلامه','اخلاء'))topic='الأمن والسلامة';
  else if(has(n,'وطني','وطن','قيم'))topic='القيم والهوية الوطنية';
  return {raw,n,audiences:uniq(audiences),stage:g.stage,grades:g.grades,topic};
}

function scoreTypes(n){
  const scores={};
  const add=(type,score)=>scores[type]=(scores[type]||0)+score;
  if(has(n,'اجتماع','اجتمعنا','لجنه','محضر'))add('اجتماع / متابعة إدارية',8);
  if(has(n,'تكليف','محضر','توصيات','قرار'))add('اجتماع / متابعة إدارية',2);
  if(has(n,'غياب','حضور','تاخير','تاخر','متاخر','انضباط','مواظبه','بصمه'))add('إجراء متابعة',7);
  if(has(n,'نتائج','درجات','اختبار','تحليل','متعثر','علاجي','علاج','اثراء'))add('تحليل نتائج',6);
  // لا تعتبر كلمة "تدريب" وحدها تطويرًا مهنيًا؛ فقد تكون "تدريبًا عمليًا" للطلاب داخل برنامج.
  if(has(n,'مجتمع مهني','مجتمع تعلم','ورشه','تطوير مهني','نمو مهني','احتياج تدريبي'))add('تطوير مهني',8);
  if(has(n,'تدريب')&&has(n,'معلمين','معلمات','المعلمين','المعلمات','منسوبي','الكادر','مهني'))add('تطوير مهني',8);
  if(has(n,'برنامج','فعاليه','نشاط','مبادره','مسابقه','حمله'))add('برنامج / فعالية',7);
  if(has(n,'خطة','خطه'))add('خطة',6);
  if(has(n,'خطة','خطه')&&has(n,'اعداد','اعددنا','بناء','بنينا','نحتاج','وضع'))add('خطة',4);
  if(has(n,'حللنا','تحليل','نتائج','درجات')&&has(n,'علاجي','اثرائي'))add('تحليل نتائج',4);
  return scores;
}

function subtypeFor(type,n){
  if(type==='برنامج / فعالية')return has(n,'مسابقه')?'مسابقة':has(n,'مبادره')?'مبادرة':has(n,'حمله')?'حملة':has(n,'فعاليه')?'فعالية':has(n,'نشاط')?'نشاط':'برنامج';
  if(type==='تطوير مهني')return has(n,'مجتمع مهني','مجتمع تعلم')?'مجتمع تعلم مهني':has(n,'ورشه')?'ورشة':has(n,'تدريب')?'تدريب':'لقاء تبادل خبرات';
  if(type==='إجراء متابعة')return has(n,'غياب')?'متابعة غياب':has(n,'تاخير','تاخر','متاخر')?'متابعة تأخر':has(n,'انضباط','مواظبه')?'متابعة انضباط':'متابعة حضور';
  if(type==='تحليل نتائج')return has(n,'علاج','علاجي','متعثر')?'خطة علاجية':has(n,'اثراء','اثرائي','متفوق')?'خطة إثرائية':has(n,'متابعه','تقدم')?'متابعة تقدم':'تحليل نتائج';
  if(type==='اجتماع / متابعة إدارية')return has(n,'نتائج','درجات')?'اجتماع مراجعة نتائج':has(n,'مشكل','معالجه')?'اجتماع حل مشكلة':has(n,'خطة','تخطيط')?'اجتماع تخطيط':'اجتماع متابعة';
  if(type==='خطة')return has(n,'علاجي','علاج')?'خطة علاجية':has(n,'اثرائي','اثراء','متفوق')?'خطة إثرائية':has(n,'تطوير مهني','مهني','المعلمين')?'خطة تطوير مهني':has(n,'تحسين','تطوير','جوده','جودة')?'خطة تحسين':has(n,'متابعة','متابعه')?'خطة متابعة':'خطة تنفيذية';
  return FAMILIES[type]?.subtypes?.[0]||'';
}

function subjectFromRaw(raw,topic){
  const s=String(raw||'').trim();
  const m=s.match(/(?:برنامج|مبادرة|مسابقة|حملة|فعالية|نشاط|ورشة|تدريب|خطة|خطه)\s+([^،.\n]{2,55})/i);
  if(m){let x=m[1].replace(/(?:لطلاب|للطالب|للمعلمين|للمعلم|لأولياء|عشان|بهدف|عن|من أجل)\s.*$/i,'').trim();x=x.replace(/^ل(?=رفع|تحسين|تنمية|تعزيز|تطوير)/,'').trim();if(x.length>2)return x}
  const n=norm(s);
  if(has(n,'خط'))return'تحسين الخط';
  if(has(n,'قراءه','قرائي','فهم قرائي'))return'تنمية مهارات القراءة والفهم القرائي';
  if(has(n,'غياب'))return'متابعة الغياب';
  if(has(n,'تاخير','تاخر','متاخر'))return'متابعة التأخر';
  if(has(n,'نتائج','درجات','اختبار'))return'تحسين نتائج الطلاب';
  if(has(n,'ذكاء اصطناعي','الذكاء الاصطناعي'))return'توظيف الذكاء الاصطناعي في التعليم';
  if(has(n,'امن','سلامه','اخلاء'))return'تعزيز الأمن والسلامة';
  return topic||'';
}

export function titleSuggestions(state){
  const {type,subtype}=state.classification,subject=subjectFromRaw(state.raw,state.topic),a=[];
  if(type==='برنامج / فعالية')a.push(subject?`${subtype||'برنامج'} ${subject}`:`${subtype||'برنامج'} تربوي`);
  if(type==='تطوير مهني')a.push(subject?`${subtype||'نشاط تطوير مهني'} حول ${subject}`:`${subtype||'نشاط'} للتطوير المهني`);
  if(type==='إجراء متابعة')a.push(has(state.normalized,'غياب')?'متابعة الغياب والانضباط المدرسي':has(state.normalized,'تاخير','تاخر','متاخر')?'متابعة حالات التأخر والانضباط المدرسي':'تعزيز متابعة الحضور والانضباط المدرسي');
  if(type==='تحليل نتائج')a.push(has(state.normalized,'علاج','علاجي','متعثر')?'تحليل نتائج الطلاب وتحديد التدخلات العلاجية':'تحليل نتائج التقويم وتحديد أولويات التحسين','تحليل الأداء التحصيلي وبناء إجراءات التحسين');
  if(type==='اجتماع / متابعة إدارية')a.push(has(state.normalized,'نتائج','درجات')?'اجتماع مراجعة نتائج الطلاب وتحديد إجراءات التحسين':`اجتماع ${subtype?.replace(/^اجتماع\s+/,'')||'متابعة إدارية'}`);
  if(type==='خطة'){if(has(state.normalized,'قراءه','قرائي'))a.push(`${subtype||'خطة تنفيذية'} لتحسين مهارات القراءة`);else if(has(state.normalized,'نتائج','درجات','اختبار'))a.push(`${subtype||'خطة تنفيذية'} لتحسين نتائج الطلاب`);else a.push(subject?`${subtype||'خطة تنفيذية'} لـ${subject}`:(subtype||'خطة تنفيذية'));}
  return uniq(a.map(x=>x.replace(/\s+/g,' ').trim())).slice(0,3);
}

function explicitTypeFromRaw(raw){
  const n=norm(raw);
  if(/^(?:تم )?(?:نفذت|نفذنا|نفذ|تنفيذ) (?:برنامجا?|فعاليه|نشاط|مبادره|مسابقه|حمله)\b/u.test(n))return'برنامج / فعالية';
  if(/^(?:تم )?(?:حضرت|حضرنا|نفذت|نفذنا|قدمت|قدمنا|تنفيذ) (?:برنامج تدريبي|دوره|ورشه|مجتمع تعلم مهني)\b/u.test(n))return'تطوير مهني';
  return'';
}

export function analyze(raw,entryIntent='smart'){
  const f=extractFacts(raw),scores=scoreTypes(f.n),explicit=explicitTypeFromRaw(raw);
  if(explicit)scores[explicit]=99;
  const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const detected=ranked[0]?.[0]||'برنامج / فعالية';
  const hinted=INTENT_TO_TYPE[entryIntent]||'';
  const conflict=Boolean(hinted&&detected!==hinted&&((scores[detected]||0)-(scores[hinted]||0)>=3));
  const type=hinted&&!conflict?hinted:detected;
  const state={
    raw,normalized:f.n,topic:f.topic,audiences:f.audiences.length?f.audiences:(type==='تطوير مهني'?['المعلمون']:['الطلاب']),stage:f.stage,grades:f.grades,
    entryIntent,answers:{},metadata:{executorName:'',count:'',workTitle:''},
    classification:{type,subtype:subtypeFor(type,f.n),domain:FAMILIES[type]?.domain||'عمل مدرسي',detected,hinted,conflict,confidence:ranked[0]?.[1]||0,explicit:Boolean(explicit)},
    titleIndex:0
  };
  const titles=titleSuggestions(state);state.titleSuggestions=titles;state.metadata.workTitle=titles[0]||state.classification.subtype||type;
  return state;
}

export function acceptHint(state){
  const hinted=state.classification.hinted;if(!hinted)return state;
  state.classification.type=hinted;state.classification.subtype=subtypeFor(hinted,state.normalized);state.classification.domain=FAMILIES[hinted]?.domain||'';state.classification.conflict=false;
  state.answers={};state.titleIndex=0;state.titleSuggestions=titleSuggestions(state);state.metadata.workTitle=state.titleSuggestions[0]||state.classification.subtype||hinted;return state;
}
export function acceptDetected(state){state.classification.type=state.classification.detected;state.classification.subtype=subtypeFor(state.classification.detected,state.normalized);state.classification.domain=FAMILIES[state.classification.type]?.domain||'';state.classification.conflict=false;state.answers={};state.titleIndex=0;state.titleSuggestions=titleSuggestions(state);state.metadata.workTitle=state.titleSuggestions[0]||state.classification.subtype||state.classification.type;return state}
export function setType(state,type){state.classification.type=type;state.classification.subtype=subtypeFor(type,state.normalized);state.classification.domain=FAMILIES[type]?.domain||'';state.classification.conflict=false;state.answers={};state.titleIndex=0;state.titleSuggestions=titleSuggestions(state);state.metadata.workTitle=state.titleSuggestions[0]||state.classification.subtype||type;return state}
export function setSubtype(state,subtype){state.classification.subtype=subtype;state.titleIndex=0;state.titleSuggestions=titleSuggestions(state);state.metadata.workTitle=state.titleSuggestions[0]||subtype;return state}
export const questionsFor=state=>FAMILIES[state.classification.type]?.questions||[];
export const familyOptions=()=>Object.keys(FAMILIES);
export const subtypeOptions=state=>FAMILIES[state.classification.type]?.subtypes||[];

export function evidenceFor(state){
  switch(state.classification.type){
    case 'إجراء متابعة':return'كشف الحضور/الغياب، سجل المتابعة، أو صورة من أداة الرصد المستخدمة.';
    case 'تحليل نتائج':return'كشف أو تقرير التحليل، قوائم الفئات المستهدفة، والخطة العلاجية/الإثرائية إن وُجدت.';
    case 'تطوير مهني':return'محضر النشاط، كشف حضور، مادة تدريبية، ثم شاهد تطبيق لاحق.';
    case 'برنامج / فعالية':return'صور التنفيذ، المنتجات الناتجة، سجل المشاركة، أو مواد البرنامج.';
    case 'خطة':return'نسخة الخطة المعتمدة، جدول الإجراءات والمسؤوليات، وأداة أو تقرير المتابعة.';
    default:return'محضر الاجتماع، القرارات أو التكليفات، وخطة أو أداة المتابعة.';
  }
}

export function potentialLinks(state){
  const t=state.classification.type;
  if(t==='خطة')return['وجود خطة منظمة مرتبطة باحتياج أو بيانات','قوة الأثر تعتمد على شواهد التنفيذ والمتابعة والنتائج اللاحقة'];
  if(t==='تحليل نتائج')return['استخدام البيانات لتحديد احتياج أو فجوة','قوة الارتباط بالمؤشرات ترتفع عند وجود تدخل وقياس لاحق'];
  if(t==='تطوير مهني')return['توثيق نشاط نمو مهني مرتبط باحتياج','لا يُعد الحضور وحده دليلًا على تحقق أثر مهني'];
  if(t==='برنامج / فعالية')return['توثيق تنفيذ برنامج أو فعالية ومشاركة المستفيدين','قياس الأثر يحتاج أداة أو نتيجة لاحقة عند اشتراط المؤشر لذلك'];
  if(t==='إجراء متابعة')return['توثيق إجراء رصد أو متابعة','تحقق الأثر يحتاج مقارنة أو نتيجة متابعة لاحقة'];
  return['توثيق اجتماع وقرارات أو تكليفات','قوة الشاهد ترتفع بوجود متابعة لاحقة للإنجاز'];
}

const vals=(state,id)=>state.answers[id]||[];
const valText=(state,id,fallback)=>joinAr(vals(state,id))||fallback;
const audienceText=state=>joinAr(state.audiences)||'المستفيدين';
const infoSuffix=state=>{const b=[];if(state.metadata.executorName)b.push(`نفذه ${state.metadata.executorName}`);if(state.metadata.count)b.push(`بلغ عدد المستفيدين ${state.metadata.count}`);return b.length?` ${b.join('، ')}.`:''};

export function composeNarrative(state){
  const t=state.classification.type,name=state.metadata.workTitle||state.classification.subtype,A=audienceText(state),extra=infoSuffix(state),p=[];
  if(t==='إجراء متابعة'){
    p.push(`جاء تنفيذ ${name} لدعم ${valText(state,'goal','رفع دقة متابعة الحضور والانضباط')} لدى ${A}، وتحسين قدرة المدرسة على اكتشاف حالات الغياب أو التأخر في وقت مبكر.${extra}`);
    p.push(`اعتمد التنفيذ على ${valText(state,'method','متابعة منظمة')}، مع تنظيم الرصد بما يسمح بجمع معلومات أدق والرجوع إليها عند الحاجة.`);
    p.push(`أسفر التنفيذ عن ${valText(state,'outcome','بيانات تساعد على المتابعة')}. وتمثل هذه المخرجات أساسًا لاستكمال المتابعة دون اعتبارها وحدها دليلًا على تحقق أثر نهائي.`);
  } else if(t==='تحليل نتائج'){
    p.push(`تم تنفيذ ${name} بالاعتماد على ${valText(state,'basis','نتائج التقويم المتاحة')} لدى ${A}، بهدف بناء صورة أوضح عن مستويات الأداء وتحديد الجوانب التي تستدعي تدخلاً إضافيًا.${extra}`);
    p.push(`في ضوء التحليل تم العمل على ${valText(state,'action','تحديد أولويات التحسين')}، بما ينقل قراءة النتائج إلى إجراءات تعليمية قابلة للتنفيذ.`);
    p.push(`ستتم المتابعة من خلال ${valText(state,'follow','متابعة أداء الطلاب لاحقًا')}، ويظل الحكم على الأثر مرتبطًا بنتائج المتابعة الفعلية.`);
  } else if(t==='تطوير مهني'){
    p.push(`نُفذ ${name} استجابةً إلى ${valText(state,'reason','احتياج مهني')} لدى ${A}${state.topic?` في مجال ${state.topic}`:''}. وركز العمل على ربط التطوير المهني بالممارسة الفعلية.${extra}`);
    p.push(`تم التنفيذ من خلال ${valText(state,'method','مناقشة وتبادل خبرات')}، وأتاح ذلك ربط المحتوى بالمواقف المهنية وتبادل الممارسات بين المشاركين.`);
    p.push(`تمثلت المخرجات المباشرة في ${valText(state,'product','مخرجات مهنية قابلة للتطبيق')}. وتتم متابعة الاستفادة من خلال ${valText(state,'follow','متابعة التطبيق')}.`);
  } else if(t==='برنامج / فعالية'){
    p.push(`نُفذ ${name} لخدمة ${A}${state.topic?` في مجال ${state.topic}`:''}، مع التركيز على ${valText(state,'goal','تحقيق هدف تربوي محدد')}.${extra}`);
    p.push(`تم تنفيذ العمل من خلال ${valText(state,'method','نشاط منظم')}، مع توجيه المشاركة نحو الهدف المحدد والمخرجات المتوقعة.`);
    p.push(`نتج عن التنفيذ ${valText(state,'product','مخرجات مباشرة من التنفيذ')}. وإذا كان الهدف يتطلب قياس أثر، فيُستكمل التوثيق بأداة مناسبة تقيس التغير لدى المستفيدين.`);
  } else if(t==='خطة'){
    p.push(`أُعدت ${name} استنادًا إلى ${valText(state,'basis','احتياج محدد')} لدى ${A}، بهدف الانتقال من تحديد الاحتياج إلى استجابة منظمة قابلة للتنفيذ والمتابعة.${extra}`);
    p.push(`تركز الخطة على ${valText(state,'goal','تحسين مستوى الأداء')}، ويتم تنفيذها من خلال ${valText(state,'method','إجراءات محددة')}.`);
    p.push(`تُتابع الخطة من خلال ${valText(state,'follow','مراجعة دورية')}. ويظل الحكم على الأثر مرتبطًا بنتائج المتابعة الفعلية وليس بمجرد وجود الخطة.`);
  } else {
    p.push(`عُقد ${name} بهدف ${valText(state,'purpose','المتابعة والتنظيم')}، بما يدعم تنظيم العمل والوصول إلى إجراءات قابلة للمتابعة.${extra}`);
    p.push(`تناول الاجتماع ${valText(state,'work','مناقشة المحاور ذات الصلة')}، مع ترتيب الأولويات وربط كل محور بالإجراء المناسب.`);
    p.push(`انتهى الاجتماع إلى ${valText(state,'product','مخرجات تنظيمية واضحة')}. وتتم متابعة المخرجات وفق المسؤوليات والإجراءات والمواعيد المحددة.`);
  }
  return p.map(x=>x.replace(/\s+/g,' ').trim());
}
