export const FAMILY_REQUIREMENTS={
 'برنامج / فعالية':{
  label:'تفاصيل البرنامج أو الفعالية',
  fields:[
   {id:'context',label:'سبب التنفيذ أو المناسبة',type:'text',placeholder:'مثال: معالجة احتياج أو تفعيل مناسبة'},
   {id:'method',label:'طريقة التنفيذ',type:'textarea',placeholder:'اذكر أبرز الطرق أو الأنشطة المستخدمة'},
   {id:'participation',label:'المشاركة والتفاعل',type:'textarea',placeholder:'ما الذي حدث أثناء التنفيذ؟'},
   {id:'outputs',label:'المخرجات المباشرة',type:'textarea',placeholder:'منتجات، توصيات، أعمال، نتائج مباشرة...'},
   {id:'measure',label:'كيف تم التحقق من النجاح؟',type:'text',placeholder:'استبانة، ملاحظة، نتائج، منتج، لم يقس بعد'}
  ],
  evidence:['صور التنفيذ','تقرير البرنامج/الفعالية','كشف حضور','رابط أو باركود','أداة قياس أثر أو نتائج']
 },
 'اجتماع / متابعة إدارية':{
  label:'تفاصيل محضر الاجتماع',
  fields:[
   {id:'purpose',label:'غرض الاجتماع',type:'text',placeholder:'لماذا عُقد الاجتماع؟'},
   {id:'agenda',label:'محاور الاجتماع',type:'textarea',placeholder:'اكتب المحاور الرئيسة التي نوقشت'},
   {id:'discussion',label:'أبرز ما تمت مناقشته',type:'textarea',placeholder:'الخلاصة المهنية للمناقشات'},
   {id:'decisions',label:'القرارات والتوصيات',type:'textarea',placeholder:'ما الذي تم الاتفاق أو التوصية به؟'},
   {id:'assignments',label:'التكليفات والمسؤوليات والمواعيد',type:'textarea',placeholder:'من المسؤول؟ وما الموعد إن وجد؟'}
  ],
  evidence:['محضر الاجتماع','كشف حضور','عرض أو مادة الاجتماع','صور','مرفقات أو تعاميم مرتبطة']
 },
 'تحليل نتائج':{
  label:'تفاصيل تحليل النتائج',
  fields:[
   {id:'source',label:'مصدر النتائج / نوع التقويم',type:'text',placeholder:'اختبار فترة، تشخيصي، نهائي، مهاري...'},
   {id:'subjectGrade',label:'المادة / الصف / الشعبة',type:'text',placeholder:'اكتب ما ينطبق'},
   {id:'levels',label:'مستويات الأداء الظاهرة',type:'textarea',placeholder:'صف توزيع أو مستويات الأداء دون اختراع نسب'},
   {id:'strengths',label:'جوانب القوة',type:'textarea',placeholder:'المهارات أو الجوانب التي ظهر فيها أداء جيد'},
   {id:'needs',label:'جوانب الاحتياج أو الضعف',type:'textarea',placeholder:'المهارات أو الفئات التي تحتاج دعمًا'},
   {id:'actions',label:'الإجراءات الناتجة عن التحليل',type:'textarea',placeholder:'علاجي، إثرائي، إعادة تدريس، متابعة...'}
  ],
  evidence:['ملف النتائج','ملف أو تقرير التحليل','خطة علاجية أو إثرائية','أداة تشخيص أو تقويم','سجل متابعة تقدم']
 },
 'خطة':{
  label:'تفاصيل الخطة',
  fields:[
   {id:'basis',label:'أساس بناء الخطة',type:'textarea',placeholder:'نتائج، احتياج، تقويم ذاتي، توجيه، مشكلة...'},
   {id:'objectives',label:'الأهداف المحددة',type:'textarea',placeholder:'ما الذي تسعى الخطة لتحقيقه؟'},
   {id:'actions',label:'الإجراءات الرئيسة',type:'textarea',placeholder:'الإجراءات أو الأنشطة التنفيذية'},
   {id:'responsibilities',label:'المسؤوليات',type:'textarea',placeholder:'من المسؤول عن كل جزء أو إجراء؟'},
   {id:'success',label:'مؤشرات النجاح / قياس الإنجاز',type:'textarea',placeholder:'كيف سيعرف أن الخطة حققت المطلوب؟'},
   {id:'followup',label:'آلية المتابعة',type:'text',placeholder:'أسبوعية، شهرية، بعد كل إجراء...'}
  ],
  evidence:['الخطة المعتمدة','الجدول الزمني','سجلات أو نماذج المتابعة','أدلة تنفيذ الإجراءات','نتائج أو مؤشرات قياس الإنجاز']
 },
 'تطوير مهني':{
  label:'تفاصيل التطوير المهني',
  fields:[
   {id:'path',label:'نوع المشاركة',type:'select',options:['حصلت على تدريب أو شهادة','نفذت تدريبًا أو ورشة للآخرين','نقلت أثر تدريب أو تبادلت خبرة']},
   {id:'provider',label:'الجهة / مقدم البرنامج',type:'text',placeholder:'الجهة المقدمة أو المستضيفة'},
   {id:'hours',label:'عدد الساعات',type:'text',placeholder:'مثال: 3 ساعات'},
   {id:'need',label:'الاحتياج المهني الذي يخدمه',type:'textarea',placeholder:'بناءً على أي احتياج أو نتيجة تقويم؟'},
   {id:'learning',label:'أبرز ما تم تعلمه أو نقله',type:'textarea',placeholder:'المعارف أو الممارسات المهنية الرئيسة'},
   {id:'impact',label:'التطبيق أو قياس الأثر',type:'textarea',placeholder:'كيف طبق أو نقل الأثر؟ وإن لم يقس بعد فاذكر ذلك'}
  ],
  evidence:['خطة أو تحليل احتياج','إعلان أو رابط البرنامج','كشف حضور','شهادة','مادة تدريبية أو عرض','تقرير أو أداة قياس أثر']
 },
 'إجراء متابعة':{
  label:'تفاصيل المتابعة',
  fields:[
   {id:'subject',label:'موضوع أو حالة المتابعة',type:'text',placeholder:'ما الذي تتم متابعته؟'},
   {id:'baseline',label:'الوضع عند بداية المتابعة',type:'textarea',placeholder:'صف الحالة أو الملاحظة قبل الإجراء'},
   {id:'method',label:'طريقة ودورية المتابعة',type:'text',placeholder:'يومية، أسبوعية، سجل، نظام إلكتروني...'},
   {id:'action',label:'الإجراء المتخذ',type:'textarea',placeholder:'ما الإجراء الذي نفذ فعلًا؟'},
   {id:'result',label:'الحالة أو النتيجة الحالية',type:'textarea',placeholder:'تحسن، مستمر، يحتاج تصعيدًا، لم يكتمل...'},
   {id:'next',label:'الخطوة التالية',type:'text',placeholder:'إن وجدت'}
  ],
  evidence:['سجل أو نموذج متابعة','إشعار أو تواصل موثق','صور أو مستندات داعمة','تقرير حالة','إثبات تنفيذ الإجراء أو إغلاق الحالة']
 },
 'تقرير':{label:'تفاصيل التقرير',fields:[],evidence:['تقرير','صور','كشف أو سجل','رابط أو مستند داعم']}
};
export function familyRequirements(type){return FAMILY_REQUIREMENTS[type]||{label:'تفاصيل الوثيقة',fields:[],evidence:[]}}
