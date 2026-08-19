/* Guided Capture — robust print flow for iOS/in-app browsers */
(function(){
  function printable(){return document.getElementById('printDocument')}
  function allStyles(){return Array.from(document.querySelectorAll('style,link[rel="stylesheet"]')).map(el=>el.outerHTML).join('\n')}
  function printHtml(){
    const doc=printable(); if(!doc)return'';
    const clone=doc.cloneNode(true);
    clone.querySelectorAll('.noPrint,button,input[type=file]').forEach(x=>x.remove());
    return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${allStyles()}<style>body{margin:0;background:#fff}.paperA4{box-shadow:none!important;border:0!important;margin:0 auto!important}.noPrint{display:none!important}@media print{@page{size:A4;margin:0}html,body{width:210mm;background:#fff}.paperA4{width:210mm!important;min-height:297mm!important;padding:14mm 14mm 12mm!important}}</style><title>${document.title||'وثيقة مدرسية'}</title></head><body>${clone.outerHTML}<script>window.addEventListener('load',()=>setTimeout(()=>{try{window.focus();window.print()}catch(e){}},250));<\/script></body></html>`;
  }
  window.gcPrintDocument=function(){
    const html=printHtml(); if(!html){alert('لم يتم العثور على الوثيقة الجاهزة للطباعة.');return;}
    let w=null;
    try{w=window.open('about:blank','_blank');}catch(e){}
    if(w&&w.document){
      try{w.document.open();w.document.write(html);w.document.close();return;}catch(e){}
    }
    /* Fallback for browsers that block popups: print the current page in-place. */
    document.body.classList.add('gcPrintCurrent');
    const oldTitle=document.title; document.title=(document.querySelector('.paperHero h1')?.textContent||'وثيقة مدرسية');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      try{window.print()}finally{setTimeout(()=>{document.body.classList.remove('gcPrintCurrent');document.title=oldTitle},1200)}
    }));
  };
  window.gcOpenPrintPage=function(){
    const html=printHtml(); if(!html){alert('لم يتم العثور على الوثيقة الجاهزة للطباعة.');return;}
    const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  };
  function patchButtons(){
    document.querySelectorAll('.parityTools button').forEach(b=>{
      const t=b.textContent.trim();
      if(t.includes('طباعة')||t.includes('PDF')){b.setAttribute('onclick','gcPrintDocument()');b.textContent='طباعة / حفظ PDF';}
    });
    const tools=document.querySelector('.parityTools');
    if(tools&&!tools.querySelector('.openPrintPageBtn')){
      const b=document.createElement('button');b.type='button';b.className='btn soft openPrintPageBtn';b.textContent='فتح نسخة للطباعة';b.onclick=gcOpenPrintPage;tools.appendChild(b);
    }
  }
  const oldParity=window.renderParity;
  if(typeof oldParity==='function')window.renderParity=function(){const r=oldParity.apply(this,arguments);setTimeout(patchButtons,0);return r};
  const oldGenerate=window.generate;
  if(typeof oldGenerate==='function')window.generate=function(){const r=oldGenerate.apply(this,arguments);setTimeout(patchButtons,0);return r};
  const style=document.createElement('style');
  style.textContent='@media print{body.gcPrintCurrent>main.wrap>section.card,body.gcPrintCurrent .parityTools{display:none!important}body.gcPrintCurrent .wrap{max-width:none!important;padding:0!important}body.gcPrintCurrent #out{margin:0!important}body.gcPrintCurrent .paperA4{box-shadow:none!important;border:0!important;margin:0 auto!important;width:210mm!important;min-height:297mm!important}}';
  document.head.appendChild(style);
})();
