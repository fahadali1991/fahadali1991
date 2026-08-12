/* Smart Guided Capture V1 — Plan family extension */
(function(){
  if(typeof WORK_TYPES!=='undefined'&&!WORK_TYPES.includes('خطة')) WORK_TYPES.push('خطة');
  if(typeof SUBTYPES!=='undefined') SUBTYPES['خطة']=['خطة تنفيذية','خطة تحسين','خطة علاجية','خطة إثرائية','خطة تطوير مهني','خطة متابعة'];
  if(typeof Q!=='undefined') Q['خطة']=[
    {id:'basis',q:'ما الذي بُنيت عليه الخطة؟',why:'اختر كل ما استندت إليه الخطة.',multi:true,opts:['احتياج محدد','نتائج وبيانات','ملاحظة ميدانية','توجيه أو تكليف','خطة المدرسة']},
    {id:'goal',q:'ما أهداف الخطة؟',why:'يمكن اختيار أكثر من هدف.',multi:true,opts:['معالجة فجوة','تحسين مستوى الأداء','تنظيم التنفيذ','رفع مستوى المتابعة','تطوير ممارسة','دعم فئة مستهدفة']},
    {id:'method',q:'كيف ستُنفذ الخطة؟',why:'اختر مكونات التنفيذ الفعلية.',multi:true,opts:['إجراءات محددة','جدول زمني','توزيع مسؤوليات','أنشطة أو برامج','متابعة دورية']},
    {id:'follow',q:'كيف ستتم متابعة الخطة؟',why:'يحدد آلية التحقق من سير التنفيذ دون افتراض نتائج.',multi:true,opts:['مؤشرات إنجاز','مراجعة دورية','قياس نتائج لاحق','تقرير متابعة','اجتماع متابعة']}
  ];

  function isPlanIntent(raw){
    let n=norm(raw||'');
    if(!has(n,'خطة','خطه')) return false;
    if(has(n,'حللنا','تحليل','نتائج','درجات','اختبار')&&has(n,'علاجي','علاج','اثرائي','اثراء')) return false;
    return true;
  }
  function planSubtype(n){
    if(has(n,'علاجي','علاج')) return 'خطة علاجية';
    if(has(n,'اثرائي','اثراء','متفوق')) return 'خطة إثرائية';
    if(has(n,'تطوير مهني','مهني','المعلمين')) return 'خطة تطوير مهني';
    if(has(n,'تحسين','تطوير','جوده','جودة')) return 'خطة تحسين';
    if(has(n,'متابعة','متابعه')) return 'خطة متابعة';
    return 'خطة تنفيذية';
  }
  function planTitle(raw,sub){
    let s=String(raw||'').trim();
    let m=s.match(/(?:خطة|خطه)\s+([^،.\n]{2,55})/i);
    if(m){
      let x=m[1].replace(/(?:لطلاب|للطالب|للمعلمين|للمعلم|عشان|بهدف|من أجل)\s.*$/i,'').trim();
      if(x){
        let clean=x.replace(/^(تنفيذية|تحسين|علاجية|إثرائية|تطوير مهني|متابعة)\s*/,'').trim();
        return clean?`${sub} ${clean}`:sub;
      }
    }
    return sub;
  }

  const baseInfer=infer;
  infer=function(raw){
    let f=baseInfer(raw),n=norm(raw||'');
    if(isPlanIntent(raw)){
      f.type='خطة';f.domain='التخطيط والتحسين';f.subtype=planSubtype(n);f.mode=f.subtype;
      f.workTitle=planTitle(raw,f.subtype);
      if(!f.audiences?.length){
        if(has(n,'طلاب','طالب','متعثر','متفوق')) f.audiences=['الطلاب'];
        else if(has(n,'معلمين','معلمات','معلم')) f.audiences=['المعلمون'];
      }
    }
    return f;
  };

  const baseInferSubtype=inferSubtype;
  inferSubtype=function(f){
    if(f?.type==='خطة') return f.subtype||planSubtype(f.n||'');
    return baseInferSubtype(f);
  };

  const baseExplain=explain;
  explain=function(f){
    if(f?.type==='خطة'){
      let who=f.audiences?.length?` تستهدف ${joinAr(f.audiences)}`:'';
      let grades=(f.audiences||[]).includes('الطلاب')&&f.grades?.length?` في ${joinAr(f.grades)}`:'';
      return `فهمت أنك أعددت ${f.workTitle||f.subtype||'خطة'}${who}${grades} لتنظيم إجراءات التحسين والتنفيذ والمتابعة.`;
    }
    return baseExplain(f);
  };

  const baseMakeTitle=makeTitle;
  makeTitle=function(){
    if(cur?.type==='خطة') return cur.workTitle?.trim()||cur.subtype||'خطة تنفيذية';
    return baseMakeTitle();
  };
  const baseWorkName=workName;
  workName=function(){
    if(cur?.type==='خطة') return cur.workTitle?.trim()||cur.subtype||'الخطة';
    return baseWorkName();
  };

  const baseParagraphBank=paragraphBank;
  paragraphBank=function(){
    if(cur?.type!=='خطة') return baseParagraphBank();
    let name=workName(),A=audienceText(),basis=valText('basis','احتياج محدد'),goals=valText('goal','تحسين مستوى الأداء'),methods=valText('method','إجراءات محددة'),follow=valText('follow','مراجعة دورية');
    let extra=typeof infoSuffix==='function'?infoSuffix():'';
    return [
      ['مبررات بناء الخطة',`أُعدت ${name} استنادًا إلى ${basis} لدى ${A}، بهدف الانتقال من تحديد الاحتياج إلى تنظيم استجابة واضحة قابلة للتنفيذ والمتابعة. وتساعد الخطة على توحيد اتجاه العمل وتحديد الأولويات بما يقلل من المعالجة العشوائية أو المنفصلة عن البيانات والسياق الفعلي.${extra}`],
      ['الأهداف والأولويات',`تركز ${name} على ${goals}. وقد روعي في تحديد الأهداف أن تكون مرتبطة بالاحتياج الذي بُنيت عليه الخطة، وأن تقود إلى إجراءات عملية يمكن متابعتها، مع توجيه الجهد نحو الأولويات الأكثر ارتباطًا بالفئة المستهدفة وطبيعة العمل.`],
      ['آلية التنفيذ',`يتم تنفيذ ${name} من خلال ${methods}. ويساعد ذلك على تحويل الأهداف إلى خطوات منظمة، مع إمكانية توزيع المسؤوليات وتحديد التوقيت المناسب لكل إجراء بحسب ما تتطلبه طبيعة الخطة، دون افتراض تنفيذ أي عنصر لم يتم تحديده فعليًا.`],
      ['المتابعة والتقويم',`تُتابع ${name} من خلال ${follow}. وتهدف المتابعة إلى التحقق من سير الإجراءات وفق ما خُطط له، ورصد ما يحتاج إلى تعديل أو دعم إضافي، ثم تحديث الخطة عند ظهور بيانات أو احتياجات جديدة. ويظل الحكم على الأثر مرتبطًا بنتائج المتابعة الفعلية وليس بمجرد وجود الخطة.`]
    ];
  };

  const baseEvidence=evidence;
  evidence=function(){
    if(cur?.type==='خطة') return 'نسخة الخطة المعتمدة، جدول الإجراءات والمسؤوليات، وأداة أو تقرير المتابعة.';
    return baseEvidence();
  };
  const baseLinks=links;
  links=function(){
    if(cur?.type==='خطة') return ['وجود خطة منظمة مرتبطة باحتياج أو بيانات','قوة الأثر تعتمد على شواهد التنفيذ والمتابعة والنتائج اللاحقة'];
    return baseLinks();
  };
})();
