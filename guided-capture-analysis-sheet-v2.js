/* Analysis Sheet V2 — smart classroom grades analysis
   Field structure inspired by proven classroom-analysis workflows, with smarter defaults and interpretation. */
(function(){
  const LEVELS=[
    {key:'excellent',label:'ممتاز',min:.90,max:1},
    {key:'verygood',label:'جيد جدًا',min:.80,max:.899999},
    {key:'good',label:'جيد',min:.70,max:.799999},
    {key:'pass',label:'مقبول',min:.50,max:.699999},
    {key:'weak',label:'ضعيف',min:0,max:.499999}
  ];
  function current(){try{return typeof cur!=='undefined'?cur:null}catch(e){return null}}
  function isAnalysis(){const c=current();return !!c&&(c.benchmarkDocId==='exam-analysis'||c.type==='تحليل نتائج'||c.entryIntent==='analysis')}
  function meta(){const c=current();if(!c)return{};c.docMeta=c.docMeta||{};c.docMeta.analysis=c.docMeta.analysis||{};return c.docMeta.analysis}
  function parseScores(raw,max){
    const scores=String(raw||'').split(/[\s,،;؛\n\t]+/).map(x=>Number(String(x).replace(/[^0-9.\-]/g,''))).filter(Number.isFinite).filter(x=>x>=0&&(max?x<=max:true));
    return scores;
  }
  function calc(data){
    const max=Number(data.maxScore)||0,scores=parseScores(data.scores,max);if(!scores.length||!max)return null;
    const sum=scores.reduce((a,b)=>a+b,0),avg=sum/scores.length,high=Math.max(...scores),low=Math.min(...scores),achievement=(avg/max)*100;
    const levels=LEVELS.map(l=>{
      const count=scores.filter(s=>{const r=s/max;return r>=l.min&&r<=l.max}).length;
      return {...l,count,pct:(count/scores.length)*100,range:`${(l.min*max).toFixed(2).replace(/\.00$/,'')} - ${(l.max*max).toFixed(2).replace(/\.00$/,'')}`};
    });
    const weak=levels.find(x=>x.key==='weak')?.count||0,pass=levels.find(x=>x.key==='pass')?.count||0,highBand=(levels.find(x=>x.key==='excellent')?.count||0)+(levels.find(x=>x.key==='verygood')?.count||0);
    let reading='';
    if(achievement>=90)reading='تشير النتائج إلى مستوى تحصيل مرتفع جدًا مع ضرورة المحافظة على مستوى الإتقان ودعم فرص الإثراء.';
    else if(achievement>=80)reading='تشير النتائج إلى مستوى تحصيل جيد جدًا، مع وجود فرصة لتحسين أداء الفئات الأقل إتقانًا.';
    else if(achievement>=70)reading='تشير النتائج إلى مستوى تحصيل جيد إجمالًا، مع حاجة واضحة لمعالجة مواطن الضعف لدى بعض الطلاب.';
    else if(achievement>=60)reading='تشير النتائج إلى مستوى متوسط يحتاج إلى تدخل تعليمي منظم يركز على الفئات والمهارات الأقل أداءً.';
    else reading='تشير النتائج إلى انخفاض في مستوى التحصيل يستدعي تدخلًا علاجيًا منظمًا وإعادة قياس بعد التنفيذ.';
    const priority=(weak+pass)>0?`الأولوية الأولى: متابعة ${weak+pass} طالبًا ضمن فئتي الضعيف والمقبول، مع التمييز بين الحاجة العلاجية والمتابعة التحسينية.`:`لا تظهر فئات منخفضة وفق حدود التصنيف الحالية، وتتحول الأولوية إلى الإثراء والمحافظة على الأداء.`;
    const action=(weak>0)?'إنشاء خطة علاجية للفئة الضعيفة، وتحديد المهارات الأكثر حاجة إن توفرت بيانات تفصيلية، ثم إعادة القياس بعد التدخل.':(pass>0?'تنفيذ متابعة تحسين للفئة المقبولة مع اختبار قصير لاحق للتحقق من التقدم.':'بناء أنشطة إثرائية للفئات المتقدمة ومتابعة استدامة الأداء.');
    return {count:scores.length,sum,avg,high,low,achievement,levels,weak,pass,highBand,reading,priority,action,scores};
  }
  window.GC_ANALYSIS_V2={calc,parseScores,levels:LEVELS};

  function esc(v){return String(v??'').replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
  function field(id,label,value='',type='text',ph=''){
    return `<label class="a2Field"><span>${label}</span><input data-a2="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(ph)}"></label>`
  }
  function sheet(){
    const d=meta();
    return `<section class="a2Capture" id="analysisCaptureV2"><div class="a2Head"><div><b>بيانات تحليل النتائج</b><small>املأ الضروري فقط؛ المدرسة والعنوان والتوقيعات يمكن توريثها من النظام.</small></div><span>📊</span></div><div class="a2Grid">
      ${field('subject','المادة',d.subject||'','text','مثال: الرياضيات')}
      <label class="a2Field"><span>نوع الاختبار</span><select data-a2="examType">${['اختبار تشخيصي','اختبار فترة','اختبار قصير','اختبار نهائي','اختبار بعدي'].map(x=>`<option ${d.examType===x?'selected':''}>${x}</option>`).join('')}</select></label>
      ${field('stageClass','المرحلة / الصف',d.stageClass||'','text','مثال: ثاني متوسط / 2')}
      ${field('termYear','الفصل / السنة',d.termYear||'','text','مثال: الفصل الأول / 1447هـ')}
      ${field('maxScore','درجة الاختبار',d.maxScore||'40','number','40')}
      ${field('rightSign','التوقيع الأيمن',d.rightSign||'','text','يُورث إن كان محفوظًا')}
      ${field('leftSign','التوقيع الأيسر',d.leftSign||'','text','يُورث إن كان محفوظًا')}
    </div><label class="a2Field a2Wide"><span>أسماء الطلاب <em>اختياري</em></span><textarea data-a2="names" placeholder="اسم في كل سطر، أو اتركه فارغًا">${esc(d.names||'')}</textarea></label><label class="a2Field a2Wide"><span>درجات الطلاب <strong>مطلوب</strong></span><textarea data-a2="scores" placeholder="مثال: 40 40 39 35 32 29 20 15">${esc(d.scores||'')}</textarea></label><div class="a2Preview" id="analysisStatsPreview"></div></section>`;
  }
  function updatePreview(){
    const box=document.getElementById('analysisStatsPreview');if(!box)return;
    const d=meta(),r=calc(d);if(!r){box.innerHTML='<span>أدخل درجة الاختبار والدرجات ليحسب النظام الإحصاءات تلقائيًا.</span>';return;}
    box.innerHTML=`<div><b>${r.count}</b><span>طالب</span></div><div><b>${r.high}</b><span>أعلى درجة</span></div><div><b>${r.low}</b><span>أقل درجة</span></div><div><b>${r.avg.toFixed(2)}</b><span>المتوسط</span></div><div><b>${r.achievement.toFixed(1)}%</b><span>التحصيل</span></div>`;
  }
  function bind(){
    document.querySelectorAll('[data-a2]').forEach(el=>{if(el.dataset.a2Bound)return;el.dataset.a2Bound='1';el.addEventListener('input',()=>{meta()[el.dataset.a2]=el.value;try{window.GC_STABILITY?.capture?.()}catch(e){}updatePreview()});el.addEventListener('change',()=>{meta()[el.dataset.a2]=el.value;updatePreview()})});updatePreview();
  }
  function inject(){
    if(!isAnalysis()||document.getElementById('analysisCaptureV2'))return;
    const out=document.getElementById('out');if(!out)return;
    const create=[...out.querySelectorAll('button,.btn')].find(b=>/إنشاء|انشاء/.test(b.textContent||''));
    const host=create?.parentElement||out.lastElementChild||out;
    const wrap=document.createElement('div');wrap.innerHTML=sheet();const node=wrap.firstElementChild;
    if(create)create.closest('.card,section,div')?.insertBefore(node,create.closest('.row')||create);else host.appendChild(node);
    bind();
  }
  new MutationObserver(()=>{setTimeout(inject,20);setTimeout(bind,40)}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(inject,250);
  const style=document.createElement('style');style.textContent=`.a2Capture{margin:14px 0;padding:15px;border:1px solid #dce8e4;border-radius:18px;background:#fff}.a2Head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px}.a2Head b{display:block;font-size:18px}.a2Head small{display:block;color:#72807b;margin-top:3px;line-height:1.5}.a2Head>span{font-size:26px}.a2Grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.a2Field{display:block}.a2Field>span{display:block;font-size:12px;font-weight:800;color:#677772;margin-bottom:5px}.a2Field em{font-style:normal;font-weight:600;color:#89958f}.a2Field input,.a2Field select,.a2Field textarea{box-sizing:border-box;width:100%;border:1px solid #d9e4e0;border-radius:12px;padding:11px;background:#fbfdfc;font:inherit}.a2Field textarea{min-height:84px;resize:vertical}.a2Wide{margin-top:10px}.a2Preview{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:12px}.a2Preview>div{border:1px solid #e1eae7;border-radius:12px;padding:9px;text-align:center;background:#f8fbfa}.a2Preview b{display:block;font-size:17px;color:#1f665b}.a2Preview span{font-size:10px;color:#6f7d78}.a2Preview>span{grid-column:1/-1;color:#7a8782;font-size:12px}@media(max-width:620px){.a2Grid{grid-template-columns:1fr}.a2Preview{grid-template-columns:repeat(2,1fr)}}@media print{.a2Capture{display:none!important}}`;document.head.appendChild(style);
})();