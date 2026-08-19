/* Guided Capture — Benchmark Acceptance V1: essential familiar metadata for key documents */
(function(){
  function docId(){return window.GC_BENCHMARK_DOC?.id||cur?.benchmarkDocId||''}
  function meta(){if(!cur.docMeta)cur.docMeta={};return cur.docMeta}
  window.setDocMeta=function(k,v){meta()[k]=v}
  window.setPlanScope=function(v){meta().planScope=v;renderUnderstanding()}
  function input(label,key,placeholder,type='text'){
    const v=meta()[key]||'';
    return `<label><span>${esc(label)}</span><input type="${type}" ${type==='number'?'inputmode="decimal"':''} value="${esc(v)}" oninput="setDocMeta('${key}',this.value)" placeholder="${esc(placeholder)}"></label>`;
  }
  function docMetaFields(){
    const id=docId();if(!id)return'';
    if(id==='exam-analysis')return `<div class="docMetaCard"><div class="docMetaTitle">بيانات الاختبار الأساسية</div><div class="metaGrid">${input('المادة','subject','مثال: لغتي')}${input('الدرجة الكلية','maxScore','مثال: 20','number')}${input('الفصل/الفترة','period','مثال: الفترة الأولى')}</div><div class="docMetaHint">الدرجات التفصيلية ستدخل لاحقًا في المحلل الرقمي؛ لا نطلب المتوسط أو النسب يدويًا.</div></div>`;
    if(id==='remedial-plan'){
      const s=meta().planScope||'';
      return `<div class="docMetaCard"><div class="docMetaTitle">نطاق الخطة</div><div class="chiprow"><button type="button" class="chip ${s==='فردية'?'on':''}" onclick="setPlanScope('فردية')">فردية</button><button type="button" class="chip ${s==='جماعية'?'on':''}" onclick="setPlanScope('جماعية')">جماعية</button></div><div class="metaGrid" style="margin-top:10px">${input('المادة/المجال','subject','مثال: القراءة')}${input('مدة الخطة','duration','مثال: 4 أسابيع')}</div></div>`;
    }
    if(id==='training-attendance')return `<div class="docMetaCard"><div class="docMetaTitle">بيانات النشاط التدريبي</div><div class="metaGrid">${input('الجهة المقدمة','provider','مثال: المعهد الوطني للتطوير المهني')}${input('التاريخ','date','مثال: 1448/02/10')}${input('المدة/الساعات','duration','مثال: 3 ساعات')}</div></div>`;
    if(id==='training-delivery')return `<div class="docMetaCard"><div class="docMetaTitle">بيانات تنفيذ التدريب</div><div class="metaGrid">${input('المكان/الجهة','provider','مثال: المدرسة')}${input('التاريخ','date','مثال: 1448/02/10')}${input('المدة','duration','مثال: ساعتان')}</div></div>`;
    return'';
  }

  const baseUnderstanding=typeof understandingView==='function'?understandingView:null;
  if(baseUnderstanding){understandingView=function(){let h=baseUnderstanding();const fields=docMetaFields();if(fields){const marker='<div class="row" style="margin-top:14px">';if(h.includes(marker))h=h.replace(marker,fields+marker);}return h;}}

  function contextSentence(){
    const id=docId(),m=meta(),bits=[];
    if(id==='exam-analysis'){
      if(m.subject)bits.push(`في مادة ${m.subject}`);if(m.maxScore)bits.push(`والدرجة الكلية ${m.maxScore}`);if(m.period)bits.push(`خلال ${m.period}`);
    }else if(id==='remedial-plan'){
      if(m.planScope)bits.push(`وهي خطة ${m.planScope}`);if(m.subject)bits.push(`في مجال ${m.subject}`);if(m.duration)bits.push(`بمدة ${m.duration}`);
    }else if(id==='training-attendance'||id==='training-delivery'){
      if(m.provider)bits.push(`الجهة/المكان: ${m.provider}`);if(m.date)bits.push(`التاريخ: ${m.date}`);if(m.duration)bits.push(`المدة: ${m.duration}`);
    }
    return bits.length?bits.join('، '):'';
  }
  window.benchmarkContextSentence=contextSentence;

  const baseParagraph=paragraphBank;
  paragraphBank=function(){
    const secs=baseParagraph(),ctx=contextSentence();if(!ctx||!secs?.length)return secs;
    const first=[secs[0][0],`${secs[0][1]} ${ctx}.`];return[first,...secs.slice(1)];
  };

  const baseEvidenceFn=evidence;
  evidence=function(){
    const id=docId();
    if(id==='exam-analysis')return'كشف الدرجات أو ملف النتائج، ثم تقرير التحليل الناتج عن البيانات الفعلية.';
    if(id==='remedial-plan')return'الخطة العلاجية مع مصدر التشخيص، نماذج التنفيذ، ونتيجة إعادة القياس عند توفرها.';
    if(id==='training-attendance')return'شهادة أو إثبات الحضور، بطاقة/إعلان البرنامج أو المادة التدريبية، ثم شاهد تطبيق لاحق إن وجد.';
    if(id==='training-delivery')return'كشف الحضور، المادة التدريبية، صور التنفيذ، وأي منتج أو تطبيق لاحق.';
    return baseEvidenceFn();
  };

  const css=document.createElement('style');
  css.textContent='.docMetaCard{margin-top:12px;padding:13px;border:1px solid #d9e7e2;background:#fbfdfc;border-radius:15px}.docMetaTitle{font-weight:900;color:#173f38;margin-bottom:9px}.docMetaHint{font-size:12px;color:#70807a;line-height:1.7;margin-top:8px}';document.head.appendChild(css);
})();
