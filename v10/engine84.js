import * as base from './engine.js?v=84';
export * from './engine.js?v=84';

const TYPES=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني'];
const clean=s=>String(s||'').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[،,؛;:!?؟.]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const has=(t,...xs)=>xs.some(x=>t.includes(clean(x)));
const words=t=>clean(t).split(/\s+/).filter(Boolean);

const DIALECT={
 exec:['نفذت','نفذنا','نفذ','سويت','سوينا','سوى','عملت','عملنا','سوينا لهم','اقمت','اقمنا','نظمت','نظمنا','فعلت','فعلنا','جهزت','جهزنا','طبقنا','طبقت'],
 meet:['عقدت','عقدنا','اجتمعت','اجتمعنا','جلسنا','جلست','تقابلنا','سوينا اجتماع','كان عندنا اجتماع'],
 analyze:['حللت','حللنا','سويت تحليل','سوينا تحليل','شفت النتائج','شفنا النتائج','راجعت النتائج','راجعنا النتائج','قريت النتائج','قرينا النتائج','شيكت على النتائج','طلعت النتائج'],
 plan:['اعددت','اعددنا','سويت خطه','سوينا خطه','حطيت خطه','حطينا خطه','جهزت خطه','جهزنا خطه','بنيت خطه','بنينا خطه','رتبت خطه','رتبنا خطه'],
 follow:['تابعت','تابعنا','شيكت','شيكنا','رصدت','رصدنا','شفت مين','شفنا مين','قمت بمتابعه','تمت متابعه','مشينا على','راقبت','راقبنا'],
 pd:['حضرت','حضرنا','اخذت دوره','اخذنا دوره','دخلت ورشه','دخلنا ورشه','قدمت ورشه','قدمنا ورشه','نفذت ورشه','نفذنا ورشه','سويت تدريب للمعلمين','سوينا تدريب للمعلمين']
};

const ENTITIES={
 program:['برنامج','فعاليه','نشاط','مبادره','مسابقه','حمله','يوم عالمي','اليوم العالمي','اسبوع','احتفاء','تفعيل مناسبه','يوم اللغه العربيه','يوم الاعاقه','يوم التاسيس','اليوم الوطني'],
 meeting:['اجتماع','محضر','لقاء اداري','لجنه','اجتماع مع'],
 analysis:['تحليل نتائج','تحليل للنتائج','نتائج الاختبار','درجات الطلاب','نتائج الطلاب','النتائج','الدرجات','اختبار تشخيصي','اختبار فتره','بيانات تحصيليه'],
 plan:['خطه','خطة علاجية','خطه علاجيه','خطه اثرائيه','خطة تحسين','خطة تنفيذية'],
 follow:['غياب','تاخر','تأخر','حضور','انضباط','مواظبه','حالات','تكليفات','متابعه تنفيذ','الرصد','الحضور والانصراف'],
 pd:['تطوير مهني','نمو مهني','برنامج تدريبي','دوره','ورشه','مجتمع تعلم مهني','مجتمع مهني','تبادل خبرات','احتياج تدريبي']
};

function occurrences(text,arr){return arr.reduce((n,x)=>n+(text.includes(clean(x))?1:0),0)}
function firstPos(text,arr){let p=Infinity;for(const x of arr){const i=text.indexOf(clean(x));if(i>=0&&i<p)p=i}return p}
function add(scores,type,v,why){scores[type]=scores[type]||{score:0,reasons:[]};scores[type].score+=v;if(why)scores[type].reasons.push(why)}

function detectSecondary(text,primary){const out=[];const push=(type,label)=>{if(type!==primary&&!out.some(x=>x.type===type))out.push({type,label})};
 if(occurrences(text,ENTITIES.analysis))push('تحليل نتائج','تحليل أو مراجعة نتائج');
 if(occurrences(text,ENTITIES.plan))push('خطة','خطة أو إجراء مخطط');
 if(occurrences(text,ENTITIES.program))push('برنامج / فعالية','برنامج أو فعالية');
 if(occurrences(text,ENTITIES.follow))push('إجراء متابعة','متابعة أو رصد');
 if(occurrences(text,ENTITIES.meeting))push('اجتماع / متابعة إدارية','اجتماع أو قرار إداري');
 if(occurrences(text,ENTITIES.pd))push('تطوير مهني','نشاط تطوير مهني');
 return out.slice(0,4)}

