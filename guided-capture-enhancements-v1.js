/* Smart Guided Capture enhancements: Arabic spelling review + inferred/editable work type/subtype UI */
const SPELL_MAP={
'الظلاب':'الطلاب','الطللب':'الطلاب','الطلابب':'الطلاب','الطالباتت':'الطالبات','المعلمينن':'المعلمين','المعلماتت':'المعلمات',
'اولياء':'أولياء','الاولياء':'الأولياء','الامور':'الأمور','الاداريين':'الإداريين','الاداريون':'الإداريون',
'الغيابب':'الغياب','الحظور':'الحضور','الحضورر':'الحضور','التاخير':'التأخير','التاخر':'التأخر','المتاخرين':'المتأخرين','الانظباط':'الانضباط','المواظبه':'المواظبة',
'النتايج':'النتائج','النتائجج':'النتائج','الدرجاتت':'الدرجات','الاختبارر':'الاختبار','التحليلل':'التحليل','المتعثرينن':'المتعثرين','علاجيه':'علاجية','اثرائيه':'إثرائية',
'التطويرر':'التطوير','المهنيي':'المهني','ورشه':'ورشة','مجتمعع':'مجتمع','المهنيه':'المهنية','التدريسس':'التدريس',
'برنامجج':'برنامج','فعاليه':'فعالية','مبادره':'مبادرة','مسابقه':'مسابقة','حمله':'حملة','قراءه':'قراءة','املاء':'إملاء','مهاره':'مهارة','مهاراتت':'مهارات',
'اجتماعع':'اجتماع','متابعه':'متابعة','خطه':'خطة','التخطيطط':'التخطيط','مسئوليات':'مسؤوليات','مسؤولياتت':'مسؤوليات','التوصياتت':'التوصيات',
'تنفيذذ':'تنفيذ','المنفذذ':'المنفذ','المستفيدينن':'المستفيدين','الصفوفف':'الصفوف','المرحله':'المرحلة','متوسطط':'متوسط','ابتدائيي':'ابتدائي','ثانويي':'ثانوي'
};
let _spellSuggestion='';
function correctToken(token){let m=token.match(/^([^\u0600-\u06FF]*)([\u0600-\u06FF]+)([^\u0600-\u06FF]*)$/);if(!m)return token;let w=m[2],key=w.replace(/[ًٌٍَُِّْـ]/g,'');return m[1]+(SPELL_MAP[key]||w)+m[3]}
function localSpellReview(text){return String(text||'').split(/(\s+)/).map(x=>/^\s+$/.test(x)?x:correctToken(x)).join('').replace(/\s+([،؛؟.!])/g,'$1').replace(/([،؛؟.!])([^\s\n])/g,'$1 $2')}
function reviewSpelling(){let el=document.getElementById('raw'),box=document.getElementById('spellReview');if(!el||!box)return;let src=el.value.trim();if(!src){box.innerHTML='<div class="warn">اكتب وصف العمل أولًا.</div>';return}let fixed=localSpellReview(src);_spellSuggestion=fixed;if(fixed===src){box.innerHTML='<div class="spellOk">لم أجد أخطاء شائعة في المراجعة المحلية. وسيظل تدقيق المتصفح الإملائي فعالًا أثناء الكتابة.</div>';return}box.innerHTML=`<div class="spellCard"><small>التصحيح المقترح</small><div class="spellBefore">${esc(src)}</div><div class="spellArrow">↓</div><div class="spellAfter">${esc(fixed)}</div><div class="row" style="margin-top:10px"><button class="btn primary" type="button" onclick="acceptSpelling()">اعتماد التصحيح</button><button class="btn" type="button" onclick="dismissSpelling()">إبقاء النص كما هو</button></div></div>`}
function acceptSpelling(){let el=document.getElementById('raw');if(el&&_spellSuggestion)el.value=_spellSuggestion;dismissSpelling()}
function dismissSpelling(){let box=document.getElementById('spellReview');if(box)box.innerHTML=''}
function enhanceSpellInputs(root=document){root.querySelectorAll('textarea,input[type="text"],input:not([type])').forEach(el=>{el.setAttribute('spellcheck','true');el.setAttribute('lang','ar');el.setAttribute('autocapitalize','sentences')})}

