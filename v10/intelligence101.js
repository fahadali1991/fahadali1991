import {latinDigits120,finiteNumber120} from './input-normalization120.js';
const norm=s=>latinDigits120(String(s||'')).normalize('NFKC').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[،,؛;:!?؟.()\[\]{}"'«»]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const toks=s=>norm(s).split(' ').filter(Boolean);
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const phrase=(t,p)=>{const a=norm(t),b=norm(p);return new RegExp(`(?:^|\\s)${esc(b).replace(/\\ /g,'\\s+')}(?=$|\\s)`).test(a)};
const any=(t,arr)=>arr.some(x=>phrase(t,x));
const uniq=a=>[...new Set((a||[]).filter(Boolean))];

const SUBJECTS=[
{id:'quran',name:'القرآن الكريم والدراسات الإسلامية',icon:'🕌',keys:['القرآن','القران','سورة','سوره','آية','ايه','آيات','ايات','تلاوة','تلاوه','تجويد','تفسير','حديث','فقه','توحيد','عقيدة','عقيده','دين','الدين','ديني','اسلامية','إسلامية','اسلاميه','إسلاميات','اسلاميات','تربية إسلامية','تربيه اسلاميه','التربية الإسلامية','التربيه الاسلاميه','شرعيات','شرعي','دراسات اسلامية','دراسات إسلامية','قرآن ودراسات إسلامية','القرآن الكريم والدراسات الإسلامية','حفظ القرآن','حفظ القران']},
{id:'arabic',name:'اللغة العربية',icon:'📖',keys:['اللغة العربية','اللغه العربيه','لغة عربية','لغه عربيه','عربي','عربية','عربيه','العربي','لغتي','لغتي الخالدة','لغتي الخالده','فهم قرائي','الفهم القرائي','قراءة','قراءه','إملاء','املاء','نحو','تعبير','خط عربي','تحسين الخط','الخط والكتابة','الخط والكتابه','كتابة','كتابه']},
{id:'math',name:'الرياضيات',icon:'➗',keys:['رياضيات','الرياضيات','جدول الضرب','الضرب','قسمة','قسمه','كسور','الكسور','معادلات','المعادلات','هندسة','هندسه','قياس','مسائل لفظية','مسائل لفظيه']},
{id:'science',name:'العلوم',icon:'🔬',keys:['علوم','العلوم','تجربة علمية','تجربه علميه','تجربة علوم','تجربه علوم','مختبر العلوم','استقصاء علمي','كيمياء','فيزياء','أحياء','احياء','حالات المادة','حالات الماده','انتقال الحرارة','الحراره']},
{id:'english',name:'اللغة الإنجليزية',icon:'🇬🇧',keys:['اللغة الإنجليزية','اللغه الانجليزيه','انجليزي','إنجليزي','english','vocabulary','speaking','listening','reading','writing','محادثة انجليزي','محادثه انجليزي','كلمات انجليزي']},
{id:'digital',name:'المهارات الرقمية',icon:'💻',keys:['المهارات الرقمية','المهارات الرقميه','مهارات رقمية','مهارات رقميه','تقنية رقمية','تقنيه رقميه','برمجة','برمجه','امن سيبراني','أمن سيبراني','ذكاء اصطناعي','مشروع رقمي','الأمان الرقمي','الامان الرقمي']},
{id:'social',name:'الدراسات الاجتماعية',icon:'🗺️',keys:['الدراسات الاجتماعية','الدراسات الاجتماعيه','دراسات اجتماعية','دراسات اجتماعيه','تاريخ','جغرافيا','المواطنة','المواطنه']}
];
const DOMAINS=[
{id:'safety',name:'الأمن والسلامة',keys:['الأمن والسلامة','الامن والسلامه','امن وسلامة','سلامة','سلامه','إخلاء','اخلاء','حريق','طفايات','طفايات الحريق','مخارج الطوارئ','مخارج الطواري','الدفاع المدني']},
{id:'values',name:'القيم والسلوك',keys:['القيم والسلوك','سلوك','انضباط','الانضباط','احترام','مسؤولية','مسؤوليه','تعاون']},
{id:'national',name:'الهوية الوطنية',keys:['الهوية الوطنية','الهويه الوطنيه','اليوم الوطني','يوم التأسيس','يوم التاسيس']},
{id:'activity',name:'النشاط الطلابي',keys:['النشاط الطلابي','نشاط طلابي','بين الفصول','مسابقة ثقافية','مسابقه ثقافيه','تطوعي','تطوعية','تطوعيه']},
{id:'guidance',name:'التوجيه الطلابي',keys:['التوجيه الطلابي','توجيه طلابي','إرشاد','ارشاد','تهيئة الطلاب','تهيئه الطلاب','الطلاب المستجدين','غياب','تأخر','تاخر','مواظبة','مواظبه']},
{id:'gifted',name:'الموهوبون',keys:['موهوب','موهبة','موهبه','الموهوبين','برنامج إثرائي','برنامج اثرائي','إثراء','اثراء']},
{id:'inclusion',name:'الشمول وذوو الإعاقة',keys:['ذوي الإعاقة','ذوي الاعاقه','ذوو الإعاقة','ذوو الاعاقه','تربية خاصة','تربيه خاصه']},
{id:'assessment',name:'التقويم المدرسي',keys:['التقويم الذاتي','خطة تحسين','خطه تحسين']}
];

function detectFamily(t){
 const rules=[
  {type:'شراكة مجتمعية',keys:['شراكة','شراكه','نسقنا مع المركز','بالتعاون مع','مركز صحي','جهة خارجية','جهه خارجيه']},
  {type:'صيانة وتجهيزات',keys:['صيانة','صيانه','صلحنا','إصلاح','اصلاح','تجهيز المختبر','تم تجهيز','تجهيزات']},
  {type:'اجتماع / متابعة إدارية',keys:['اجتماع','اجتمعت','اجتمعنا','عقدت اجتماعا','عقدنا اجتماعا','محضر اجتماع','لجنة','لجنه']},
  {type:'تحليل نتائج',keys:['تحليل نتائج','تحليل نتايج','سويت تحليل نتائج','سويت تحليل نتايج','حللت نتائج','حللت درجات','حللنا نتائج','حللت نتايج','طلعت نتائج','طلعت نتايج','نتائج الاختبار','نتايج الاختبار','ظهر ضعف','قارنت مستوى','قارنتها بالعام السابق']},
  {type:'خطة',keys:['خطة','خطه','أعددت خطة','اعددت خطه','سويت خطة','سويت خطه']},
  {type:'إجراء متابعة',keys:['تابعت','متابعة','متابعه','رصدت','شيكت على','تابعت تقدم','تابعت تنفيذ']},
  {type:'تطوير مهني',keys:['تطوير مهني','نمو مهني','ورشة للمعلمين','ورشه للمعلمين','قدمت ورشة','قدمت ورشه','دورة','دوره','مجتمع تعلم مهني','تبادل خبرات','زيارة لزميلي','زياره لزميلي','شاركت في دورة','شاركت في دوره','لقاء تبادل خبرات']},
  {type:'برنامج / فعالية',keys:['برنامج','فعالية','فعاليه','نشاط','مبادرة','مبادره','مسابقة','مسابقه','حملة','حمله','تحدي','فعلنا','نفذت تجربة','نفذت تجربه','سوينا تجربة','سوينا تجربه','تدريب عملي على الإخلاء','تدريب عملي على الاخلاء']}
 ];
 for(const r of rules){if(any(t,r.keys)){
   if(r.type==='تطوير مهني'&&any(t,['للطلاب','طلاب','طالبات'])&&any(t,['تدريب عملي','تحدي']))continue;
   return {type:r.type,confidence:96};
 }}
 return null;
}
function subtype(f,t){if(f!=='برنامج / فعالية')return'';if(any(t,['مسابقة','مسابقه']))return'مسابقة';if(any(t,['مبادرة','مبادره']))return'مبادرة';if(any(t,['حملة','حمله']))return'حملة';if(any(t,['فعالية','فعاليه']))return'فعالية';if(any(t,['نشاط']))return'نشاط';return'برنامج';}
function detectSubject(t){let best=null,bestScore=0;for(const s of SUBJECTS){let score=0;for(const k of s.keys)if(phrase(t,k))score+=k.includes(' ')?3:1;if(score>bestScore){bestScore=score;best=s}}return best?{...best,confidence:Math.min(99,72+bestScore*5)}:null;}
function detectDomain(t){let best=null,bestScore=0;for(const d of DOMAINS){let score=0;for(const k of d.keys)if(phrase(t,k))score+=k.includes(' ')?3:1;if(score>bestScore){bestScore=score;best=d}}return best?{...best,confidence:Math.min(98,72+bestScore*5)}:null;}
function detectStageGrade(t){
 const x=norm(t),m=x.match(/(?:^|\s|ل|لل)(الاول|اول|الثاني|ثاني|الثالث|ثالث|الرابع|رابع|الخامس|خامس|السادس|سادس)\s+(?:ال)?(ابتدائي|ابتدايي|متوسط|ثانوي)(?=\s|$)/);
 if(!m)return{stage:'',grades:[]};
 const ord={الاول:'الأول',اول:'الأول',الثاني:'الثاني',ثاني:'الثاني',الثالث:'الثالث',ثالث:'الثالث',الرابع:'الرابع',رابع:'الرابع',الخامس:'الخامس',خامس:'الخامس',السادس:'السادس',سادس:'السادس'}[m[1]];
 const stage=m[2].startsWith('ابتدا')?'ابتدائي':m[2];
 return{stage,grades:[ord]};
}
function detectSection(t){const x=norm(t),canon=v=>v==='ا'?'أ':v,explicit=x.match(/(?:شعبه|الشعبه)\s*([ابجدهو]|\d{1,2})(?=\s|$)/);if(explicit)return canon(explicit[1]);const afterGrade=x.match(/(?:ال)?(?:اول|ثاني|ثالث|رابع|خامس|سادس)\s+(?:ال)?(?:ابتدائي|ابتدايي|متوسط|ثانوي)\s+([ابجدهو]|\d{1,2})(?=\s|$)/);return afterGrade?canon(afterGrade[1]):'';}
function detectAudience(t){const a=[];if(any(t,['الطلاب','طلاب','طالبات','للطلاب','العيال','عيالي']))a.push('الطلاب');if(any(t,['المعلمين','معلمين','معلمون','معلمات','لل معلمين','لل معلمات','لزميلي','الزملاء']))a.push('المعلمون');if(any(t,['اولياء الامور','أولياء الأمور','الاسر','الأسر']))a.push('أولياء الأمور');if(any(t,['طالب موهوب','طالبا موهوبا','طالبًا موهوبًا']))a.push('طالب');return uniq(a);}
function detectDuration(t){const x=norm(t);const m=x.match(/(?:مده\s*)?(اسبوعين|أسبوعين|اسبوع|أسبوع|\d+\s*اسابيع|\d+\s*أسابيع|يومين|يوم|\d+\s*ايام|\d+\s*أيام|فصل دراسي|مستمر)/);if(!m)return'';const v=m[1];if(/اسبوعين|أسبوعين/.test(v))return'أسبوعين';if(/اسبوع|أسبوع/.test(v)&&!/\d/.test(v))return'أسبوع';return v;}
function detectCount(t){const x=norm(t),byNoun=x.match(/(\d+)\s*(?:طلاب|طالب|طالبه|طالبات)(?=\s|$)/),byPhrase=x.match(/(?:عددهم|عددهن|وعددهم|وعددهن)\s*(\d+)(?=\s|$)/),value=byNoun?.[1]||byPhrase?.[1];return value?finiteNumber120(value):null;}
function detectPeriod(t){const x=norm(t);if(/الفصل\s*(?:الدراسي\s*)?(?:الاول|1)(?=\s|$)/.test(x))return'الفصل الدراسي الأول';if(/الفصل\s*(?:الدراسي\s*)?(?:الثاني|2)(?=\s|$)/.test(x))return'الفصل الدراسي الثاني';return''}
function detectAssessmentType(t){const x=norm(t);const rules=[['اختبار نهائي',/اختبار\s*(?:نهائي|النهايي)/],['اختبار تشخيصي',/اختبار\s*تشخيصي/],['اختبار قبلي',/اختبار\s*قبلي/],['اختبار بعدي',/اختبار\s*بعدي/],['اختبار الفترة الأولى',/اختبار\s*(?:الفتره\s*)?(?:الاولى|الاولي|1)/],['اختبار الفترة الثانية',/اختبار\s*(?:الفتره\s*)?(?:الثانيه|2)/],['تقويم تكويني',/تقويم\s*تكويني/],['تقويم مستمر',/تقويم\s*مستمر/]];return rules.find(([,r])=>r.test(x))?.[0]||''}
function detectMaxScore(t){const x=norm(t),m=x.match(/(?:الدرجه\s*(?:العظمي|الكليه)?\s*)?(?:من|حدها|اقصاها)\s*(\d+(?:[٫.]\d+)?)(?=\s|$)/);return m?finiteNumber120(m[1]):null}
function detectLocation(t){if(any(t,['المختبر','مختبر العلوم','بالمختبر','في مختبر']))return'المختبر';if(any(t,['في المدرسة','بالمدرسة']))return'المدرسة';return'';}
function detectIntent(t){if(any(t,['علاجي','علاجية','علاجيه','علاج','ضعف','غير المتقنين','ما اتقنوا','ما أتقنوا','ضعاف']))return'علاجي';if(any(t,['إثرائي','اثرائي','إثراء','اثراء','متفوقين','موهوب']))return'إثرائي';if(any(t,['تحفيز','تحفيزي','تحدي']))return'تحفيزي';if(any(t,['تطوعي','تطوعية','تطوعيه']))return'تطوعي';if(any(t,['قيمي','السلوك اليومي','القيم']))return'قيمي';if(any(t,['تحسين']))return'تحسين';return'';}
function detectFinding(t){if(any(t,['عدم إتقان','عدم اتقان','غير المتقنين','ما اتقنوا','ما أتقنوا']))return'عدم إتقان';if(any(t,['ضعف','ضعيف','ضعاف','ظهر ضعف']))return'ضعف';if(any(t,['أخطاء','اخطاء']))return'أخطاء';return'';}
function detectPurpose(t){if(any(t,['مناقشة نتائج','مناقشه نتائج','بخصوص نتائج','بخصوص نتايج','لمناقشة نتائج','لمناقشه نتائج']))return'مناقشة النتائج';if(any(t,['مراجعة خطة الإخلاء','مراجعه خطة الاخلاء','نراجع خطة الاخلاء']))return'مراجعة خطة الإخلاء';if(any(t,['قارن','قارنت','قارنتها']))return'مقارنة الأداء';if(any(t,['قياس أثر','قياس الاثر','قبل البرنامج وبعده']))return'قياس أثر';if(any(t,['تحديد المهارات غير المتقنة','تحديد المهارات غير المتقنه']))return'تحديد المهارات غير المتقنة';return'';}
function detectTopic(t,subject,domain){
 if(subject?.id==='quran'){if(any(t,['حفظ','حفظ سورة','حفظ سوره']))return'حفظ القرآن الكريم';if(any(t,['تلاوة','تلاوه','تحسين تلاوة','تحسين تلاوه']))return'تلاوة القرآن الكريم';if(any(t,['تجويد','أحكام النون الساكنة والتنوين','احكام النون الساكنه والتنوين']))return'أحكام التجويد';if(any(t,['تفسير','معاني سورة','معاني سوره','تدبر']))return'فهم وتفسير القرآن الكريم';return'القرآن الكريم';}
 if(subject?.id==='arabic'){if(any(t,['تحسين الخط','خط عربي','الخط والكتابة','الخط والكتابه']))return'الخط والكتابة';if(any(t,['فهم قرائي','الفهم القرائي','فهم المقروء','المقروء','قراءة','قراءه']))return'القراءة والفهم القرائي';if(any(t,['إملاء','املاء','املائية','املائيه']))return'الإملاء';return'مهارات اللغة العربية';}
 if(subject?.id==='math'){if(any(t,['جدول الضرب','الضرب']))return'جدول الضرب';if(any(t,['كسور','الكسور']))return'الكسور';if(any(t,['معادلات','المعادلات']))return'المعادلات';if(any(t,['مسائل لفظية','مسائل لفظيه']))return'المسائل اللفظية';return'المهارات الرياضية';}
 if(subject?.id==='science'){if(any(t,['تجربة','تجربه','مختبر','استقصاء','تفسير نتائج التجارب']))return'التجريب والاستقصاء العلمي';return'المفاهيم العلمية';}
 if(subject?.id==='english'){if(any(t,['مفردات','كلمات انجليزي','vocabulary']))return'المفردات';if(any(t,['التحدث','محادثة','محادثه','speaking']))return'التحدث';if(any(t,['الاستماع','استماع','listening']))return'الاستماع';if(any(t,['القراءة باللغة الإنجليزية','القراءه باللغه الانجليزيه']))return'القراءة';return'مهارات اللغة الإنجليزية';}
 if(subject?.id==='digital'){if(any(t,['برمجة','برمجه']))return'البرمجة';if(any(t,['الأمان الرقمي','الامان الرقمي']))return'الأمان الرقمي';if(any(t,['أمن سيبراني','امن سيبراني']))return'الأمن السيبراني';if(any(t,['ذكاء اصطناعي']))return'الذكاء الاصطناعي';return'المهارات الرقمية';}
 if(subject?.id==='social'){if(any(t,['المواطنة','المواطنه']))return'المواطنة';return'الدراسات الاجتماعية';}
 if(domain?.id==='safety'&&any(t,['اخلاء','إخلاء']))return'الإخلاء التجريبي';if(domain?.id==='national')return'الهوية الوطنية';if(domain?.id==='values'&&any(t,['انضباط','الانضباط']))return'الانضباط';return domain?.name||'';
}
function detectContent(t){const x=norm(t);if(/سوره الملك|سورة الملك/.test(x))return'سورة الملك';if(/حالات الماده|حالات المادة/.test(x))return'حالات المادة';return'';}
function detectPartner(t){if(any(t,['مركز صحي','المركز الصحي']))return'مركز صحي';return'';}
function detectFrequency(t){if(any(t,['أسبوعيا','اسبوعيا','كل أسبوع','كل اسبوع']))return'أسبوعي';return'';}
function detectEffectMeasured(t){if(any(t,['لم أقم بقياس أثره','لم اقم بقياس اثره','لم يقاس الاثر','لم أقس الأثر']))return false;return null;}
function detectScope(t,subject,domain){if(!subject&&any(t,['في المدرسة','بالمدرسة','طلاب المدرسة','لطلاب المدرسة','دون تحديد صف']))return'مدرسي عام';if(domain&&['national','safety','activity','guidance'].includes(domain.id)&&!subject)return'مدرسي عام';return'';}
export function preview101(raw){const t=norm(raw),family=detectFamily(t),subject=detectSubject(t),schoolDomain=detectDomain(t),sg=detectStageGrade(t);const out={raw,normalized:t,family,subtype:family?subtype(family.type,t):'',subject,schoolDomain,topic:detectTopic(t,subject,schoolDomain),audiences:detectAudience(t),...sg,section:detectSection(t),duration:detectDuration(t),count:detectCount(t),period:detectPeriod(t),assessmentType:detectAssessmentType(t),maxScore:detectMaxScore(t),location:detectLocation(t),intent:detectIntent(t),finding:detectFinding(t),purpose:detectPurpose(t),content:detectContent(t),partner:detectPartner(t),frequency:detectFrequency(t),effectMeasured:detectEffectMeasured(t),scope:detectScope(t,subject,schoolDomain),ambiguities:[],missing:[]};return out;}
export function semanticFlat101(raw){const g=preview101(raw);return{family:g.family?.type||'',subtype:g.subtype||'',subject:g.subject?.name||'',topic:g.topic||'',audience:(g.audiences||[]).join('، '),grade:(g.grades||[])[0]||'',stage:g.stage||'',schoolDomain:g.schoolDomain?.name||'',duration:g.duration||'',count:g.count??'',location:g.location||'',intent:g.intent||'',finding:g.finding||'',purpose:g.purpose||'',content:g.content||'',partner:g.partner||'',frequency:g.frequency||'',effectMeasured:g.effectMeasured,scope:g.scope||''};}
