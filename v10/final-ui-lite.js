import {esc,joinAr,potentialLinks} from './engine.js';
import {displayAudiences,smartTitle,selectedGoals,executionDescription} from './output-quality.js';
import {selectedEvidence} from './evidence-ui.js';

export function finalDocument(s){
 const meta=[],a=displayAudiences(s),goals=selectedGoals(s),ev=selectedEvidence(s),files=s.attachments||[];
 if(s.metadata.executorName)meta.push(['المنفذ',s.metadata.executorName]);
 if(s.metadata.dateDisplay)meta.push(['التاريخ',s.metadata.dateDisplay]);
 if(s.metadata.place)meta.push(['مكان التنفيذ',s.metadata.place]);
 if(s.metadata.duration)meta.push(['المدة',s.metadata.duration]);
 if(a.length)meta.push(['المستفيدون',joinAr(a)]);
 if(s.metadata.count)meta.push(['العدد',s.metadata.count]);
 if(s.grades.length)meta.push(['الصفوف',joinAr(s.grades)]);
 const desc=s.metadata.generatedDescription||executionDescription(s);
 return `<section class="card documentHead"><div class="muted">عنوان الوثيقة</div><div class="title">${esc(smartTitle(s))}</div>${meta.length?`<div class="docMeta">${meta.map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div>`:''}</section>
 <section class="card"><h2>الأهداف</h2>${goals.length?`<ul class="smartList">${goals.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="muted">لم يتم اختيار أهداف.</p>`}</section>
 <section class="card"><h2>وصف التنفيذ ومخرجاته</h2><div class="narrative"><p>${esc(desc)}</p></div></section>
 <section class="card"><h2>الشواهد والمرفقات</h2>${ev.length?`<ul class="smartList">${ev.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="muted">لم تتم إضافة شواهد.</p>`}${files.length?`<div class="attachedFiles">${files.map(f=>`<div class="attachedFile">📎 ${esc(f.name)}</div>`).join('')}</div>`:''}${s.metadata.evidenceLink?`<div class="evidenceLink"><b>رابط شاهد:</b> ${esc(s.metadata.evidenceLink)}</div>`:''}<details><summary>الارتباطات المحتملة</summary>${potentialLinks(s).map(x=>`<div class="fact">${esc(x)}</div>`).join('')}<div class="warn compact">هذه ارتباطات محتملة وليست حكمًا بتحقق مؤشر.</div></details></section>
 <div class="toolbar"><button class="btn" data-action="go-evidence">تعديل الشواهد</button><button class="btn" data-action="edit-description">تعديل الوصف</button><button class="btn" data-action="go-goals">تعديل الأهداف</button><button class="btn" data-action="understanding">تعديل البيانات</button></div>`;
}
