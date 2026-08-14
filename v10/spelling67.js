import {esc} from './engine.js';
const clean=s=>String(s||'');
const RULES=[
 {from:'تنفيد',to:'تنفيذ',label:'تصحيح إملائي'},
 {from:'التنفيد',to:'التنفيذ',label:'تصحيح إملائي'},
 {from:'المستفدين',to:'المستفيدين',label:'تصحيح إملائي'},
 {from:'الطلابء',to:'الطلاب',label:'تصحيح إملائي'},
 {from:'المدرسه',to:'المدرسة',label:'تصحيح إملائي'},
 {from:'المعلميين',to:'المعلمين',label:'تصحيح إملائي'},
 {from:'النتايج',to:'النتائج',label:'تصحيح إملائي'},
 {from:'الاهداف',to:'الأهداف',label:'تصحيح إملائي'},
 {from:'الاجراءات',to:'الإجراءات',label:'تصحيح إملائي'},
 {from:'الاداء',to:'الأداء',label:'تصحيح إملائي'},
 {from:'التقيم',to:'التقييم',label:'تصحيح إملائي'},
 {from:'المخرجاته',to:'المخرجات',label:'تصحيح إملائي'}
];
const REGEX_RULES=[
 {re:/\s{2,}/g,to:' ',label:'إزالة المسافات الزائدة'},
 {re:/\s+([،؛:.!?؟])/g,to:'$1',label:'ضبط المسافة قبل علامة الترقيم'},
 {re:/([،؛:.!?؟])([^\s\n])/g,to:'$1 $2',label:'إضافة مسافة بعد علامة الترقيم'},
 {re:/([،؛])\s*([،؛])/g,to:'$1',label:'إزالة علامة ترقيم مكررة'},
 {re:/\.\s*\./g,to:'.',label:'إزالة النقاط المكررة'},
 {re:/\bتم تم\b/g,to:'تم',label:'إزالة كلمة مكررة'},
 {re:/\bمن خلال من خلال\b/g,to:'من خلال',label:'إزالة عبارة مكررة'},
 {re:/\bبهدف بهدف\b/g,to:'بهدف',label:'إزالة عبارة مكررة'}
];
export function spellingSuggestions(text){const s=clean(text),out=[];for(const r of RULES){if(s.includes(r.from))out.push({from:r.from,to:r.to,label:r.label,type:'literal'})}for(const r of REGEX_RULES){r.re.lastIndex=0;if(r.re.test(s)){r.re.lastIndex=0;const revised=s.replace(r.re,r.to);if(revised!==s)out.push({from:s,to:revised,label:r.label,type:'full'})}}return out.slice(0,12)}
export function applySuggestion(text,from,to){return String(text||'').split(from).join(to)}
export function applyFullSuggestion(_text,to){return String(to||'')}
export function spellingPage(state){const text=state.metadata.generatedDescription||'',list=spellingSuggestions(text);return `<section class="card"><button class="linkBtn" data-action="edit-description">→ رجوع</button><div class="muted">مراجعة النص المولد</div><h1>${list.length?'وجدت تحسينات لغوية':'النص سليم مبدئيًا'}</h1><p class="lead">تم فحص النص المولد نفسه. لن يغيّر النظام أي صياغة دون موافقتك.</p>${list.length?list.map((x,i)=>`<div class="fact"><small>${esc(x.label||`اقتراح ${i+1}`)}</small>${x.type==='literal'?`<b>${esc(x.from)} ← ${esc(x.to)}</b><div class="row"><button class="btn" data-spell-from="${esc(x.from)}" data-spell-to="${esc(x.to)}">اعتماد التصحيح</button></div>`:`<div class="row"><button class="btn" data-spell-full="${i}">اعتماد التحسين</button></div><input type="hidden" data-spell-full-value="${i}" value="${esc(x.to)}">`}</div>`).join(''):'<div class="helperBox">لم أجد أخطاء أو تنسيقات لغوية شائعة تحتاج إلى تصحيح.</div>'}<div class="row"><button class="btn primary" data-action="go-evidence-direct">التالي: الشواهد</button></div></section>`}
