/* Smart Guided Capture V1 — Narrative document renderer */
(function(){
  function cleanSentence(s){return String(s||'').replace(/\s+/g,' ').trim()}
  function paragraph(text){return `<p class="narrativeP">${esc(cleanSentence(text))}</p>`}
  function compactList(items){
    items=uniq((items||[]).filter(Boolean));
    if(!items.length)return'';
    return `<div class="structuredBlock"><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }
  function narrativeFromSections(secs){
    secs=(secs||[]).filter(x=>x&&x[1]);
    if(!secs.length)return[];
    if(secs.length===1)return[cleanSentence(secs[0][1])];
    if(secs.length===2)return[cleanSentence(secs[0][1]),cleanSentence(secs[1][1])];
    if(secs.length===3)return secs.map(x=>cleanSentence(x[1]));
    return [
      cleanSentence(`${secs[0][1]} ${secs[1][1]}`),
      cleanSentence(secs[2][1]),
      cleanSentence(secs.slice(3).map(x=>x[1]).join(' '))
    ].filter(Boolean);
  }
  function structuredItems(){
    if(!cur)return[];
    if(cur.type==='اجتماع / متابعة إدارية') return vals('product');
    if(cur.type==='خطة') return vals('method');
    if(cur.type==='تحليل نتائج') return vals('action');
    return [];
  }
  function structuredLabel(){
    if(cur.type==='اجتماع / متابعة إدارية')return'القرارات والمخرجات';
    if(cur.type==='خطة')return'الإجراءات الرئيسية';
    if(cur.type==='تحليل نتائج')return'الإجراءات المبنية على التحليل';
    return'';
  }
  function narrativeWordCount(paras){return paras.join(' ').trim().split(/\s+/).filter(Boolean).length}

  generate=function(){
    let secs=paragraphBank(),paras=narrativeFromSections(secs),wc=narrativeWordCount(paras),meta=[];
    if(cur.executorName)meta.push(`المنفذ: ${cur.executorName}`);
    if(cur.count)meta.push(`العدد: ${cur.count}`);
    if(cur.audiences?.length)meta.push(`المستفيدون: ${joinAr(cur.audiences)}`);
    if(hasStudent()&&cur.grades?.length)meta.push(`الصفوف: ${joinAr(cur.grades)}`);
    let items=structuredItems(),label=structuredLabel();
    let structure=(items.length&&label)?`<div class="structuredWrap"><div class="structuredLabel">${esc(label)}</div>${compactList(items)}</div>`:'';
    $('out').innerHTML=`
      <section class="card">
        <div class="muted">العنوان المهني</div>
        <div class="title">${esc(workName())}</div>
        ${meta.length?`<div class="metaSummary">${meta.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}
        <div class="counter">النص المولد: نحو ${wc} كلمة</div>
      </section>
      <section class="card narrativeCard">
        <h2>التقرير المهني</h2>
        <div class="narrativeBody">${paras.map(paragraph).join('')}</div>
        ${structure}
      </section>
      <section class="card">
        <h2>الشاهد الأنسب</h2>
        <div class="evidence"><strong>ابدأ بهذا:</strong> ${esc(evidence())}</div>
        <details><summary>عرض الارتباطات المحتملة</summary><div style="margin-top:10px">${links().map(x=>`<div class="fact" style="margin-bottom:8px">${esc(x)}</div>`).join('')}</div><div class="warn">هذه ارتباطات محتملة للتوثيق، وليست حكمًا بتحقق مؤشر.</div></details>
      </section>
      <div class="toolbar"><button class="btn soft" onclick="guided()">تعديل الإجابات</button><button class="btn" onclick="start()">إعادة الفهم</button></div>`;
  };

  const st=document.createElement('style');
  st.textContent='.narrativeBody{font-size:17px;line-height:2;color:#243934}.narrativeP{margin:0 0 16px;text-align:justify}.narrativeP:last-child{margin-bottom:0}.structuredWrap{margin-top:18px;padding-top:14px;border-top:1px solid #e2ebe8}.structuredLabel{font-weight:900;margin-bottom:8px;color:#173f38}.structuredBlock ul{margin:0;padding-right:22px;line-height:1.9}.structuredBlock li{margin:3px 0}.narrativeCard h2{margin-bottom:14px}@media(max-width:620px){.narrativeBody{font-size:16px;line-height:1.95}.narrativeP{text-align:right}}';
  document.head.appendChild(st);
})();
