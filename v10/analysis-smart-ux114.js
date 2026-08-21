/* V114 — تحليل النتائج: تحسين لوحة المفاتيح فقط.
   اختيار المستفيدين وتحليل السياق أصبحا مسؤولية Education Scope Resolver + understanding84،
   لذلك لا توجد هنا أي ترقيعة DOM للمستفيدين. */
(function(){
  document.addEventListener('keydown',e=>{
    const score=e.target.closest?.('[data-analysis-score114]');
    if(!score||e.key!=='Enter')return;
    e.preventDefault();
    const nextIndex=Number(score.dataset.analysisScore114)+1;
    queueMicrotask(()=>{
      const nextName=document.querySelector(`[data-analysis-name114="${nextIndex}"]`);
      if(nextName){nextName.focus();nextName.select?.();return}
      const add=document.querySelector('[data-analysis-add-row114]');
      if(add){add.click();queueMicrotask(()=>{const created=document.querySelector(`[data-analysis-name114="${nextIndex}"]`);created?.focus();created?.select?.()})}
    });
  },true);
})();
