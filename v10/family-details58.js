import {esc} from './engine.js';
import {FAMILIES} from './family-registry.js';
import {inferFamilyDetails} from './family-suggest58.js';
const parse=v=>Array.isArray(v)?v:String(v||'').split('|||').filter(Boolean);
const vals=(s,id)=>parse(s.metadata?.familyDetails?.[id]);
const norm=s=>String(s||'').toLowerCase().replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
function durationSpec(type){
 if(type==='تحليل نتائج')return null;
 if(type==='اجتماع / متابعة إدارية')return{label:'مدة الاجتماع',options:['30 دقيقة','ساعة','أكثر من ساعة','أخرى']};
 if(type==='تطوير مهني')return{label:'عدد الساعات',options:['ساعة','ساعتان','3 ساعات','4 ساعات','أكثر من 4 ساعات','أخرى']};
 if(type==='خطة')return{label:'الفترة الزمنية',options:['أسبوع','شهر','فصل دراسي','أخرى']};
 if(type==='إجراء متابعة')return{label:'وتيرة المتابعة',options:['مرة واحدة','يومية','أسبوعية','شهرية','مستمرة','أخرى']};
 return{label:'مدة التنفيذ',options:['حصة واحدة','عدة حصص','يوم واحد','عدة أيام','أخرى']};
}
function inferredDuration(s,spec){
 if(s.metadata?.durationChoice)return s.metadata.durationChoice;
 const n=norm(s.raw||'');
 if(!n)return'';
 if(spec.label==='مدة الاجتماع'){
  if(n.includes('30 دقيق')||n.includes('نصف ساع'))return'30 دقيقة';
  if(n.includes('ساعتين')||n.includes('ساعتان')||n.includes('اكثر من ساع'))return'أكثر من ساعة';
  if(n.includes('ساعه'))return'ساعة';
 }
 if(spec.label==='عدد الساعات'){
  if(/4\s*ساع/.test(n)||n.includes('اربع ساعات'))return'4 ساعات';
  if(/3\s*ساع/.test(n)||n.includes('ثلاث ساعات'))return'3 ساعات';
  if(/2\s*ساع/.test(n)||n.includes('ساعتين')||n.includes('ساعتان'))return'ساعتان';
  if(/1\s*ساع/.test(n)||n.includes('ساعه'))return'ساعة';
 }
 if(spec.label==='الفترة الزمنية'){
  if(n.includes('فصل دراسي'))return'فصل دراسي';
  if(n.includes('شهر'))return'شهر';
  if(n.includes('اسبوع'))return'أسبوع';
 }
 if(spec.label==='وتيرة المتابعة'){
  if(n.includes('يومي'))return'يومية';
  if(n.includes('اسبوعي'))return'أسبوعية';
  if(n.includes('شهري'))return'شهرية';
  if(n.includes('مستمر'))return'مستمرة';
 }
 if(spec.label==='مدة التنفيذ'){
  if(n.includes('حصتين')||n.includes('حصص'))return'عدة حصص';
  if(n.includes('حصه'))return'حصة واحدة';
  if(n.includes('يومين')||n.includes('ايام'))return'عدة أيام';
  if(n.includes('يوم'))return'يوم واحد';
 }
 return'';
}
function durationBlock(s){
 const spec=durationSpec(s.classification.type);if(!spec)return'';
 const selected=inferredDuration(s,spec),auto=!s.metadata?.durationChoice&&Boolean(selected);
 return `<div class="chooser durationContext"><small>${esc(spec.label)}</small>${auto?`<p class="questionHelp"><b>فهم المحرك من وصفك:</b> ${esc(selected)}. عدله فقط إذا احتجت.</p>`:'<p class="questionHelp">اختر الأقرب، أو اتركه دون تحديد إذا لم يكن مهمًا.</p>'}<input type="hidden" id="durationSuggested" value="${esc(selected)}"><div class="chips choiceGrid">${spec.options.map(x=>`<button type="button" class="chip ${selected===x?'on':''}" data-duration-pick="${esc(x)}">${esc(x)}</button>`).join('')}</div>${selected==='أخرى'?`<label class="fullField"><span>اكتب ${esc(spec.label)}</span><input id="customDuration" value="${esc(s.metadata?.customDuration||'')}"></label>`:''}</div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-family-pick]');if(!b)return;const id=b.dataset.familyPick,v=b.dataset.familyValue,box=b.closest('.familyChoice'),hidden=box?.querySelector(`[data-family-field="${CSS.escape(id)}"]`);if(!hidden)return;let a=parse(hidden.value);a=a.includes(v)?a.filter(x=>x!==v):[...a,v];hidden.value=a.join('|||');b.classList.toggle('on',a.includes(v));hidden.dispatchEvent(new Event('input',{bubbles:true}))},true);
export function familyDetailsPage(s){
 const f=FAMILIES[s.classification.type],qs=f?.questions||[],suggest=inferFamilyDetails(s),duration=durationBlock(s);
 if(!qs.length)return `<section class="card"><button class="linkBtn" data-action="understanding">→ رجوع</button><div class="muted">الخطوة الثانية</div><h1>تفاصيل الوثيقة</h1><p class="lead">راجع فقط ما يلزم لهذه الوثيقة.</p>${duration}<div class="row"><button class="btn primary" data-action="family-details-next">اعتماد والمتابعة</button></div></section>`;
 return `<section class="card familyDetailsStep"><button class="linkBtn" data-action="understanding">→ رجوع</button><div class="muted">الخطوة الثانية</div><h1>${esc(f.label||'تفاصيل الوثيقة')}</h1><p class="lead">المحرك يقترح ما استطاع فهمه من وصفك. راجع فقط: ألغِ غير الصحيح أو أضف ما ينطبق.</p>${duration}${qs.map(q=>{const saved=vals(s,q.id),proposed=saved.length?saved:(suggest[q.id]||[]),auto=!saved.length&&proposed.length;return `<div class="chooser familyChoice"><small>${esc(q.q)}</small>${auto?`<p class="questionHelp"><b>اقتراح المحرك محدد مسبقًا.</b> عدله إذا لم يكن دقيقًا.</p>`:(q.help?`<p class="questionHelp">${esc(q.help)}</p>`:'')}<input type="hidden" data-family-field="${esc(q.id)}" value="${esc(proposed.join('|||'))}"><div class="chips choiceGrid">${q.opts.map(x=>`<button type="button" class="chip ${proposed.includes(x)?'on':''}" data-family-pick="${esc(q.id)}" data-family-value="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`}).join('')}<div class="row"><button class="btn primary" data-action="family-details-next">اعتماد والمتابعة</button></div></section>`}
