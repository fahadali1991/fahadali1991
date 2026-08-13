import {ENTRY} from './config.js';
import {esc,joinAr,questionsFor,familyOptions,subtypeOptions,potentialLinks} from './engine.js';
import {displayAudiences,smartTitle,goalsFor,executionDescription,evidenceItems} from './output-quality.js';

const AUDIENCES=['الطلاب','المعلمون','أولياء الأمور','الإداريون','جميع منسوبي المدرسة','فئة أخرى'];

export function landing(){
  return `<section class="card"><div class="kicker">V10 Stable Core · نسخة تطوير مستقرة</div><h1>ماذا تريد أن تنجز؟</h1><p class="lead">صف ما حدث بطريقتك، أو ابدأ مباشرة من نوع العمل.</p><button class="smartEntry" data-entry="smart"><span>✨</span><span><b>صف لي ما حدث</b><small>المحرك يحدد النوع ويكشف التعارضات قبل المتابعة</small></span><span>←</span></button><div class="dividerText"><span>أو ابدأ مباشرة</span></div><div class="entryGrid">${['report','minutes','analysis','plan','program','pd','follow'].map(k=>`<button class="entryTile" data-entry="${k}"><span>${ENTRY[k].icon}</span><b>${ENTRY[k].label}</b></button>`).join('')}</div></section>`;
}

export function entryForm(intent){
  const e=ENTRY[intent]||ENTRY.smart;
  return `<section class="card"><button class="linkBtn" data-action="home">→ رجوع</button><div class="badge">${e.icon} ${e.label}</div><h1>${e.title}</h1><p class="lead">${e.help}</p><textarea id="raw" lang="ar" spellcheck="true" placeholder="${esc(e.placeholder)}"></textarea><div class="row"><button class="btn primary" data-action="analyze">افهم وأكمل</button></div></section><section id="out"></section>`;
}