function scoreSemantic(raw){const text=clean(raw),scores={};TYPES.forEach(t=>scores[t]={score:0,reasons:[]});
 const student=has(text,'طلاب','طالب','طالبات','الطلاب','الطالبات');
 const staff=has(text,'معلمين','معلمون','معلمات','المعلمين','المعلمات','منسوبي المدرسه','الكادر','هيئه تعليميه','الهيئه التعليميه');
 const explicit={
  'برنامج / فعالية':occurrences(text,DIALECT.exec)+occurrences(text,ENTITIES.program),
  'اجتماع / متابعة إدارية':occurrences(text,DIALECT.meet)+occurrences(text,ENTITIES.meeting),
  'تحليل نتائج':occurrences(text,DIALECT.analyze)+occurrences(text,ENTITIES.analysis),
  'خطة':occurrences(text,DIALECT.plan)+occurrences(text,ENTITIES.plan),
  'إجراء متابعة':occurrences(text,DIALECT.follow)+occurrences(text,ENTITIES.follow),
  'تطوير مهني':occurrences(text,DIALECT.pd)+occurrences(text,ENTITIES.pd)
 };
 for(const [t,n] of Object.entries(explicit))if(n)add(scores,t,Math.min(14,n*4),`ظهرت ${n} قرينة لغوية مرتبطة بالعائلة`);

 // entity + action combinations
 if(occurrences(text,ENTITIES.program)&&occurrences(text,DIALECT.exec))add(scores,'برنامج / فعالية',14,'فعل تنفيذ مع كيان برنامج/فعالية');
 if(occurrences(text,ENTITIES.meeting)&&occurrences(text,DIALECT.meet))add(scores,'اجتماع / متابعة إدارية',14,'فعل اجتماع مع كيان إداري');
 if(occurrences(text,ENTITIES.analysis)&&occurrences(text,DIALECT.analyze))add(scores,'تحليل نتائج',14,'فعل تحليل مع نتائج/درجات');
 if(occurrences(text,ENTITIES.plan)&&occurrences(text,DIALECT.plan))add(scores,'خطة',14,'فعل إعداد/بناء مع خطة');
 if(occurrences(text,ENTITIES.follow)&&occurrences(text,DIALECT.follow))add(scores,'إجراء متابعة',14,'فعل متابعة/رصد مع حالة متابعة');
 if(occurrences(text,ENTITIES.pd)&&occurrences(text,DIALECT.pd))add(scores,'تطوير مهني',14,'فعل حضور/تنفيذ مع نشاط مهني');

 // context disambiguation
 if(student&&has(text,'تدريب عملي','دربت الطلاب','تدريب الطلاب')){add(scores,'برنامج / فعالية',8,'التدريب موجّه للطلاب ويعد طريقة تنفيذ');scores['تطوير مهني'].score-=8}
 if(staff&&has(text,'دوره','ورشه','تدريب','تطوير مهني','مجتمع تعلم'))add(scores,'تطوير مهني',8,'سياق مهني موجّه للمعلمين/المنسوبين');
 if(has(text,'اليوم العالمي','يوم عالمي','اليوم الوطني','يوم التاسيس','اسبوع التوعيه','تفعيل مناسبه','احتفاء'))add(scores,'برنامج / فعالية',12,'مناسبة أو يوم توعوي/وطني');
 if(has(text,'نتائج','درجات')&&has(text,'ثم','بعدها','وبعدها')&&has(text,'خطه علاجيه','خطة علاجية'))add(scores,'تحليل نتائج',5,'التحليل سبق الخطة العلاجية؛ الخطة ناتج لاحق');
 if(has(text,'اجتمعنا','عقدت اجتماع','جلسنا مع')&&has(text,'نتائج','درجات','خطه'))add(scores,'اجتماع / متابعة إدارية',5,'الاجتماع هو إطار العمل الرئيسي رغم وجود نتائج/خطة');
 if(has(text,'غياب','تاخر','تأخر','انضباط')&&has(text,'كلمت اولياء','تواصلت مع','ولي الامر'))add(scores,'إجراء متابعة',6,'رصد حالة ثم إجراء متابعة');

 // first-event prior: earliest meaningful event gets weight in compound narratives
 const eventPos={
  'برنامج / فعالية':Math.min(firstPos(text,DIALECT.exec),firstPos(text,ENTITIES.program)),
  'اجتماع / متابعة إدارية':Math.min(firstPos(text,DIALECT.meet),firstPos(text,ENTITIES.meeting)),
  'تحليل نتائج':Math.min(firstPos(text,DIALECT.analyze),firstPos(text,ENTITIES.analysis)),
  'خطة':Math.min(firstPos(text,DIALECT.plan),firstPos(text,ENTITIES.plan)),
  'إجراء متابعة':Math.min(firstPos(text,DIALECT.follow),firstPos(text,ENTITIES.follow)),
  'تطوير مهني':Math.min(firstPos(text,DIALECT.pd),firstPos(text,ENTITIES.pd))
 };
 const finite=Object.entries(eventPos).filter(([,p])=>Number.isFinite(p)).sort((a,b)=>a[1]-b[1]);
 if(finite.length)add(scores,finite[0][0],4,'ظهر هذا الحدث أولًا في وصف واقعة مركبة');

 const ranked=Object.entries(scores).map(([type,v])=>({type,score:Math.max(0,v.score),reasons:v.reasons})).sort((a,b)=>b.score-a.score);
 const top=ranked[0],second=ranked[1];
 const margin=(top?.score||0)-(second?.score||0);
 let confidence=0;if(top?.score>=24&&margin>=7)confidence=95;else if(top?.score>=18&&margin>=5)confidence=88;else if(top?.score>=13&&margin>=4)confidence=80;else if(top?.score>=9&&margin>=3)confidence=70;else if(top?.score>=6&&margin>=2)confidence=60;
 const decisive=confidence>=70;
 return {text,ranked,primary:decisive?top.type:'',confidence,margin,secondary:detectSecondary(text,decisive?top.type:''),staff,student};
}

