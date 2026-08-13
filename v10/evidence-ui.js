import {esc} from './engine.js';
import {evidenceItems} from './output-quality.js';

export function selectedEvidence(state){
  const items=[...(state.answers?.evidence||[])];
  const other=String(state.metadata?.otherEvidence||'').trim();
  return other?[...items,other]:items;
}

export function evidencePage(state){
  const suggestions=evidenceItems(state);
  const selected=state.answers?.evidence||[];
  const otherOn=Boolean(state.metadata?.otherEvidenceEnabled);
  const files=state.attachments||[];
  const chosen=selectedEvidence(state);
  const onlyPhotos=chosen.length&&chosen.every(x=>/صور/.test(x));
  const advice=!chosen.length&&!files.length&&!state.metadata?.evidenceLink
    ?'<div class="warn compact">لم تضف شاهدًا بعد. يمكنك المتابعة، لكن الوثيقة ستكون دون شواهد داعمة.</div>'
    :onlyPhotos
      ?'<div class="warn compact">الصور تثبت حدوث التنفيذ، لكنها وحدها لا تثبت الأثر. أضف رابطًا أو شاهدًا آخر إذا كان متوفرًا.</div>'
      :'<div class="helperBox"><b>الشواهد مناسبة كبداية</b><p>اختر فقط ما لديك فعليًا.</p></div>';

  return `<section class="card">
    <button class="linkBtn" data-action="edit-description">→ رجوع</button>
    <div class="muted">الخطوة الرابعة</div>
    <h1>الشواهد والمرفقات</h1>
    <p class="lead">اختر الشواهد المتوفرة، ثم أضف الصور من الاستوديو أو رابطًا داعمًا.</p>
    <div class="chips choiceGrid">${suggestions.map(x=>`<button class="chip ${selected.includes(x)?'on':''}" data-evidence="${esc(x)}">${esc(x)}</button>`).join('')}<button class="chip ${otherOn?'on':''}" data-action="toggle-other-evidence">شاهد آخر</button></div>
    ${otherOn?`<label class="fullField"><span>اكتب اسم الشاهد</span><input id="otherEvidence" value="${esc(state.metadata?.otherEvidence||'')}" placeholder="اكتب اسم الشاهد"></label>`:''}
    ${advice}
    <div class="attachmentGrid">
      <label class="uploadBox"><span class="uploadIcon">🖼️</span><b>اختيار صور من الاستوديو</b><small>يمكن اختيار أكثر من صورة</small><input id="evidenceFiles" type="file" accept="image/*" multiple hidden></label>
      <label class="fullField"><span>رابط شاهد - اختياري</span><input id="evidenceLink" inputmode="url" value="${esc(state.metadata?.evidenceLink||'')}" placeholder="https://..."></label>
    </div>
    ${files.length?`<div class="attachedFiles"><b>الصور المضافة</b>${files.map((f,i)=>`<div class="attachedFile"><span>🖼️ ${esc(f.name)}</span><button class="linkBtn dangerText" data-remove-attachment="${i}">إزالة</button></div>`).join('')}</div>`:''}
    <div class="helperBox"><b>ملاحظة</b><p>الصور في النسخة التجريبية تبقى داخل جلسة إنشاء الوثيقة فقط. التخزين الدائم سيُربط بطبقة الحفظ والأرشفة لاحقًا.</p></div>
    <div class="row"><button class="btn primary" data-action="finalize">معاينة الوثيقة</button><button class="btn" data-action="finalize">تخطي الشواهد الآن</button></div>
  </section>`;
}
