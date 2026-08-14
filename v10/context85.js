import {norm,uniq} from './engine.js?v=85';

const clean=s=>String(s||'').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim().toLowerCase();
const has=(t,...xs)=>xs.some(x=>t.includes(clean(x)));
const add=(a,v)=>{if(v&&!a.includes(v))a.push(v)};

const GRADE_WORDS={اول:'الأول',الأول:'الأول',ثاني:'الثاني',الثاني:'الثاني',ثالث:'الثالث',الثالث:'الثالث',رابع:'الرابع',الرابع:'الرابع',خامس:'الخامس',الخامس:'الخامس',سادس:'السادس',السادس:'السادس'};
const STAGE_ADJ={ابتدائي:'الابتدائي',متوسط:'المتوسط',ثانوي:'الثانوي'};
function studentScope(raw){
 const n=clean(raw),grades=[];let stage='';
 const re=/(اول|الأول|ثاني|الثاني|ثالث|الثالث|رابع|الرابع|خامس|الخامس|سادس|السادس)\s*(ابتدائي|متوسط|ثانوي)/g;let m;
 while((m=re.exec(n))){stage=stage||m[2];add(grades,`${GRADE_WORDS[m[1]]} ${STAGE_ADJ[m[2]]}`)}
 if(!stage){if(has(n,'ابتدائي','الابتدائي'))stage='ابتدائي';else if(has(n,'متوسط','المتوسط'))stage='متوسط';else if(has(n,'ثانوي','الثانوي'))stage='ثانوي'}
 return{stage,grades};
}
function audiences(raw){const n=clean(raw),a=[];if(has(n,'طلاب','طالب','الطلاب','الطالبات','طالبات'))add(a,'الطلاب');if(has(n,'معلمين','معلمون','معلمات','المعلمين','المعلمات','معلم'))add(a,'المعلمون');if(has(n,'اولياء الامور','ولي الامر','الاسر','الأسر','اهالي'))add(a,'أولياء الأمور');if(has(n,'اداريين','اداريون','الاداريين','الإداريين','اداره المدرسه'))add(a,'الإداريون');return a}
function topic(raw){const n=clean(raw);
 if(has(n,'قراءه','قراءة','فهم قرائي','قرائي'))return'تنمية مهارات القراءة والفهم القرائي';
 if(has(n,'خط عربي','تحسين الخط','الخط والكتابه','الخط والكتابة'))return'تحسين الخط والمهارات الكتابية';
 if(has(n,'امن وسلامه','الأمن والسلامة','اخلاء','إخلاء','طوارئ','حالات طارئه'))return'تعزيز الأمن والسلامة';
 if(has(n,'تقنيه','تقنية','منصه مدرستي','منصة مدرستي','رقمي','الذكاء الاصطناعي','ذكاء اصطناعي'))return has(n,'تدريس','حصه','حصة','درس')?'توظيف التقنية في التدريس':'توظيف التقنية في التعليم';
 if(has(n,'غياب'))return'متابعة الغياب';if(has(n,'تاخر','تأخر'))return'متابعة التأخر';
 if(has(n,'انضباط','مواظبه','مواظبة','سلوك'))return'تعزيز السلوك والانضباط';
 if(has(n,'لغه عربيه','لغة عربية','اليوم العالمي للغه العربيه','اليوم العالمي للغة العربية'))return'تعزيز اللغة العربية';
 if(has(n,'يوم التاسيس','يوم التأسيس','اليوم الوطني','وطني','هويه وطنيه','هوية وطنية'))return'تعزيز القيم والهوية الوطنية';
 if(has(n,'نتائج','درجات','تحصيل'))return'تحسين التحصيل الدراسي';
 if(has(n,'تطوير مهني','استراتيجيات تدريس','استراتيجيات التدريس'))return'تطوير الممارسات المهنية';
 return'';
}
function occasion(raw){const n=clean(raw);const M=[['اليوم العالمي للغة العربية',['اليوم العالمي للغه العربيه','يوم اللغه العربيه']],['اليوم الدولي للأشخاص ذوي الإعاقة',['اليوم العالمي للاعاقه','يوم الاعاقه','ذوي الاعاقه']],['يوم التأسيس',['يوم التاسيس']],['اليوم الوطني',['اليوم الوطني']],['اليوم العالمي للمعلم',['يوم المعلم','اليوم العالمي للمعلم']],['اليوم العالمي للتطوع',['يوم التطوع','اليوم العالمي للتطوع']]];for(const [name,ks] of M)if(ks.some(k=>n.includes(clean(k))))return name;return''}
function methods(raw){const n=clean(raw),a=[];if(has(n,'عرض','شرح','ناقشنا','مناقشه','مناقشة'))add(a,'عرض ومناقشة');if(has(n,'تطبيق عملي','تدريب عملي','طبقوا','تجربه عمليه','تجربة عملية'))add(a,'تطبيق عملي');if(has(n,'جماعي','مجموعات','انشطه جماعيه','أنشطة جماعية'))add(a,'أنشطة جماعية');if(has(n,'فردي','انشطه فرديه','أنشطة فردية'))add(a,'أنشطة فردية');if(has(n,'مسابقه','تحدي','تحدٍ'))add(a,'مسابقة أو تحدٍ');if(has(n,'اركان','أركان','محطات'))add(a,'أركان ومحطات');if(has(n,'مدرستي','منصه','منصة','تقنيه','تقنية','تطبيق رقمي'))add(a,'توظيف التقنية والمنصات الرقمية');if(has(n,'منتجات','انتاج اعمال','إنتاج أعمال'))add(a,'إنتاج أعمال أو منتجات');return a.slice(0,3)}
function reason(raw){const n=clean(raw);if(has(n,'ضعف','متعثر','احتياج','بحاجه','بحاجة'))return has(n,'مهاره','مهارة','قراءه','قراءة')?'تنمية مهارة محددة':'معالجة احتياج لدى المستفيدين';if(has(n,'مناسبه','مناسبة','اليوم العالمي','يوم التاسيس','اليوم الوطني','احتفاء','فعلنا يوم'))return'تفعيل مناسبة تربوية أو وطنية';if(has(n,'خطه المدرسه','خطة المدرسة','الخطة التشغيليه','الخطة التشغيلية'))return'دعم أحد أهداف خطة المدرسة';if(has(n,'مشاركه','مشاركة','دافعيه','دافعية'))return'رفع المشاركة والدافعية';return''}
function participation(raw){const n=clean(raw),a=[];if(has(n,'تفاعل كبير','تفاعل مرتفع','تفاعل ممتاز'))add(a,'تفاعل مرتفع من المستفيدين');if(has(n,'تفاوت','مستويات مختلفه','مستويات مختلفة'))add(a,'تفاوت في مستويات المشاركة');if(has(n,'احتاجوا دعم','يحتاجون دعم','حاجه بعض','حاجة بعض'))add(a,'حاجة بعض المستفيدين إلى دعم إضافي');if(has(n,'تعاون','تعاونوا'))add(a,'تعاون واضح بين المستفيدين');if(has(n,'انتجوا','منتجات','اعمال الطلاب','أعمال الطلاب'))add(a,'إنتاج أعمال أو منتجات');return a.slice(0,3)}
function evidence(raw){const n=clean(raw),a=[];if(has(n,'صور','صورنا','صورت','تصوير'))add(a,'صور التنفيذ');if(has(n,'كشف حضور','سجل حضور','التوقيع'))add(a,'كشف أو سجل المستفيدين');if(has(n,'محضر'))add(a,'محضر الاجتماع');if(has(n,'شهاده','شهادة'))add(a,'الشهادة أو إثبات المشاركة');if(has(n,'رابط','باركود','qr'))add(a,'رابط أو رمز QR داعم');if(has(n,'منتج','اعمال الطلاب','أعمال الطلاب'))add(a,'نماذج من الأعمال أو المنتجات إن وجدت');return a}
function place(raw){const n=clean(raw);if(has(n,'منصه مدرستي','منصة مدرستي','عن بعد','عن بُعد'))return{mode:'عن بُعد',choice:has(n,'مدرستي')?'منصة مدرستي':''};if(has(n,'خارج المدرسه','خارج المدرسة','زياره خارجيه','زيارة خارجية'))return{mode:'خارج المدرسة',choice:''};if(has(n,'داخل المدرسه','داخل المدرسة','الفصل','الصف','المسرح','الساحه','الساحة','المعمل','المختبر','قاعة التدريب'))return{mode:'داخل المدرسة',choice:has(n,'الفصل','الصف')?'فصل دراسي':has(n,'المسرح')?'المسرح المدرسي':has(n,'الساحه','الساحة')?'الساحة أو الملعب':has(n,'المعمل','المختبر')?'معمل أو مختبر':has(n,'قاعة التدريب')?'قاعة التدريب':''};return{mode:'',choice:''}}
function analysisFacts(raw){const n=clean(raw),f={};if(has(n,'تشخيصي','اختبار تشخيصي'))f.basis='اختبار تشخيصي';else if(has(n,'اختبار فتره','اختبار الفترة','فتره اولى','فترة أولى','فترة ثانية'))f.basis='اختبار فترة';else if(has(n,'اختبار نهائي','النهائي'))f.basis='اختبار نهائي';else if(has(n,'تقويم تكويني'))f.basis='تقويم تكويني';else if(has(n,'نافس','اختبار وطني'))f.basis='اختبار وطني عند انطباقه';if(has(n,'ضعف','منخفضه الاتقان','منخفضة الإتقان'))f.finding='مهارات منخفضة الإتقان';else if(has(n,'تفاوت','مستويات مختلفه','مستويات مختلفة'))f.finding='تفاوت واضح بين مستويات الطلاب';else if(has(n,'متعثر','متعثرين'))f.finding='وجود طلاب متعثرين';if(has(n,'حددت الطلاب','حددنا الطلاب','المحتاجين للدعم','المتعثرين'))f.action='تحديد الطلاب المتعثرين';if(has(n,'خطه علاجيه','خطة علاجية'))f.action='بناء خطة علاجية';if(has(n,'اعاده تدريس','إعادة تدريس'))f.action='إعادة تدريس المهارات المستهدفة';if(has(n,'اختبار قصير','قياس لاحق'))f.follow='اختبار قصير لاحق';return f}
function meetingFacts(raw){const n=clean(raw),f={};if(has(n,'توزيع المهام','وزعنا المهام','تكليف'))f.purpose='توزيع المهام والمسؤوليات';else if(has(n,'متابعه التنفيذ','متابعة التنفيذ','مستوى الانجاز','مستوى الإنجاز'))f.purpose='مراجعة مستوى الإنجاز';else if(has(n,'نتائج','درجات'))f.purpose='دراسة نتائج أو بيانات';if(has(n,'تحديات','معوقات'))f.work='مناقشة التحديات والمعوقات';else if(has(n,'النتائج','البيانات'))f.work='استعراض البيانات والنتائج';if(has(n,'تكليف','وزعنا','مسؤول'))f.product='تكليف مسؤول أو فريق';if(has(n,'موعد','اجتماع لاحق'))f.follow='اجتماع متابعة لاحق';return f}
function planFacts(raw){const n=clean(raw),f={};if(has(n,'نتائج','اختبار','درجات'))f.basis='نتائج تقويم أو اختبارات';else if(has(n,'احتياج','ضعف'))f.basis='احتياج محدد لدى الفئة';else if(has(n,'تقويم ذاتي'))f.basis='نتائج تقويم ذاتي';if(has(n,'تحسين','رفع مستوى'))f.goal='تحسين مستوى الأداء';if(has(n,'علاجي','علاج'))f.goal='معالجة فجوة محددة';return f}
function pdFacts(raw){const n=clean(raw),f={};f.role=has(n,'حضرت','اخذت دوره','أخذت دورة','دخلت ورشه','دخلت ورشة')?'received':has(n,'قدمت','نفذت ورشه','نفذت ورشة','دربت المعلمين','تدريب للمعلمين')?'delivered':'';return f}

