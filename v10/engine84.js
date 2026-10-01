import * as base from './engine.js?v=84';
export * from './engine.js?v=84';

const TYPES=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني'];
const clean=s=>String(s||'').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[،,؛;:!?؟.]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const has=(t,...xs)=>xs.some(x=>t.includes(clean(x)));
const occurrences=(text,arr)=>arr.reduce((n,x)=>n+(text.includes(clean(x))?1:0),0);
const firstPos=(text,arr)=>{let p=Infinity;for(const x of arr){const i=text.indexOf(clean(x));if(i>=0&&i<p)p=i}return p};

const DIALECT={
 exec:['نفذت','نفذنا','نفذ','سويت','سوينا','سوى','عملت','عملنا','سوينا لهم','اقمت','اقمنا','نظمت','نظمنا','فعلت','فعلنا','جهزت','جهزنا','طبقنا','طبقت'],
 meet:['عقدت','عقدنا','اجتمعت','اجتمعنا','جلسنا','جلست','تقابلنا','سويت اجتماع','سوينا اجتماع','كان عندنا اجتماع'],
 analyze:['حللت','حللنا','حللت اختبار','حللنا اختبار','حللت الاختبار','حللنا الاختبار','حللت النتيجه','حللت النتائج','حللت نتايج','حللنا نتايج','سويت تحليل','سوينا تحليل','سويت تحليل نتيجه','سويت تحليل نتائج','سويت تحليل نتايج','عملت تحليل','عملنا تحليل','عملت تحليل نتيجه','عملنا تحليل نتائج','شفت النتائج','شفنا النتائج','شفت نتايج','شفنا نتايج','شفت درجات','شفنا درجات','شفت الدرجات','شفنا الدرجات','راجعت النتيجه','راجعت النتائج','راجعنا النتائج','راجعت نتايج','راجعنا نتايج','راجعت درجات','راجعنا درجات','قريت النتيجه','قريت النتائج','قرينا النتائج','شيكت على النتائج','شيكت على النتايج','طلعت النتيجه','طلعت النتائج','طلعت نتايج','حللنا بيانات','قارنا نتائج','قارنا نتايج','قارنّا نتائج'],
 plan:['اعددت','اعددنا','سويت خطه','سوينا خطه','حطيت خطه','حطينا خطه','جهزت خطه','جهزنا خطه','بنيت خطه','بنينا خطه','رتبت خطه','رتبنا خطه'],
 follow:['تابعت','تابعنا','شيكت','شيكنا','رصدت','رصدنا','شفت مين','شفنا مين','قمت بمتابعه','تمت متابعه','سوينا متابعه','سويت متابعه','متابعه اسبوعيه','متابعه يوميه','مشينا على','راقبت','راقبنا'],
 pd:['حضرت','حضرنا','اخذت دوره','اخذنا دوره','دخلت ورشه','دخلنا ورشه','قدمت ورشه','قدمنا ورشه','نفذت ورشه','نفذنا ورشه','سويت تدريب للمعلمين','سوينا تدريب للمعلمين','لقاء مهني','برنامج نمو مهني','مجتمع تعلم مهني']
};

const ENTITIES={
 program:['برنامج','فعاليه','نشاط','مبادره','مسابقه','حمله','يوم عالمي','اليوم العالمي','اسبوع','احتفاء','تفعيل مناسبه','يوم اللغه العربيه','يوم الاعاقه','يوم التاسيس','اليوم الوطني'],
 meeting:['اجتماع','محضر','لقاء اداري','لجنه','اجتماع مع'],
 analysis:['تحليل نتيجه','تحليل النتيجه','تحليل نتائج','تحليل نتايج','تحليل للنتائج','نتيجه الاختبار','نتائج الاختبار','نتايج الاختبار','درجات الطلاب','نتائج الطلاب','نتايج الطلاب','النتيجه','النتائج','النتايج','الدرجات','اختبار تشخيصي','اختبار فتره','بيانات تحصيليه','تصنيف الطلاب','تصنيف مستويات الطلاب'],
 plan:['خطه','خطة علاجية','خطه علاجيه','خطة علاجيه','خطة إثرائية','خطه اثرائيه','خطة اثرائيه','خطة تحسين','خطة تنفيذية'],
 follow:['غياب','تاخر','تأخر','حضور','انضباط','مواظبه','حالات','تكليفات','متابعه تنفيذ','الرصد','الحضور والانصراف'],
 pd:['تطوير مهني','نمو مهني','برنامج تدريبي','دوره','ورشه','مجتمع تعلم مهني','مجتمع مهني','تبادل خبرات','احتياج تدريبي']
};

const ACTIONS={
 'اجتماع / متابعة إدارية':DIALECT.meet,
 'تحليل نتائج':DIALECT.analyze,
 'خطة':DIALECT.plan,
 'إجراء متابعة':DIALECT.follow,
 'تطوير مهني':DIALECT.pd
};
const ENTITY_BY_TYPE={
 'برنامج / فعالية':ENTITIES.program,
 'اجتماع / متابعة إدارية':ENTITIES.meeting,
 'تحليل نتائج':ENTITIES.analysis,
 'خطة':ENTITIES.plan,
 'إجراء متابعة':ENTITIES.follow,
 'تطوير مهني':ENTITIES.pd
};

