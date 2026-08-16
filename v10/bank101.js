// V101 Acceptance Bank
// Fusha is the reference language. Saudi colloquial Arabic is a secondary input-tolerance layer only.
// Every case describes the semantic facts the engine is allowed to infer. Missing facts must remain unknown.

export const BANK101 = [
  // Quran / Islamic studies
  {id:'Q001',register:'fusha',input:'نفذت برنامجًا عن القرآن الكريم',expect:{family:'برنامج / فعالية',subtype:'برنامج',subject:'القرآن الكريم والدراسات الإسلامية',topic:'القرآن الكريم'},unknown:['grade','stage','audience','duration','result']},
  {id:'Q002',register:'fusha',input:'نفذت مسابقة لحفظ سورة الملك لطلاب الصف الأول المتوسط',expect:{family:'برنامج / فعالية',subtype:'مسابقة',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',content:'سورة الملك',audience:'الطلاب',grade:'الأول',stage:'متوسط'}},
  {id:'Q003',register:'saudi',input:'سويت مسابقة حفظ سورة الملك لأول متوسط',expect:{family:'برنامج / فعالية',subtype:'مسابقة',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',content:'سورة الملك',grade:'الأول',stage:'متوسط'}},
  {id:'Q004',register:'noisy',input:'سوينا نشاط تجويد للطلاب',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'القرآن الكريم والدراسات الإسلامية',topic:'أحكام التجويد',audience:'الطلاب'}},

  // Arabic
  {id:'A001',register:'fusha',input:'نفذت برنامجًا لتحسين خط طلاب الصف الأول المتوسط',expect:{family:'برنامج / فعالية',subtype:'برنامج',subject:'اللغة العربية',topic:'الخط والكتابة',audience:'الطلاب',grade:'الأول',stage:'متوسط'}},
  {id:'A002',register:'saudi',input:'الطلاب خطهم ضعيف وسويت لهم نشاط',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'اللغة العربية',topic:'الخط والكتابة',audience:'الطلاب',need:'grade'}},
  {id:'A003',register:'noisy',input:'طلاب ثالث مايفهمون المقروء وسويت لهم برنامج',expect:{family:'برنامج / فعالية',subtype:'برنامج',subject:'اللغة العربية',topic:'القراءة والفهم القرائي',audience:'الطلاب',grade:'الثالث'},unknown:['stage']},

  // Mathematics
  {id:'M001',register:'fusha',input:'نفذت برنامجًا علاجيًا لمعالجة ضعف الطلاب في الكسور',expect:{family:'برنامج / فعالية',subtype:'برنامج',subject:'الرياضيات',topic:'الكسور',intent:'علاجي',audience:'الطلاب'}},
  {id:'M002',register:'saudi',input:'عيالي ضعاف بجدول الضرب وسويت لهم تحدي أسبوعين',expect:{family:'برنامج / فعالية',subject:'الرياضيات',topic:'جدول الضرب',intent:'علاجي/تحفيزي',audience:'الطلاب',duration:'أسبوعين'},unknown:['grade','stage']},
  {id:'M003',register:'fusha',input:'حللت نتائج اختبار الرياضيات للصف الثاني المتوسط وظهر ضعف في الكسور',expect:{family:'تحليل نتائج',subject:'الرياضيات',topic:'الكسور',grade:'الثاني',stage:'متوسط',finding:'ضعف'}},

  // Science
  {id:'S001',register:'fusha',input:'نفذت تجربة عملية في المختبر حول حالات المادة',expect:{family:'برنامج / فعالية',subject:'العلوم',topic:'التجريب والاستقصاء العلمي',content:'حالات المادة',location:'المختبر'}},
  {id:'S002',register:'saudi',input:'سوينا تجربة بالمختبر عن حالات الماده',expect:{family:'برنامج / فعالية',subject:'العلوم',topic:'التجريب والاستقصاء العلمي',content:'حالات المادة',location:'المختبر'}},

  // English
  {id:'E001',register:'fusha',input:'نفذت نشاطًا لتنمية مهارة التحدث باللغة الإنجليزية',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'اللغة الإنجليزية',topic:'التحدث'}},
  {id:'E002',register:'saudi',input:'سويت للطلاب نشاط محادثة انجليزي',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'اللغة الإنجليزية',topic:'التحدث',audience:'الطلاب'}},

  // Digital skills / Social studies
  {id:'D001',register:'fusha',input:'نفذت نشاطًا عن الأمن السيبراني في المهارات الرقمية',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'المهارات الرقمية',topic:'الأمن السيبراني'}},
  {id:'SS001',register:'fusha',input:'نفذت برنامجًا لتعزيز المواطنة والهوية الوطنية',expect:{family:'برنامج / فعالية',subtype:'برنامج',subjectContext:'الدراسات الاجتماعية/سياق مدرسي',topic:'الهوية الوطنية'},ambiguous:true},

  // School-wide / activity
  {id:'ACT001',register:'fusha',input:'فعلنا اليوم العالمي للدفاع المدني في المدرسة',expect:{family:'برنامج / فعالية',schoolDomain:'الأمن والسلامة',scope:'مدرسي عام'},mustNot:{subject:true}},
  {id:'ACT002',register:'saudi',input:'سوينا اخلاء تجريبي للطلاب اليوم',expect:{family:'برنامج / فعالية',schoolDomain:'الأمن والسلامة',topic:'الإخلاء التجريبي',audience:'الطلاب'},mustNot:{professionalDevelopment:true}},

  // Meetings
  {id:'MEET001',register:'fusha',input:'اجتمعت بمعلمي اللغة العربية لمناقشة نتائج نافس في القراءة',expect:{family:'اجتماع / متابعة إدارية',subject:'اللغة العربية',topic:'القراءة والفهم القرائي',audience:'المعلمون',purpose:'مناقشة النتائج'}},
  {id:'MEET002',register:'saudi',input:'اجتمعت مع معلمين العربي بخصوص نتايج نافس',expect:{family:'اجتماع / متابعة إدارية',subject:'اللغة العربية',audience:'المعلمون',purpose:'مناقشة النتائج'}},

  // Professional development
  {id:'PD001',register:'fusha',input:'قدمت ورشة للمعلمين عن استراتيجيات تدريس العلوم',expect:{family:'تطوير مهني',subject:'العلوم',audience:'المعلمون',topic:'استراتيجيات التدريس'}},
  {id:'PD002',register:'saudi',input:'سويت للمعلمين ورشة عن طرق تدريس الرياضيات',expect:{family:'تطوير مهني',subject:'الرياضيات',audience:'المعلمون',topic:'استراتيجيات التدريس'}},

  // Follow-up / analysis / plan
  {id:'F001',register:'fusha',input:'تابعت الطلاب الذين لم يتقنوا مهارة القراءة',expect:{family:'إجراء متابعة',subject:'اللغة العربية',topic:'القراءة',audience:'الطلاب',finding:'عدم إتقان'}},
  {id:'P001',register:'saudi',input:'طلع عندي 8 طلاب ما اتقنوا المهاره وسويت لهم خطه علاجية',expect:{family:'خطة',intent:'علاجي',audience:'الطلاب',count:8},unknown:['subject','skill']},

  // Gifted / enrichment
  {id:'G001',register:'fusha',input:'رشحت طالبًا موهوبًا ونفذت له برنامجًا إثرائيًا',expect:{family:'برنامج / فعالية',intent:'إثرائي',audience:'طالب',schoolDomain:'الموهوبون'},mustNot:{remedial:true}},
  {id:'G002',register:'saudi',input:'رشحت طالب لموهبة وسويت له اثراء',expect:{intent:'إثرائي',audience:'طالب',schoolDomain:'الموهوبون'},mustNot:{remedial:true}},

  // Noise / spelling / fragments
  {id:'N001',register:'noisy',input:'برنامج قران اول متوسط اسبوع حفظ',expect:{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',grade:'الأول',stage:'متوسط',duration:'أسبوع'}},
  {id:'N002',register:'noisy',input:'رياضيات ثاني ضعف كسور علاج',expect:{subject:'الرياضيات',topic:'الكسور',grade:'الثاني',intent:'علاجي'},unknown:['stage','family']},
  {id:'N003',register:'noisy',input:'اجتماع علوم نتايج الطلاب',expect:{family:'اجتماع / متابعة إدارية',subject:'العلوم',purpose:'مناقشة النتائج'},unknown:['grade','stage']}
];

export const BANK101_RULES = {
 referenceLanguage:'الفصحى',
 secondaryInputLayer:'اللهجات السعودية',
 outputLanguage:'العربية الفصحى المهنية',
 principles:[
  'لا يُسأل المستخدم عن حقيقة ذكرها صراحة أو استنتجت بثقة عالية.',
  'لا تُخترع المادة أو الصف أو المرحلة أو المستفيد أو المدة أو النتيجة أو الأثر.',
  'المعلومة المجهولة تبقى مجهولة وتدخل في اختيار أفضل سؤال تالٍ.',
  'اللهجة والأخطاء الإملائية تؤثر في تحمل الإدخال ولا تغير المصطلح التربوي المعياري.',
  'كل حقيقة مؤكدة تنتقل إلى الأسئلة والأهداف والمؤشرات والعنوان والنص والشواهد.',
  'السياق المدرسي العام لا يُجبر على مادة دراسية.',
  'الإثراء والموهبة مسار أصيل ولا يعاد تفسيرهما كعلاج ضعف.',
  'نجاح حالة فصيحة هو المرجع؛ ثم تقاس الصيغة العامية والضوضائية مقابل المعنى نفسه.'
 ]
};

export function bank101Summary(){
 const byRegister=Object.groupBy?Object.groupBy(BANK101,x=>x.register):BANK101.reduce((a,x)=>((a[x.register]??=[]).push(x),a),{});
 return {total:BANK101.length,registers:Object.fromEntries(Object.entries(byRegister).map(([k,v])=>[k,v.length]))};
}
