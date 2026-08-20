/* Unified School Letterhead V2 — formal reusable print identity */
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
    const s=identity();
    const admin=s.admin||'الإدارة العامة للتعليم بنجران';
    const school=s.school||'مدرسة حطين المتوسطة';
    const label=docLabel(paper), title=docTitle(paper);
    const h=document.createElement('header');h.className='lh2';
    h.innerHTML=`<div class="lh2Ministry"><strong>وزارة التعليم</strong><span>المملكة العربية السعودية</span></div><div class="lh2Center"><span>${esc(admin)}</span><strong>${esc(school)}</strong></div><div class="lh2Doc"><span>التوثيق المدرسي الذكي</span><strong>${esc(label)}</strong></div>`;
    old.replaceWith(h);
    const rule=paper.querySelector('.accentRule');if(rule)rule.className='lh2Rule';
    const hero=paper.querySelector('.paperHero');if(hero){hero.classList.add('lh2Hero');hero.querySelector('small')?.remove();const t=hero.querySelector('h1');if(t)t.textContent=title;}
    paper.dataset.letterheadV2='1';
  }
  const css=document.createElement('style');css.textContent=`
    #printDocument .lh2{display:grid;grid-template-columns:1fr 1.35fr 1fr;align-items:center;gap:12px;padding:0 0 10px;border-bottom:1px solid #dce6e2;color:#183a34}
    #printDocument .lh2Ministry,#printDocument .lh2Center,#printDocument .lh2Doc{min-width:0}
    #printDocument .lh2Ministry{text-align:right}#printDocument .lh2Center{text-align:center;padding:0 10px;border-right:1px solid #e2e9e6;border-left:1px solid #e2e9e6}#printDocument .lh2Doc{text-align:left}
    #printDocument .lh2 span{display:block;color:#71807b;font-size:9.5px;font-weight:700;line-height:1.45}#printDocument .lh2 strong{display:block;font-size:12.5px;line-height:1.5;font-weight:900}#printDocument .lh2Center strong{font-size:15px;color:#174f45;margin-top:1px}#printDocument .lh2Doc strong{color:#246d60;margin-top:1px}
    #printDocument .lh2Rule{height:3px;margin:0 0 10px;background:linear-gradient(90deg,#dbe9e4 0 26%,#2d7b6d 26% 74%,#dbe9e4 74% 100%)}
    #printDocument .lh2Hero{text-align:center;padding:7px 8px 10px;margin:0 0 6px;border-bottom:0}#printDocument .lh2Hero h1{font-size:21px;line-height:1.45;margin:0;color:#153f37;font-weight:900;letter-spacing:0}
    @media(max-width:700px){#printDocument .lh2{grid-template-columns:1fr 1fr}#printDocument .lh2Center{grid-column:1/-1;grid-row:1;text-align:center;border:0;border-bottom:1px solid #e5ece9;padding:0 0 7px;margin-bottom:2px}#printDocument .lh2Ministry{grid-column:2;text-align:right}#printDocument .lh2Doc{grid-column:1;text-align:left}}
    @media print{body.gc-v2-printing #printDocument .lh2{grid-template-columns:1fr 1.35fr 1fr!important;gap:8px!important;padding-bottom:6px!important}body.gc-v2-printing #printDocument .lh2 span{font-size:7.2px!important}body.gc-v2-printing #printDocument .lh2 strong{font-size:9.2px!important}body.gc-v2-printing #printDocument .lh2Center strong{font-size:11.2px!important}body.gc-v2-printing #printDocument .lh2Rule{height:2px!important;margin-bottom:6px!important}body.gc-v2-printing #printDocument .lh2Hero{padding:4px 5px 6px!important;margin-bottom:3px!important}body.gc-v2-printing #printDocument .lh2Hero h1{font-size:15px!important}}
  `;document.head.appendChild(css);
  window.GC_LETTERHEAD_V2={version:'2.0',apply};
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,40)}).observe(document.documentElement,{childList:true,subtree:true});setTimeout(apply,250);
})();