function detectSecondary(text,primary){const out=[];const push=(type,label)=>{if(type!==primary&&!out.some(x=>x.type===type))out.push({type,label})};
 if(occurrences(text,ENTITIES.analysis))push('تحليل نتائج','تحليل أو مراجعة نتائج');
 if(occurrences(text,ENTITIES.plan))push('خطة','خطة أو إجراء مخطط');
 if(occurrences(text,ENTITIES.program))push('برنامج / فعالية','برنامج أو فعالية');
 if(occurrences(text,ENTITIES.follow))push('إجراء متابعة','متابعة أو رصد');
 if(occurrences(text,ENTITIES.meeting))push('اجتماع / متابعة إدارية','اجتماع أو قرار إداري');
 if(occurrences(text,ENTITIES.pd))push('تطوير مهني','نشاط تطوير مهني');
 return out.slice(0,4)}

function scoreSemantic(raw){
 const text=clean(raw),scores={};TYPES.forEach(t=>scores[t]={score:0,reasons:[]});
 const add=(type,v,why)=>{scores[type].score+=v;if(why)scores[type].reasons.push(why)};
 const student=has(text,'طلاب','طالب','طالبات','الطلاب','الطالبات');
 const staff=has(text,'معلمين','معلمون','معلمات','المعلمين','المعلمات','منسوبي المدرسه','الكادر','هيئه تعليميه','الهيئه التعليميه','الزملاء');

 for(const type of TYPES){const n=occurrences(text,ENTITY_BY_TYPE[type]);if(n)add(type,Math.min(16,n*5),`ظهرت ${n} قرينة موضوعية مرتبطة بالعائلة`)}
 for(const [type,arr] of Object.entries(ACTIONS)){const n=occurrences(text,arr);if(n){add(type,Math.min(18,n*8),`ظهر فعل رئيسي مرتبط بالعائلة`);if(occurrences(text,ENTITY_BY_TYPE[type]))add(type,10,'اجتمع الفعل مع كيان من العائلة نفسها')}}

 if(has(text,'صنفت الطلاب','صنف الطلاب','تصنيف الطلاب','تصنيف مستويات الطلاب'))add('تحليل نتائج',18,'طلب تصنيف الطلاب مرتبط مباشرة بقراءة النتائج');
 if(has(text,'خطه علاجيه','خطة علاجية','خطة علاجيه'))add('خطة',18,'خطة علاجية صريحة');
 if(has(text,'خطه اثرائيه','خطة إثرائية','خطة اثرائيه'))add('خطة',18,'خطة إثرائية صريحة');

 // لا نعطي «سويت/سوينا» وحدهما وزن برنامج؛ يلزم وجود كيان برنامج/فعالية فعلي.
 if(occurrences(text,ENTITIES.program)&&occurrences(text,DIALECT.exec))add('برنامج / فعالية',12,'فعل تنفيذ مع برنامج/فعالية أو نشاط');
 if(has(text,'اليوم العالمي','يوم عالمي','اليوم الوطني','يوم التاسيس','اسبوع التوعيه','تفعيل مناسبه','احتفاء'))add('برنامج / فعالية',12,'مناسبة توعوية أو وطنية');

 // التدريب العملي للطلاب طريقة تنفيذ، لا تطوير مهني.
 if(student&&has(text,'تدريب عملي','دربت الطلاب','تدريب الطلاب')){add('برنامج / فعالية',12,'التدريب موجه للطلاب ضمن تنفيذ تربوي');scores['تطوير مهني'].score-=8}

 // السياق المهني للمعلمين يقوّي التطوير المهني.
 if(staff&&has(text,'دوره','ورشه','تدريب','تطوير مهني','مجتمع تعلم','نمو مهني','برنامج تدريبي','تبادل خبرات'))add('تطوير مهني',14,'السياق مهني وموجه للمعلمين أو المنسوبين');
 if(has(text,'مجتمع تعلم مهني','مجتمع مهني'))add('تطوير مهني',14,'مجتمع تعلم مهني صريح');
 if(staff&&has(text,'برنامج تدريبي')){add('تطوير مهني',16,'برنامج تدريبي مهني صريح');scores['برنامج / فعالية'].score-=8}

 // أولوية الحدث الرئيسي في الجمل المركبة.
 const pos={};for(const [type,arr] of Object.entries(ACTIONS))pos[type]=firstPos(text,arr);
 const finite=Object.entries(pos).filter(([,p])=>Number.isFinite(p)).sort((a,b)=>a[1]-b[1]);
 if(finite.length){add(finite[0][0],8,'هذا أول فعل متخصص في وصف الواقعة');if(finite.length>1&&finite[0][1]<finite[1][1])add(finite[0][0],4,'سبق زمنيًا الأحداث الثانوية')}
 if(Number.isFinite(pos['تحليل نتائج'])&&Number.isFinite(pos['خطة'])&&pos['تحليل نتائج']<pos['خطة'])add('تحليل نتائج',8,'التحليل سبق الخطة؛ الخطة نتيجة لاحقة');
 if(Number.isFinite(pos['اجتماع / متابعة إدارية'])&&has(text,'نتائج','درجات','خطه','غياب','تكليفات','مسؤوليات'))add('اجتماع / متابعة إدارية',8,'الاجتماع هو الإطار الرئيسي والموضوعات المذكورة داخله ثانوية');
 if(has(text,'غياب','تاخر','تأخر','انضباط','مواظبه')&&has(text,'كلمت اولياء','كلمنا اولياء','تواصلت مع','ولي الامر'))add('إجراء متابعة',8,'رصد حالة ثم إجراء متابعة واضح');

 const ranked=Object.entries(scores).map(([type,v])=>({type,score:Math.max(0,v.score),reasons:v.reasons})).sort((a,b)=>b.score-a.score);
 const top=ranked[0],second=ranked[1],margin=(top?.score||0)-(second?.score||0),sc=top?.score||0;
 let confidence=0;if(sc>=25&&margin>=8)confidence=95;else if(sc>=20&&margin>=6)confidence=90;else if(sc>=16&&margin>=5)confidence=85;else if(sc>=12&&margin>=4)confidence=78;else if(sc>=10&&margin>=4)confidence=70;
 const decisive=confidence>=70;
 return{text,ranked,primary:decisive?top.type:'',confidence,margin,secondary:detectSecondary(text,decisive?top.type:''),staff,student};
}

