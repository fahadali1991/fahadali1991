/* School Documentation Engine — V2 Foundation
   Document Registry + family-aware output routing. No visual identity copied from external products. */
(function(){
  const REGISTRY={
    'program-report':{family:'event',label:'تقرير برنامج / فعالية',evidence:'execution',output:'event'},
    'exam-analysis':{family:'analysis',label:'تحليل نتائج',evidence:'result',output:'analysis'},
    'remedial-plan':{family:'plan',label:'خطة علاجية',evidence:'result',output:'plan'},
    'plc':{family:'professional',label:'مجتمع تعلم مهني',evidence:'product',output:'professional'},
    'minutes':{family:'minutes',label:'محضر',evidence:'execution',output:'minutes'}
  };
  window.GC_V2={version:'2.0-foundation',registry:REGISTRY,getDocument(id){return REGISTRY[id]||null},family(id){return REGISTRY[id]?.family||'generic'}};
  function currentId(){return window.gcInferredParityDoc?.()||window.GC_BENCHMARK_DOC?.id||window.cur?.benchmarkDocId||''}
  window.gcV2CurrentDocument=function(){return GC_V2.getDocument(currentId())};

  /* Analysis documents must privilege data/results over generic photo evidence. */
  const oldRenderParity=window.renderParity;
  if(typeof oldRenderParity==='function')window.renderParity=function(){
    const result=oldRenderParity.apply(this,arguments);
    const d=gcV2CurrentDocument();
    if(result&&d?.family==='analysis'){
      const sec=document.querySelector('#printDocument .evidenceSection');
      if(sec){
        const h=sec.querySelector('h3'); if(h)h.textContent='المرفقات الداعمة';
        const empty=sec.querySelector('.evidenceEmpty');
        if(empty)empty.textContent='الصور اختيارية في تحليل النتائج. الأولوية لبيانات الدرجات والمؤشرات والرسوم الناتجة عنها.';
      }
    }
    return result;
  };

  /* Quality cue: output family is explicit, so later V2 renderers can replace family by family. */
  window.gcV2OutputFamily=function(){return gcV2CurrentDocument()?.output||'generic'};
})();