/* Guided Capture — Icon Interaction Guard V2
   Ensures tapping an icon, label, or tile always triggers the same action. */
(function(){
  const intentMap={
    'تقرير':'report','محضر':'minutes','تحليل نتائج':'analysis','خطة':'plan',
    'برنامج / فعالية':'program','تطوير مهني':'pd','متابعة':'follow','صف لي ما حدث':'smart'
  };
  function intentFromButton(btn){
    const oc=btn.getAttribute('onclick')||'';
    const m=oc.match(/openEntry\(['\"]([^'\"]+)['\"]\)/);if(m)return m[1];
    const text=(btn.querySelector('b')?.textContent||btn.textContent||'').trim();
    return intentMap[text]||'';
  }
  function bind(){
    document.querySelectorAll('.entryTile,.smartEntry').forEach(btn=>{
      if(btn.dataset.iconGuardBound==='1')return;
      const intent=intentFromButton(btn);if(!intent)return;
      btn.dataset.iconGuardBound='1';
      btn.style.touchAction='manipulation';
      btn.addEventListener('click',function(e){
        if(typeof window.openEntry!=='function')return;
        e.preventDefault();e.stopImmediatePropagation();window.openEntry(intent);
      },true);
      btn.setAttribute('aria-label',btn.querySelector('b')?.textContent?.trim()||'فتح');
    });
    const more=document.querySelector('.moreEntry');
    if(more&&more.dataset.iconGuardBound!=='1'){
      more.dataset.iconGuardBound='1';more.style.touchAction='manipulation';
      more.addEventListener('click',function(e){if(typeof window.toggleMoreEntries==='function'){e.preventDefault();e.stopImmediatePropagation();window.toggleMoreEntries()}},true);
    }
    const back=document.querySelector('.backEntry');
    if(back&&back.dataset.iconGuardBound!=='1'){
      back.dataset.iconGuardBound='1';back.style.touchAction='manipulation';
      back.addEventListener('click',function(e){if(typeof window.returnToEntryHome==='function'){e.preventDefault();e.stopImmediatePropagation();window.returnToEntryHome()}},true);
    }
  }
  function audit(){
    bind();
    const tiles=[...document.querySelectorAll('.entryTile,.smartEntry')];
    const problems=[];
    tiles.forEach(btn=>{
      const intent=intentFromButton(btn);
      if(!intent)problems.push({type:'missing-intent',text:(btn.textContent||'').trim()});
      if(btn.dataset.iconGuardBound!=='1')problems.push({type:'not-bound',intent});
      const icon=btn.querySelector('span');if(!icon)problems.push({type:'missing-icon',intent});
    });
    const result={passed:problems.length===0&&typeof window.openEntry==='function',tiles:tiles.length,problems,openEntry:typeof window.openEntry==='function',more:typeof window.toggleMoreEntries==='function',back:typeof window.returnToEntryHome==='function'};
    window.GC_ICON_AUDIT=result;return result;
  }
  window.gcAuditIcons=audit;
  let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(audit,60)}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(audit,120);
})();