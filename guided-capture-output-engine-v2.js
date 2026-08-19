/* School Documentation Engine — Output Engine V2
   Shared identity, family-specific document bodies. */
(function(){
  function id(){return window.gcInferredParityDoc?.()||window.cur?.benchmarkDocId||''}
  function family(){return window.GC_V2?.family(id())||'generic'}
  function esc2(v){return typeof esc==='function'?esc(v):String(v||'')}
  function val(k,f=''){try{return valText(k,f)}catch(e){return f}}
  function meta(){return cur?.docMeta||{}}
  function bullets(items){return `<ul class="v2Bullets">${items.filter(Boolean).map(x=>`<li>${esc2(x)}</li>`).join('')}</ul>`}
  function eventBody(){
    const topic=workName(),goal=val('goal','تحقيق هدف تربوي مرتبط بموضوع العمل'),method=val('method','تنفيذ أنشطة مناسبة'),product=val('product','مخرجات مرتبطة بالتنفيذ');
    const intro=`نُفذ ${topic} لصالح ${audienceText()} في إطار عمل تربوي منظم، مع توجيه التنفيذ نحو موضوع البرنامج والفئة المستفيدة دون افتراض نتائج لم يتم قياسها.`;
    const goals=[goal,`تعزيز مشاركة المستفيدين في أنشطة مرتبطة بـ${topic}.`,`دعم الاستفادة العملية من محتوى البرنامج بما يتناسب مع الفئة المستهدفة.`];
    const steps=[method,`تنفيذ أنشطة ومشاركات مرتبطة مباشرة بموضوع ${topic}.`,`توثيق المشاركة والمخرجات الفعلية أثناء التنفيذ.`];
    return `<section class="paperSection"><h3>وصف التنفيذ</h3><p class="v2Intro">${esc2(intro)}</p></section><div class="v2TwoCols"><section class="paperSection"><h3>الأهداف</h3>${bullets(goals)}</section><section class="paperSection"><h3>خطوات التنفيذ</h3>${bullets(steps)}</section></div><section class="paperSection"><h3>المخرجات</h3><p class="v2Intro">${esc2(product)}.</p></section>`;
  }
  function analysisBody(){
    const m=meta();
    return `<section class="paperSection"><h3>بيانات التحليل</h3><div class="v2AnalysisGrid"><div><span>المادة</span><b>${esc2(m.subject||'—')}</b></div><div><span>الدرجة الكلية</span><b>${esc2(m.maxScore||'—')}</b></div><div><span>الفترة/الفصل</span><b>${esc2(m.period||'—')}</b></div></div></section><section class="paperSection"><h3>القراءة المهنية للنتائج</h3><p class="v2Intro">يعتمد هذا التحليل على البيانات الفعلية للدرجات. لا تُولد نسب أو متوسطات أو أحكام رقمية ما لم تتوفر البيانات اللازمة للحساب.</p></section><section class="paperSection"><h3>الإجراء المبني على النتائج</h3><p class="v2Intro">${esc2(val('action','يتم تحديد الإجراء بعد قراءة النتائج الفعلية وتحديد الفئات أو المهارات التي تحتاج إلى دعم.'))}</p></section><section class="paperSection v2DataPlaceholder"><h3>الرسوم والمؤشرات</h3><div>سيخصص هذا الجزء في V2 للمؤشرات الإحصائية والرسوم الناتجة عن الدرجات، وليس لصور النشاط.</div></section>`;
  }
  function planBody(){
    return `<section class="paperSection"><h3>هدف الخطة</h3><p class="v2Intro">${esc2(val('goal','هدف علاجي محدد'))}</p></section><section class="paperSection"><h3>مصفوفة التنفيذ</h3><div class="v2PlanTable"><div><span>مصدر التشخيص</span><b>${esc2(val('basis','—'))}</b></div><div><span>الإجراءات العلاجية</span><b>${esc2(val('method','—'))}</b></div><div><span>المتابعة وإعادة القياس</span><b>${esc2(val('follow','—'))}</b></div><div><span>المدة</span><b>${esc2(meta().duration||'—')}</b></div></div></section>`;
  }
  function professionalBody(){
    return `<section class="paperSection"><h3>السياق المهني</h3><p class="v2Intro">عُقد ${esc2(workName())} استجابةً إلى ${esc2(val('reason','احتياج مهني'))}، وركز على تبادل الخبرة وبناء ممارسة قابلة للتطبيق.</p></section><div class="v2TwoCols"><section class="paperSection"><h3>أسلوب العمل</h3><p class="v2Intro">${esc2(val('method','مناقشة وتبادل خبرات'))}</p></section><section class="paperSection"><h3>المخرج المهني</h3><p class="v2Intro">${esc2(val('product','مخرج مهني قابل للتطبيق'))}</p></section></div><section class="paperSection"><h3>المتابعة</h3><p class="v2Intro">${esc2(val('follow','تطبيق أو جلسة متابعة'))}</p></section>`;
  }
  function body(){const f=family();if(f==='event')return eventBody();if(f==='analysis')return analysisBody();if(f==='plan')return planBody();if(f==='professional')return professionalBody();return''}
  function enhance(){
    const paper=document.getElementById('printDocument');if(!paper)return;
    const target=paper.querySelector('.paperSection');if(!target||paper.querySelector('.v2FamilyBody'))return;
    const html=body();if(!html)return;
    const wrap=document.createElement('div');wrap.className='v2FamilyBody';wrap.innerHTML=html;
    target.replaceWith(wrap);
    paper.dataset.outputFamily=family();
  }
  const obs=new MutationObserver(()=>enhance());obs.observe(document.documentElement,{childList:true,subtree:true});
  enhance();
  const s=document.createElement('style');s.textContent=`.v2Intro{font-size:13px;line-height:1.9;text-align:justify;margin:0}.v2TwoCols{display:grid;grid-template-columns:1fr 1fr;gap:12px}.v2Bullets{margin:0;padding-right:18px;font-size:12.5px;line-height:1.8}.v2AnalysisGrid,.v2PlanTable{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #dde7e3;border-radius:9px;overflow:hidden}.v2AnalysisGrid>div,.v2PlanTable>div{padding:8px;border-left:1px solid #e5ece9;border-bottom:1px solid #e5ece9}.v2AnalysisGrid span,.v2PlanTable span{display:block;font-size:10px;color:#76857f;font-weight:800;margin-bottom:4px}.v2AnalysisGrid b,.v2PlanTable b{font-size:12px}.v2DataPlaceholder{border:1px dashed #b7cbc4;border-radius:9px;padding:10px;color:#6e7e79;background:#fbfdfc}.v2DataPlaceholder div{font-size:12px;line-height:1.7}@media(max-width:700px){.v2TwoCols,.v2AnalysisGrid,.v2PlanTable{grid-template-columns:1fr}}@media print{.v2Intro{font-size:11px!important;line-height:1.55!important}.v2Bullets{font-size:10.5px!important;line-height:1.55!important}.v2TwoCols{gap:7px!important}.v2AnalysisGrid>div,.v2PlanTable>div{padding:5px!important}.v2DataPlaceholder{padding:6px!important}}`;
  document.head.appendChild(s);
})();