const WORK_TYPES=['إجراء متابعة','تحليل نتائج','تطوير مهني','برنامج / فعالية','اجتماع / متابعة إدارية'];
const SUBTYPES={
'برنامج / فعالية':['برنامج','مبادرة','مسابقة','حملة','فعالية','نشاط'],
'تطوير مهني':['ورشة','مجتمع تعلم مهني','تدريب','لقاء تبادل خبرات'],
'إجراء متابعة':['متابعة حضور','متابعة غياب','متابعة تأخر','متابعة انضباط'],
'تحليل نتائج':['تحليل نتائج','خطة علاجية','خطة إثرائية','متابعة تقدم'],
'اجتماع / متابعة إدارية':['اجتماع متابعة','اجتماع تخطيط','اجتماع مراجعة نتائج','اجتماع حل مشكلة']
};
function inferSubtype(f){if(!f)return'';let n=f.n||'';if(f.type==='برنامج / فعالية'){if(has(n,'مسابقه'))return'مسابقة';if(has(n,'مبادره'))return'مبادرة';if(has(n,'حمله'))return'حملة';if(has(n,'فعاليه'))return'فعالية';if(has(n,'نشاط'))return'نشاط';return'برنامج'}if(f.type==='تطوير مهني'){if(has(n,'مجتمع مهني','مجتمع تعلم'))return'مجتمع تعلم مهني';if(has(n,'ورشه'))return'ورشة';if(has(n,'تدريب'))return'تدريب';return'لقاء تبادل خبرات'}if(f.type==='إجراء متابعة'){if(has(n,'غياب'))return'متابعة غياب';if(has(n,'تاخير','متاخر'))return'متابعة تأخر';if(has(n,'انضباط','مواظبه'))return'متابعة انضباط';return'متابعة حضور'}if(f.type==='تحليل نتائج'){if(f.mode==='علاجي'||has(n,'علاج','علاجي'))return'خطة علاجية';if(f.mode==='إثرائي'||has(n,'اثراء','اثرائي'))return'خطة إثرائية';if(has(n,'متابعه','تقدم'))return'متابعة تقدم';return'تحليل نتائج'}if(f.type==='اجتماع / متابعة إدارية'){if(f.mode==='تخطيط')return'اجتماع تخطيط';if(f.mode==='مراجعة نتائج')return'اجتماع مراجعة نتائج';if(f.mode==='حل مشكلة')return'اجتماع حل مشكلة';return'اجتماع متابعة'}return''}
function syncSubtype(){if(cur&&!cur.subtype)cur.subtype=inferSubtype(cur)}
function subtypeButtons(){syncSubtype();let opts=SUBTYPES[cur.type]||[];if(!opts.length)return'';return`<div class="subtypeBox"><small>النوع الفرعي · اقتراح النظام ويمكن تعديله</small><div class="chiprow">${opts.map(v=>`<button type="button" class="chip ${cur.subtype===v?'on':''}" onclick="setSubtype('${v}')">${v}</button>`).join('')}</div></div>`}
function setSubtype(v){if(!cur)return;let old=cur.subtype||'';cur.subtype=v;if(cur.type==='برنامج / فعالية'){cur.mode=v;let t=(cur.workTitle||'').trim();if(t){let re=/^(برنامج|مبادرة|مسابقة|حملة|فعالية|نشاط)\s+/;cur.workTitle=re.test(t)?t.replace(re,v+' '):`${v} ${t}`}}renderUnderstanding();let note=document.getElementById('subtypeNotice');if(note)note.innerHTML=`تم تعديل النوع الفرعي من <b>${esc(old||'غير محدد')}</b> إلى <b>${esc(v)}</b>.`}
function typeButtons(){return`<div class="chiprow">${WORK_TYPES.map(v=>`<button type="button" class="chip ${cur.type===v?'on':''}" onclick="setTypeEnhanced('${v}')">${v}</button>`).join('')}</div>`}
function setTypeEnhanced(v){if(!cur)return;cur.type=v;cur.answers={};cur.subtype='';cur.mode=(v==='برنامج / فعالية')?'برنامج':cur.mode;cur.subtype=inferSubtype(cur);renderUnderstanding();let e=document.getElementById('typeEditor');if(e)e.classList.remove('hidden')}
function toggleTypeEditor(){document.getElementById('typeEditor')?.classList.toggle('hidden')}

