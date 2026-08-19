/* Smart Guided Capture V1 — QA Fix Pack
   Scope: classification stability, compound grades, broader PD/follow-up,
   state reset, exclusive audiences, custom answers, stable title carousel. */
(function(){
  const ORD={اول:'الأول',الاول:'الأول',ثاني:'الثاني',الثاني:'الثاني',ثالث:'الثالث',الثالث:'الثالث',رابع:'الرابع',الرابع:'الرابع',خامس:'الخامس',الخامس:'الخامس',سادس:'السادس',السادس:'السادس'};
  const STAGE_LABEL={ابتدائي:'الابتدائي',متوسط:'المتوسط',ثانوي:'الثانوي'};
  const STAGE_MAX={ابتدائي:6,متوسط:3,ثانوي:3};
  const ORD_NUM={اول:1,الاول:1,ثاني:2,الثاني:2,ثالث:3,الثالث:3,رابع:4,الرابع:4,خامس:5,الخامس:5,سادس:6,السادس:6};

  /* 1) Compound grades: "أول وثاني متوسط" / "الأول والثاني المتوسط" */
  gradeFrom=function(input){
    const n=norm(input||''),grades=[]; let stage='';
    const stageRe=/(ابتدائي|متوسط|ثانوي)/g; let sm;
    while((sm=stageRe.exec(n))){
      const st=sm[1]; stage=stage||st;
      const before=n.slice(Math.max(0,sm.index-60),sm.index).split(/[،,.؛;\n]/).pop()||'';
      const ordRe=/(الاول|اول|الثاني|ثاني|الثالث|ثالث|الرابع|رابع|الخامس|خامس|السادس|سادس)/g; let om;
      while((om=ordRe.exec(before))){
        const num=ORD_NUM[om[1]]||0;
        if(num&&num<=STAGE_MAX[st]) grades.push(`${ORD[om[1]]} ${STAGE_LABEL[st]}`);
      }
      /* Also catch an ordinal immediately after a stage in natural phrases. */
      const after=n.slice(sm.index+sm[0].length,sm.index+sm[0].length+24);
      const am=after.match(/^\s*(الاول|اول|الثاني|ثاني|الثالث|ثالث)/);
      if(am){const num=ORD_NUM[am[1]]||0;if(num&&num<=STAGE_MAX[st])grades.push(`${ORD[am[1]]} ${STAGE_LABEL[st]}`)}
    }
    if(!stage) stage=has(n,'ابتدائي')?'ابتدائي':has(n,'متوسط')?'متوسط':has(n,'ثانوي')?'ثانوي':'';
    return{stage,grades:uniq(grades)};
  };

  function directPlanIntent(raw){
    const n=norm(raw||'');
    if(!has(n,'خطه'))return false;
    if(has(n,'اجتماع','اجتمعنا','محضر','لجنه'))return false;
    if(/(?:ضمن|وفق|حسب|استنادا الى|استنادًا إلى)\s+خطه/.test(n))return false;
    if(/(?:مراجعه|ناقشنا|استعرضنا|تابعنا)\s+(?:تنفيذ\s+)?خطه/.test(n))return false;
    if(has(n,'حللنا','تحليل','نتائج','درجات','اختبار')&&has(n,'ثم','بعد')&&has(n,'علاجي','علاج','اثرائي','اثراء','خطه'))return false;
    return /(?:^|\s)(?:اعددنا|اعدينا|جهزنا|سويت|سوينا|وضعنا|نبغى|نحتاج|اعداد|بناء|صممنا)\s+(?:لنا\s+)?خطه/.test(n) || /^\s*خطه\s+/.test(n);
  }
  function pdIntent(n){return has(n,'مجتمع مهني','مجتمع تعلم','ورشه','تدريب','دوره','دورة','تبادل خبرات','لقاء مهني','لقاء تبادل','زياره صفيه','زياره تبادليه','درس تطبيقي','تطوير مهني')}
  function followIntent(n){
    const followWords=has(n,'متابعه','تابعنا','تواصلنا','تواصل مع','اتصلنا','اتصال','استدعينا','احاله','رصد حاله','حالات الطلاب','اولياء الامور','ولي الامر');
    const analysisAction=has(n,'حللنا','تحليل','حلل','نتائج','درجات','اختبار','مقارنه نتائج');
    return followWords&&!analysisAction;
  }
  function programIntent(n){return has(n,'برنامج','فعاليه','نشاط','مبادره','مسابقه','حمله')}
  function meetingIntent(n){return has(n,'اجتماع','اجتمعنا','محضر','لجنه')}

  /* 2–4) Context-aware classification. Keep explicit work stronger than incidental words. */
  const qaBaseInfer=infer;
  infer=function(raw){
    const f=qaBaseInfer(raw),n=norm(raw||''),g=gradeFrom(n);
    f.stage=g.stage||f.stage; f.grades=g.grades.length?g.grades:f.grades;
    const plan=directPlanIntent(raw);
    if(meetingIntent(n)){
      f.type='اجتماع / متابعة إدارية';f.domain='الإدارة والمتابعة';
      f.mode=has(n,'نتائج','درجات')?'مراجعة نتائج':has(n,'مشكل','معالجه','حل')?'حل مشكلة':has(n,'تخطيط')?'تخطيط':has(n,'متابعه','تكليف','انجاز')?'متابعة':'';
    }else if(plan){
      f.type='خطة';f.domain='التخطيط والتحسين';f.mode='';
    }else if(pdIntent(n)){
      f.type='تطوير مهني';f.domain='التطوير المهني';f.mode='';if(!f.audiences.length)f.audiences=['المعلمون'];
    }else if(programIntent(n)){
      f.type='برنامج / فعالية';f.domain='البرامج والأنشطة';f.mode=has(n,'مسابقه')?'مسابقة':has(n,'حمله')?'حملة':has(n,'مبادره')?'مبادرة':has(n,'فعاليه')?'فعالية':has(n,'نشاط')?'نشاط':'برنامج';
    }else if(followIntent(n)){
      f.type='إجراء متابعة';
      f.domain=has(n,'غياب','حضور','تاخير','انضباط')?'الحضور والانضباط':'متابعة الحالات';
      f.mode=has(n,'غياب')?'غياب':has(n,'تاخير','متاخر')?'تأخر':has(n,'اولياء','ولي الامر','تواصل','اتصال','استدعينا')?'متابعة حالة':'';
      if(!f.audiences.length&&has(n,'طالب','طلاب','متعثر','متاخر'))f.audiences=['الطلاب'];
    }
    if(typeof inferSubtype==='function')f.subtype=inferSubtype(f);
    /* Any classifier change invalidates a stale title. */
    if(f.workTitle&&typeof genericTitle==='function'&&genericTitle(f.workTitle))f.workTitle='';
    return f;
  };

  /* 3) Expand PD vocabulary and subtype options. */
  if(typeof SUBTYPES!=='undefined'&&SUBTYPES['تطوير مهني']){
    SUBTYPES['تطوير مهني']=uniq([...SUBTYPES['تطوير مهني'],'زيارة صفية تبادلية','درس تطبيقي']);
  }
  const qaSubtypeBase=inferSubtype;
  inferSubtype=function(f){
    if(f?.type==='تطوير مهني'){
      const n=f.n||norm(f.raw||'');
      if(has(n,'زياره صفيه','زياره تبادليه'))return'زيارة صفية تبادلية';
      if(has(n,'درس تطبيقي'))return'درس تطبيقي';
      if(has(n,'مجتمع مهني','مجتمع تعلم'))return'مجتمع تعلم مهني';
      if(has(n,'ورشه'))return'ورشة';
      if(has(n,'تدريب','دوره'))return'تدريب';
      if(has(n,'تبادل خبرات','لقاء تبادل'))return'لقاء تبادل خبرات';
    }
    if(f?.type==='إجراء متابعة'){
      const n=f.n||norm(f.raw||'');
      if(has(n,'غياب'))return'متابعة غياب';
      if(has(n,'تاخير','متاخر'))return'متابعة تأخر';
      if(has(n,'انضباط','مواظبه'))return'متابعة انضباط';
      return'متابعة حضور';
    }
    return qaSubtypeBase(f);
  };
  if(typeof Q!=='undefined'&&Q['تطوير مهني']){
    const method=Q['تطوير مهني'].find(x=>x.id==='method');
    if(method)method.opts=uniq([...method.opts,'زيارة صفية تبادلية','درس تطبيقي']);
  }
  if(typeof Q!=='undefined'&&Q['إجراء متابعة']){
    const goal=Q['إجراء متابعة'].find(x=>x.id==='goal');
    const method=Q['إجراء متابعة'].find(x=>x.id==='method');
    const outcome=Q['إجراء متابعة'].find(x=>x.id==='outcome');
    if(goal)goal.opts=uniq([...goal.opts,'متابعة حالات طلابية','تعزيز التواصل مع الأسرة']);
    if(method)method.opts=uniq([...method.opts,'تواصل مع ولي الأمر','متابعة فردية للحالة']);
    if(outcome)outcome.opts=uniq([...outcome.opts,'توثيق التواصل والإجراء','تحديد حالات تحتاج متابعة مستمرة']);
  }

  /* 5) Reset state completely when the user changes the work family. */
  setTypeEnhanced=function(v){
    if(!cur)return;
    cur.type=v;cur.answers={};cur.subtype='';cur.mode='';cur.workTitle='';cur._titleSuggestions=[];cur._titleIndex=0;cur._titleSig='';
    if(v==='برنامج / فعالية')cur.mode='برنامج';
    if(v==='اجتماع / متابعة إدارية'){
      const n=cur.n||norm(cur.raw||'');
      cur.mode=has(n,'نتائج','درجات')?'مراجعة نتائج':has(n,'مشكل','معالجه','حل')?'حل مشكلة':has(n,'تخطيط')?'تخطيط':has(n,'متابعه','تكليف')?'متابعة':'';
    }
    cur.subtype=inferSubtype(cur);
    renderUnderstanding();
  };
  if(typeof setType==='function')setType=function(v){setTypeEnhanced(v)};

  /* 7) Stable title carousel: do not rebuild/reorder while arrows are used. */
  ensureTitleSuggestions=function(){
    if(!cur)return;
    const sig=[cur.raw,cur.type,cur.subtype,cur.topic,cur.mode].map(x=>String(x||'')).join('|');
    if(cur._titleSig===sig&&Array.isArray(cur._titleSuggestions)&&cur._titleSuggestions.length){
      if(!Number.isInteger(cur._titleIndex)||cur._titleIndex<0||cur._titleIndex>=cur._titleSuggestions.length)cur._titleIndex=0;
      if(!cur.workTitle)cur.workTitle=cur._titleSuggestions[cur._titleIndex];
      return;
    }
    let list=typeof buildTitleSuggestions==='function'?buildTitleSuggestions(cur):[];
    list=uniq((list||[]).filter(x=>x&&!(typeof genericTitle==='function'&&genericTitle(x))));
    cur._titleSig=sig;cur._titleSuggestions=list;cur._titleIndex=0;
    if(list.length)cur.workTitle=list[0];
  };

  /* 8) Better extraction around Arabic prepositions in titles. */
  if(typeof titleSubjectFromRaw==='function'){
    const oldSubject=titleSubjectFromRaw;
    titleSubjectFromRaw=function(raw){
      let s=String(raw||'').trim();
      let m=s.match(/(?:برنامج|مبادرة|مسابقة|حملة|فعالية|نشاط|ورشة|تدريب|خطة)\s+([^،.\n]{2,80})/i);
      if(m){
        let x=m[1].replace(/(?:لطلاب|للطلاب|للطالب|للطالبات|للمعلمين|للمعلم|لأولياء|لأولياء الأمور|لمنسوبي|عشان|بهدف|من أجل)\s.*$/i,'').trim();
        x=x.replace(/^(?:عن|حول)\s+/,'').trim();
        if(x.length>2&&!(typeof genericTitle==='function'&&genericTitle(x)))return x;
      }
      return oldSubject(raw);
    };
  }

  /* 10) "All school staff" is exclusive; selecting a specific audience removes it. */
  toggleChip=function(field,val){
    let arr=cur[field]||[];
    if(field==='audiences'){
      if(val==='جميع منسوبي المدرسة') arr=arr.includes(val)?[]:['جميع منسوبي المدرسة'];
      else{
        arr=arr.filter(x=>x!=='جميع منسوبي المدرسة');
        arr=arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];
      }
    }else arr=arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];
    cur[field]=uniq(arr);
    if(field==='audiences'&&!hasStudent())cur.grades=[];
    renderUnderstanding();
  };

  /* 9) Preserve custom "Other" values visibly during review; Skip clears old answer. */
  renderQ=function(){
    let qs=cur._qs||[];if(qi>=qs.length)return renderReady();
    let q=qs[qi],pct=Math.round((qi/Math.max(qs.length,1))*100);
    tempSelections=[...(Array.isArray(cur.answers[q.id])?cur.answers[q.id]:cur.answers[q.id]?[cur.answers[q.id]]:[])];
    const custom=tempSelections.filter(v=>!q.opts.includes(v));
    $('out').innerHTML=`<section class="card"><div class="muted">تحسين التقرير · ${qi+1} من ${qs.length}</div><div class="progress"><span style="width:${pct}%"></span></div><h2 style="margin-top:16px">${esc(q.q)}</h2><div class="why">${esc(q.why)}</div><div id="qchips" class="chiprow">${q.opts.map(o=>`<button class="chip ${tempSelections.includes(o)?'on':''}" onclick="toggleAnswer('${esc(o)}')">${esc(o)}</button>`).join('')}${custom.map(o=>`<button class="chip on" onclick="toggleAnswer('${esc(o)}')">${esc(o)}</button>`).join('')}<button class="chip" onclick="toggleOther()">أخرى</button></div><div id="otherBox" class="hidden otherBox"><input id="otherText" placeholder="اكتب ما تريد إضافته"><button class="btn soft" onclick="addOther()">إضافة</button></div><div class="row" style="margin-top:16px"><button class="btn primary" onclick="saveAnswer('${q.id}')">التالي</button><button class="btn" onclick="skipQ()">تخطي</button></div></section>`;
    if(typeof enhanceSpellInputs==='function')enhanceSpellInputs(document);
  };
  skipQ=function(){let q=cur?._qs?.[qi];if(q&&cur?.answers)delete cur.answers[q.id];qi++;renderQ()};

  /* Only valid modes may auto-answer questions. */
  questionsFor=function(){
    let arr=[...(Q[cur.type]||[])];
    if(cur.type==='اجتماع / متابعة إدارية'&&['متابعة','تخطيط','حل مشكلة','مراجعة نتائج'].includes(cur.mode)){
      cur.answers.purpose=[cur.mode];arr=arr.filter(x=>x.id!=='purpose');
    }
    if(cur.type==='إجراء متابعة'&&cur.mode==='على مستوى الحصة'){
      cur.answers.method=['رصد على مستوى الحصة'];arr=arr.filter(x=>x.id!=='method');
    }
    if(cur.type==='إجراء متابعة'&&cur.mode==='بصمة'){
      cur.answers.method=['بصمة أو وسيلة إلكترونية'];arr=arr.filter(x=>x.id!=='method');
    }
    if(cur.type==='تحليل نتائج'&&cur.mode==='علاجي'){
      cur.answers.action=['خطة علاجية'];arr=arr.filter(x=>x.id!=='action');
    }
    return arr;
  };

  /* Lightweight internal regression suite, callable from console: runGuidedCaptureQATests() */
  window.runGuidedCaptureQATests=function(){
    const cases=[
      ['نفذنا ورشة للمعلمين ضمن خطة المدرسة','تطوير مهني'],['نفذنا برنامج تحسين الخط ضمن خطة المدرسة','برنامج / فعالية'],['اجتمعنا لمراجعة خطة المدرسة','اجتماع / متابعة إدارية'],['سويت خطة علاجية للطلاب الضعاف','خطة'],['جهزنا خطة تطوير مهني للمعلمين','خطة'],
      ['لقاء تبادل خبرات بين المعلمين','تطوير مهني'],['زيارة صفية تبادلية بين معلمي العربي','تطوير مهني'],['سوينا دورة للمعلمين عن التقنية','تطوير مهني'],['درس تطبيقي للمعلمين عن استراتيجيات القراءة','تطوير مهني'],
      ['تواصلنا مع أولياء أمور الطلاب المتعثرين للمتابعة','إجراء متابعة'],['استدعينا ولي أمر طالب بسبب تكرار الغياب','إجراء متابعة'],['تابعنا حالة طالب متعثر مع أسرته','إجراء متابعة'],
      ['حللنا نتائج الفترة وحددنا المتعثرين','تحليل نتائج'],['حللنا النتائج ثم وضعنا خطة علاجية','تحليل نتائج'],['أطلقنا مبادرة للمحافظة على النظافة','برنامج / فعالية'],['سوينا مسابقة قراءة','برنامج / فعالية']
    ];
    const rows=cases.map(([raw,expected])=>{let got=infer(raw);return{raw,expected,got:got.type,pass:got.type===expected,grades:got.grades}});
    return{total:rows.length,passed:rows.filter(x=>x.pass).length,failed:rows.filter(x=>!x.pass),rows};
  };
})();
