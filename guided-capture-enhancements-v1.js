/* Smart Guided Capture enhancements: Arabic spelling review + inferred work type UI */
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
const _baseUnderstandingView=typeof understandingView==='function'?understandingView:null;
if(_baseUnderstandingView){understandingView=function(){let h=_baseUnderstandingView();h=h.replace('<small>نوع العمل</small><b>','<small>نوع العمل · اقتراح النظام</small><b>');h=h.replace('تصحيح نوع العمل','تعديل نوع العمل');return h}}
const _baseRenderUnderstanding=typeof renderUnderstanding==='function'?renderUnderstanding:null;
if(_baseRenderUnderstanding){renderUnderstanding=function(){_baseRenderUnderstanding();enhanceSpellInputs(document)}}
const _baseRenderQ=typeof renderQ==='function'?renderQ:null;
if(_baseRenderQ){renderQ=function(){_baseRenderQ();enhanceSpellInputs(document)}}
const _baseRenderReady=typeof renderReady==='function'?renderReady:null;
if(_baseRenderReady){renderReady=function(){_baseRenderReady();enhanceSpellInputs(document)}}
const style=document.createElement('style');style.textContent='.spellCard{margin-top:10px;padding:12px;border:1px solid #cfe4dd;background:#f8fcfa;border-radius:14px}.spellCard small{display:block;color:#687570;font-weight:700;margin-bottom:6px}.spellBefore{padding:9px 10px;border-radius:10px;background:#fff8e7;line-height:1.7}.spellAfter{padding:9px 10px;border-radius:10px;background:#eaf5f1;line-height:1.7;font-weight:700}.spellArrow{text-align:center;color:#687570;padding:4px}.spellOk{margin-top:10px;padding:10px 12px;border-radius:12px;background:#eaf5f1;color:#145e52;font-weight:700}';document.head.appendChild(style);
const obs=new MutationObserver(()=>enhanceSpellInputs(document));obs.observe(document.body,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>enhanceSpellInputs(document));
