/* Guided Capture — Benchmark Acceptance V1: essential familiar metadata for all 12 reference documents */
(function(){
  function docId(){return window.GC_BENCHMARK_DOC?.id||cur?.benchmarkDocId||''}
  function meta(){if(!cur.docMeta)cur.docMeta={};return cur.docMeta}
  window.setDocMeta=function(k,v){meta()[k]=v}
  window.setPlanScope=function(v){meta().planScope=v;renderUnderstanding()}
  function input(label,key,placeholder,type='text'){const v=meta()[key]||'';return `<label><span>${esc(label)}</span><input type="${type}" ${type==='number'?'inputmode="decimal"':''} value="${esc(v)}" oninput="setDocMeta('${key}',this.value)" placeholder="${esc(placeholder)}"></label>`}
  function scopeButtons(){const s=meta().planScope||'';return `<div class="chiprow"><button type="button" class="chip ${s==='فردية'?'on':''}" onclick="setPlanScope('فردية')">فردية</button><button type="button" class="chip ${s==='جماعية'?'on':''}" onclick="setPlanScope('جماعية')">جماعية</button></div>`}
  function card(title,inner,hint=''){return `<div class="docMetaCard"><div class="docMetaTitle">${esc(title)}</div>${inner}${hint?`<div class="docMetaHint">${esc(hint)}</div>`:''}</div>`}
  function docMetaFields(){
    const id=docId();if(!id)return'';
    if(id==='program-report')return card('بيانات التنفيذ',`<div class="metaGrid">${input('التاريخ','date','مثال: 1448/02/10')}${input('المكان','place','مثال: المدرسة')}${input('المدة','duration','مثال: أسبوع')}</div>`);
    if(id==='minutes')return card('بيانات الاجتماع',`<div class="metaGrid">${input('التاريخ','date','مثال: 1448/02/10')}${input('المكان','place','مثال: قاعة الاجتماعات')}${input('رئيس الاجتماع','chair','الاسم')}</div>`);
    if(id==='exam-analysis')return card('بيانات الاختبار الأساسية',`<div class="metaGrid">${input('المادة','subject','مثال: لغتي')}${input('الدرجة الكلية','maxScore','مثال: 20','number')}${input('الفصل/الفترة','period','مثال: الفترة الأولى')}</div>`,'الدرجات التفصيلية ستدخل لاحقًا في المحلل الرقمي؛ لا نطلب المتوسط أو النسب يدويًا.');
    if(id==='diagnostic-test')return card('بيانات الاختبار التشخيصي',`<div class="metaGrid">${input('المادة/المجال','subject','مثال: القراءة')}${input('تاريخ التطبيق','date','مثال: 1448/01/20')}${input('الدرجة الكلية','maxScore','مثال: 20','number')}</div>`);
    if(id==='pre-post')return card('بيانات القياس',`<div class="metaGrid">${input('المادة/المجال','subject','مثال: الفهم القرائي')}${input('تاريخ القياس القبلي','preDate','مثال: 1448/01/10')}${input('تاريخ القياس البعدي','postDate','مثال: 1448/02/10')}</div>`);
    if(id==='remedial-plan')return card('نطاق الخطة',`${scopeButtons()}<div class="metaGrid" style="margin-top:10px">${input('المادة/المجال','subject','مثال: القراءة')}${input('مدة الخطة','duration','مثال: 4 أسابيع')}</div>`);
    if(id==='enrichment-plan')return card('نطاق الخطة',`${scopeButtons()}<div class="metaGrid" style="margin-top:10px">${input('المادة/المجال','subject','مثال: القراءة')}${input('مدة الخطة','duration','مثال: 4 أسابيع')}</div>`);
    if(id==='training-attendance')return card('بيانات النشاط التدريبي',`<div class="metaGrid">${input('الجهة المقدمة','provider','مثال: المعهد الوطني للتطوير المهني')}${input('التاريخ','date','مثال: 1448/02/10')}${input('المدة/الساعات','duration','مثال: 3 ساعات')}</div>`);
    if(id==='training-delivery')return card('بيانات تنفيذ التدريب',`<div class="metaGrid">${input('المكان/الجهة','provider','مثال: المدرسة')}${input('التاريخ','date','مثال: 1448/02/10')}${input('المدة','duration','مثال: ساعتان')}</div>`);
    if(id==='plc')return card('بيانات الجلسة المهنية',`<div class="metaGrid">${input('رقم الجلسة','sessionNo','مثال: 2')}${input('التاريخ','date','مثال: 1448/02/10')}${input('المكان','place','مثال: مركز مصادر التعلم')}</div>`);
    if(id==='exchange-visit')return card('بيانات الزيارة',`<div class="metaGrid">${input('المعلم المزار','visitedTeacher','اسم المعلم')}${input('المادة/التخصص','subject','مثال: لغتي')}${input('الدرس/الممارسة','lesson','مثال: استراتيجية القراءة الموجهة')}</div>`);
    if(id==='parent-contact')return card('بيانات المتابعة',`<div class="metaGrid">${input('اسم الطالب','studentName','اختياري')}${input('التاريخ','date','مثال: 1448/02/10')}</div>`,'يمكن ترك اسم الطالب فارغًا إذا كان التقرير سيحفظ بصورة عامة أو لأغراض الخصوصية.');
    return'';
  }

  const baseUnderstanding=typeof understandingView==='function'?understandingView:null;
  if(baseUnderstanding){understandingView=function(){let h=baseUnderstanding();const fields=docMetaFields();if(fields){const marker='<div class="row" style="margin-top:14px">';if(h.includes(marker))h=h.replace(marker,fields+marker);}return h;}}

  function contextSentence(){
    const id=docId(),m=meta(),bits=[];
    const add=(cond,text)=>{if(cond)bits.push(text)};
    if(id==='program-report'){add(m.date,`التاريخ: ${m.date}`);add(m.place,`المكان: ${m.place}`);add(m.duration,`المدة: ${m.duration}`)}
    else if(id==='minutes'){add(m.date,`التاريخ: ${m.date}`);add(m.place,`المكان: ${m.place}`);add(m.chair,`برئاسة ${m.chair}`)}
    else if(id==='exam-analysis'){add(m.subject,`في مادة ${m.subject}`);add(m.maxScore,`الدرجة الكلية ${m.maxScore}`);add(m.period,`خلال ${m.period}`)}
    else if(id==='diagnostic-test'){add(m.subject,`في مجال ${m.subject}`);add(m.date,`بتاريخ ${m.date}`);add(m.maxScore,`والدرجة الكلية ${m.maxScore}`)}
    else if(id==='pre-post'){add(m.subject,`في مجال ${m.subject}`);add(m.preDate,`القياس القبلي ${m.preDate}`);add(m.postDate,`والبعدي ${m.postDate}`)}
    else if(id==='remedial-plan'||id==='enrichment-plan'){add(m.planScope,`وهي خطة ${m.planScope}`);add(m.subject,`في مجال ${m.subject}`);add(m.duration,`بمدة ${m.duration}`)}
    else if(id==='training-attendance'||id==='training-delivery'){add(m.provider,`الجهة/المكان: ${m.provider}`);add(m.date,`التاريخ: ${m.date}`);add(m.duration,`المدة: ${m.duration}`)}
    else if(id==='plc'){add(m.sessionNo,`الجلسة رقم ${m.sessionNo}`);add(m.date,`بتاريخ ${m.date}`);add(m.place,`في ${m.place}`)}
    else if(id==='exchange-visit'){add(m.visitedTeacher,`لدى المعلم ${m.visitedTeacher}`);add(m.subject,`في تخصص ${m.subject}`);add(m.lesson,`حول ${m.lesson}`)}
    else if(id==='parent-contact'){add(m.studentName,`بخصوص الطالب ${m.studentName}`);add(m.date,`بتاريخ ${m.date}`)}
    return bits.join('، ');
  }
  window.benchmarkContextSentence=contextSentence;

  const baseParagraph=paragraphBank;
  paragraphBank=function(){const secs=baseParagraph(),ctx=contextSentence();if(!ctx||!secs?.length)return secs;return[[secs[0][0],`${secs[0][1]} ${ctx}.`],...secs.slice(1)];}

  const baseEvidenceFn=evidence;
  evidence=function(){
    const id=docId();
    const map={
      'program-report':'صور التنفيذ، كشف/سجل المشاركة، المنتجات أو المواد المستخدمة، وملحق شواهد عند زيادة الصور.',
      'minutes':'محضر الاجتماع، كشف الحضور، القرارات والتكليفات، ثم متابعة لاحقة لما تم إسناده.',
      'exam-analysis':'كشف الدرجات أو ملف النتائج، ثم تقرير التحليل الناتج عن البيانات الفعلية.',
      'diagnostic-test':'نموذج الاختبار التشخيصي، كشف النتائج، تحليل المهارات أو الاحتياجات، ثم الإجراء الناتج.',
      'pre-post':'كشف القياس القبلي والبعدي لنفس الفئة، وجدول المقارنة أو التحسن الناتج عن البيانات الفعلية.',
      'remedial-plan':'الخطة العلاجية مع مصدر التشخيص، نماذج التنفيذ، ونتيجة إعادة القياس عند توفرها.',
      'enrichment-plan':'الخطة الإثرائية، منتجات أو مهام متقدمة، أداة تقييم أو ملف أعمال، وصور التنفيذ عند الحاجة.',
      'training-attendance':'شهادة أو إثبات الحضور، بطاقة/إعلان البرنامج أو المادة التدريبية، ثم شاهد تطبيق لاحق إن وجد.',
      'training-delivery':'كشف الحضور، المادة التدريبية، صور التنفيذ، وأي منتج أو تطبيق لاحق.',
      'plc':'محضر مجتمع التعلم، كشف الحضور، المخرج أو التوصيات، وشاهد التطبيق في الجلسة التالية إن وجد.',
      'exchange-visit':'نموذج الزيارة التبادلية، توقيعات الأطراف، الملاحظات المهنية، وشاهد تطبيق لاحق.',
      'parent-contact':'سجل أو نموذج التواصل، ما تم الاتفاق عليه، وأي متابعة لاحقة للحالة.'
    };
    return map[id]||baseEvidenceFn();
  };

  const css=document.createElement('style');css.textContent='.docMetaCard{margin-top:12px;padding:13px;border:1px solid #d9e7e2;background:#fbfdfc;border-radius:15px}.docMetaTitle{font-weight:900;color:#173f38;margin-bottom:9px}.docMetaHint{font-size:12px;color:#70807a;line-height:1.7;margin-top:8px}';document.head.appendChild(css);
})();
