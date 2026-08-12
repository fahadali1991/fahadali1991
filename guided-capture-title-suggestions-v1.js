/* Smart title suggestion layer for Guided Capture V1 */
function titleSubjectFromRaw(raw){
  let s=String(raw||'').trim();
  let m=s.match(/(?:برنامج|مبادرة|مسابقة|حملة|فعالية|نشاط|ورشة|تدريب|خطة)\s+([^،.\n]{2,55})/i);
  if(m){
    let x=m[1].replace(/(?:لطلاب|للطالب|للمعلمين|للمعلم|لأولياء|لأولياء الأمور|عشان|بهدف|عن|من أجل)\s.*$/i,'').trim();
    if(x.length>2)return x;
  }
  if(has(norm(s),'خط'))return'تحسين الخط';
  if(has(norm(s),'قراءه','قرائي','فهم قرائي'))return'تنمية مهارات القراءة والفهم القرائي';
  if(has(norm(s),'غياب'))return'متابعة الغياب';
  if(has(norm(s),'تاخير','متاخر'))return'متابعة التأخر';
  if(has(norm(s),'نتائج','درجات','اختبار'))return'تحسين نتائج الطلاب';
  if(has(norm(s),'ذكاء اصطناعي'))return'توظيف الذكاء الاصطناعي في التعليم';
  if(has(norm(s),'امن','سلامه','اخلاء'))return'تعزيز الأمن والسلامة';
  if(has(norm(s),'نظافه'))return'تعزيز النظافة والمسؤولية';
  return cur?.topic||'';
}
function buildTitleSuggestions(f){
  if(!f)return[];
  let subject=titleSubjectFromRaw(f.raw),st=f.subtype||inferSubtype?.(f)||'',a=[];
  let existing=(f.workTitle||'').trim();
  if(existing)a.push(existing);
  if(f.type==='برنامج / فعالية'){
    let k=st||'برنامج';
    if(subject){a.push(`${k} ${subject}`);a.push(`${k} لتنمية ${subject.replace(/^تحسين\s+/,'مهارات ')}`)}
    else a.push(`${k} تربوي`);
  }else if(f.type==='تطوير مهني'){
    if(subject){a.push(`${st||'نشاط تطوير مهني'} حول ${subject}`);a.push(`تطوير الممارسات المهنية في ${subject}`)}
    else a.push(`${st||'نشاط'} للتطوير المهني`);
  }else if(f.type==='إجراء متابعة'){
    if(has(f.n,'غياب'))a.push('متابعة الغياب والانضباط المدرسي');
    if(has(f.n,'تاخير','متاخر'))a.push('متابعة حالات التأخر والانضباط المدرسي');
    a.push('تعزيز متابعة الحضور والانضباط المدرسي');
  }else if(f.type==='تحليل نتائج'){
    if(has(f.n,'علاج','علاجي','متعثر'))a.push('تحليل نتائج الطلاب وتحديد التدخلات العلاجية');
    a.push('تحليل نتائج التقويم وتحديد أولويات التحسين');
    a.push('تحليل الأداء التحصيلي وبناء إجراءات التحسين');
  }else if(f.type==='اجتماع / متابعة إدارية'){
    if(has(f.n,'نتائج','درجات'))a.push('اجتماع مراجعة نتائج الطلاب وتحديد إجراءات التحسين');
    if(has(f.n,'غياب','تاخير'))a.push('اجتماع متابعة الانضباط ومعالجة حالات الغياب والتأخر');
    a.push(`اجتماع ${f.mode||'متابعة إدارية'}`);
  }else if(f.type==='خطة'){
    let p=st||'خطة تنفيذية';
    if(subject)a.push(`${p} لـ${subject}`);
    if(has(f.n,'قراءه','قرائي'))a.push(`${p} لتحسين مهارات القراءة`);
    if(has(f.n,'نتائج','درجات','اختبار'))a.push(`${p} لتحسين نتائج الطلاب`);
    if(has(f.n,'تطوير مهني','معلمين'))a.push(`${p} للتطوير المهني`);
    a.push(p);
  }
  return uniq(a.map(x=>x.replace(/\s+/g,' ').trim()).filter(x=>x.length>2)).slice(0,3);
}
function ensureTitleSuggestions(){
  if(!cur)return;
  let list=buildTitleSuggestions(cur);
  cur._titleSuggestions=list;
  if(!Number.isInteger(cur._titleIndex))cur._titleIndex=0;
  if(!cur.workTitle&&list.length)cur.workTitle=list[0];
  if(cur.workTitle&&list.length&&!list.includes(cur.workTitle))cur._titleSuggestions=uniq([cur.workTitle,...list]).slice(0,3);
  if(cur._titleIndex>=cur._titleSuggestions.length)cur._titleIndex=0;
  if(cur._titleSuggestions.length)cur.workTitle=cur._titleSuggestions[cur._titleIndex];
}
function currentSuggestedTitle(){ensureTitleSuggestions();return cur?._titleSuggestions?.[cur._titleIndex||0]||cur?.workTitle||''}
function moveTitleSuggestion(step){
  if(!cur)return;
  ensureTitleSuggestions();
  let list=cur._titleSuggestions||[];
  if(list.length<2)return;
  cur._titleIndex=((cur._titleIndex||0)+step+list.length)%list.length;
  cur.workTitle=list[cur._titleIndex];
  renderUnderstanding();
}
function toggleTitleEdit(){document.getElementById('titleEditBox')?.classList.toggle('hidden')}
function titleSuggestionBox(){
  ensureTitleSuggestions();
  let list=cur?._titleSuggestions||[],idx=cur?._titleIndex||0,t=currentSuggestedTitle()||'لم يتضح عنوان مناسب بعد';
  let count=list.length?`${idx+1} من ${list.length}`:'';
  let disabled=list.length<2?' disabled aria-disabled="true"':'';
  return `<div class="titleSuggest"><small>اسم العمل المقترح</small><div class="titleCarousel"><button type="button" class="titleArrow" onclick="moveTitleSuggestion(-1)" aria-label="العنوان السابق"${disabled}>‹</button><div class="titleCenter"><div class="suggestedTitle">${esc(t)}</div>${count?`<div class="titleCount">${count}</div>`:''}</div><button type="button" class="titleArrow" onclick="moveTitleSuggestion(1)" aria-label="العنوان التالي"${disabled}>›</button></div><button type="button" class="titleEditBtn" onclick="toggleTitleEdit()">✎ تعديل الاسم</button><div id="titleEditBox" class="hidden titleEditBox"><input type="text" lang="ar" spellcheck="true" value="${esc(cur.workTitle||t)}" oninput="setMeta('workTitle',this.value)" placeholder="اكتب اسم العمل"></div></div>`;
}
const _titleBaseUnderstanding=typeof understandingView==='function'?understandingView:null;
if(_titleBaseUnderstanding){
  understandingView=function(){
    ensureTitleSuggestions();
    let h=_titleBaseUnderstanding();
    let re=/<label><span>اسم\/عنوان العمل<\/span><input[^>]*><\/label>/;
    if(re.test(h))h=h.replace(re,titleSuggestionBox());
    return h;
  }
}
const _titleBaseSetSubtype=typeof setSubtype==='function'?setSubtype:null;
if(_titleBaseSetSubtype){setSubtype=function(v){_titleBaseSetSubtype(v);if(cur){cur._titleIndex=0;cur._titleSuggestions=[];ensureTitleSuggestions();renderUnderstanding()}}}
const _titleBaseSetTypeEnhanced=typeof setTypeEnhanced==='function'?setTypeEnhanced:null;
if(_titleBaseSetTypeEnhanced){setTypeEnhanced=function(v){_titleBaseSetTypeEnhanced(v);if(cur){cur._titleIndex=0;cur._titleSuggestions=[];ensureTitleSuggestions();renderUnderstanding()}}}
const titleStyle=document.createElement('style');
titleStyle.textContent='.titleSuggest{padding:14px;border:1px solid #d9e7e2;border-radius:16px;background:#fbfdfc}.titleSuggest small{display:block;color:#687570;font-weight:800;margin-bottom:8px}.titleCarousel{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;gap:8px}.titleArrow{width:44px;height:44px;border:1px solid #d6e5df;background:#fff;border-radius:50%;font-size:30px;line-height:1;color:#145e52;font-weight:500;display:flex;align-items:center;justify-content:center}.titleArrow:disabled{opacity:.28}.titleCenter{text-align:center;min-width:0}.suggestedTitle{font-size:18px;font-weight:900;line-height:1.55;color:#173f38}.titleCount{font-size:12px;color:#7b8a85;margin-top:3px}.titleEditBtn{display:block;margin:10px auto 0;border:0;background:transparent;color:#326c62;font-weight:800;padding:7px 10px}.titleEditBox{margin-top:9px}.titleEditBox input{width:100%}@media(max-width:620px){.titleCarousel{grid-template-columns:40px 1fr 40px}.titleArrow{width:40px;height:40px}}';
document.head.appendChild(titleStyle);
