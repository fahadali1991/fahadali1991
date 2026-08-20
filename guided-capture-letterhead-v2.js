/* Unified School Letterhead V2.1 — formal reusable print identity */
(function(){
  const LS_KEY='gc_school_identity_v1';
  function identity(){try{return JSON.parse(localStorage.getItem(LS_KEY)||'{}')}catch(e){return{}}}
  function esc(v){return String(v??'').replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
  function docLabel(paper){return paper?.querySelector('.docClass b')?.textContent?.trim()||'وثيقة مدرسية'}
  function docTitle(paper){return paper?.querySelector('.paperHero h1')?.textContent?.trim()||docLabel(paper)}
  function apply(){
    const paper=document.getElementById('printDocument');
    if(!paper||paper.dataset.letterheadV2==='1')return;
    const old=paper.querySelector('.paperHeader'); if(!old)return;
    const s=identity(),admin=s.admin||'الإدارة العامة للتعليم بنجران',school=s.school||'مدرسة حطين المتوسطة',label=docLabel(paper),title=docTitle(paper);
    const h=document.createElement('header');h.className='lh2';
    h.innerHTML=`<div class="lh2Side lh2Ministry"><strong>وزارة التعليم</strong><span>المملكة العربية السعودية</span></div><div class="lh2Center"><span>${esc(admin)}</span><strong>${esc(school)}</strong></div><div class="lh2Side lh2Doc"><span>وثيقة مدرسية</span><strong>${esc(label)}</strong></div>`;
    old.replaceWith(h);
    const rule=paper.querySelector('.accentRule');if(rule)rule.className='lh2Rule';
    const hero=paper.querySelector('.paperHero');if(hero){hero.classList.add('lh2Hero');hero.querySelector('small')?.remove();const t=hero.querySelector('h1');if(t)t.textContent=title;}
    const footer=paper.querySelector('.paperFooter');if(footer){footer.classList.add('lh2Footer');footer.innerHTML='<span>وثيقة مدرسية</span><span>تعتمد البيانات وفق ما تم إدخاله والتحقق منه</span>';}
    paper.dataset.letterheadV2='1';
  }
  const css=document.createElement('style');css.textContent=`
    #printDocument .lh2{display:grid;grid-template-columns:1fr 1.45fr 1fr;align-items:center;gap:0;padding:0 0 9px;border-bottom:1px solid #d9e3df;color:#173c35}
    #printDocument .lh2Side,#printDocument .lh2Center{min-width:0;min-height:42px;display:flex;flex-direction:column;justify-content:center}
    #printDocument .lh2Ministry{text-align:right;padding-left:12px}#printDocument .lh2Center{text-align:center;padding:0 14px;border-right:1px solid #e1e8e5;border-left:1px solid #e1e8e5}#printDocument .lh2Doc{text-align:left;padding-right:12px}
    #printDocument .lh2 span{display:block;color:#77847f;font-size:9px;font-weight:700;line-height:1.45}#printDocument .lh2 strong{display:block;font-size:11.5px;line-height:1.45;font-weight:900}#printDocument .lh2Center strong{font-size:15px;color:#174f45;margin-top:1px}#printDocument .lh2Doc strong{color:#246b5f;margin-top:1px}
    #printDocument .lh2Rule{height:2px;margin:0 0 9px;background:#2b7568;position:relative}#printDocument .lh2Rule:after{content:'';display:block;width:36%;height:2px;background:#cfe1db;position:absolute;left:0;top:0}
    #printDocument .lh2Hero{text-align:center;padding:7px 8px 9px;margin:0 0 6px}#printDocument .lh2Hero h1{font-size:20px;line-height:1.45;margin:0;color:#153f37;font-weight:900}
    #printDocument .lh2Footer{color:#8a9692!important;font-size:8px!important;border-top:1px solid #e4ebe8!important;margin-top:13px!important;padding-top:6px!important}
    #printDocument[data-output-family="analysis"] .metaTable{margin-bottom:9px}#printDocument[data-output-family="analysis"] .paperSection{margin:9px 0}#printDocument[data-output-family="analysis"] .paperSection h3{font-size:13px;margin-bottom:6px}#printDocument[data-output-family="analysis"] .a2Insight{background:#fbfdfc}
    @media(max-width:700px){#printDocument .lh2{grid-template-columns:1fr 1fr}#printDocument .lh2Center{grid-column:1/-1;grid-row:1;text-align:center;border:0;border-bottom:1px solid #e5ece9;padding:0 0 7px;margin-bottom:2px}#printDocument .lh2Ministry{grid-column:2;text-align:right}#printDocument .lh2Doc{grid-column:1;text-align:left}}
    @media print{body.gc-v2-printing #printDocument .lh2{grid-template-columns:1fr 1.45fr 1fr!important;padding-bottom:5px!important}body.gc-v2-printing #printDocument .lh2Side,body.gc-v2-printing #printDocument .lh2Center{min-height:30px!important}body.gc-v2-printing #printDocument .lh2 span{font-size:6.8px!important}body.gc-v2-printing #printDocument .lh2 strong{font-size:8.5px!important}body.gc-v2-printing #printDocument .lh2Center strong{font-size:10.7px!important}body.gc-v2-printing #printDocument .lh2Rule{height:1.5px!important;margin-bottom:5px!important}body.gc-v2-printing #printDocument .lh2Hero{padding:3px 5px 5px!important;margin-bottom:2px!important}body.gc-v2-printing #printDocument .lh2Hero h1{font-size:14.5px!important}body.gc-v2-printing #printDocument .lh2Footer{font-size:6.5px!important;margin-top:8px!important;padding-top:4px!important}}
  `;document.head.appendChild(css);
  window.GC_LETTERHEAD_V2={version:'2.1',apply};
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,40)}).observe(document.documentElement,{childList:true,subtree:true});setTimeout(apply,250);
})();