function subtype(type,text){
 if(type==='برنامج / فعالية')return has(text,'مسابقه')?'مسابقة':has(text,'مبادره')?'مبادرة':has(text,'حمله')?'حملة':has(text,'فعاليه','يوم عالمي','اليوم العالمي','تفعيل','احتفاء')?'فعالية':has(text,'نشاط')?'نشاط':'برنامج';
 if(type==='اجتماع / متابعة إدارية')return has(text,'حل مشكله','معالجه مشكله')?'اجتماع حل مشكلة':has(text,'تخطيط','خطه قادمه')?'اجتماع تخطيط':has(text,'نتائج','درجات')?'اجتماع مراجعة نتائج':'اجتماع متابعة';
 if(type==='تحليل نتائج')return has(text,'متابعه تقدم')?'متابعة تقدم':'تحليل نتائج';
 if(type==='خطة')return has(text,'علاجي','علاجيه')?'خطة علاجية':has(text,'اثرائي','اثرائيه','متفوق')?'خطة إثرائية':has(text,'تطوير مهني','نمو مهني')?'خطة تطوير مهني':has(text,'تحسين')?'خطة تحسين':has(text,'متابعه')?'خطة متابعة':'خطة تنفيذية';
 if(type==='إجراء متابعة')return has(text,'غياب')?'متابعة غياب':has(text,'تاخر','تأخر')?'متابعة تأخر':has(text,'انضباط','مواظبه')?'متابعة انضباط':'متابعة حضور';
 if(type==='تطوير مهني')return has(text,'مجتمع تعلم','مجتمع مهني')?'مجتمع تعلم مهني':has(text,'ورشه')?'ورشة':has(text,'دوره','تدريب','برنامج تدريبي')?'تدريب':'لقاء تبادل خبرات';
 return'';
}

export function understand84(raw){return scoreSemantic(raw)}

export function analyze(raw,entryIntent='smart'){
 const s=base.analyze(raw,entryIntent),u=scoreSemantic(raw);s.metadata=s.metadata||{};s.metadata.understanding84=u;s.metadata.secondaryEvents84=u.secondary;
 if(u.primary){base.setType(s,u.primary);const st=subtype(u.primary,u.text);if(st)base.setSubtype(s,st);s.classification.detected=u.primary;s.classification.confidence=u.confidence;s.classification.conflict=false;s.classification.autoDecision='semantic84';s.classification.ranked84=u.ranked.slice(0,3);}
 else{s.classification.type='';s.classification.subtype='';s.classification.domain='';s.classification.confidence=u.confidence;s.classification.conflict=false;s.classification.autoDecision='uncertain84';s.classification.ranked84=u.ranked.slice(0,3);s.titleSuggestions=[];s.metadata.workTitle='';}
 return s;
}