export function extractContext85(raw,type=''){
 const scope=studentScope(raw),p=place(raw),ctx={topic:topic(raw),occasion:occasion(raw),audiences:audiences(raw),stage:scope.stage,grades:scope.grades,placeMode:p.mode,placeChoice:p.choice,methods:methods(raw),reason:reason(raw),participation:participation(raw),evidence:evidence(raw),familyDetails:{},pdRole:''};
 if(type==='برنامج / فعالية'){if(ctx.reason)ctx.familyDetails.reason=ctx.reason;if(ctx.methods.length)ctx.familyDetails.method=ctx.methods.join('|||');if(ctx.participation.length)ctx.familyDetails.participation=ctx.participation.join('|||')}
 if(type==='تحليل نتائج')Object.assign(ctx.familyDetails,analysisFacts(raw));
 if(type==='اجتماع / متابعة إدارية')Object.assign(ctx.familyDetails,meetingFacts(raw));
 if(type==='خطة')Object.assign(ctx.familyDetails,planFacts(raw));
 if(type==='تطوير مهني'){const pd=pdFacts(raw);ctx.pdRole=pd.role}
 return ctx;
}

export function applyContext85(state){const x=extractContext85(state.raw||'',state.classification?.type||'');state.metadata=state.metadata||{};state.metadata.context85=x;state.metadata.pdRole85=x.pdRole||'';if(x.topic)state.topic=x.topic;if(x.stage)state.stage=x.stage;if(x.grades.length)state.grades=uniq([...(state.grades||[]),...x.grades]);state.suggestedAudiences=uniq([...(state.suggestedAudiences||[]),...x.audiences]);if(x.placeMode){state.metadata.placeMode=x.placeMode;state.metadata.placeChoice=x.placeChoice||state.metadata.placeChoice||''}state.metadata.familyDetails={...(state.metadata.familyDetails||{}),...x.familyDetails};if(x.evidence.length)state.metadata.contextEvidence85=x.evidence;return state}
