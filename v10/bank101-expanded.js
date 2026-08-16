// Additional V101 acceptance cases. Fusha remains primary; Saudi colloquial/noisy inputs are secondary tolerance cases.
export const BANK101_EXPANDED = [
// Quran / Islamic studies
{id:'Q101',register:'fusha',input:'نفذت برنامجًا لتحسين تلاوة القرآن الكريم لدى طلاب الصف الثاني المتوسط',expect:{family:'برنامج / فعالية',subtype:'برنامج',subject:'القرآن الكريم والدراسات الإسلامية',topic:'تلاوة القرآن الكريم',audience:'الطلاب',grade:'الثاني',stage:'متوسط'}},
{id:'Q102',register:'fusha',input:'نفذت نشاطًا تطبيقيًا على أحكام النون الساكنة والتنوين',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'القرآن الكريم والدراسات الإسلامية',topic:'أحكام التجويد'}},
{id:'Q103',register:'fusha',input:'نفذت حلقة مراجعة لحفظ سورة الملك لمدة أسبوع',expect:{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',duration:'أسبوع'}},
{id:'Q104',register:'saudi',input:'سويت للطلاب مراجعة حفظ الملك اسبوع',expect:{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',audience:'الطلاب',duration:'أسبوع'}},
{id:'Q105',register:'fusha',input:'نفذت نشاطًا لفهم معاني سورة الحجرات وربطها بالسلوك اليومي',expect:{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'فهم وتفسير القرآن الكريم',intent:'قيمي'}},
{id:'Q106',register:'noisy',input:'برنامج قران تلاوه ثاني متوسط',expect:{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'تلاوة القرآن الكريم',grade:'الثاني',stage:'متوسط'}},

// Arabic
{id:'A101',register:'fusha',input:'نفذت برنامجًا علاجيًا لتحسين الفهم القرائي لدى طلاب الصف الثاني المتوسط',expect:{family:'برنامج / فعالية',subtype:'برنامج',subject:'اللغة العربية',topic:'القراءة والفهم القرائي',intent:'علاجي',grade:'الثاني',stage:'متوسط'}},
{id:'A102',register:'fusha',input:'نفذت مسابقة في الإملاء لطلاب الصف الأول المتوسط',expect:{family:'برنامج / فعالية',subtype:'مسابقة',subject:'اللغة العربية',topic:'الإملاء',grade:'الأول',stage:'متوسط'}},
{id:'A103',register:'saudi',input:'طلاب أول عندهم اخطاء املائية وسويت لهم تدريب',expect:{family:'برنامج / فعالية',subject:'اللغة العربية',topic:'الإملاء',grade:'الأول',finding:'أخطاء'}},
{id:'A104',register:'fusha',input:'حللت نتائج اختبار الفهم القرائي وحددت الطلاب غير المتقنين',expect:{family:'تحليل نتائج',subject:'اللغة العربية',topic:'القراءة والفهم القرائي',finding:'عدم إتقان'}},
{id:'A105',register:'fusha',input:'تابعت تطبيق الطلاب لقواعد الكتابة بعد البرنامج العلاجي',expect:{family:'إجراء متابعة',subject:'اللغة العربية',topic:'الخط والكتابة'}},
{id:'A106',register:'noisy',input:'عربي ثالث فهم مقروء ضعيف خطة علاج',expect:{family:'خطة',subject:'اللغة العربية',topic:'القراءة والفهم القرائي',grade:'الثالث',intent:'علاجي'},unknown:['stage']},

// Mathematics
{id:'M101',register:'fusha',input:'نفذت مسابقة لإتقان جدول الضرب لطلاب الصف الرابع الابتدائي',expect:{family:'برنامج / فعالية',subtype:'مسابقة',subject:'الرياضيات',topic:'جدول الضرب',grade:'الرابع',stage:'ابتدائي'}},
{id:'M102',register:'fusha',input:'نفذت نشاطًا تطبيقيًا في حل المسائل اللفظية',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'الرياضيات',topic:'المسائل اللفظية'}},
{id:'M103',register:'saudi',input:'ثاني متوسط ضعاف بالمعادلات وسويت لهم علاج اسبوعين',expect:{family:'برنامج / فعالية',subject:'الرياضيات',topic:'المعادلات',grade:'الثاني',stage:'متوسط',intent:'علاجي',duration:'أسبوعين'}},
{id:'M104',register:'fusha',input:'حللت نتائج اختبار الرياضيات وقارنت مستوى الطلاب قبل البرنامج وبعده',expect:{family:'تحليل نتائج',subject:'الرياضيات',purpose:'قياس أثر'}},
{id:'M105',register:'fusha',input:'أعددت خطة علاجية للطلاب غير المتقنين لمهارة الكسور',expect:{family:'خطة',subject:'الرياضيات',topic:'الكسور',intent:'علاجي',audience:'الطلاب'}},
{id:'M106',register:'noisy',input:'رياضيات رابع ضرب مسابقه',expect:{family:'برنامج / فعالية',subtype:'مسابقة',subject:'الرياضيات',topic:'جدول الضرب',grade:'الرابع'},unknown:['stage']},

// Science
{id:'S101',register:'fusha',input:'نفذت تجربة حول التغيرات الفيزيائية والكيميائية في مختبر العلوم',expect:{family:'برنامج / فعالية',subject:'العلوم',topic:'التجريب والاستقصاء العلمي',location:'المختبر'}},
{id:'S102',register:'fusha',input:'نفذت نشاط استقصاء علمي حول انتقال الحرارة',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'العلوم',topic:'التجريب والاستقصاء العلمي'}},
{id:'S103',register:'saudi',input:'سوينا تجربة علوم عن الحرارة بالمختبر',expect:{family:'برنامج / فعالية',subject:'العلوم',topic:'التجريب والاستقصاء العلمي',location:'المختبر'}},
{id:'S104',register:'fusha',input:'حللت نتائج اختبار العلوم وظهر ضعف في تفسير نتائج التجارب',expect:{family:'تحليل نتائج',subject:'العلوم',finding:'ضعف',topic:'التجريب والاستقصاء العلمي'}},
{id:'S105',register:'fusha',input:'قدمت ورشة لمعلمي العلوم عن التعلم بالاستقصاء',expect:{family:'تطوير مهني',subject:'العلوم',audience:'المعلمون',topic:'استراتيجيات التدريس'}},
{id:'S106',register:'noisy',input:'علوم تجربه مختبر اول متوسط',expect:{family:'برنامج / فعالية',subject:'العلوم',topic:'التجريب والاستقصاء العلمي',grade:'الأول',stage:'متوسط'}},

// English
{id:'E101',register:'fusha',input:'نفذت برنامجًا لتنمية مفردات اللغة الإنجليزية لدى طلاب الصف الأول المتوسط',expect:{family:'برنامج / فعالية',subject:'اللغة الإنجليزية',topic:'المفردات',grade:'الأول',stage:'متوسط'}},
{id:'E102',register:'fusha',input:'نفذت مسابقة للتحدث باللغة الإنجليزية',expect:{family:'برنامج / فعالية',subtype:'مسابقة',subject:'اللغة الإنجليزية',topic:'التحدث'}},
{id:'E103',register:'saudi',input:'سويت للطلاب تحدي كلمات انجليزي',expect:{family:'برنامج / فعالية',subject:'اللغة الإنجليزية',topic:'المفردات',audience:'الطلاب'}},
{id:'E104',register:'fusha',input:'حللت نتائج اختبار الاستماع في اللغة الإنجليزية',expect:{family:'تحليل نتائج',subject:'اللغة الإنجليزية',topic:'الاستماع'}},
{id:'E105',register:'fusha',input:'أعددت خطة علاجية للطلاب المتعثرين في القراءة باللغة الإنجليزية',expect:{family:'خطة',subject:'اللغة الإنجليزية',topic:'القراءة',intent:'علاجي'}},
{id:'E106',register:'noisy',input:'انجليزي اول متوسط مفردات ضعيف برنامج',expect:{family:'برنامج / فعالية',subject:'اللغة الإنجليزية',topic:'المفردات',grade:'الأول',stage:'متوسط',finding:'ضعف'}},

// Digital skills
{id:'D101',register:'fusha',input:'نفذت نشاطًا عمليًا في البرمجة باستخدام بيئة تعليمية',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'المهارات الرقمية',topic:'البرمجة'}},
{id:'D102',register:'fusha',input:'نفذت برنامج توعية عن الأمان الرقمي للطلاب',expect:{family:'برنامج / فعالية',subject:'المهارات الرقمية',topic:'الأمان الرقمي',audience:'الطلاب'}},
{id:'D103',register:'saudi',input:'سويت للطلاب نشاط برمجة',expect:{family:'برنامج / فعالية',subtype:'نشاط',subject:'المهارات الرقمية',topic:'البرمجة',audience:'الطلاب'}},
{id:'D104',register:'fusha',input:'قدمت ورشة للمعلمين عن توظيف أدوات الذكاء الاصطناعي في التعليم',expect:{family:'تطوير مهني',topic:'الذكاء الاصطناعي',audience:'المعلمون'}},
{id:'D105',register:'fusha',input:'تابعت الطلاب أثناء تنفيذ مشروع رقمي جماعي',expect:{family:'إجراء متابعة',subject:'المهارات الرقمية',audience:'الطلاب'}},

// Social studies / national identity
{id:'SS101',register:'fusha',input:'نفذت نشاطًا في الدراسات الاجتماعية حول المواطنة المسؤولة',expect:{family:'برنامج / فعالية',subject:'الدراسات الاجتماعية',topic:'المواطنة'}},
{id:'SS102',register:'fusha',input:'نفذت فعالية بمناسبة يوم التأسيس',expect:{family:'برنامج / فعالية',subtype:'فعالية',schoolDomain:'الهوية الوطنية',scope:'مدرسي عام'},mustNot:{subject:true}},
{id:'SS103',register:'saudi',input:'فعلنا يوم التأسيس بالمدرسة',expect:{family:'برنامج / فعالية',schoolDomain:'الهوية الوطنية',scope:'مدرسي عام'},mustNot:{subject:true}},

// Activity / school-wide
{id:'ACT101',register:'fusha',input:'نفذت حملة لتعزيز الانضباط المدرسي',expect:{family:'برنامج / فعالية',subtype:'حملة',schoolDomain:'القيم والسلوك',topic:'الانضباط'}},
{id:'ACT102',register:'fusha',input:'نظمت مسابقة ثقافية بين الفصول',expect:{family:'برنامج / فعالية',subtype:'مسابقة',schoolDomain:'النشاط الطلابي'}},
{id:'ACT103',register:'saudi',input:'سوينا مسابقه بين الفصول',expect:{family:'برنامج / فعالية',subtype:'مسابقة',schoolDomain:'النشاط الطلابي'}},
{id:'ACT104',register:'fusha',input:'نفذت برنامجًا لاستقبال الطلاب المستجدين وتهيئتهم',expect:{family:'برنامج / فعالية',schoolDomain:'التوجيه الطلابي',topic:'التهيئة'}},
{id:'ACT105',register:'fusha',input:'نفذت حملة تطوعية لخدمة المجتمع المحلي',expect:{family:'برنامج / فعالية',subtype:'حملة',schoolDomain:'النشاط الطلابي',intent:'تطوعي'}},

// Safety
{id:'SAFE101',register:'fusha',input:'نفذت تدريبًا عمليًا على الإخلاء لطلاب المدرسة',expect:{family:'برنامج / فعالية',schoolDomain:'الأمن والسلامة',topic:'الإخلاء التجريبي',audience:'الطلاب'},mustNot:{professionalDevelopment:true}},
{id:'SAFE102',register:'fusha',input:'تابعت صلاحية طفايات الحريق ومخارج الطوارئ',expect:{family:'إجراء متابعة',schoolDomain:'الأمن والسلامة'}},
{id:'SAFE103',register:'saudi',input:'شيكت على الطفايات ومخارج الطوارئ',expect:{family:'إجراء متابعة',schoolDomain:'الأمن والسلامة'}},

// Meetings
{id:'MEET101',register:'fusha',input:'عقدت اجتماعًا مع معلمي الرياضيات لمناقشة نتائج الاختبار التشخيصي',expect:{family:'اجتماع / متابعة إدارية',subject:'الرياضيات',audience:'المعلمون',purpose:'مناقشة النتائج'}},
{id:'MEET102',register:'fusha',input:'عقدت اجتماعًا للجنة الأمن والسلامة لمراجعة خطة الإخلاء',expect:{family:'اجتماع / متابعة إدارية',schoolDomain:'الأمن والسلامة',purpose:'مراجعة خطة الإخلاء'}},
{id:'MEET103',register:'saudi',input:'اجتمعنا كلجنة السلامه نراجع خطة الاخلاء',expect:{family:'اجتماع / متابعة إدارية',schoolDomain:'الأمن والسلامة',purpose:'مراجعة خطة الإخلاء'}},
{id:'MEET104',register:'fusha',input:'اجتمعت بمعلمي اللغة الإنجليزية لتنسيق اختبار موحد',expect:{family:'اجتماع / متابعة إدارية',subject:'اللغة الإنجليزية',audience:'المعلمون'}},

// Professional development
{id:'PD101',register:'fusha',input:'نفذت ورشة تدريبية للمعلمين حول تحليل نتائج التقويم',expect:{family:'تطوير مهني',audience:'المعلمون',topic:'تحليل نتائج التقويم'}},
{id:'PD102',register:'fusha',input:'نفذت لقاء تبادل خبرات بين معلمي اللغة العربية حول الفهم القرائي',expect:{family:'تطوير مهني',subject:'اللغة العربية',audience:'المعلمون',topic:'القراءة والفهم القرائي'}},
{id:'PD103',register:'saudi',input:'سويت زيارة لزميلي أشوف طريقته في شرح الكسور',expect:{family:'تطوير مهني',subject:'الرياضيات',topic:'الكسور',intent:'تبادل خبرات'}},
{id:'PD104',register:'fusha',input:'شاركت في دورة عن إدارة الصف',expect:{family:'تطوير مهني',topic:'إدارة الصف'},mustNot:{subject:true}},

// Analysis
{id:'AN101',register:'fusha',input:'حللت نتائج الاختبار التشخيصي وحددت المهارات غير المتقنة',expect:{family:'تحليل نتائج',purpose:'تحديد المهارات غير المتقنة'}},
{id:'AN102',register:'fusha',input:'حللت نتائج نافس في القراءة وقارنتها بالعام السابق',expect:{family:'تحليل نتائج',subject:'اللغة العربية',topic:'القراءة',purpose:'مقارنة الأداء'}},
{id:'AN103',register:'saudi',input:'طلعت نتايج الاختبار وعندي ضعف واضح بالكسور',expect:{family:'تحليل نتائج',subject:'الرياضيات',topic:'الكسور',finding:'ضعف'}},

// Follow-up
{id:'F101',register:'fusha',input:'تابعت تنفيذ الخطة العلاجية للطلاب غير المتقنين',expect:{family:'إجراء متابعة',intent:'علاجي',audience:'الطلاب'}},
{id:'F102',register:'fusha',input:'تابعت تقدم الطلاب في حفظ سورة الملك أسبوعيًا',expect:{family:'إجراء متابعة',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',audience:'الطلاب',frequency:'أسبوعي'}},
{id:'F103',register:'saudi',input:'تابعت الطلاب كل اسبوع بالحفظ',expect:{family:'إجراء متابعة',topic:'الحفظ',audience:'الطلاب',frequency:'أسبوعي'},unknown:['subject']},

// Plans
{id:'P101',register:'fusha',input:'أعددت خطة علاجية لمعالجة ضعف الفهم القرائي لدى طلاب الصف الثاني المتوسط',expect:{family:'خطة',subject:'اللغة العربية',topic:'القراءة والفهم القرائي',intent:'علاجي',grade:'الثاني',stage:'متوسط'}},
{id:'P102',register:'fusha',input:'أعددت خطة إثرائية للطلاب المتفوقين في الرياضيات',expect:{family:'خطة',subject:'الرياضيات',intent:'إثرائي',audience:'الطلاب'},mustNot:{remedial:true}},
{id:'P103',register:'fusha',input:'أعددت خطة تحسين بناء على نتائج التقويم الذاتي',expect:{family:'خطة',intent:'تحسين',schoolDomain:'التقويم المدرسي'},mustNot:{subject:true}},
{id:'P104',register:'saudi',input:'سويت خطة للطلاب الضعاف بالقراءة',expect:{family:'خطة',subject:'اللغة العربية',topic:'القراءة',intent:'علاجي',audience:'الطلاب'}},

// Gifted / enrichment
{id:'G101',register:'fusha',input:'نفذت برنامجًا إثرائيًا لطالب موهوب في الرياضيات',expect:{family:'برنامج / فعالية',subject:'الرياضيات',intent:'إثرائي',schoolDomain:'الموهوبون'},mustNot:{remedial:true}},
{id:'G102',register:'fusha',input:'رشحت مجموعة من الطلاب للمشاركة في مسابقة موهبة',expect:{family:'برنامج / فعالية',schoolDomain:'الموهوبون',audience:'الطلاب',intent:'ترشيح/مشاركة'}},
{id:'G103',register:'saudi',input:'عندي طالب موهوب بالرياضيات وسويت له اثراء',expect:{family:'برنامج / فعالية',subject:'الرياضيات',schoolDomain:'الموهوبون',intent:'إثرائي'},mustNot:{remedial:true}},

// Special education / inclusion
{id:'SP101',register:'fusha',input:'نفذت نشاطًا تعليميًا ملائمًا لطالب من ذوي الإعاقة',expect:{family:'برنامج / فعالية',schoolDomain:'الشمول وذوو الإعاقة',audience:'طالب'}},
{id:'SP102',register:'fusha',input:'تابعت تقدم طالب من ذوي الإعاقة في المهارة المستهدفة',expect:{family:'إجراء متابعة',schoolDomain:'الشمول وذوو الإعاقة',audience:'طالب'},unknown:['subject','skill']},

// Partnerships
{id:'PART101',register:'fusha',input:'نفذت شراكة مع مركز صحي لتوعية الطلاب بالصحة العامة',expect:{family:'شراكة مجتمعية',audience:'الطلاب',partner:'مركز صحي'}},
{id:'PART102',register:'saudi',input:'نسقنا مع المركز الصحي برنامج توعوي للطلاب',expect:{family:'شراكة مجتمعية',audience:'الطلاب',partner:'مركز صحي'}},

// Maintenance / facilities
{id:'MAINT101',register:'fusha',input:'تابعت صيانة أجهزة التكييف في الفصول',expect:{family:'صيانة وتجهيزات',topic:'صيانة أجهزة التكييف'}},
{id:'MAINT102',register:'fusha',input:'تم تجهيز مختبر العلوم بأدوات جديدة',expect:{family:'صيانة وتجهيزات',subject:'العلوم',topic:'تجهيز المختبر'}},
{id:'MAINT103',register:'saudi',input:'صلحنا مكيفات الفصول',expect:{family:'صيانة وتجهيزات',topic:'صيانة أجهزة التكييف'}},

// Ambiguity / safety cases
{id:'AMB101',register:'fusha',input:'نفذت برنامجًا للطلاب',expect:{family:'برنامج / فعالية',audience:'الطلاب'},unknown:['subject','topic','grade','stage'],nextQuestion:'ما موضوع البرنامج؟'},
{id:'AMB102',register:'fusha',input:'أعددت خطة للصف الثاني',expect:{family:'خطة',grade:'الثاني'},unknown:['stage','subject','intent'],nextQuestion:'ما نوع الخطة أو الغرض منها؟'},
{id:'AMB103',register:'saudi',input:'سويت نشاط للطلاب',expect:{family:'برنامج / فعالية',subtype:'نشاط',audience:'الطلاب'},unknown:['subject','topic','grade','stage'],nextQuestion:'ما موضوع النشاط؟'},
{id:'AMB104',register:'noisy',input:'ثاني ضعف',expect:{grade:'الثاني',finding:'ضعف'},unknown:['family','stage','subject','topic'],mustNot:{guessFamily:true}},

// Contradiction / non-invention
{id:'C101',register:'fusha',input:'نفذت برنامجًا لمدة أسبوعين ولم أقم بقياس أثره بعد',expect:{family:'برنامج / فعالية',duration:'أسبوعين',effectMeasured:false},mustNot:{claimImprovement:true}},
{id:'C102',register:'fusha',input:'نفذت نشاطًا للطلاب ولا أعرف عدد المشاركين بدقة',expect:{family:'برنامج / فعالية',audience:'الطلاب'},unknown:['count'],mustNot:{inventCount:true}},
{id:'C103',register:'fusha',input:'نفذت برنامجًا في المدرسة دون تحديد صف معين',expect:{family:'برنامج / فعالية',scope:'مدرسي عام'},mustNot:{inventGrade:true}}
];
