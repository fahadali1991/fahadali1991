/* Guided Capture — Output Parity Fix V1
   Makes advanced A4 output and evidence upload available regardless of entry path. */
(function(){
  function inferredDocId(){
    if(!cur)return'';
    if(cur.benchmarkDocId)return cur.benchmarkDocId;
    const st=cur.subtype||'';
    if(cur.type==='برنامج / فعالية')return'program-report';
    if(cur.type==='خطة'&&(st==='خطة علاجية'||cur.mode==='خطة علاجية'||has(cur.n||'','علاجي','علاج')))return'remedial-plan';
    if(cur.type==='تطوير مهني'&&(st==='مجتمع تعلم مهني'||has(cur.n||'','مجتمع تعلم','مجتمع مهني')))return'plc';
    if(cur.type==='تحليل نتائج')return'exam-analysis';
    return'';
  }
  function applyParityIdentity(){
    const id=inferredDocId();
    if(!id||!cur)return'';
    if(!cur.benchmarkDocId)cur.benchmarkDocId=id;
    return id;
  }
  window.gcInferredParityDoc=applyParityIdentity;

  /* Ensure the A4 renderer is reached even from smart/free-text entry. */
  const previousGenerate=window.generate;
  window.generate=function(){
    applyParityIdentity();
    return previousGenerate.apply(this,arguments);
  };

  /* Let users attach evidence before generating the final document. */
  function preEvidenceBox(){
    const id=applyParityIdentity();
    if(!['program-report','exam-analysis','remedial-plan','plc'].includes(id))return'';
    const count=(window._gcEvidence||[]).length;
    return `<div class="preEvidenceCard">
      <div><b>الشواهد والصور</b><small>${count?`تم إرفاق ${count} شاهد/صورة`:'يمكنك الإرفاق الآن أو بعد إنشاء الوثيقة'}</small></div>
      <label class="preEvidenceBtn">＋ إرفاق صور / شواهد<input type="file" accept="image/*" multiple hidden onchange="addEvidenceFiles(this.files);refreshPreEvidenceCount()"></label>
    </div>`;
  }
  window.refreshPreEvidenceCount=function(){
    const box=document.querySelector('.preEvidenceCard');
    if(!box)return;
    const small=box.querySelector('small'),count=(window._gcEvidence||[]).length;
    if(small)small.textContent=count?`تم إرفاق ${count} شاهد/صورة`:'يمكنك الإرفاق الآن أو بعد إنشاء الوثيقة';
  };
  const previousReady=window.renderReady;
  window.renderReady=function(){
    applyParityIdentity();
    previousReady.apply(this,arguments);
    const card=document.querySelector('#out .card');
    if(card&&!card.querySelector('.preEvidenceCard')){
      const html=preEvidenceBox();
      if(html){const row=card.querySelector('.row');if(row)row.insertAdjacentHTML('beforebegin',html);else card.insertAdjacentHTML('beforeend',html)}
    }
  };

  /* Add an explicit output cue after A4 rendering so users know where print lives. */
  const previousParity=window.renderParity;
  if(typeof previousParity==='function'){
    window.renderParity=function(){
      applyParityIdentity();
      const ok=previousParity.apply(this,arguments);
      if(ok){
        const tools=document.querySelector('.parityTools');
        if(tools&&!tools.querySelector('.parityStatus')){
          const s=document.createElement('span');s.className='parityStatus';s.textContent='✓ الوثيقة جاهزة للطباعة وإرفاق الشواهد';tools.appendChild(s);
        }
      }
      return ok;
    };
  }

  const style=document.createElement('style');
  style.textContent=`.preEvidenceCard{margin:14px 0;padding:13px;border:1px dashed #a9ccc1;background:#fbfdfc;border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:12px}.preEvidenceCard b{display:block;color:#173f38}.preEvidenceCard small{display:block;color:#70807a;margin-top:4px}.preEvidenceBtn{background:#eaf5f1;color:#145e52;border-radius:12px;padding:9px 12px;font-weight:900;cursor:pointer;white-space:nowrap}.parityStatus{align-self:center;color:#397a6e;font-size:12px;font-weight:800;margin-inline-start:auto}@media(max-width:620px){.preEvidenceCard{align-items:stretch;flex-direction:column}.preEvidenceBtn{text-align:center}.parityStatus{width:100%;margin:4px 0 0}}`;
  document.head.appendChild(style);
})();
