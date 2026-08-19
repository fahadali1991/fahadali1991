/* Guided Capture QA — student case follow-up subtype */
(function(){
  if(typeof SUBTYPES!=='undefined'&&SUBTYPES['إجراء متابعة'])SUBTYPES['إجراء متابعة']=uniq([...SUBTYPES['إجراء متابعة'],'متابعة حالة طلابية']);
  const base=inferSubtype;
  inferSubtype=function(f){
    if(f?.type==='إجراء متابعة'){
      const n=f.n||norm(f.raw||'');
      if(has(n,'اولياء','ولي الامر','تواصل','اتصال','استدعينا','حاله طالب','حالات الطلاب','متعثر'))return'متابعة حالة طلابية';
    }
    return base(f);
  };
})();
