import * as core from './engine84.js?v=100';
const n=s=>String(s||'').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[،,؛;:!?؟.]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const has=(t,...xs)=>xs.some(x=>t.includes(n(x)));
const any=(t,arr)=>arr.some(x=>t.includes(n(x)));
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
const SUBJECTS=[
 {id:'quran',name:'القرآن الكريم والدراسات الإسلامية',icon:'🕌',words:['قرآن','القران','سورة','سوره','آية','ايه','آيات','حفظ','تلاوة','تلاوه','تجويد','تفسير','حديث','فقه','توحيد','عقيدة','عقيده','دراسات اسلامية','اسلاميه']},
 {id:'arabic',name:'اللغة العربية',icon:'📖',words:['لغة عربية','اللغه العربيه','لغتي','قراءة','قراءه','فهم قرائي','خط','إملاء','املاء','نحو','تعبير','كتابة','كتابه']},
 {id:'math',name:'الرياضيات',icon:'➗',words:['رياضيات','حساب','جمع','طرح','ضرب','قسمة','قسمه','كسور','معادلات','هندسة','هندسه','نسبة','نسبه','مسائل لفظية','مسائل لفظيه']},
 {id:'science',name:'العلوم',icon:'🔬',words:['علوم','تجربة علمية','تجربه علميه','مختبر','استقصاء','كيمياء','فيزياء','أحياء','احياء','مادة','الماده','حالات المادة']},
 {id:'english',name:'اللغة الإنجليزية',icon:'🇬🇧',words:['انجليزي','إنجليزي','english','vocabulary','speaking','listening','reading','writing','مفردات انجليزي','محادثة انجليزي']},
 {id:'digital',name:'المهارات الرقمية',icon:'💻',words:['مهارات رقمية','مهارات رقميه','حاسب','برمجة','برمجه','ذكاء اصطناعي','أمن سيبراني','امن سيبراني','تقنية رقمية','تقنيه رقميه']},
 {id:'social',name:'الدراسات الاجتماعية',icon:'🗺️',words:['دراسات اجتماعية','دراسات اجتماعيه','تاريخ','جغرافيا','مواطنة','مواطنه']}
];
const SCHOOL_DOMAINS=[
 {id:'safety',name:'الأمن والسلامة',words:['امن وسلامة','أمن وسلامة','اخلاء','إخلاء','حريق','طوارئ','سلامة']},
 {id:'values',name:'القيم والسلوك',words:['قيمة','قيم','سلوك','انضباط','مسؤولية','احترام','تعاون']},
 {id:'national',name:'الهوية الوطنية',words:['اليوم الوطني','يوم التأسيس','يوم التاسيس','هوية وطنية','الهوية الوطنية']},
 {id:'student',name:'التوجيه الطلابي',words:['توجيه طلابي','ارشاد','إرشاد','غياب','تأخر','تاخر','مواظبة','مواظبه']}
];
function detectSubject(t){let best=null,score=0;for(const s of SUBJECTS){const hits=s.words.filter(w=>t.includes(n(w))).length;if(hits>score){best=s;score=hits}}return best?{...best,confidence:Math.min(99,70+score*10)}:null}
function detectSchoolDomain(t){let best=null,score=0;for(const s of SCHOOL_DOMAINS){const hits=s.words.filter(w=>t.includes(n(w))).length;if(hits>score){best=s;score=hits}}return best?{...best,confidence:Math.min(98,70+score*10)}:null}
function detectFamily(t){const explicit=[
 ['برنامج / فعالية',['برنامج','فعالية','فعاليه','نشاط','مبادرة','مبادره','مسابقة','مسابقه','حملة','حمله']],
 ['اجتماع / متابعة إدارية',['اجتماع','محضر','لجنة','لجنه']],
 ['تحليل نتائج',['تحليل نتائج','حللت النتائج','حللنا النتائج','درجات الطلاب','نتائج الطلاب']],
 ['خطة',['خطة','خطه']],
 ['إجراء متابعة',['متابعة','متابعه','رصدت','تابعت']],
 ['تطوير مهني',['تطوير مهني','نمو مهني','دورة','دوره','ورشة','ورشه','مجتمع تعلم مهني','تبادل خبرات']]
 ];
 for(const [type,arr] of explicit){for(const w of arr){if(t.includes(n(w))){if(type==='تطوير مهني'&&has(t,'طلاب','طالب','طالبات')&&has(t,'تدريب عملي'))continue;return{type,confidence:96,reason:`ذكر المستخدم ${w} صراحة`}}}
 }
 return null
}
function subtype(type,t){if(type==='برنامج / فعالية')return has(t,'مسابقه','مسابقة')?'مسابقة':has(t,'مبادره','مبادرة')?'مبادرة':has(t,'حمله','حملة')?'حملة':has(t,'فعاليه','فعالية')?'فعالية':has(t,'نشاط')?'نشاط':'برنامج';return''}
function topic(t,subject,domain){if(subject?.id==='quran'){if(has(t,'حفظ'))return'حفظ القرآن الكريم';if(has(t,'تلاوه','تلاوة'))return'تلاوة القرآن الكريم';if(has(t,'تجويد'))return'أحكام التجويد';if(has(t,'تفسير'))return'فهم وتفسير القرآن الكريم';return'القرآن الكريم'}
 if(subject?.id==='arabic'){if(has(t,'خط'))return'الخط والكتابة';if(has(t,'قراءه','قراءة','فهم قرائي'))return'القراءة والفهم القرائي';if(has(t,'املاء','إملاء'))return'الإملاء';return'مهارات اللغة العربية'}
 if(subject?.id==='math'){if(has(t,'جدول الضرب','الضرب'))return'جدول الضرب';if(has(t,'كسور'))return'الكسور';if(has(t,'معادلات'))return'المعادلات';return'المهارات الرياضية'}
 if(subject?.id==='science'){if(has(t,'تجرب','مختبر','استقصاء'))return'التجريب والاستقصاء العلمي';return'المفاهيم العلمية'}
 if(subject?.id==='english'){if(has(t,'vocabulary','مفردات'))return'المفردات';if(has(t,'speaking','تحدث','محادثه','محادثة'))return'التحدث';if(has(t,'listening','استماع'))return'الاستماع';return'مهارات اللغة الإنجليزية'}
 return domain?.name||''}
