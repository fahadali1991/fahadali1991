/* Analysis Output V2.4 — premium one-page print renderer for classroom grade analysis */
(function(){
  function current(){try{return typeof cur!=='undefined'?cur:null}catch(e){return null}}
  function isAnalysis(){const c=current();return !!c&&(c.benchmarkDocId==='exam-analysis'||c.type==='تحليل نتائج'||c.entryIntent==='analysis')}
  function data(){return current()?.docMeta?.analysis||{}}
  function esc(v){return String(v??'').replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
  function fmt(n,d=1){return Number(n).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:d})}
  function result(){return window.GC_ANALYSIS_V2?.calc?.(data())||null}
  function title(){const d=data();return `تحليل نتائج ${d.examType||'اختبار'} مادة ${d.subject||''}`.trim()}
  function stat(label,value,sub=''){return `<div class="arStat"><span>${esc(label)}</span><b>${esc(value)}</b>${sub?`<small>${esc(sub)}</small>`:''}</div>`}
  function levelTable(r){return `<div class="arLevelTable"><div class="arRow arTH"><span>المستوى</span><span>نطاق الدرجة</span><span>الطلاب</span><span>النسبة</span></div>${r.levels.map(l=>`<div class="arRow"><span><i class="arDot ar-${l.key}"></i>${esc(l.label)}</span><span>${esc(l.range)}</span><span>${l.count}</span><span>${fmt(l.pct,1)}%</span></div>`).join('')}</div>`}
  function bars(r){const maxCount=Math.max(1,...r.levels.map(x=>x.count));return `<div class="arBars">${r.levels.map(l=>`<div class="arBarItem"><div class="arBarMeta"><b>${esc(l.label)}</b><span>${l.count} طالب · ${fmt(l.pct,1)}%</span></div><div class="arTrack"><i class="ar-${l.key}" style="width:${Math.max(l.count?8:0,(l.count/maxCount)*100)}%"></i></div></div>`).join('')}</div>`}
  function bands(r){const weakPct=(r.weak/r.count)*100,passPct=(r.pass/r.count)*100;return `<section class="arBands"><div><span>إتقان مرتفع</span><b>${fmt(r.mastery,1)}%</b><small>${r.highBand} طالب · جيد جدًا فأعلى</small></div><div><span>متابعة تحسينية</span><b>${fmt(passPct,1)}%</b><small>${r.pass} طالب · مستوى مقبول</small></div><div><span>أولوية علاجية</span><b>${fmt(weakPct,1)}%</b><small>${r.weak} طالب · مستوى ضعيف</small></div></section>`}
  function insight(r){return `<section class="arInsight"><div class="arInsightTitle"><span>قراءة مهنية للنتائج</span><b>${fmt(r.achievement,1)}%</b></div><p>${esc(r.reading)}</p><div class="arDecision"><div><span>أولوية التحسين</span><p>${esc(r.priority)}</p></div><div><span>الإجراء المقترح</span><p>${esc(r.action)}</p></div></div><small>لا يُعد الإجراء المقترح حكمًا على أثر تدخل سابق؛ قياس الأثر يتطلب بيانات لاحقة.</small></section>`}
  function priorityStudents(r){
    const names=window.GC_ANALYSIS_V2?.parseNames?.(data().names)||[];if(!names.length||names.length!==r.scores.length)return'';
    const rows=names.map((name,i)=>({name,score:r.scores[i],pct:r.scores[i]/Number(data().maxScore)*100})).filter(x=>x.pct<70).sort((a,b)=>a.pct-b.pct);
    if(!rows.length)return'';const shown=rows.slice(0,8),extra=rows.length-shown.length;
    return `<section class="arPriority"><h3>قائمة المتابعة ذات الأولوية</h3><div>${shown.map(x=>`<span><b>${esc(x.name)}</b><i>${fmt(x.score,2)} / ${esc(data().maxScore)}</i></span>`).join('')}${extra>0?`<span class="arMore">+ ${extra} آخرين</span>`:''}</div></section>`;
  }
  function signatures(){const d=data();if(!d.rightSign&&!d.leftSign)return'';return `<div class="arSigns"><div><span>التوقيع</span><b>${esc(d.rightSign||'')}</b></div><div><span>التوقيع</span><b>${esc(d.leftSign||'')}</b></div></div>`}
  function render(){
    if(!isAnalysis())return;const r=result(),paper=document.getElementById('printDocument');if(!r||!paper)return;
    const old=paper.querySelector('.v2FamilyBody');if(!old)return;const d=data();
    old.innerHTML=`<div class="analysisReportV2">
      <section class="arMeta"><div><span>نوع الاختبار</span><b>${esc(d.examType||'—')}</b></div><div><span>المرحلة / الصف</span><b>${esc(d.stageClass||'—')}</b></div><div><span>الفصل / السنة</span><b>${esc(d.termYear||'—')}</b></div><div><span>درجة الاختبار</span><b>${esc(d.maxScore||'—')}</b></div></section>
      <section class="arStats">${stat('عدد الطلاب',r.count)}${stat('متوسط الدرجات',fmt(r.avg,2),`من ${d.maxScore}`)}${stat('نسبة التحصيل',`${fmt(r.achievement,1)}%`)}${stat('الوسيط',fmt(r.median,1))}${stat('أعلى درجة',fmt(r.high,2))}${stat('أقل درجة',fmt(r.low,2))}</section>
      <div class="arSplit"><section><h3>توزيع مستويات الأداء</h3>${levelTable(r)}</section><section><h3>التوزيع البياني</h3>${bars(r)}</section></div>
      ${bands(r)}${insight(r)}${priorityStudents(r)}
      <section class="arFootFacts"><span>مجموع الدرجات: <b>${fmt(r.sum,2)}</b></span><span>نسبة الإتقان (جيد جدًا فأعلى): <b>${fmt(r.mastery,1)}%</b></span><span>عدد المقبول والضعيف: <b>${r.lowBand}</b></span></section>
      ${signatures()}
    </div>`;
    const hero=paper.querySelector('.paperHero h1');if(hero)hero.textContent=title();
    paper.dataset.analysisV2='complete';
  }
  window.GC_ANALYSIS_OUTPUT_V2={version:'2.4',render};
  let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(render,60)}).observe(document.documentElement,{childList:true,subtree:true});setTimeout(render,350);
  const s=document.createElement('style');s.textContent=`
    .analysisReportV2{--ink:#193b36;--muted:#6f7d79;--line:#d9e5e1;--soft:#f6faf8;--accent:#2b7769;font-family:inherit;color:var(--ink)}
    .analysisReportV2 h3{font-size:13px;margin:0 0 8px;color:#286f62;border-right:3px solid #3f8f80;padding-right:7px}
    .arMeta{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:9px}.arMeta>div{border:1px solid var(--line);border-radius:10px;padding:8px 9px;background:#fff;min-height:45px}.arMeta span,.arFootFacts span,.arSigns span{display:block;font-size:9px;color:var(--muted);font-weight:800;margin-bottom:3px}.arMeta b{font-size:11px;line-height:1.4}
    .arStats{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:10px}.arStat{background:var(--soft);border:1px solid #e1ebe8;border-radius:11px;text-align:center;padding:8px 4px}.arStat span{display:block;font-size:8.5px;color:var(--muted);font-weight:800}.arStat b{display:block;font-size:16px;color:#1f665a;margin-top:2px}.arStat small{display:block;font-size:7px;color:#8b9692;margin-top:1px}
    .arSplit{display:grid;grid-template-columns:1.08fr .92fr;gap:10px;margin-bottom:9px}.arSplit>section{border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff}
    .arLevelTable{border:1px solid #e1e8e5;border-radius:8px;overflow:hidden}.arRow{display:grid;grid-template-columns:1.2fr 1.35fr .65fr .65fr;align-items:center;min-height:25px;border-bottom:1px solid #edf1ef}.arRow:last-child{border-bottom:0}.arRow span{font-size:9px;padding:4px 6px}.arTH{background:#f6f9f8;font-weight:900;color:#60726c}.arDot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-left:5px;vertical-align:middle}
    .arBars{display:flex;flex-direction:column;gap:7px}.arBarMeta{display:flex;justify-content:space-between;gap:8px;align-items:center}.arBarMeta b{font-size:9px}.arBarMeta span{font-size:8px;color:var(--muted)}.arTrack{height:10px;background:#edf2f0;border-radius:999px;overflow:hidden}.arTrack i{display:block;height:100%;min-width:0;border-radius:999px}
    .ar-excellent{background:#3f9c72}.ar-verygood{background:#45a8a3}.ar-good{background:#4a91c9}.ar-pass{background:#df9441}.ar-weak{background:#d96565}
    .arBands{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:9px}.arBands>div{border:1px solid #dde8e4;border-radius:10px;padding:7px 9px;background:#fbfdfc}.arBands span{display:block;font-size:8px;color:#6d7b76;font-weight:900}.arBands b{font-size:14px;color:#27695d}.arBands small{display:block;font-size:7px;color:#87938f;margin-top:2px}
    .arInsight{border:1px solid #cfe0da;border-radius:12px;background:linear-gradient(180deg,#fbfdfc,#f4f9f7);padding:10px 12px;margin-bottom:8px}.arInsightTitle{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}.arInsightTitle span{font-size:12px;font-weight:900;color:#285f55}.arInsightTitle b{font-size:15px;color:#2b7769}.arInsight>p{font-size:10px;line-height:1.65;margin:0 0 7px;text-align:justify}.arDecision{display:grid;grid-template-columns:1fr 1fr;gap:8px}.arDecision>div{background:#fff;border:1px solid #e0eae6;border-radius:9px;padding:7px}.arDecision span{display:block;font-size:8.5px;font-weight:900;color:#6a7a74;margin-bottom:3px}.arDecision p{font-size:9px;line-height:1.55;margin:0}.arInsight>small{display:block;margin-top:6px;font-size:7.5px;color:#84908c}
    .arPriority{border:1px solid #e0e8e5;border-radius:10px;padding:8px;margin-bottom:8px}.arPriority>div{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.arPriority>div>span{display:flex;justify-content:space-between;gap:5px;border:1px solid #edf1ef;border-radius:7px;padding:5px 6px}.arPriority b{font-size:8px}.arPriority i{font-style:normal;font-size:7px;color:#7a8883}.arMore{font-size:8px;color:#6e7d77;align-items:center;justify-content:center!important}
    .arFootFacts{display:flex;justify-content:space-between;gap:8px;border-top:1px solid #e2e9e6;padding-top:6px;margin-top:3px}.arFootFacts span{font-size:8.5px;margin:0}.arFootFacts b{color:#315f56}.arSigns{display:grid;grid-template-columns:1fr 1fr;gap:45px;margin-top:9px;padding-top:7px;border-top:1px dashed #d7e0dd}.arSigns>div{min-height:26px}.arSigns b{font-size:9px}
    @media(max-width:700px){.arMeta{grid-template-columns:repeat(2,1fr)}.arStats{grid-template-columns:repeat(3,1fr)}.arSplit,.arDecision{grid-template-columns:1fr}.arBands{grid-template-columns:1fr}.arPriority>div{grid-template-columns:repeat(2,1fr)}}
    @media print{
      body.gc-v2-printing #printDocument .analysisReportV2{font-size:10px!important}
      body.gc-v2-printing #printDocument .arMeta{grid-template-columns:repeat(4,1fr)!important;gap:5px!important;margin-bottom:6px!important}.arMeta>div{padding:6px 7px!important;min-height:35px!important}
      body.gc-v2-printing #printDocument .arStats{grid-template-columns:repeat(6,1fr)!important;gap:5px!important;margin-bottom:7px!important}.arStat{padding:6px 3px!important}.arStat b{font-size:13.5px!important}.arStat span{font-size:7.5px!important}
      body.gc-v2-printing #printDocument .arSplit{grid-template-columns:1.08fr .92fr!important;gap:7px!important;margin-bottom:7px!important}.arSplit>section{padding:7px!important}.analysisReportV2 h3{font-size:10px!important;margin-bottom:5px!important}.arRow{min-height:20px!important}.arRow span{font-size:7.6px!important;padding:3px 4px!important}.arBars{gap:5px!important}.arTrack{height:7px!important}.arBarMeta b{font-size:7.6px!important}.arBarMeta span{font-size:6.9px!important}
      body.gc-v2-printing #printDocument .arBands{grid-template-columns:repeat(3,1fr)!important;gap:5px!important;margin-bottom:7px!important}.arBands>div{padding:5px 7px!important}.arBands span{font-size:7px!important}.arBands b{font-size:11px!important}.arBands small{font-size:6.2px!important}
      body.gc-v2-printing #printDocument .arInsight{padding:7px 9px!important;margin-bottom:6px!important}.arInsightTitle span{font-size:9.5px!important}.arInsightTitle b{font-size:11.5px!important}.arInsight>p{font-size:8px!important;line-height:1.5!important;margin-bottom:5px!important}.arDecision{grid-template-columns:1fr 1fr!important;gap:5px!important}.arDecision>div{padding:5px!important}.arDecision span{font-size:6.9px!important}.arDecision p{font-size:7.2px!important;line-height:1.42!important}.arInsight>small{font-size:6.2px!important;margin-top:4px!important}
      body.gc-v2-printing #printDocument .arPriority{padding:5px!important;margin-bottom:5px!important}.arPriority>div{grid-template-columns:repeat(4,1fr)!important;gap:3px!important}.arPriority>div>span{padding:3px 4px!important}.arPriority b{font-size:6.8px!important}.arPriority i{font-size:6px!important}
      body.gc-v2-printing #printDocument .arFootFacts{padding-top:4px!important}.arFootFacts span{font-size:6.9px!important}.arSigns{margin-top:6px!important;padding-top:5px!important;gap:35px!important}.arSigns>div{min-height:19px!important}.arSigns span,.arSigns b{font-size:7px!important}
    }
  `;document.head.appendChild(s)
})();