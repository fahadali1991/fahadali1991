const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const raw=s=>clean(s?.raw||'');
const subject=s=>clean(s?.metadata?.subjectHint101||s?.metadata?.semantic101?.subject?.name||'');
const topic=s=>clean(s?.topic||s?.metadata?.semantic101?.topic||'');
const packs={
'القرآن الكريم والدراسات الإسلامية':[
 {branch:'القرآن الكريم',test:/قرآن|قران|حفظ|تلاو|تجويد|سورة|سوره/,skills:[['حفظ القرآن الكريم',/حفظ|مراجعة حفظ|تسميع/],['تلاوة القرآن الكريم',/تلاو|قراءة القرآن|قراءه القران/],['أحكام التجويد',/تجويد|أحكام|احكام/],['فهم معاني الآيات وتدبرها',/تفسير|معاني|تدبر/]]},
 {branch:'الفقه',test:/فقه/,skills:[['فهم الحكم الفقهي وتطبيقه',/حكم|تطبيق|فقه/]]},
 {branch:'الحديث',test:/حديث/,skills:[['فهم الحديث واستنباط دلالاته',/حديث/]]},
 {branch:'التوحيد والعقيدة',test:/توحيد|عقيد/,skills:[['فهم المفاهيم العقدية',/توحيد|عقيد/]]}
],
'اللغة العربية':[
 {branch:'القراءة',test:/قراء|فهم قرائي|مقروء/,skills:[['الطلاقة القرائية',/طلاقة|سرعة قراءة|قراءه جهريه|قراءة جهرية/],['الفهم القرائي',/فهم قرائي|فهم المقروء|استيعاب/],['تحليل النصوص',/تحليل نص|افكار رئيسية|أفكار رئيسية/]]},
 {branch:'الكتابة',test:/خط|كتابة|كتابه|تعبير/,skills:[['الخط والكتابة',/تحسين الخط|خط عربي|الخط/],['التعبير الكتابي',/تعبير|كتابة فقرة|كتابه فقره/]]},
 {branch:'الإملاء',test:/املاء|إملاء|املائي|إملائي/,skills:[['الدقة الإملائية',/املاء|إملاء|املائي|إملائي/]]},
 {branch:'النحو واللغويات',test:/نحو|اعراب|إعراب|صرف/,skills:[['تطبيق القاعدة اللغوية',/نحو|اعراب|إعراب|صرف/]]}
],
'الرياضيات':[
 {branch:'الكسور والنسب',test:/كسر|كسور|نسب/,skills:[['فهم مفهوم الكسور',/مفهوم|فهم.*كسر/],['تمثيل الكسور ومقارنتها',/تمثيل|مقارنه|مقارنة/],['العمليات على الكسور',/جمع الكسور|طرح الكسور|ضرب الكسور|قسمة الكسور|عمليات.*كسور/],['توحيد المقامات',/توحيد المقامات|مقامات/],['تطبيق الكسور في المسائل',/مسائل|لفظيه|لفظية/]]},
 {branch:'الجبر',test:/معادلات|جبر/,skills:[['حل المعادلات',/معادلات|حل المعادله|حل المعادلة/],['فهم الأنماط والعلاقات',/انماط|أنماط|علاقات/]]},
 {branch:'الأعداد والعمليات',test:/جدول الضرب|ضرب|قسمة|قسمه|جمع|طرح/,skills:[['إتقان جدول الضرب',/جدول الضرب/],['دقة العمليات الحسابية',/جمع|طرح|ضرب|قسمة|قسمه/]]},
 {branch:'حل المشكلات والاستدلال',test:/مسائل|استدلال|حل مشكلات/,skills:[['اختيار استراتيجية الحل',/استراتيجية|طريقه الحل|طريقة الحل/],['تطبيق المهارة في مسائل',/مسائل/]]}
],
'العلوم':[
 {branch:'التجريب والاستقصاء',test:/تجرب|مختبر|استقصاء/,skills:[['تنفيذ التجربة بأمان',/سلامة|سلامه|أمان|امان/],['استخدام الأدوات العلمية',/أدوات|ادوات/],['تسجيل الملاحظات والقياسات',/ملاحظة|ملاحظه|قياس/],['تفسير نتائج التجربة',/تفسير النتائج|نتائج التجرب/]]},
 {branch:'المفاهيم العلمية',test:/مفهوم|حالات الماده|حالات المادة|حرارة|الحراره/,skills:[['فهم المفهوم العلمي',/مفهوم|حالات الماده|حالات المادة|حرارة|الحراره/]]}
],
'اللغة الإنجليزية':[
 {branch:'Speaking',test:/speaking|محادثة|محادثه|تحدث/,skills:[['Speaking fluency',/طلاقة|fluency/],['Speaking accuracy',/دقة|accuracy/]]},
 {branch:'Reading',test:/reading|قراءة انجليزي|قراءه انجليزي|قراءة باللغة الإنجليزية|القراءه باللغه الانجليزيه/,skills:[['Reading comprehension',/فهم|comprehension/],['Reading fluency',/طلاقة|fluency/]]},
 {branch:'Listening',test:/listening|استماع/,skills:[['Listening comprehension',/استماع|listening/]]},
 {branch:'Vocabulary',test:/vocabulary|مفردات|كلمات انجليزي/,skills:[['Vocabulary development',/مفردات|vocabulary|كلمات/]]},
 {branch:'Writing',test:/writing|كتابة انجليزي|كتابه انجليزي/,skills:[['Writing accuracy',/كتابه|كتابة|writing/]]}
],
'المهارات الرقمية':[
 {branch:'البرمجة',test:/برمجة|برمجه|كود|coding/,skills:[['بناء خوارزمية أو حل برمجي',/خوارزم|حل برمجي/],['كتابة برنامج وتنفيذه',/برمجة|برمجه|كود/]]},
 {branch:'المشروعات الرقمية',test:/مشروع رقمي|منتج رقمي|تصميم/,skills:[['إنتاج منتج رقمي',/مشروع|منتج|تصميم/]]},
 {branch:'الأمان الرقمي',test:/امان رقمي|أمان رقمي|امن سيبراني|أمن سيبراني/,skills:[['الممارسة الآمنة رقميًا',/امان|أمان|سيبراني/]]}
]
};
function resolvePack(s){const p=packs[subject(s)]||[],r=`${raw(s)} ${topic(s)}`;for(const b of p){if(b.test.test(r)){const hit=[];for(const [name,re] of b.skills||[])if(re.test(r))hit.push(name);return{branch:b.branch,explicitSkills:hit,skillOptions:(b.skills||[]).map(x=>x[0])}}}return{branch:'',explicitSkills:[],skillOptions:[]}}
export function resolveSkill105(s){const x=resolvePack(s),fd=s?.metadata?.familyDetails||{},chosen=clean(fd.skillFocus||'');const explicit=x.explicitSkills.length===1?x.explicitSkills[0]:'';return{subject:subject(s),topic:topic(s),branch:x.branch,skill:chosen||explicit,skillKnown:Boolean(chosen||explicit),skillOptions:x.skillOptions,needsSkillQuestion:Boolean(x.skillOptions.length>1&&!chosen&&!explicit)};}
