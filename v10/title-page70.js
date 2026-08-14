import {esc} from './engine.js';
import {bestTitle62,titleCandidates62,needsTitleClarification62,clarificationOptions62,extractTitleFacts62} from './title62.js?v=70';

function fallbackTitle(s){
 const f=extractTitleFacts62(s), type=s.classification?.type||'', sub=s.classification?.subtype||'';
 if(type==='تحليل نتائج') return f.target?`تحليل نتائج ${f.target}`:'تحليل نتائج الطلاب';
 if(type==='برنامج / فعالية'){
   const topic=f.topicConcept||'العمل المدرسي';
   return `${sub||'برنامج'} ${topic}`;
 }
 if(type==='خطة') return `${sub||'خطة'} ${f.topicConcept||'التحسين المدرسي'}`;
 if(type==='اجتماع / متابعة إدارية') return `${sub||'اجتماع'} ${f.topicConcept?`بشأن ${f.topicConcept}`:'لمتابعة العمل المدرسي'}`;
 if(type==='إجراء متابعة') return `${sub||'متابعة'} ${f.topicConcept||'الإجراء المستهدف'}`;
 if(type==='تطوير مهني') return `${sub||'تطوير مهني'} في ${f.topicConcept||'تطوير الممارسات المهنية'}`;
 return sub||type||'وثيقة مدرسية';
}

export function titlePage70(s){
 if(needsTitleClarification62(s)){
  const opts=clarificationOptions62(s);
  return `<section class="card titleStep"><button class="linkBtn" data-action="go-goals">→ رجوع للأهداف</button><div class="stepBadge">الخطوة الثالثة</div><h1>حدد موضوع العمل</h1><p class="lead">أحتاج فقط تحديد موضوع العمل حتى أصوغ عنوانًا مهنيًا دقيقًا.</p><div class="clarifyList">${opts.map(x=>`<button class="choiceRow" data-title-clarify="${esc(x)}"><span>${esc(x)}</span><span>←</span></button>`).join('')}<button class="choiceRow" data-action="custom-title-clarification"><span>موضوع آخر</span><span>+</span></button></div>${s.metadata?.showCustomTitleClarification?`<div class="editPanel"><label class="fullField"><span>موضوع العمل فقط</span><input id="titleClarification" value="${esc(s.metadata?.titleClarification||'')}" placeholder="مثال: تحسين الخط والمهارات الكتابية"></label><button class="btn primary fullBtn" data-action="apply-title-clarification">بناء العنوان</button></div>`:''}</section>`;
 }
 const all=titleCandidates62(s);
 const generated=all[0]||bestTitle62(s)||fallbackTitle(s);
 const saved=s.metadata?.selectedTitle;
 const primary=(saved&&String(saved).trim())?saved:generated;
 const show=Boolean(s.metadata?.showAltTitles);
 const alts=all.filter(x=>x&&x!==primary).slice(0,2);
 return `<section class="card titleStep"><button class="linkBtn" data-action="go-goals">→ رجوع للأهداف</button><div class="stepBadge">الخطوة الثالثة</div><h1>عنوان الوثيقة</h1><p class="lead">بُني العنوان من نوع الوثيقة والموضوع والفئة التي فهمها المحرك.</p><div class="recommendedTitle"><small>العنوان الموصى به</small><div class="recommendedText">${esc(primary)}</div><button class="btn primary fullBtn" data-title-accept="${esc(primary)}">اعتماد العنوان والمتابعة</button></div><div class="titleActions"><button class="btn" data-action="toggle-alt-titles">${show?'إخفاء الاقتراحات':'عرض اقتراحات أخرى'}</button><button class="btn" data-action="edit-title55">تعديل العنوان</button></div>${show&&alts.length?`<div class="altTitlePanel"><small>بدائل سليمة</small>${alts.map(x=>`<button class="altTitleRow" data-title-choice55="${esc(x)}">${esc(x)}</button>`).join('')}</div>`:''}${s.metadata?.editTitle55?`<div class="editPanel"><label class="fullField"><span>تعديل العنوان</span><input id="workTitle55" value="${esc(primary)}"></label><button class="btn primary fullBtn" data-action="accept-manual-title55">اعتماد العنوان المعدل</button></div>`:''}</section>`;
}
