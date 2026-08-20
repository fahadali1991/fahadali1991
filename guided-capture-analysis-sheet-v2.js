/* Analysis Sheet V2.3 — smart classroom grades analysis
   Familiar input, lower effort, stronger validation, print-safe interpretation.
*/
(function(){
  const LEVELS=[
    {key:'excellent',label:'ممتاز',min:.90,max:1},
    {key:'verygood',label:'جيد جدًا',min:.80,max:.90},
    {key:'good',label:'جيد',min:.70,max:.80},
    {key:'pass',label:'مقبول',min:.50,max:.70},
    {key:'weak',label:'ضعيف',min:0,max:.50}
  ];
  const EXAMS=['اختبار تشخيصي','اختبار فترة','اختبار قصير','اختبار نهائي','اختبار بعدي','تقويم ختامي'];
  function current(){try{return typeof cur!=='undefined'?cur:null}catch(e){return null}}
  function isAnalysis(){const c=current();return !!c&&(c.benchmarkDocId==='exam-analysis'||c.type==='تحليل نتائج'||c.entryIntent==='analysis')}
  function meta(){const c=current();if(!c)return{};c.docMeta=c.docMeta||{};c.docMeta.analysis=c.docMeta.analysis||{};return c.docMeta.analysis}
  function normalizeDigits(v){return String(v??'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/٫/g,'.')}
  function tokenize(raw){return normalizeDigits(raw).split(/[\s,،;؛\n\t|]+/).map(x=>x.trim()).filter(Boolean)}
  function parseDetailed(raw,max){
    const accepted=[],invalid=[],outOfRange=[]; const limit=Number(max)||0;
    tokenize(raw).forEach(token=>{
      const cleaned=token.replace(/[^0-9.\-]/g,''); const n=Number(cleaned);
      if(!cleaned||!Number.isFinite(n)){invalid.push(token);return}
      if(n<0||(limit&&n>limit)){outOfRange.push(token);return}
      accepted.push(n);
    });
    return {scores:accepted,invalid,outOfRange,totalTokens:tokenize(raw).length};
  }
  function parseScores(raw,max){return parseDetailed(raw,max).scores}
  function parseNames(raw){return String(raw||'').split(/\n+/).map(x=>x.trim()).filter(Boolean)}
  function median(arr){if(!arr.length)return 0;const a=[...arr].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
  function rangeLabel(level,max){
    const lo=level.min*max,hi=level.max*max;
    const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(1).replace(/\.0$/,'');
    if(level.key==='excellent')return `${fmt(lo)} – ${fmt(max)}`;
    if(level.key==='weak')return `أقل من ${fmt(hi)}`;
    return `${fmt(lo)} – أقل من ${fmt(hi)}`;
  }
  function calc(data){
    const max=Number(data.maxScore)||0,detail=parseDetailed(data.scores,max),scores=detail.scores;if(!scores.length||!max)return null;
    const sum=scores.reduce((a,b)=>a+b,0),avg=sum/scores.length,high=Math.max(...scores),low=Math.min(...scores),med=median(scores),achievement=(avg/max)*100;
    const levels=LEVELS.map(l=>{
      const count=scores.filter(s=>{const r=s/max;if(l.key==='excellent')return r>=l.min&&r<=1;if(l.key==='weak')return r>=0&&r<l.max;return r>=l.min&&r<l.max}).length;
      return {...l,count,pct:(count/scores.length)*100,range:rangeLabel(l,max)};
    });
    const by=k=>levels.find(x=>x.key===k)?.count||0,weak=by('weak'),pass=by('pass'),excellent=by('excellent'),verygood=by('verygood'),good=by('good');
    const highBand=excellent+verygood,lowBand=weak+pass,mastery=((excellent+verygood)/scores.length)*100;
    let reading;
    if(achievement>=90&&weak===0)reading='يظهر المتوسط العام مستوى تحصيل مرتفعًا جدًا، مع اتساق إيجابي في توزيع النتائج وعدم وجود طلاب ضمن الفئة الضعيفة وفق الحدود الحالية.';
    else if(achievement>=80)reading=`يظهر المتوسط العام مستوى تحصيل جيدًا جدًا. ويمثل طلاب فئتي الممتاز والجيد جدًا ${highBand} من أصل ${scores.length} طالبًا، بينما يحتاج ${lowBand} طالبًا في فئتي المقبول والضعيف إلى متابعة أقرب.`;
    else if(achievement>=70)reading=`يظهر المتوسط العام مستوى تحصيل جيدًا، إلا أن توزيع النتائج يكشف حاجة ${lowBand} طالبًا في الفئتين الأدنى إلى تدخل أو متابعة موجهة بدل الاكتفاء بمتوسط الصف.`;
    else if(achievement>=60)reading=`يظهر المتوسط العام مستوى تحصيل متوسطًا، مع وجود ${lowBand} طالبًا في فئتي المقبول والضعيف؛ وهذا يستدعي تحديد المهارات أو الموضوعات الأقل إتقانًا قبل بناء التدخل.`;
    else reading=`تظهر النتائج انخفاضًا في المتوسط العام، مع وجود ${lowBand} طالبًا في الفئتين الأدنى؛ والأولوية هي التشخيص التفصيلي ثم التدخل العلاجي وإعادة القياس.`;
    let priority,action;
    if(weak>0){priority=`الأولوية: الطلاب في المستوى الضعيف (${weak})، ثم الطلاب في المستوى المقبول (${pass})، مع فصل العلاج عن المتابعة التحسينية.`;action='مقترح: إنشاء خطة علاجية للفئة الضعيفة بعد تحديد المهارات المتعثرة، مع متابعة الفئة المقبولة باختبار قصير أو مهمة تحقق، ثم إعادة القياس.'}
    else if(pass>0){priority=`الأولوية: رفع أداء الطلاب في المستوى المقبول (${pass}) إلى مستوى الإتقان، مع المحافظة على تقدم بقية الفئات.`;action='مقترح: تنفيذ تدخل تحسيني قصير للفئة المقبولة ثم قياس لاحق، وإتاحة مهام إثرائية للطلاب المتقدمين.'}
    else{priority='لا تظهر فئات منخفضة وفق حدود التصنيف الحالية؛ تتحول الأولوية إلى استدامة الإتقان وتوسيع فرص الإثراء.';action='مقترح: تقديم مهام إثرائية للفئات المتقدمة ومتابعة استدامة الأداء في القياسات اللاحقة.'}
    return {count:scores.length,sum,avg,median:med,high,low,achievement,mastery,levels,weak,pass,good,verygood,excellent,highBand,lowBand,reading,priority,action,scores,detail};
  }
  function validate(data){
    const errors=[],warnings=[],max=Number(data.maxScore)||0,detail=parseDetailed(data.scores,max),scores=detail.scores,names=parseNames(data.names);
    if(!String(data.subject||'').trim())errors.push('حدد المادة.');
    if(!String(data.stageClass||'').trim())errors.push('حدد المرحلة / الصف.');
    if(!String(data.termYear||'').trim())warnings.push('لم يحدد الفصل / السنة بعد.');
    if(!max||max<=0)errors.push('حدد درجة الاختبار بقيمة صحيحة.');
    if(!scores.length)errors.push('أدخل درجات الطلاب.');
    if(detail.invalid.length)errors.push(`توجد قيم غير مفهومة في الدرجات: ${detail.invalid.slice(0,4).join('، ')}`);
    if(detail.outOfRange.length)errors.push(`توجد درجات خارج النطاق 0–${max}: ${detail.outOfRange.slice(0,4).join('، ')}`);
    if(names.length&&names.length!==scores.length)errors.push(`عدد الأسماء (${names.length}) لا يطابق عدد الدرجات (${scores.length}).`);
    if(scores.length>0&&scores.length<5)warnings.push('عدد الدرجات قليل؛ القراءة الإحصائية قد لا تمثل صفًا كاملًا.');
    return {passed:!errors.length,errors,warnings,scoreCount:scores.length,nameCount:names.length};
  }
  function selfTest(){
    const sample={maxScore:40,scores:'40 40 40 40 40 39 39 35 35 34 32 32 31 29 29 20 20 19 15 5'},r=calc(sample);
    const counts=r?.levels.map(x=>x.count).join(',');
    return {passed:!!r&&r.count===20&&Math.abs(r.avg-30.7)<.001&&Math.abs(r.achievement-76.75)<.001&&counts==='7,5,3,2,3',count:r?.count,avg:r?.avg,achievement:r?.achievement,levels:counts};
  }
  window.GC_ANALYSIS_V2={version:'2.3',calc,parseScores,parseDetailed,parseNames,validate,levels:LEVELS,selfTest};
  window.GC_ANALYSIS_V2_AUDIT=selfTest();

  function esc(v){return String(v??'').replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
  function field(id,label,value='',type='text',ph=''){return `<label class="a2Field"><span>${label}</span><input data-a2="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(ph)}"></label>`}
  function selectField(id,label,value,opts){return `<label class="a2Field"><span>${label}</span><select data-a2="${id}">${opts.map(x=>`<option ${value===x?'selected':''}>${x}</option>`).join('')}</select></label>`}
  function sheet(){
    const d=meta(); if(!d.examType)d.examType='اختبار تشخيصي'; if(!d.maxScore)d.maxScore='40';
    return `<section class="a2Capture" id="analysisCaptureV2">
      <div class="a2Head"><div><b>تحليل النتائج</b><small>بيانات قليلة، والحساب والتفسير يتولاها النظام.</small></div><span aria-hidden="true">📊</span></div>
      <div class="a2Hint"><b>لا تحتاج كتابة عنوان التقرير أو عدد الطلاب أو المتوسطات.</b><span>ألصق الدرجات كما هي من Excel/نور أو اكتبها مفصولة بمسافة أو سطر.</span></div>
      <div class="a2Grid">
        ${field('subject','المادة',d.subject||'','text','مثال: الرياضيات')}
        ${selectField('examType','نوع الاختبار',d.examType,EXAMS)}
        ${field('stageClass','المرحلة / الصف',d.stageClass||'','text','مثال: ثاني متوسط / 2')}
        ${field('termYear','الفصل / السنة',d.termYear||'','text','مثال: الفصل الأول / 1448هـ')}
        ${field('maxScore','درجة الاختبار',d.maxScore||'40','number','40')}
      </div>
      <label class="a2Field a2Wide"><span>درجات الطلاب <strong>مطلوب</strong><i id="a2ScoreCount"></i></span><textarea data-a2="scores" inputmode="decimal" placeholder="مثال: 40 40 39 35 32 29 20 15">${esc(d.scores||'')}</textarea></label>
      <details class="a2Optional"><summary>خيارات إضافية <small>اختيارية</small></summary>
        <label class="a2Field a2Wide"><span>أسماء الطلاب <em>اختياري — اسم في كل سطر</em></span><textarea data-a2="names" placeholder="لا تدخل الأسماء إذا كنت لا تحتاج كشفًا فرديًا">${esc(d.names||'')}</textarea></label>
        <div class="a2Grid">${field('rightSign','التوقيع الأيمن',d.rightSign||'','text','يُورث من هوية المدرسة إن كان محفوظًا')}${field('leftSign','التوقيع الأيسر',d.leftSign||'','text','يُورث من هوية المدرسة إن كان محفوظًا')}</div>
      </details>
      <div class="a2Validation" id="analysisValidation"></div>
      <div class="a2Preview" id="analysisStatsPreview"></div>
      <div class="a2MiniInsight" id="analysisMiniInsight"></div>
    </section>`;
  }
  function smartTitle(){const c=current(),d=meta();if(!c||!String(d.subject||'').trim())return;const t=`تحليل نتائج ${d.examType||'اختبار'} مادة ${d.subject.trim()}`;if(!c.workTitle||/تحليل نتائج اختبار|تحليل نتائج$/.test(c.workTitle))c.workTitle=t}
  function updatePreview(){
    const box=document.getElementById('analysisStatsPreview'),vbox=document.getElementById('analysisValidation'),ins=document.getElementById('analysisMiniInsight'),counter=document.getElementById('a2ScoreCount');if(!box)return;
    const d=meta(),v=validate(d),r=calc(d); if(counter)counter.textContent=v.scoreCount?` · ${v.scoreCount} درجة` : '';
    if(vbox)vbox.innerHTML=[...v.errors.map(x=>`<div class="a2Err">${esc(x)}</div>`),...v.warnings.map(x=>`<div class="a2Warn">${esc(x)}</div>`)].join('');
    if(!r){box.innerHTML='<span>أدخل البيانات الأساسية والدرجات، وستظهر المؤشرات مباشرة.</span>';if(ins)ins.innerHTML='';return}
    box.innerHTML=`<div><b>${r.count}</b><span>طالب</span></div><div><b>${r.avg.toFixed(2)}</b><span>المتوسط</span></div><div><b>${r.achievement.toFixed(1)}%</b><span>التحصيل</span></div><div><b>${r.high}</b><span>الأعلى</span></div><div><b>${r.low}</b><span>الأدنى</span></div><div><b>${r.median.toFixed(1)}</b><span>الوسيط</span></div>`;
    if(ins)ins.innerHTML=`<b>قراءة أولية:</b> ${esc(r.reading)}`;
  }
  function bind(){document.querySelectorAll('[data-a2]').forEach(el=>{if(el.dataset.a2Bound)return;el.dataset.a2Bound='1';const save=()=>{meta()[el.dataset.a2]=el.value;smartTitle();try{window.GC_STABILITY?.capture?.()}catch(e){}updatePreview()};el.addEventListener('input',save);el.addEventListener('change',save)});updatePreview()}
  function inject(){if(!isAnalysis()||document.getElementById('analysisCaptureV2'))return;const out=document.getElementById('out');if(!out)return;const create=[...out.querySelectorAll('button,.btn')].find(b=>/إنشاء|انشاء/.test(b.textContent||''));const wrap=document.createElement('div');wrap.innerHTML=sheet();const node=wrap.firstElementChild;if(create){const row=create.closest('.row')||create;row.parentElement?.insertBefore(node,row)}else out.appendChild(node);bind()}
  const prevCreate=window.gcCreateDocumentV2;window.gcCreateDocumentV2=function(){if(isAnalysis()){const v=validate(meta());if(!v.passed){alert('أكمل بيانات تحليل النتائج أولًا:\n- '+v.errors.join('\n- '));document.getElementById('analysisCaptureV2')?.scrollIntoView({behavior:'smooth',block:'start'});return}}return typeof prevCreate==='function'?prevCreate():window.generate?.()};
  new MutationObserver(()=>{setTimeout(inject,20);setTimeout(bind,40)}).observe(document.documentElement,{childList:true,subtree:true});setTimeout(inject,250);
  const style=document.createElement('style');style.textContent=`
    .a2Capture{margin:14px 0;padding:16px;border:1px solid #d8e6e1;border-radius:20px;background:#fff;box-shadow:0 8px 30px rgba(29,86,76,.04)}
    .a2Head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px}.a2Head b{display:block;font-size:19px}.a2Head small{display:block;color:#72807b;margin-top:3px;line-height:1.5}.a2Head>span{font-size:28px}
    .a2Hint{display:flex;flex-direction:column;gap:3px;background:#f2f8f6;border:1px solid #deebe7;border-radius:13px;padding:10px 12px;margin-bottom:12px;color:#536b64}.a2Hint b{font-size:12px;color:#2f655b}.a2Hint span{font-size:11px;line-height:1.5}
    .a2Grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.a2Field{display:block}.a2Field>span{display:block;font-size:12px;font-weight:800;color:#64756f;margin-bottom:5px}.a2Field i{font-style:normal;color:#1d7162}.a2Field em{font-style:normal;font-weight:600;color:#89958f}.a2Field input,.a2Field select,.a2Field textarea{box-sizing:border-box;width:100%;border:1px solid #d7e3df;border-radius:12px;padding:11px;background:#fbfdfc;font:inherit;outline:none}.a2Field input:focus,.a2Field select:focus,.a2Field textarea:focus{border-color:#6cae9f;box-shadow:0 0 0 3px rgba(68,137,122,.08)}.a2Field textarea{min-height:92px;resize:vertical}.a2Wide{margin-top:10px}
    .a2Optional{margin-top:10px;border-top:1px dashed #dfe8e5;padding-top:8px}.a2Optional summary{cursor:pointer;color:#477167;font-weight:800;font-size:12px}.a2Optional summary small{font-weight:600;color:#8b9994}
    .a2Validation{margin-top:8px}.a2Err,.a2Warn{padding:8px 10px;border-radius:9px;margin-top:5px;font-size:11px}.a2Err{background:#fff1f1;color:#8b3f3f}.a2Warn{background:#fff8e9;color:#805f25}
    .a2Preview{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;margin-top:12px}.a2Preview>div{border:1px solid #e0e9e6;border-radius:12px;padding:9px 5px;text-align:center;background:#f8fbfa}.a2Preview b{display:block;font-size:16px;color:#1d675a}.a2Preview span{font-size:10px;color:#6f7d78}.a2Preview>span{grid-column:1/-1;color:#7a8782;font-size:12px}
    .a2MiniInsight{margin-top:10px;padding:10px 12px;border-radius:12px;background:#fafcfb;border-right:3px solid #4a8f81;color:#5e716a;font-size:11px;line-height:1.7}.a2MiniInsight:empty{display:none}.a2MiniInsight b{color:#2c6056}
    @media(max-width:620px){.a2Grid{grid-template-columns:1fr}.a2Preview{grid-template-columns:repeat(3,1fr)}}
    @media print{.a2Capture{display:none!important}}
  `;document.head.appendChild(style)
})();