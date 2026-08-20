/* G0 Create Document Guard V2
   Ensures visible create-report/create-document actions are always bound to the real generator. */
(function(){
  let busy=false;
  function saveBeforeGenerate(){
    try{window.GC_STABILITY?.capture?.()}catch(e){}
    try{window.GC_STABILITY?.syncEvidence?.()}catch(e){}
  }
  window.gcCreateDocumentV2=function(){
    if(busy)return;
    if(typeof window.generate!=='function'){
      console.error('[G0] generate() is unavailable');
      alert('تعذر إنشاء التقرير لأن محرك الإنشاء غير جاهز. أعد فتح الصفحة ثم حاول مرة أخرى.');
      return;
    }
    busy=true;
    saveBeforeGenerate();
    try{
      window.generate();
      setTimeout(()=>{
        const paper=document.getElementById('printDocument');
        if(!paper){
          console.error('[G0] generate() completed without printDocument');
          alert('تم تنفيذ أمر الإنشاء لكن لم تظهر الوثيقة. تم تسجيل الخلل للفحص.');
        }else{
          try{paper.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}
        }
      },250);
    }catch(err){
      console.error('[G0] create document failed',err);
      alert('تعذر إنشاء التقرير. تم تسجيل الخطأ للفحص.');
      throw err;
    }finally{
      setTimeout(()=>{busy=false},450);
    }
  };

  function isCreateButton(el){
    if(!(el instanceof HTMLElement))return false;
    const button=el.closest('button,[role="button"],.btn');
    if(!button)return false;
    const t=(button.textContent||'').replace(/\s+/g,' ').trim();
    return /^(?:إنشاء|انشاء)(?:\s+(?:التقرير|تقرير|الوثيقة|وثيقة))?(?:\s*[←→›»])?$/i.test(t) || /إنشاء\s+(?:التقرير|تقرير|الوثيقة)/i.test(t);
  }

  function bindCreateButtons(){
    document.querySelectorAll('button,[role="button"],.btn').forEach(btn=>{
      if(!isCreateButton(btn))return;
      btn.setAttribute('data-gc-create-bound','1');
      btn.onclick=function(ev){
        ev?.preventDefault?.(); ev?.stopPropagation?.();
        window.gcCreateDocumentV2();
        return false;
      };
    });
  }

  /* Capture protects dynamically rendered icon/child clicks even before MutationObserver rebinds. */
  document.addEventListener('click',function(ev){
    const target=ev.target;
    if(!isCreateButton(target))return;
    const btn=target.closest('button,[role="button"],.btn');
    if(btn?.getAttribute('data-gc-create-bound')==='1')return;
    ev.preventDefault();ev.stopPropagation();
    window.gcCreateDocumentV2();
  },true);

  let timer;
  new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(bindCreateButtons,30)}).observe(document.documentElement,{childList:true,subtree:true});
  bindCreateButtons();

  window.gcAuditCreateButton=function(){
    const buttons=[...document.querySelectorAll('button,[role="button"],.btn')].filter(isCreateButton);
    return {count:buttons.length,bound:buttons.filter(b=>b.getAttribute('data-gc-create-bound')==='1').length,generate:typeof window.generate==='function'};
  };
})();