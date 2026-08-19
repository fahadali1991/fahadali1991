/* Guided Capture — Benchmark Compatibility V1
   Keeps familiar school document names while using one smart engine. */
(function(){
  const GROUPS=[
    {id:'core',label:'وثائق مدرسية أساسية',icon:'📚'},
    {id:'analysis',label:'التحليل والخطط',icon:'📊'},
    {id:'pd',label:'التطوير المهني',icon:'👥'},
    {id:'family',label:'الأسرة والمتابعة',icon:'🤝'}
  ];
  const DOCS=[
    {id:'program-report',group:'core',label:'تقرير برنامج / نشاط',icon:'🎯',intent:'program',family:'برنامج / فعالية',subtype:'برنامج',title:'تقرير تنفيذ برنامج أو نشاط',help:'صف البرنامج أو النشاط كما حدث، وسأكمل فقط المعلومات الضرورية لإخراج تقرير مألوف ومتكامل.',placeholder:'مثال: نفذنا برنامج تحسين الخط لطلاب أول وثاني متوسط',qs:[
      {id:'goal',q:'ما أهداف العمل؟',why:'اختر ما ينطبق فقط.',opts:['تنمية مهارة','تعزيز قيمة','رفع المشاركة','التوعية','تحفيز الطلاب']},
      {id:'method',q:'كيف نُفذ العمل؟',why:'يمكن اختيار أكثر من أسلوب.',opts:['نشاط تفاعلي','تطبيق عملي','مسابقة','عرض ومناقشة','أركان/محطات']},
      {id:'product',q:'ما أبرز المخرجات المباشرة؟',why:'اختر ما حدث فعليًا.',opts:['مشاركات طلابية','منتجات/أعمال','مواد توعوية','توصيات','لا يوجد مخرج محدد']}
    ]},
    {id:'minutes',group:'core',label:'محضر اجتماع',icon:'📝',intent:'minutes',family:'اجتماع / متابعة إدارية',subtype:'اجتماع متابعة',title:'محضر اجتماع',help:'اذكر سبب الاجتماع ومن حضره، وسأبني معك المحاور والقرارات والتكليفات.',placeholder:'مثال: اجتمعنا مع معلمي اللغة العربية لمراجعة نتائج الفترة وتوزيع المهام',qs:[
      {id:'purpose',q:'ما أغراض الاجتماع؟',why:'يمكن اختيار أكثر من غرض.',opts:['متابعة','تخطيط','حل مشكلة','مراجعة نتائج','توزيع مهام']},
      {id:'work',q:'ما أبرز ما نوقش؟',why:'اختر المحاور التي حدثت فعليًا.',opts:['مراجعة ما تم','تحليل أسباب','تحديد أولويات','تنسيق الإجراءات','مناقشة التحديات']},
      {id:'product',q:'ما الذي انتهى إليه الاجتماع؟',why:'هذه أهم عناصر المحضر.',opts:['توصيات','تكليفات ومسؤوليات','إجراءات محددة','خطة عمل','موعد متابعة']}
    ]},
    {id:'exam-analysis',group:'analysis',label:'تحليل نتائج اختبار',icon:'📈',intent:'analysis',family:'تحليل نتائج',subtype:'تحليل نتائج',title:'تحليل نتائج اختبار',help:'لتحليل اختبار واحد. سنبقي البيانات الأساسية مألوفة، والحسابات الرقمية ستكون آلية عند إضافة الدرجات لاحقًا.',placeholder:'مثال: تحليل نتائج اختبار الفترة لطلاب الأول المتوسط في مادة لغتي',qs:[
      {id:'basis',q:'ما نوع النتائج التي تعتمد عليها؟',why:'حدد مصدر التحليل.',opts:['اختبار فترة','اختبار نهائي','اختبار قصير','نتائج عدة تقويمات']},
      {id:'action',q:'ماذا ظهر أو تقرر بعد التحليل؟',why:'يمكن اختيار أكثر من إجراء.',opts:['تحديد المتعثرين','تحديد المتفوقين','خطة علاجية','خطة إثرائية','تعديل التدريس']},
      {id:'follow',q:'كيف ستتابع النتائج؟',why:'لا نفترض أثرًا قبل القياس.',opts:['إعادة قياس لاحق','متابعة أداء الطلاب','اختبار قصير بعد التدخل','لم تحدد المتابعة بعد']}
    ]},
    {id:'diagnostic-test',group:'analysis',label:'تقرير اختبار تشخيصي',icon:'🩻',intent:'analysis',family:'تحليل نتائج',subtype:'اختبار تشخيصي',title:'تقرير اختبار تشخيصي',help:'مخصص لتشخيص المستوى أو المهارات قبل بناء التدخل المناسب.',placeholder:'مثال: نفذنا اختبارًا تشخيصيًا في القراءة لطلاب الأول المتوسط لتحديد المهارات الضعيفة',qs:[
      {id:'basis',q:'ما مجال التشخيص؟',why:'اختر ما يقيسه الاختبار.',opts:['مهارات أساسية','فهم قرائي','مهارات كتابية','معارف سابقة','أكثر من مجال']},
      {id:'action',q:'ما الإجراء الناتج عن التشخيص؟',why:'حدد ما سيتم فعليًا بعد التشخيص.',opts:['تحديد المتعثرين','تقسيم الطلاب حسب الاحتياج','خطة علاجية','تعديل التدريس','متابعة فقط']},
      {id:'follow',q:'كيف ستتحقق من التقدم؟',why:'حدد القياس اللاحق إن كان معروفًا.',opts:['اختبار بعدي','اختبار قصير','متابعة مهارية','لم يحدد بعد']}
    ]},
    {id:'pre-post',group:'analysis',label:'تحليل قبلي / بعدي',icon:'↔️',intent:'analysis',family:'تحليل نتائج',subtype:'تحليل قبلي/بعدي',title:'تحليل نتائج قبلي وبعدي',help:'يقيس التغير بين قياسين بدل الاكتفاء بدرجة واحدة.',placeholder:'مثال: مقارنة نتائج الطلاب في اختبار قبلي وبعدي لبرنامج تحسين القراءة',qs:[
      {id:'basis',q:'ما الذي تتم مقارنته؟',why:'حدد نوع القياسين.',opts:['اختبار قبلي وبعدي','قياس مهارة قبل وبعد','نتائج قبل تدخل وبعده']},
      {id:'action',q:'كيف ستستخدم نتيجة المقارنة؟',why:'اختر ما سيحدث بناءً عليها.',opts:['قياس مقدار التحسن','تحديد من يحتاج متابعة','تطوير التدخل','إنهاء الخطة للحالات المتحسنة']},
      {id:'follow',q:'هل توجد متابعة بعد القياس البعدي؟',why:'اختر عند الحاجة.',opts:['متابعة الحالات المتبقية','قياس ثالث لاحق','لا توجد متابعة محددة']}
    ]},
    {id:'remedial-plan',group:'analysis',label:'خطة علاجية',icon:'🩺',intent:'plan',family:'خطة',subtype:'خطة علاجية',title:'خطة علاجية',help:'اختر فردية أو جماعية داخل الوصف، وسيربط النظام الخطة بالتشخيص والإجراءات والمتابعة.',placeholder:'مثال: خطة علاجية جماعية لطلاب الأول المتوسط الضعاف في الفهم القرائي',qs:[
      {id:'basis',q:'على ماذا بُنيت الخطة؟',why:'حدد مصدر الاحتياج.',opts:['اختبار تشخيصي','تحليل نتائج','ملاحظة مهارية','أداء صفي']},
      {id:'goal',q:'ما أهداف الخطة؟',why:'يمكن اختيار أكثر من هدف.',opts:['معالجة فجوة مهارية','رفع مستوى التحصيل','تحسين المشاركة','دعم طالب أو مجموعة']},
      {id:'method',q:'ما أبرز أساليب العلاج؟',why:'اختر ما ستنفذه فعليًا.',opts:['تدريس علاجي مباشر','تدريس الأقران','تدريبات متدرجة','تعزيز ومتابعة','تواصل مع الأسرة']},
      {id:'follow',q:'كيف ستقيس التقدم؟',why:'القياس شرط للحكم على الأثر.',opts:['اختبار بعدي','متابعة مهارية','أداة ملاحظة','مقارنة نتائج','تقرير متابعة']}
    ]},
    {id:'enrichment-plan',group:'analysis',label:'خطة إثرائية',icon:'🚀',intent:'plan',family:'خطة',subtype:'خطة إثرائية',title:'خطة إثرائية',help:'مخصصة للطلاب المتفوقين أو من أظهروا مستوى متقدمًا، مع أنشطة وتحديات مناسبة.',placeholder:'مثال: خطة إثرائية للطلاب المتفوقين في القراءة',qs:[
      {id:'basis',q:'ما أساس اختيار الفئة؟',why:'حدد نقطة القوة أو مصدر الترشيح.',opts:['نتائج مرتفعة','إتقان مهارة','ملاحظة أداء متميز','ترشيح موهبة']},
      {id:'goal',q:'ما الهدف المتقدم؟',why:'اختر الهدف الذي يرفع مستوى التحدي.',opts:['تعميق الفهم','توسيع المعرفة','إنتاج مشروع','تنمية الإبداع','مهام متقدمة']},
      {id:'method',q:'ما نوع الإثراء؟',why:'اختر ما يناسب التنفيذ.',opts:['مشروع','تحديات إضافية','بحث واستقصاء','تعلم مستقل','مشاركة في مسابقة']},
      {id:'follow',q:'كيف ستتابع الإنجاز؟',why:'حدد المنتج أو أداة المتابعة.',opts:['منتج نهائي','عرض أو تقديم','ملف أعمال','أداة تقييم','متابعة دورية']}
    ]},
    {id:'training-attendance',group:'pd',label:'تقرير حضور دورة / ورشة',icon:'🎟️',intent:'pd',family:'تطوير مهني',subtype:'تدريب',title:'تقرير حضور برنامج تدريبي',help:'مخصص لتوثيق حضور المعلم أو الموظف لدورة أو ورشة خارجية أو داخلية.',placeholder:'مثال: حضرت دورة عن استراتيجيات تنمية الفهم القرائي',qs:[
      {id:'reason',q:'ما سبب حضور النشاط؟',why:'اختر الدافع المهني.',opts:['احتياج مهني','توجيه إشرافي','خطة تطوير مهني','اهتمام تخصصي']},
      {id:'product',q:'ما أبرز ما خرجت به؟',why:'اختر المخرج الفعلي.',opts:['معرفة جديدة','ممارسة قابلة للتطبيق','مادة تدريبية','توصيات']},
      {id:'follow',q:'كيف ستستفيد منه لاحقًا؟',why:'لا نفترض تطبيقًا لم يحدث.',opts:['تطبيق صفي','نقل الخبرة للزملاء','تجربة أداة أو استراتيجية','لا توجد متابعة محددة']}
    ]},
    {id:'training-delivery',group:'pd',label:'تقرير تنفيذ دورة / ورشة',icon:'🎓',intent:'pd',family:'تطوير مهني',subtype:'ورشة',title:'تقرير تنفيذ برنامج تدريبي',help:'مخصص لمن نفذ تدريبًا أو ورشة للزملاء، ويختلف عن مجرد الحضور.',placeholder:'مثال: نفذت ورشة للمعلمين عن استخدام الذكاء الاصطناعي في إعداد الدروس',qs:[
      {id:'reason',q:'ما مبررات التنفيذ؟',why:'اختر سبب تنفيذ التدريب.',opts:['احتياج مهني','نتائج الطلاب','توجيه إشرافي','خطة المدرسة','تبادل خبرات']},
      {id:'method',q:'كيف نُفذ التدريب؟',why:'حدد أسلوب التنفيذ.',opts:['ورشة تطبيقية','عرض ومناقشة','تدريب عملي','تطبيق مباشر']},
      {id:'product',q:'ما المخرجات المباشرة؟',why:'اختر ما تحقق فعليًا.',opts:['مادة تدريبية','توصيات','ممارسة للتطبيق','منتج تدريبي']},
      {id:'follow',q:'ما المتابعة المقترحة؟',why:'حددها فقط إن كانت موجودة.',opts:['تطبيق صفي','زيارة تبادلية','لقاء متابعة','مشاركة تجربة التطبيق']}
    ]},
    {id:'plc',group:'pd',label:'مجتمع تعلم مهني',icon:'🔄',intent:'pd',family:'تطوير مهني',subtype:'مجتمع تعلم مهني',title:'تقرير مجتمع تعلم مهني',help:'يحافظ على طبيعة الجلسة المهنية: موضوع، نقاش، مخرج، وتطبيق لاحق.',placeholder:'مثال: مجتمع تعلم مهني لمعلمي العربية عن تحسين تدريس القراءة',qs:[
      {id:'reason',q:'ما سبب عقد المجتمع المهني؟',why:'حدد الاحتياج أو الدافع.',opts:['احتياج مهني','نتائج الطلاب','تبادل خبرات','خطة المدرسة']},
      {id:'method',q:'كيف تمت الجلسة؟',why:'اختر ما حدث فعليًا.',opts:['مناقشة مهنية','عرض ممارسة','تحليل حالة','تبادل خبرات']},
      {id:'product',q:'ما مخرج الجلسة؟',why:'حدد ما خرج به المجتمع.',opts:['توصيات','ممارسة للتطبيق','خطة متابعة','أداة أو مادة مشتركة']},
      {id:'follow',q:'ما الخطوة التالية؟',why:'يمكن أن تكون جلسة أو تطبيقًا.',opts:['تطبيق صفي','جلسة لاحقة','زيارة تبادلية','مشاركة نتائج التطبيق']}
    ]},
    {id:'exchange-visit',group:'pd',label:'زيارة صفية تبادلية',icon:'👁️',intent:'pd',family:'تطوير مهني',subtype:'زيارة صفية تبادلية',title:'تقرير زيارة صفية تبادلية',help:'مخصص لتبادل الخبرة بين المعلمين داخل الصف، وليس ملاحظة أداء رسمية.',placeholder:'مثال: زيارة صفية تبادلية بين معلمي العربية لمشاهدة استراتيجية تدريس',qs:[
      {id:'reason',q:'ما هدف الزيارة؟',why:'حدد الغرض المهني.',opts:['مشاهدة استراتيجية','تبادل خبرة','ملاحظة ممارسة ناجحة','تحسين تدريس مهارة']},
      {id:'method',q:'ما الذي تم التركيز عليه؟',why:'اختر عناصر الممارسة.',opts:['إدارة التعلم','استراتيجية تدريس','تفاعل الطلاب','التقويم أثناء الدرس']},
      {id:'product',q:'ما أبرز ما تم تعلمه؟',why:'اختر المخرج المهني.',opts:['ممارسة قابلة للتطبيق','ملاحظات مهنية','توصيات','فكرة لتطوير الدرس']},
      {id:'follow',q:'ما الخطوة التالية؟',why:'حددها عند وجودها.',opts:['تطبيق الممارسة','زيارة عكسية','نقاش لاحق','مشاركة تجربة التطبيق']}
    ]},
    {id:'parent-contact',group:'family',label:'تقرير تواصل مع ولي الأمر',icon:'☎️',intent:'follow',family:'إجراء متابعة',subtype:'متابعة حالة طلابية',title:'تقرير تواصل مع ولي الأمر',help:'مخصص للتواصل الفردي حول تعلم الطالب أو حضوره أو سلوكه، مع توثيق الإجراء والمتابعة.',placeholder:'مثال: تواصلنا مع ولي أمر طالب متعثر في القراءة واتفقنا على متابعة منزلية',qs:[
      {id:'goal',q:'ما سبب التواصل؟',why:'اختر السبب الأقرب.',opts:['تعثر دراسي','غياب أو تأخر','سلوك','متابعة تقدم','تعزيز مستوى جيد']},
      {id:'method',q:'كيف تم التواصل؟',why:'اختر الوسيلة المستخدمة.',opts:['اتصال هاتفي','لقاء حضوري','رسالة رسمية','منصة مدرسية']},
      {id:'outcome',q:'ما الذي نتج عن التواصل؟',why:'اختر فقط ما تم الاتفاق عليه.',opts:['اتفاق على متابعة','إجراء أسري','إحالة للمتابعة','موعد تواصل لاحق','توثيق ملاحظة فقط']}
    ]}
  ];

  window.GC_BENCHMARK_DOC=null;
  const byId=id=>DOCS.find(d=>d.id===id);
  const groupDocs=g=>DOCS.filter(d=>d.group===g);

  function renderLibrary(){
    const card=document.querySelector('main.wrap > section.card'); if(!card)return;
    card.innerHTML=`<button type="button" class="backEntry" onclick="returnToEntryHome()">→ رجوع</button>
      <div class="entryKicker">مكتبة المستندات المرجعية</div>
      <h1 class="entryTitle">ابدأ من مستند مألوف</h1>
      <p class="entryLead">هذه الوثائق تحافظ على الأسماء والبنية المألوفة للمعلم والإدارة، لكن إدخالها يمر عبر نفس المحرك الذكي.</p>
      <div class="benchGroups">${GROUPS.map(g=>`<section class="benchGroup"><div class="benchGroupTitle"><span>${g.icon}</span><b>${g.label}</b></div><div class="benchGrid">${groupDocs(g.id).map(d=>`<button type="button" class="benchTile" onclick="openBenchmarkDoc('${d.id}')"><span>${d.icon}</span><b>${d.label}</b></button>`).join('')}</div></section>`).join('')}</div>`;
    const out=document.getElementById('out');if(out)out.innerHTML='';
  }
  window.openBenchmarkLibrary=renderLibrary;

  function injectButton(){
    const more=document.querySelector('.moreEntry');
    if(!more||document.getElementById('benchmarkLibraryBtn'))return;
    const b=document.createElement('button');b.type='button';b.id='benchmarkLibraryBtn';b.className='benchmarkLibraryBtn';b.onclick=renderLibrary;
    b.innerHTML='<span>📚</span><span><b>مكتبة المستندات</b><small>وثائق مألوفة بإنشاء ذكي</small></span><span>←</span>';
    more.parentNode.insertBefore(b,more);
  }

  window.openBenchmarkDoc=function(id){
    const d=byId(id);if(!d)return;
    window.GC_BENCHMARK_DOC=d;
    if(typeof openEntry==='function')openEntry(d.intent);
    setTimeout(()=>{
      const chosen=document.querySelector('.entryChosen');if(chosen)chosen.textContent=`${d.icon} ${d.label}`;
      const title=document.querySelector('.entryFormTitle');if(title)title.textContent=d.title;
      const lead=document.querySelector('.entryLead');if(lead)lead.textContent=d.help;
      const raw=document.getElementById('raw');if(raw)raw.placeholder=d.placeholder;
    },0);
  };

  function applyDocContext(){
    const d=window.GC_BENCHMARK_DOC;if(!d||typeof cur==='undefined'||!cur)return;
    cur.benchmarkDocId=d.id;cur.benchmarkLabel=d.label;cur.type=d.family;cur.answers={};cur.mode='';cur.subtype=d.subtype||'';
    if(d.family==='برنامج / فعالية')cur.mode=d.subtype||'برنامج';
    if(d.family==='خطة')cur.mode=d.subtype||'';
    cur.workTitle='';cur._titleSuggestions=[];cur._titleIndex=0;cur._titleSig='';
    if(typeof ensureTitleSuggestions==='function')ensureTitleSuggestions();
    if(!cur.workTitle||/^(?:تحليل نتائج التقويم|نشاط تطوير مهني|تعزيز متابعة)/.test(cur.workTitle))cur.workTitle=d.title;
  }

  const baseStart=window.start;
  window.start=function(){
    const r=baseStart.apply(this,arguments);
    if(window.GC_BENCHMARK_DOC&&typeof cur!=='undefined'&&cur){applyDocContext();if(typeof renderUnderstanding==='function')renderUnderstanding()}
    return r;
  };

  const baseQuestions=typeof questionsFor==='function'?questionsFor:null;
  if(baseQuestions)questionsFor=function(){
    const d=window.GC_BENCHMARK_DOC;
    if(!d||!d.qs)return baseQuestions();
    let arr=d.qs.map(q=>({id:q.id,q:q.q,why:q.why,multi:true,opts:q.opts.slice()}));
    /* Respect facts already explicit in the description. */
    const n=cur?.n||'';
    if(d.id==='minutes'&&cur.mode){cur.answers.purpose=[cur.mode];arr=arr.filter(x=>x.id!=='purpose')}
    if(d.id==='remedial-plan'&&has(n,'اختبار تشخيصي','تحليل نتائج')){cur.answers.basis=[has(n,'اختبار تشخيصي')?'اختبار تشخيصي':'تحليل نتائج'];arr=arr.filter(x=>x.id!=='basis')}
    if(d.id==='parent-contact'&&has(n,'اتصل','اتصال','هاتف')){cur.answers.method=['اتصال هاتفي'];arr=arr.filter(x=>x.id!=='method')}
    return arr;
  };

  const oldHome=window.returnToEntryHome;
  if(typeof oldHome==='function')window.returnToEntryHome=function(){window.GC_BENCHMARK_DOC=null;oldHome();setTimeout(injectButton,0)};
  setTimeout(injectButton,0);

  if(typeof SUBTYPES!=='undefined'){
    SUBTYPES['تحليل نتائج']=uniq([...(SUBTYPES['تحليل نتائج']||[]),'اختبار تشخيصي','تحليل قبلي/بعدي']);
    SUBTYPES['إجراء متابعة']=uniq([...(SUBTYPES['إجراء متابعة']||[]),'متابعة حالة طلابية']);
  }

  const css=document.createElement('style');
  css.textContent=`.benchmarkLibraryBtn{width:100%;margin:12px 0 4px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;text-align:right;border:1px solid #d9e6e2;background:#fff;border-radius:16px;padding:13px 14px;color:#214039}.benchmarkLibraryBtn>span:first-child{font-size:24px}.benchmarkLibraryBtn b{display:block;font-size:15px}.benchmarkLibraryBtn small{display:block;color:#71807b;margin-top:2px}.benchGroup{margin:16px 0}.benchGroupTitle{display:flex;gap:8px;align-items:center;margin-bottom:9px;color:#173f38}.benchGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.benchTile{min-height:82px;border:1px solid #dce7e3;background:#fff;border-radius:15px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:#233a35}.benchTile span{font-size:23px}.benchTile b{font-size:13px;line-height:1.5}@media(min-width:700px){.benchGrid{grid-template-columns:repeat(3,1fr)}}`;
  document.head.appendChild(css);
})();
