import {landing,entryForm} from './renderers.js?v=4';
import {esc,joinAr,familyOptions,subtypeOptions} from './engine.js';
import {smartTitle,titleCandidates,suggestedGoals} from './output-quality-v5.js';

const AUD=['الطلاب','المعلمون','أولياء الأمور','الإداريون','جميع منسوبي المدرسة','مستفيدون آخرون'];
const DUR=['','حصة دراسية','حصتان دراسيتان','يوم دراسي','يومان','أسبوع','أسبوعان','شهر','فصل دراسي','مدة أخرى'];
const PLC=['','فصل دراسي','مركز مصادر التعلم','المكتبة','معمل الحاسب','المختبر','المسرح المدرسي','المصلى','ساحة المدرسة','الملعب','غرفة النشاط','قاعة التدريب','مكتب الإدارة','عن بُعد','خارج المدرسة','مكان آخر'];
const DOMAINS=['','البرامج والأنشطة','الإدارة والمتابعة','التحصيل والتقويم','التخطيط والتحسين','الحضور والانضباط','التطوير المهني','التوجيه الطلابي','الأمن والسلامة','الشراكة المجتمعية','الجودة والتقويم الذاتي','التقنية والتحول الرقمي','القيم والهوية الوطنية'];
const opts=(a,v,p)=>a.map(x=>`<option value="${esc(x)}" ${x===v?'selected':''}>${esc(x||p)}</option>`).join('');

export {landing,entryForm};

export function understanding(s){
 const c=s.classification;
 const titles=titleCandidates(s);
 const suggest=s.suggestedAudiences?.length
  ?`<p class="questionHelp">قد يكون المستفيدون: <b>${esc(joinAr(s.suggestedAudiences))}</b>. اختر بنفسك للتأكيد.</p>`
  :'<p class="questionHelp">اختر المستفيدين الفعليين.</p>';
 return `<section class="card">
  <div class="muted">فهم المحرك</div>
  <div class="under">${esc(smartTitle(s))}</div>

  <section class="classificationBlock">
   <div class="muted">تصنيف العمل</div>
   <p class="questionHelp">راجع التصنيف وعدله عند الحاجة.</p>
   <div class="chooser"><small>عائلة العمل</small><div class="chips">${familyOptions().map(x=>`<button class="chip ${x===c.type?'on':''}" data-type="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
   <div class="chooser"><small>النوع الفرعي</small><div class="chips">${subtypeOptions(s).map(x=>`<button class="chip ${x===c.subtype?'on':''}" data-subtype="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
   <div class="editGrid classificationFields">
    <label><span>المجال</span><select id="domainSelect">${opts(DOMAINS,c.domain||'','اختر المجال')}</select></label>
    <label><span>الموضوع</span><input id="topicEdit" value="${esc(s.topic||'')}" placeholder="اكتب موضوع العمل أو عدله"></label>
   </div>
  </section>

  <div class="chooser"><small>العنوان</small><p class="questionHelp">اختر أحد الاقتراحات أو عدله.</p><div class="chips choiceGrid">${titles.map(x=>`<button class="chip ${s.metadata.selectedTitle===x?'on':''}" data-title-choice="${esc(x)}">${esc(x)}</button>`).join('')}</div><label class="fullField"><span>تعديل العنوان</span><input id="workTitle" value="${esc(s.metadata.titleManual?s.metadata.workTitle:(s.metadata.selectedTitle||titles[0]||''))}"></label></div>

  <div class="editGrid"><label><span>المنفذ</span><input id="executorName" value="${esc(s.metadata.executorName||'')}"></label><label><span>العدد</span><input id="count" inputmode="numeric" value="${esc(s.metadata.count||'')}"></label><label><span>التاريخ</span><input id="dateISO" type="date" value="${esc(s.metadata.dateISO||'')}"></label></div>
  <div class="editGrid"><label><span>المدة</span><select id="durationSelect">${opts(DUR,s.metadata.durationChoice||'','اختر المدة')}</select></label><label><span>مكان التنفيذ</span><select id="placeSelect">${opts(PLC,s.metadata.placeChoice||'','اختر المكان')}</select></label></div>
  ${s.metadata.durationChoice==='مدة أخرى'?`<label class="fullField"><span>اكتب المدة</span><input id="customDuration" value="${esc(s.metadata.customDuration||'')}"></label>`:''}
  ${s.metadata.placeChoice==='مكان آخر'?`<label class="fullField"><span>اكتب المكان</span><input id="customPlace" value="${esc(s.metadata.customPlace||'')}"></label>`:''}

  <div class="chooser"><small>المستفيدون</small>${suggest}<div class="chips choiceGrid">${AUD.map(x=>`<button class="chip ${(s.audiences||[]).includes(x)?'on':''}" data-audience="${esc(x)}">${esc(x)}</button>`).join('')}</div>${(s.audiences||[]).includes('مستفيدون آخرون')?`<label class="fullField"><span>من هم؟</span><input id="otherAudience" value="${esc(s.metadata.otherAudience||'')}"></label>`:''}</div>

  <div class="row"><button class="btn primary" data-action="go-goals">التالي: الأهداف</button></div>
 </section>`;
}

export function goalsPage(s){
 const a=s.answers.goals||[],other=s.metadata.otherGoalEnabled;
 return `<section class="card"><button class="linkBtn" data-action="understanding">→ رجوع</button><div class="muted">الخطوة الثانية</div><h1>الأهداف</h1><p class="lead">اختر أي عدد يناسب العمل.</p><div class="chips choiceGrid">${suggestedGoals(s).map(x=>`<button class="chip ${a.includes(x)?'on':''}" data-goal="${esc(x)}">${esc(x)}</button>`).join('')}<button class="chip ${other?'on':''}" data-action="toggle-other-goal">أخرى</button></div>${other?`<label class="fullField"><span>اكتب الهدف</span><input id="otherGoal" value="${esc(s.metadata.otherGoal||'')}"></label>`:''}<div class="row"><button class="btn primary" data-action="go-description">التالي: اختيار الوصف</button></div></section>`;
}
