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
    @page{size:A4 portrait;margin:6mm}
    html.gc-v2-printing,body.gc-v2-printing{background:#fff!important;margin:0!important;padding:0!important;width:auto!important}
    body.gc-v2-printing *{visibility:hidden!important}
    body.gc-v2-printing #printDocument,body.gc-v2-printing #printDocument *{visibility:visible!important}
    body.gc-v2-printing #printDocument{position:absolute!important;right:0!important;top:0!important;width:198mm!important;min-height:285mm!important;margin:0!important;box-shadow:none!important;border:0!important;border-radius:0!important;padding:7mm 9mm 7mm!important;background:#fff!important;transform:none!important}
    body.gc-v2-printing #printDocument .noPrint,body.gc-v2-printing #printDocument button,body.gc-v2-printing #printDocument input[type=file]{display:none!important}
    body.gc-v2-printing .paperHeader{gap:8px!important}
    body.gc-v2-printing .brandMark{width:42px!important;height:42px!important;font-size:22px!important}
    body.gc-v2-printing .schoolHead strong{font-size:14px!important}
    body.gc-v2-printing .docClass b{font-size:12px!important}
    body.gc-v2-printing .paperHero{padding:5px 6px 8px!important}
    body.gc-v2-printing .paperHero h1{font-size:18px!important;line-height:1.35!important}
    body.gc-v2-printing .metaTable{margin-bottom:8px!important}
    body.gc-v2-printing .metaTable>div{min-height:42px!important;padding:6px 8px!important}
    body.gc-v2-printing .metaTable b{font-size:11.5px!important}
    body.gc-v2-printing .paperNarrative p{font-size:11.5px!important;line-height:1.62!important;margin-bottom:3px!important}
    body.gc-v2-printing .paperSection{margin:6px 0!important}
    body.gc-v2-printing .paperSection h3{font-size:12.5px!important;margin-bottom:5px!important}
    body.gc-v2-printing .evFig img{height:32mm!important}
    body.gc-v2-printing .signatures{margin-top:7px!important;padding-top:6px!important;gap:28px!important}
    body.gc-v2-printing .signatures i{margin-top:6px!important}
    body.gc-v2-printing .paperFooter{margin-top:6px!important;font-size:7.5px!important}
  }`;
  document.head.appendChild(s);
})();