function subtype(type,text){
 if(type==='برنامج / فعالية')return has(text,'مسابقه')?'مسابقة':has(text,'مبادره')?'مبادرة':has(text,'حمله')?'حملة':has(text,'فعاليه','يوم عالمي','اليوم العالمي','تفعيل','احتفاء')?'فعالية':has(text,'نشاط')?'نشاط':'برنامج';
 if(type==='اجتماع / متابعة إدارية')return has(text,'حل مشكله','معالجه مشكله')?'اجتماع حل مشكلة':has(text,'تخطيط','خطه قادمه')?'اجتماع تخطيط':has(text,'نتائج','درجات')?'اجتماع مراجعة نتائج':'اجتماع متابعة';
 if(type==='تحليل نتائج')return has(text,'متابعه تقدم')?'متابعة تقدم':'تحليل نتائج';
 if(type==='خطة')return has(text,'علاجي','علاجيه','علاجية')?'خطة علاجية':has(text,'اثرائي','اثرائيه','إثرائية','اثراء','إثراء','متفوق')?'خطة إثرائية':has(text,'تطوير مهني','نمو مهني')?'خطة تطوير مهني':has(text,'تحسين')?'خطة تحسين':has(text,'متابعه')?'خطة متابعة':'خطة تنفيذية';
 if(type==='إجراء متابعة')return has(text,'غياب')?'متابعة غياب':has(text,'تاخر','تأخر')?'متابعة تأخر':has(text,'انضباط','مواظبه')?'متابعة انضباط':'متابعة حضور';
 if(type==='تطوير مهني')return has(text,'مجتمع تعلم','مجتمع مهني')?'مجتمع تعلم مهني':has(text,'ورشه')?'ورشة':has(text,'دوره','تدريب','برنامج تدريبي')?'تدريب':'لقاء تبادل خبرات';
 return'';
}

export function understand84(raw){return scoreSemantic(raw)}
export function analyze(raw,entryIntent='smart'){
 const s=base.analyze(raw,entryIntent),u=scoreSemantic(raw);s.metadata=s.metadata||{};s.metadata.understanding84=u;s.metadata.secondaryEvents84=u.secondary;
 if(entryIntent==='analysis'||entryIntent==='classification'){base.setType(s,'تحليل نتائج');base.setSubtype(s,'تحليل نتائج');s.classification.detected='تحليل نتائج';s.classification.confidence=100;s.classification.conflict=false;s.classification.autoDecision='direct-entry84';s.classification.ranked84=[{type:'تحليل نتائج',score:100}];s.metadata.directEntry134=entryIntent;return s}
 if(entryIntent==='remedial'||entryIntent==='enrichment'){base.setType(s,'خطة');base.setSubtype(s,entryIntent==='remedial'?'خطة علاجية':'خطة إثرائية');s.classification.detected='خطة';s.classification.confidence=100;s.classification.conflict=false;s.classification.autoDecision='direct-entry84';s.classification.ranked84=[{type:'خطة',score:100}];s.metadata.directEntry134=entryIntent;return s}
 if(u.primary){base.setType(s,u.primary);const st=subtype(u.primary,u.text);if(st)base.setSubtype(s,st);s.classification.detected=u.primary;s.classification.confidence=u.confidence;s.classification.conflict=false;s.classification.autoDecision='semantic84';s.classification.ranked84=u.ranked.slice(0,3)}
 else{s.classification.type='';s.classification.subtype='';s.classification.domain='';s.classification.confidence=u.confidence;s.classification.conflict=false;s.classification.autoDecision='uncertain84';s.classification.ranked84=u.ranked.slice(0,3);s.titleSuggestions=[];s.metadata.workTitle=''}
 return s;
}
