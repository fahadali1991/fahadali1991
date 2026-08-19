/* School Documentation Engine — Print V2
   iOS/in-app safe print: no popup dependency. Prints current document in place. */
(function(){
  function doc(){return document.getElementById('printDocument')}
  function cleanup(){document.documentElement.classList.remove('gc-v2-printing');document.body.classList.remove('gc-v2-printing');}
  window.gcPrintV2=function(){
    if(!doc()){alert('لا توجد وثيقة جاهزة للطباعة.');return;}
    const old=document.title;
    document.title=(doc().querySelector('.paperHero h1')?.textContent||'وثيقة مدرسية').trim();
    document.documentElement.classList.add('gc-v2-printing');document.body.classList.add('gc-v2-printing');
    const restore=()=>{cleanup();document.title=old;window.removeEventListener('afterprint',restore)};
    window.addEventListener('afterprint',restore);
    setTimeout(()=>{try{window.print()}catch(e){restore();alert('تعذر فتح الطباعة داخل هذا المتصفح. افتح الصفحة في Safari ثم اختر مشاركة ← طباعة.')}setTimeout(restore,4000)},80);
  };
  function patch(){
    document.querySelectorAll('.parityTools button').forEach(b=>{
      if(/طباعة|PDF/.test(b.textContent)){b.onclick=window.gcPrintV2;b.removeAttribute('data-old-print');b.textContent='طباعة / حفظ PDF';}
    });
    const extra=document.querySelector('.openPrintPageBtn');if(extra)extra.remove();
  }
  const observer=new MutationObserver(()=>patch());observer.observe(document.documentElement,{childList:true,subtree:true});
  patch();
  const s=document.createElement('style');s.textContent=`
  @media print{
    @page{size:A4;margin:0}
    html.gc-v2-printing,body.gc-v2-printing{background:#fff!important;margin:0!important;padding:0!important;width:210mm!important}
    body.gc-v2-printing *{visibility:hidden!important}
    body.gc-v2-printing #printDocument,body.gc-v2-printing #printDocument *{visibility:visible!important}
    body.gc-v2-printing #printDocument{position:absolute!important;right:0!important;top:0!important;width:210mm!important;min-height:297mm!important;margin:0!important;box-shadow:none!important;border:0!important;border-radius:0!important;padding:10mm 12mm 9mm!important;background:#fff!important}
    body.gc-v2-printing #printDocument .noPrint,body.gc-v2-printing #printDocument button,body.gc-v2-printing #printDocument input[type=file]{display:none!important}
    body.gc-v2-printing .paperNarrative p{line-height:1.7!important;margin-bottom:4px!important}
    body.gc-v2-printing .paperSection{margin:8px 0!important}
    body.gc-v2-printing .evFig img{height:37mm!important}
    body.gc-v2-printing .signatures{margin-top:9px!important;padding-top:7px!important}
    body.gc-v2-printing .paperFooter{margin-top:8px!important}
  }`;
  document.head.appendChild(s);
})();