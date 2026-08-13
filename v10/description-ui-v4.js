import {esc} from './engine.js';
import {descriptionVariants} from './description-variants-v4.js';

export function descriptionChoicesPage(state){
  const variants=descriptionVariants(state);
  return `<section class="card"><button class="linkBtn" data-action="go-goals">→ رجوع</button><div class="muted">الخطوة الثالثة</div><h1>اختر أسلوب وصف التنفيذ ومخرجاته</h1><p class="lead">أعددت لك نماذج مختلفة حسب عائلة العمل ونوعه وبياناتك. اختر الأنسب، وبعدها يمكنك تعديله.</p><div class="variantGrid">${variants.map(v=>`<article class="variantCard"><div class="variantHead"><b>${esc(v.label)}</b><small>${esc(v.help)}</small></div>${v.mode==='bullets'?`<ul class="smartList">${v.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p>${esc(v.text)}</p>`}<button class="btn primary" data-description-variant="${esc(v.id)}">اختيار هذا النموذج</button></article>`).join('')}</div></section>`;
}

export function descriptionEditorPage(state){
  const text=state.metadata.generatedDescription||'';
  const label=state.metadata.descriptionVariantLabel||'النموذج المختار';
  return `<section class="card"><button class="linkBtn" data-action="description-choices">→ رجوع للنماذج</button><div class="muted">النموذج المختار: ${esc(label)}</div><h1>وصف التنفيذ ومخرجاته</h1><p class="lead">راجع النص وعدله بحرية قبل الانتقال إلى الشواهد.</p><textarea id="generatedDescription" class="descriptionEditor" spellcheck="true" autocorrect="on">${esc(text)}</textarea><div class="row"><button class="btn primary" data-action="go-evidence">التالي: الشواهد والمرفقات</button><button class="btn" data-action="description-choices">اختيار نموذج آخر</button></div></section>`;
}
