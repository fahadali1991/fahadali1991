import {ENTRY} from './config.js';
import {esc,joinAr,questionsFor,familyOptions,subtypeOptions,evidenceFor,potentialLinks,composeNarrative} from './engine.js';

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
  return `<section class="card"><div class="muted">فهم المحرك</div><div class="under">${esc(state.metadata.workTitle)}</div>${conflict}<div class="facts"><div class="fact"><small>عائلة العمل</small><b>${esc(c.type)}</b></div><div class="fact"><small>النوع الفرعي</small><b>${esc(c.subtype)}</b></div><div class="fact"><small>المجال</small><b>${esc(c.domain)}</b></div><div class="fact"><small>المستفيدون</small><b>${esc(joinAr(state.audiences))}</b></div></div><div class="editGrid"><label><span>اسم العمل</span><input id="workTitle" value="${esc(state.metadata.workTitle)}"></label><label><span>المنفذ</span><input id="executorName" value="${esc(state.metadata.executorName)}"></label><label><span>العدد</span><input id="count" inputmode="numeric" value="${esc(state.metadata.count)}"></label></div><div class="chooser"><small>تعديل عائلة العمل</small><div class="chips">${familyOptions().map(x=>`<button class="chip ${x===c.type?'on':''}" data-type="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><div class="chooser"><small>النوع الفرعي</small><div class="chips">${subtypeOptions(state).map(x=>`<button class="chip ${x===c.subtype?'on':''}" data-subtype="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><div class="row"><button class="btn primary" data-action="questions">متابعة</button><button class="btn" data-action="home">بداية جديدة</button></div></section>`;
}

export function questions(state,index=0){
  const list=questionsFor(state);if(index>=list.length)return ready(state);
  const q=list[index],selected=state.answers[q.id]||[];
  return `<section class="card"><div class="progress"><span style="width:${Math.round((index/list.length)*100)}%"></span></div><div class="q"><small>سؤال ${index+1} من ${list.length}</small><h2>${esc(q.q)}</h2><div class="chips">${q.opts.map(x=>`<button class="chip ${selected.includes(x)?'on':''}" data-answer="${esc(q.id)}" data-value="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><div class="row"><button class="btn primary" data-action="next-question">${index===list.length-1?'إنشاء التقرير':'التالي'}</button><button class="btn" data-action="understanding">رجوع</button></div></section>`;
}

export function ready(state){
  const paras=composeNarrative(state),wc=paras.join(' ').split(/\s+/).filter(Boolean).length;
  return `<section class="card"><div class="muted">العنوان المهني</div><div class="title">${esc(state.metadata.workTitle)}</div><div class="metaSummary"><span>المستفيدون: ${esc(joinAr(state.audiences))}</span>${state.grades.length?`<span>الصفوف: ${esc(joinAr(state.grades))}</span>`:''}${state.metadata.executorName?`<span>المنفذ: ${esc(state.metadata.executorName)}</span>`:''}${state.metadata.count?`<span>العدد: ${esc(state.metadata.count)}</span>`:''}</div><div class="counter">النص المولد: نحو ${wc} كلمة</div></section><section class="card"><h2>التقرير المهني</h2><div class="narrative">${paras.map(p=>`<p>${esc(p)}</p>`).join('')}</div></section><section class="card"><h2>الشاهد الأنسب</h2><div class="evidence"><strong>ابدأ بهذا:</strong> ${esc(evidenceFor(state))}</div><details><summary>الارتباطات المحتملة</summary>${potentialLinks(state).map(x=>`<div class="fact">${esc(x)}</div>`).join('')}<div class="warn compact">هذه ارتباطات محتملة وليست حكمًا بتحقق مؤشر.</div></details></section><div class="toolbar"><button class="btn" data-action="understanding">تعديل البيانات</button><button class="btn" data-action="home">بداية جديدة</button></div>`;
}