export function understanding(state){
  const c=state.classification;
  const conflict=c.conflict?`<div class="warn"><b>وجدت تعارضًا يحتاج قرارك.</b><p>أنت دخلت من <strong>${esc(c.hinted)}</strong>، بينما وصفك أقرب إلى <strong>${esc(c.detected)}</strong>.</p><div class="row"><button class="btn primary" data-action="accept-detected">اعتماد فهم المحرك</button><button class="btn" data-action="accept-hint">الاستمرار حسب اختياري</button></div></div>`:'';
  const suggested=state.suggestedAudiences?.length?`<p class="questionHelp">فهمت من وصفك أن الفئة قد تكون: <b>${esc(joinAr(state.suggestedAudiences))}</b>. اختر بنفسك للتأكيد.</p>`:`<p class="questionHelp">اختر المستفيدين الفعليين من العمل.</p>`;
  return `<section class="card"><div class="muted">فهم المحرك</div><div class="under">${esc(state.metadata.workTitle)}</div>${conflict}
    <div class="facts"><div class="fact"><small>عائلة العمل</small><b>${esc(c.type)}</b></div><div class="fact"><small>النوع الفرعي</small><b>${esc(c.subtype)}</b></div><div class="fact"><small>المجال</small><b>${esc(c.domain)}</b></div><div class="fact"><small>الموضوع</small><b>${esc(state.topic||'يُستكمل من الوصف والاختيارات')}</b></div></div>
    <div class="editGrid"><label><span>العنوان المقترح</span><input id="workTitle" value="${esc(state.metadata.workTitle)}"></label><label><span>المنفذ</span><input id="executorName" value="${esc(state.metadata.executorName)}" placeholder="اسم المنفذ"></label><label><span>العدد</span><input id="count" inputmode="numeric" value="${esc(state.metadata.count)}" placeholder="عدد المستفيدين"></label></div>
    <div class="editGrid"><label><span>التاريخ الهجري</span><input id="dateHijri" value="${esc(state.metadata.dateHijri||'')}" placeholder="مثال: 01/03/1448"></label><label><span>التاريخ الميلادي</span><input id="dateGregorian" value="${esc(state.metadata.dateGregorian||'')}" placeholder="مثال: 14/08/2026"></label><label><span>المدة</span><input id="duration" value="${esc(state.metadata.duration||'')}" placeholder="مثال: 45 دقيقة"></label></div>
    <div class="editGrid"><label><span>مكان التنفيذ</span><input id="place" value="${esc(state.metadata.place||'')}" placeholder="مثال: قاعة مصادر التعلم"></label><label><span>فئة أخرى - عند الحاجة</span><input id="otherAudience" value="${esc(state.metadata.otherAudience||'')}" placeholder="اكتب اسم الفئة"></label></div>
    <div class="chooser"><small>من المستفيدون؟</small>${suggested}<div class="chips choiceGrid">${AUDIENCES.map(x=>`<button class="chip ${(state.audiences||[]).includes(x)?'on':''}" data-audience="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
    <div class="chooser"><small>تعديل عائلة العمل</small><div class="chips">${familyOptions().map(x=>`<button class="chip ${x===c.type?'on':''}" data-type="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
    <div class="chooser"><small>النوع الفرعي</small><div class="chips">${subtypeOptions(state).map(x=>`<button class="chip ${x===c.subtype?'on':''}" data-subtype="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
    <div class="helperBox"><b>الخطوة التالية بسيطة</b><p>سأعرض لك اختيارات مناسبة لما فهمته. اختر فقط الأشياء التي حدثت فعلًا، وسأحوّلها إلى وثيقة مرتبة.</p></div><div class="row"><button class="btn primary" data-action="questions">متابعة</button><button class="btn" data-action="home">بداية جديدة</button></div></section>`;
}

export function questions(state,index=0){
  const list=questionsFor(state);if(index>=list.length)return ready(state);
  const q=list[index],selected=state.answers[q.id]||[],min=q.min??0,max=q.max??q.opts.length;
  const limitText=min?`اختر من ${min} إلى ${max}`:`اختر حتى ${max}`;
  return `<section class="card"><div class="progress"><span style="width:${Math.round((index/list.length)*100)}%"></span></div><div class="q"><small>سؤال ${index+1} من ${list.length}</small><h2>${esc(q.q)}</h2>${q.help?`<p class="questionHelp">${esc(q.help)}</p>`:''}<div class="choiceMeta"><span>${esc(limitText)}</span><span>اخترت ${selected.length} من ${max}</span></div><div class="chips choiceGrid">${q.opts.map(x=>`<button class="chip ${selected.includes(x)?'on':''}" data-answer="${esc(q.id)}" data-value="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><div class="row"><button class="btn primary" data-action="next-question">${index===list.length-1?'إنشاء الوثيقة':'التالي'}</button><button class="btn" data-action="understanding">رجوع</button></div></section>`;
}

export function ready(state){
  const title=smartTitle(state),goals=goalsFor(state),description=executionDescription(state),evidence=evidenceItems(state),aud=displayAudiences(state);
  const meta=[];
  if(state.metadata.executorName)meta.push(['المنفذ',state.metadata.executorName]);
  if(state.metadata.dateHijri)meta.push(['التاريخ الهجري',state.metadata.dateHijri]);
  if(state.metadata.dateGregorian)meta.push(['التاريخ الميلادي',state.metadata.dateGregorian]);
  if(state.metadata.place)meta.push(['مكان التنفيذ',state.metadata.place]);
  if(state.metadata.duration)meta.push(['المدة',state.metadata.duration]);
  if(aud.length)meta.push(['المستفيدون',joinAr(aud)]);
  if(state.metadata.count)meta.push(['العدد',state.metadata.count]);
  if(state.grades.length)meta.push(['الصفوف',joinAr(state.grades)]);
  return `<section class="card documentHead"><div class="muted">عنوان الوثيقة</div><div class="title">${esc(title)}</div>${meta.length?`<div class="docMeta">${meta.map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div>`:''}</section>
  <section class="card"><h2>الأهداف</h2>${goals.length?`<ul class="smartList">${goals.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="muted">لم يتم تحديد أهداف كافية.</p>`}</section>
  <section class="card"><h2>وصف التنفيذ ومخرجاته</h2><div class="narrative"><p>${esc(description)}</p></div></section>
  <section class="card"><h2>الشواهد</h2><ul class="smartList">${evidence.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><details><summary>الارتباطات المحتملة</summary>${potentialLinks(state).map(x=>`<div class="fact">${esc(x)}</div>`).join('')}<div class="warn compact">هذه ارتباطات محتملة وليست حكمًا بتحقق مؤشر.</div></details></section>
  <div class="toolbar"><button class="btn" data-action="understanding">تعديل البيانات</button><button class="btn" data-action="home">بداية جديدة</button></div>`;
}
