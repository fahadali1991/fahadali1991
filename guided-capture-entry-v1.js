/* Smart Guided Capture V1 — Two Entrances, One Engine */
(function(){
  let entryIntent='';
  const ENTRY={
    smart:{label:'صف لي ما حدث',icon:'✨',title:'صف لي ما حدث',help:'اكتب بطريقتك، وسأحدد نوع العمل المناسب ثم أكمل معك.',placeholder:'مثال: اجتمعنا مع المعلمين بسبب تدني النتائج وحددنا إجراءات للمتابعة'},
    report:{label:'تقرير',icon:'📄',title:'ما العمل الذي تريد إعداد تقرير عنه؟',help:'صف العمل باختصار، وسأفهم نوعه وأبني التقرير المناسب.',placeholder:'مثال: نفذنا برنامج تحسين الخط لطلاب أول وثاني متوسط'},
    minutes:{label:'محضر',icon:'📝',title:'صف الاجتماع باختصار',help:'اكتب مع من اجتمعت ولماذا، وسأكمل معك عناصر المحضر.',placeholder:'مثال: اجتمعنا مع معلمي اللغة العربية لمراجعة نتائج الفترة وتوزيع المهام'},
    analysis:{label:'تحليل نتائج',icon:'📊',title:'ما الذي تريد تحليله؟',help:'اذكر النتائج أو البيانات والفئة المستهدفة، وسأبني معك التحليل.',placeholder:'مثال: نتائج اختبار الفترة لطلاب الأول المتوسط وظهر انخفاض في القراءة'},
    plan:{label:'خطة',icon:'🗂️',title:'ما الخطة التي تريد إعدادها؟',help:'صف الاحتياج أو المشكلة والهدف، وسأحدد نوع الخطة وأكملها معك.',placeholder:'مثال: نحتاج خطة لرفع مستوى القراءة عند الطلاب الضعاف'},
    program:{label:'برنامج / فعالية',icon:'🎯',title:'صف البرنامج أو الفعالية',help:'اذكر الفكرة والفئة المستهدفة، وسأحدد النوع والاسم المقترح.',placeholder:'مثال: نشاط لتحسين الخط لطلاب أول وثاني متوسط'},
    pd:{label:'تطوير مهني',icon:'👥',title:'صف النشاط المهني',help:'اذكر الاحتياج أو الموضوع والفئة، وسأحدد نوع النشاط المهني.',placeholder:'مثال: تدريب للمعلمين على استخدام الذكاء الاصطناعي في إعداد الدروس'},
    follow:{label:'متابعة',icon:'✓',title:'ما الذي تريد متابعته؟',help:'صف الحالة أو الإجراء الذي تتابعه، وسأحدد نوع المتابعة.',placeholder:'مثال: متابعة تأخر الطلاب عن الطابور وتسجيل الحالات المتكررة'}
  };

  function homeCard(){return document.querySelector('main.wrap > section.card')}
  function renderLanding(){
    entryIntent='';
    const card=homeCard(); if(!card)return;
    card.id='entryHome';
    card.innerHTML=`
      <div class="entryKicker">Smart Guided Capture V1 · مختبر تطوير</div>
      <h1 class="entryTitle">ماذا تريد أن تنجز؟</h1>
      <p class="entryLead">يمكنك وصف ما حدث بطريقتك، أو البدء مباشرة من نوع العمل الذي تعرف أنك تحتاجه.</p>
      <button type="button" class="smartEntry" onclick="openEntry('smart')">
        <span class="smartIcon">✨</span>
        <span><b>صف لي ما حدث</b><small>لا تحتاج معرفة التصنيف؛ المحرك يتولى الباقي</small></span>
        <span class="entryArrow">←</span>
      </button>
      <div class="entryDivider"><span>أو ابدأ مباشرة</span></div>
      <div class="entryGrid">
        ${['report','minutes','analysis','plan','program','pd'].map(k=>entryButton(k)).join('')}
      </div>
      <button type="button" class="moreEntry" onclick="toggleMoreEntries()">المزيد <span id="moreChevron">⌄</span></button>
      <div id="moreEntries" class="entryGrid entryMore hidden">${entryButton('follow')}</div>`;
    document.getElementById('out').innerHTML='';
  }
  function entryButton(k){let e=ENTRY[k];return`<button type="button" class="entryTile" onclick="openEntry('${k}')"><span>${e.icon}</span><b>${e.label}</b></button>`}
  window.toggleMoreEntries=function(){let b=document.getElementById('moreEntries'),c=document.getElementById('moreChevron');if(!b)return;b.classList.toggle('hidden');if(c)c.textContent=b.classList.contains('hidden')?'⌄':'⌃'};
  window.openEntry=function(intent){
    entryIntent=intent;
    const e=ENTRY[intent]||ENTRY.smart,card=homeCard();if(!card)return;
    card.innerHTML=`
      <button type="button" class="backEntry" onclick="returnToEntryHome()">→ رجوع</button>
      <div class="entryChosen">${e.icon} ${e.label}</div>
      <h1 class="entryFormTitle">${e.title}</h1>
      <p class="entryLead">${e.help}</p>
      <textarea id="raw" lang="ar" spellcheck="true" autocapitalize="sentences" placeholder="${e.placeholder}"></textarea>
      <div class="row entryActions">
        <button class="btn primary" type="button" onclick="start()">افهم وأكمل</button>
        <button class="btn soft" type="button" onclick="reviewSpelling()">مراجعة إملائية</button>
      </div>
      <div id="spellReview"></div>`;
    if(typeof enhanceSpellInputs==='function')enhanceSpellInputs(card);
    document.getElementById('raw')?.focus();
  };
  window.returnToEntryHome=function(){renderLanding()};

  function forceIntent(f,intent){
    f.entryIntent=intent;
    if(intent==='report'||intent==='smart')return f;
    const map={minutes:'اجتماع / متابعة إدارية',analysis:'تحليل نتائج',plan:'خطة',program:'برنامج / فعالية',pd:'تطوير مهني',follow:'إجراء متابعة'};
    let wanted=map[intent]; if(!wanted)return f;
    f.type=wanted;
    f.answers={};
    f.subtype='';
    if(wanted==='برنامج / فعالية'&&!f.mode)f.mode='برنامج';
    if(typeof inferSubtype==='function')f.subtype=inferSubtype(f);
    if(wanted==='برنامج / فعالية'&&f.subtype)f.mode=f.subtype;
    if(wanted==='خطة'&&f.subtype)f.mode=f.subtype;
    if(typeof proposeTitles==='function'){
      try{let arr=proposeTitles(f);if(arr&&arr.length&&!f.workTitle)f.workTitle=arr[0]}catch(e){}
    }
    return f;
  }

  const previousStart=window.start;
  window.start=function(){
    let el=document.getElementById('raw'),raw=el?.value.trim();
    if(!raw)return alert('اكتب وصفًا مختصرًا أولًا');
    if(!entryIntent||entryIntent==='smart'||entryIntent==='report'){
      if(typeof previousStart==='function'){
        previousStart();
        if(typeof cur!=='undefined'&&cur)cur.entryIntent=entryIntent||'smart';
        return;
      }
    }
    cur=forceIntent(infer(raw),entryIntent);
    renderUnderstanding();
    const out=document.getElementById('out');if(out)out.scrollIntoView({behavior:'smooth',block:'start'});
  };

  const css=document.createElement('style');
  css.textContent=`
    .entryKicker{color:#72807b;font-size:13px;font-weight:800}.entryTitle{margin:8px 0 6px}.entryLead{color:#687570;line-height:1.75;margin:0 0 16px}.smartEntry{width:100%;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;text-align:right;border:1px solid #badbd1;background:linear-gradient(135deg,#eef8f5,#f9fcfb);border-radius:18px;padding:16px;color:#123f38;box-shadow:0 5px 18px rgba(20,94,82,.06)}.smartEntry b{display:block;font-size:18px}.smartEntry small{display:block;margin-top:4px;color:#63716d;font-weight:600}.smartIcon{font-size:25px}.entryArrow{font-size:22px;color:#397a6e}.entryDivider{display:flex;align-items:center;gap:10px;color:#8a9591;font-size:12px;font-weight:800;margin:18px 0 12px}.entryDivider:before,.entryDivider:after{content:'';height:1px;background:#e2e9e6;flex:1}.entryGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.entryTile{min-height:86px;border:1px solid #dce7e3;background:#fff;border-radius:15px;padding:11px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:#233a35}.entryTile span{font-size:24px}.entryTile b{font-size:14px}.entryTile:active,.smartEntry:active{transform:scale(.985)}.moreEntry{display:block;margin:12px auto 0;border:0;background:transparent;color:#397a6e;font-weight:800;padding:7px 14px}.entryMore{margin-top:5px}.backEntry{border:0;background:transparent;color:#397a6e;font-weight:800;padding:4px 0 10px}.entryChosen{display:inline-flex;background:#eaf5f1;color:#145e52;border-radius:999px;padding:6px 11px;font-size:13px;font-weight:800}.entryFormTitle{margin:10px 0 6px}.entryActions{margin-top:12px}.hidden{display:none!important}
    @media(max-width:620px){.entryGrid{grid-template-columns:repeat(2,1fr)}.entryTile{min-height:80px}.smartEntry{padding:14px}}
  `;
  document.head.appendChild(css);
  renderLanding();
})();
