/* V114 — تحليل النتائج: مستفيدون أذكى + انتقال إدخال أسرع */
(function(){
  let busy=false;
  function isAnalysis(){return !!document.querySelector('[data-type="تحليل نتائج"].on')}
  function audienceChooser(){return [...document.querySelectorAll('.chooser')].find(x=>x.querySelector('small')?.textContent.trim()==='المستفيدون')||null}
  function apply(){
    if(busy||!isAnalysis())return;
    const host=audienceChooser();if(!host)return;
    host.querySelectorAll('[data-audience]').forEach(btn=>{
      const v=btn.dataset.audience;
      const keep=v==='الطلاب'||v==='مستفيدون آخرون';
      btn.style.display=keep?'':'none';
      if(v==='مستفيدون آخرون')btn.textContent='أخرى';
    });
    const help=host.querySelector('.questionHelp');if(help)help.innerHTML='في تحليل النتائج يكون المستفيد الافتراضي <b>الطلاب</b>. اختر «أخرى» فقط إذا كان التحليل لفئة مختلفة.';
    const students=host.querySelector('[data-audience="الطلاب"]');
    if(students&&!students.classList.contains('on')){
      busy=true;queueMicrotask(()=>{students.click();setTimeout(()=>busy=false,60)});
    }
  }
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-type],[data-audience]'))setTimeout(apply,0)},true);
  document.addEventListener('keydown',e=>{
    const score=e.target.closest?.('[data-analysis-score114]');
    if(!score||e.key!=='Enter')return;
    const nextIndex=Number(score.dataset.analysisScore114)+1;
    queueMicrotask(()=>{
      const nextName=document.querySelector(`[data-analysis-name114="${nextIndex}"]`);
      if(nextName){nextName.focus();nextName.select?.()}
    });
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();