const _baseUnderstandingView=typeof understandingView==='function'?understandingView:null;
if(_baseUnderstandingView){understandingView=function(){syncSubtype();let h=_baseUnderstandingView();h=h.replace('<small>نوع العمل</small><b>','<small>عائلة العمل · اقتراح النظام</small><b>');h=h.replace('تصحيح نوع العمل','تعديل عائلة العمل');let anchor='</div><div class="metaGrid">';let insert=`<div class="typeRefine"><div class="fact"><small>عائلة العمل</small><div class="typeLine"><b>${esc(cur.type)}</b><button class="miniEdit" type="button" onclick="toggleTypeEditor()">تعديل</button></div><div id="typeEditor" class="hidden typeEditor">${typeButtons()}</div></div><div class="fact">${subtypeButtons()}<div id="subtypeNotice" class="tiny" style="margin-top:6px"></div></div></div>`;if(h.includes(anchor))h=h.replace(anchor,`</div>${insert}<div class="metaGrid">`);return h}}

const _baseRenderUnderstanding=typeof renderUnderstanding==='function'?renderUnderstanding:null;
if(_baseRenderUnderstanding){renderUnderstanding=function(){syncSubtype();_baseRenderUnderstanding();enhanceSpellInputs(document)}}
const _baseRenderQ=typeof renderQ==='function'?renderQ:null;
if(_baseRenderQ){renderQ=function(){_baseRenderQ();enhanceSpellInputs(document)}}
const _baseRenderReady=typeof renderReady==='function'?renderReady:null;
if(_baseRenderReady){renderReady=function(){_baseRenderReady();enhanceSpellInputs(document)}}

const _baseWorkName=typeof workName==='function'?workName:null;
if(_baseWorkName){workName=function(){syncSubtype();let name=_baseWorkName();if(cur?.type==='برنامج / فعالية'&&cur.subtype&&name){let re=/^(برنامج|مبادرة|مسابقة|حملة|فعالية|نشاط)\s+/;if(re.test(name))name=name.replace(re,cur.subtype+' ')}return name}}
const _baseMakeTitle=typeof makeTitle==='function'?makeTitle:null;
if(_baseMakeTitle){makeTitle=function(){syncSubtype();let t=_baseMakeTitle();if(cur?.type==='برنامج / فعالية'&&cur.subtype){let re=/^(برنامج|مبادرة|مسابقة|حملة|فعالية|نشاط)\s+/;t=re.test(t)?t.replace(re,cur.subtype+' '):`${cur.subtype} ${t}`}return t}}

const style=document.createElement('style');style.textContent='.spellCard{margin-top:10px;padding:12px;border:1px solid #cfe4dd;background:#f8fcfa;border-radius:14px}.spellCard small{display:block;color:#687570;font-weight:700;margin-bottom:6px}.spellBefore{padding:9px 10px;border-radius:10px;background:#fff8e7;line-height:1.7}.spellAfter{padding:9px 10px;border-radius:10px;background:#eaf5f1;line-height:1.7;font-weight:700}.spellArrow{text-align:center;color:#687570;padding:4px}.spellOk{margin-top:10px;padding:10px 12px;border-radius:12px;background:#eaf5f1;color:#145e52;font-weight:700}.typeRefine{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:9px}.typeLine{display:flex;align-items:center;justify-content:space-between;gap:8px}.miniEdit{border:0;background:#eaf5f1;color:#145e52;border-radius:999px;padding:6px 10px;font-weight:800}.typeEditor{margin-top:9px}.subtypeBox small{display:block;color:#687570;font-weight:700;margin-bottom:6px}@media(max-width:620px){.typeRefine{grid-template-columns:1fr}}';document.head.appendChild(style);
const obs=new MutationObserver(()=>enhanceSpellInputs(document));obs.observe(document.body,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>enhanceSpellInputs(document));