function audiences(t){const a=[];if(has(t,'طلاب','طالب','طالبات','الطلاب','الطالبات'))a.push('الطلاب');if(has(t,'معلمين','معلمون','معلمات','المعلمين','الزملاء','منسوبي'))a.push('المعلمون');if(has(t,'اولياء','أولياء','الاسر','الأسر','الاسره','الأسرة'))a.push('أولياء الأمور');return a}
function stageGrades(t){let stage='';if(has(t,'ابتدائي','الابتدائي'))stage='ابتدائي';else if(has(t,'متوسط','المتوسط'))stage='متوسط';else if(has(t,'ثانوي','الثانوي'))stage='ثانوي';let grades=[];for(const g of ['الأول','الاول','الثاني','الثالث','الرابع','الخامس','السادس'])if(t.includes(n(g)))grades.push(g==='الاول'?'الأول':g);return{stage,grades:uniq(grades)}}
function frame(raw){const t=n(raw),family=detectFamily(t),subject=detectSubject(t),schoolDomain=detectSchoolDomain(t),sg=stageGrades(t);return{raw,normalized:t,family,subtype:family?subtype(family.type,t):'',subject,schoolDomain,topic:topic(t,subject,schoolDomain),audiences:audiences(t),...sg,ambiguities:[],missing:[]}}
export function analyze100(raw,entryIntent='smart'){let s=core.analyze(raw,entryIntent),f=frame(raw);s.metadata=s.metadata||{};s.metadata.semantic100=f;if(f.family){if(core.setType)core.setType(s,f.family.type);else s.classification={...(s.classification||{}),type:f.family.type};if(f.subtype&&core.setSubtype)core.setSubtype(s,f.subtype)}if(f.topic)s.topic=f.topic;if(f.stage)s.stage=f.stage;if(f.grades?.length)s.grades=f.grades;if(f.audiences?.length)s.suggestedAudiences=uniq([...(s.suggestedAudiences||[]),...f.audiences]);s.metadata.subjectHint100=f.subject?.name||'';s.metadata.subjectConfidence100=f.subject?.confidence||0;s.metadata.schoolDomain100=f.schoolDomain?.name||'';return s}
export function preview100(raw){return frame(raw)}
