/* School Documentation Engine — Print V2.1
   iOS/in-app safe print: same-page print, A4 fit, adaptive density, orphan prevention. */
(function(){
  function doc(){return document.getElementById('printDocument')}
  function cleanup(){
    document.documentElement.classList.remove('gc-v2-printing','gc-print-compact','gc-print-dense');
    document.body.classList.remove('gc-v2-printing','gc-print-compact','gc-print-dense');
  }
  function prepareDensity(){
    const d=doc(); if(!d)return;
    const text=(d.innerText||'').length;
    const images=d.querySelectorAll('.evFig img').length;
    const sections=d.querySelectorAll('.paperSection').length;
    const score=text+(images*420)+(sections*100);
    if(score>4300){document.documentElement.classList.add('gc-print-dense');document.body.classList.add('gc-print-dense');}
    else if(score>3000){document.documentElement.classList.add('gc-print-compact');document.body.classList.add('gc-print-compact');}
  }
  window.gcPrintV2=function(){
    const d=doc();
    if(!d){alert('لا توجد وثيقة جاهزة للطباعة.');return;}
    const old=document.title;
    document.title=(d.querySelector('.paperHero h1')?.textContent||'وثيقة مدرسية').trim();
    document.documentElement.classList.add('gc-v2-printing');document.body.classList.add('gc-v2-printing');
    prepareDensity();
    const restore=()=>{cleanup();document.title=old;window.removeEventListener('afterprint',restore)};
    window.addEventListener('afterprint',restore);
    setTimeout(()=>{try{window.print()}catch(e){restore();alert('تعذر فتح الطباعة داخل هذا المتصفح. افتح الصفحة في Safari ثم اختر مشاركة ← طباعة.')}setTimeout(restore,5000)},120);
  };
  function patch(){
    document.querySelectorAll('.parityTools button').forEach(b=>{
      if(/طباعة|PDF/.test(b.textContent)){b.onclick=window.gcPrintV2;b.textContent='طباعة / حفظ PDF';}
    });
    document.querySelector('.openPrintPageBtn')?.remove();
  }
  new MutationObserver(patch).observe(document.documentElement,{childList:true,subtree:true}); patch();
  const s=document.createElement('style');s.textContent=`
  @media print{
    @page{size:A4 portrait;margin:7mm}
    html.gc-v2-printing,body.gc-v2-printing{background:#fff!important;margin:0!important;padding:0!important;width:auto!important;min-width:0!important}
    body.gc-v2-printing *{visibility:hidden!important}
    body.gc-v2-printing #printDocument,body.gc-v2-printing #printDocument *{visibility:visible!important}
    body.gc-v2-printing #printDocument{box-sizing:border-box!important;position:absolute!important;inset:0 auto auto 0!important;width:196mm!important;max-width:196mm!important;min-width:0!important;min-height:0!important;margin:0!important;padding:6mm 8mm!important;box-shadow:none!important;border:0!important;border-radius:0!important;background:#fff!important;transform:none!important;zoom:1!important;overflow:visible!important}
    body.gc-v2-printing #printDocument .noPrint,body.gc-v2-printing #printDocument button,body.gc-v2-printing #printDocument input[type=file],body.gc-v2-printing .parityTools{display:none!important}
    body.gc-v2-printing .paperHeader,body.gc-v2-printing .paperHero,body.gc-v2-printing .metaTable>div,body.gc-v2-printing .paperSection h3,body.gc-v2-printing .signatures,body.gc-v2-printing .paperFooter{break-inside:avoid!important;page-break-inside:avoid!important}
    body.gc-v2-printing .signatures{break-before:avoid-page!important;page-break-before:avoid!important}
    body.gc-v2-printing .paperHeader{gap:7px!important}
    body.gc-v2-printing .brandMark{width:38px!important;height:38px!important;font-size:20px!important}
    body.gc-v2-printing .schoolHead strong{font-size:13px!important}
    body.gc-v2-printing .docClass b{font-size:11px!important}
    body.gc-v2-printing .paperHero{padding:4px 5px 7px!important}
    body.gc-v2-printing .paperHero h1{font-size:17px!important;line-height:1.3!important;margin:0!important}
    body.gc-v2-printing .metaTable{margin-bottom:6px!important}
    body.gc-v2-printing .metaTable>div{min-height:36px!important;padding:5px 7px!important}
    body.gc-v2-printing .metaTable b{font-size:10.8px!important}
    body.gc-v2-printing .paperNarrative p{font-size:10.8px!important;line-height:1.55!important;margin:0 0 3px!important}
    body.gc-v2-printing .paperSection{margin:5px 0!important}
    body.gc-v2-printing .paperSection h3{font-size:12px!important;margin:0 0 4px!important}
    body.gc-v2-printing .evFig{break-inside:avoid!important;page-break-inside:avoid!important}
    body.gc-v2-printing .evFig img{height:29mm!important;object-fit:cover!important}
    body.gc-v2-printing .signatures{margin-top:6px!important;padding-top:5px!important;gap:24px!important;min-height:22mm!important}
    body.gc-v2-printing .signatures i{margin-top:5px!important}
    body.gc-v2-printing .paperFooter{margin-top:5px!important;font-size:7px!important}
    body.gc-print-compact #printDocument{padding:5mm 7mm!important}
    body.gc-print-compact .paperNarrative p{font-size:10.2px!important;line-height:1.48!important}
    body.gc-print-compact .paperSection{margin:4px 0!important}
    body.gc-print-compact .evFig img{height:26mm!important}
    body.gc-print-compact .signatures{min-height:19mm!important;margin-top:4px!important}
    body.gc-print-dense #printDocument{padding:4.5mm 6.5mm!important}
    body.gc-print-dense .paperHero h1{font-size:15.5px!important}
    body.gc-print-dense .metaTable>div{min-height:31px!important;padding:4px 6px!important}
    body.gc-print-dense .paperNarrative p{font-size:9.7px!important;line-height:1.42!important}
    body.gc-print-dense .paperSection{margin:3px 0!important}
    body.gc-print-dense .paperSection h3{font-size:11px!important;margin-bottom:3px!important}
    body.gc-print-dense .evFig img{height:23mm!important}
    body.gc-print-dense .signatures{min-height:17mm!important;margin-top:3px!important;padding-top:4px!important}
    body.gc-print-dense .paperFooter{margin-top:3px!important}
  }`;
  document.head.appendChild(s);
})();