import {esc} from './engine.js';
import {bestTitle62,titleCandidates62,extractTitleFacts62} from './title62.js?v=71';

function fallbackTitle(s){
 const f=extractTitleFacts62(s),type=s.classification?.type||'',sub=s.classification?.subtype||'';
 if(type==='تحليل نتائج') return f.assessmentSource?`تحليل نتائج ${f.assessmentSource}${f.target?` لدى ${f.target}`:''}`:(f.target?`تحليل نتائج ${f.target}`:'تحليل نتائج الطلاب');
 if(type==='برنامج / فعالية') return f.topicConcept?`${sub||'برنامج'} ${f.topicConcept}${f.target?` ل${f.target}`:''}`:`${sub||'برنامج'} مدرسي`;
 if(type==='خطة') return `${sub||'خطة'} ${f.topicConcept||'للتحسين المدرسي'}`;
 if(type==='اجتماع / متابعة إدارية') return f.topicConcept?`${sub||'اجتماع'} بشأن ${f.topicConcept}`:`${sub||'اجتماع'} لمتابعة العمل المدرسي`;
 if(type==='إجراء متابعة') return `${sub||'متابعة'} ${f.topicConcept||'الإجراء المستهدف'}`;
 if(type==='تطوير مهني') return `${sub||'تطوير مهني'} في ${f.topicConcept||'تطوير الممارسات المهنية'}`;
 return sub||type||'وثيقة مدرسية';
}

export function titlePage71(s){
 const all=titleCandidates62(s);
 const generated=all[0]||bestTitle62(s)||fallbackTitle(s);
 const saved=String(s.metadata?.selectedTitle||'').trim();
 const primary=saved||generated||fallbackTitle(s);
 const show=Boolean(s.metadata?.showAltTitles);
 const alts=all.filter(x=>x&&x!==primary).slice(0,2);
 return `<section class="card titleStep"><button class="linkBtn" data-action="go-goals">→ رجوع للأهداف</button><div class="stepBadge">الخطوة الثالثة</div><h1>عنوان الوثيقة</h1><p class="lead">يقترح المحرك عنوانًا مباشرة بناءً على نوع الوثيقة والموضوع والفئة. ويمكنك تعديله قبل المتابعة.</p><div class="recommendedTitle"><small>العنوان الموصى به</small><div class="recommendedText">${esc(primary)}</div><button class="btn primary fullBtn" data-title-accept="${esc(primary)}">اعتماد العنوان والمتابعة</button></div><div class="titleActions"><button class="btn" data-action="toggle-alt-titles">${show?'إخفاء الاقتراحات':'عرض اقتراحات أخرى'}</button><button class="btn" data-action="edit-title55">تعديل العنوان</button></div>${show&&alts.length?`<div class="altTitlePanel"><small>بدائل سليمة</small>${alts.map(x=>`<button class="altTitleRow" data-title-choice55="${esc(x)}">${esc(x)}</button>`).join('')}</div>`:''}${s.metadata?.editTitle55?`<div class="editPanel"><label class="fullField"><span>تعديل العنوان</span><input id="workTitle55" value="${esc(primary)}"></label><button class="btn primary fullBtn" data-action="accept-manual-title55">اعتماد العنوان المعدل</button></div>`:''}</section>`;
}
