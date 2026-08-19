/* Guided Capture QA — direct-entry state sanitizer */
(function(){
  const baseStart=window.start;
  if(typeof baseStart!=='function')return;
  window.start=function(){
    const result=baseStart.apply(this,arguments);
    if(typeof cur==='undefined'||!cur||!cur.entryIntent||['smart','report'].includes(cur.entryIntent))return result;
    const n=cur.n||norm(cur.raw||'');
    cur.answers={};
    cur.mode='';
    if(cur.type==='اجتماع / متابعة إدارية'){
      cur.mode=has(n,'نتائج','درجات')?'مراجعة نتائج':has(n,'مشكل','معالجه','حل')?'حل مشكلة':has(n,'تخطيط')?'تخطيط':has(n,'متابعه','تكليف','انجاز')?'متابعة':'';
    }else if(cur.type==='تحليل نتائج'){
      cur.mode=has(n,'متعثر','علاج','علاجي')?'علاجي':has(n,'متفوق','اثرائي','اثراء')?'إثرائي':'';
    }else if(cur.type==='برنامج / فعالية'){
      cur.mode=has(n,'مسابقه')?'مسابقة':has(n,'حمله')?'حملة':has(n,'مبادره')?'مبادرة':has(n,'فعاليه')?'فعالية':has(n,'نشاط')?'نشاط':'برنامج';
    }else if(cur.type==='إجراء متابعة'){
      cur.mode=has(n,'بصمه')?'بصمة':has(n,'حصه','الحصه','حصص')?'على مستوى الحصة':'';
    }
    cur.subtype=typeof inferSubtype==='function'?inferSubtype(cur):cur.subtype;
    cur.workTitle='';cur._titleSuggestions=[];cur._titleIndex=0;cur._titleSig='';
    if(typeof ensureTitleSuggestions==='function')ensureTitleSuggestions();
    if(typeof renderUnderstanding==='function')renderUnderstanding();
    return result;
  };
})();
