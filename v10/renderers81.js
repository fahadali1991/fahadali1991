import {ENTRY} from './config.js';
import {esc} from './engine.js';

const shortcuts=[
  ['analysis','تحليل نتائج','تحليل الدرجات واتخاذ القرار'],
  ['classification','تصنيف الطلاب','تصنيف مستقل من نفس الدرجات'],
  ['remedial','خطة علاجية','دعم الطلاب الذين يحتاجون تدخلًا'],
  ['enrichment','خطة إثرائية','إثراء الطلاب المتقدمين'],
  ['program','برنامج / فعالية','توثيق البرامج والأنشطة'],
  ['plan','خطة','بناء خطة منظمة'],
  ['minutes','اجتماع','توثيق الاجتماع والقرارات'],
  ['follow','متابعة','توثيق الرصد والمتابعة'],
  ['pd','تطوير مهني','توثيق النمو والتبادل المهني']
];
const icon=(kind)=>{
  const m={program:'<path d="M7 12h10M12 7v10"/>',analysis:'<path d="M5 18V10m5 8V6m5 12v-5m4 5V3"/>',classification:'<path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-4 2-7 6-7s6 3 6 7M12 20c0-3 2-6 6-6 2 0 3 .6 4 1.5"/>',remedial:'<path d="M12 3v18M3 12h18"/>',enrichment:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',plan:'<path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/>',minutes:'<path d="M7 4h10v16H7zM10 8h4M10 12h4M10 16h3"/>',follow:'<path d="M5 12l4 4L19 6"/>',pd:'<path d="M8 7a4 4 0 1 0 8 0M5 20c.7-4 3-6 7-6s6.3 2 7 6"/>'};
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${m[kind]||m.program}</svg>`;
};

export function landing(){return `<section class="home81">
  <header class="brand81">
    <div class="mark81"><span></span><span></span><span></span></div>
    <div><b>محرك التوثيق المدرسي</b><small>تنظيم ذكي للعمل المدرسي</small></div>
  </header>

  <section class="hero81">
    <div class="heroLabel81">ابدأ من الواقع، وليس من النموذج</div>
    <h1>وثّق عملك بسهولة</h1>
    <p>صف ما حدث بطريقتك، وسيتولى النظام فهم العمل وتنظيمه وربطه بالدليل وصياغة الوثيقة.</p>
    <button class="start81" data-entry="smart">
      <span class="startText81"><b>ابدأ التوثيق الذكي</b><small>اكتب ما حدث فقط</small></span>
      <span class="arrow81">←</span>
    </button>
  </section>

  <section class="quick81">
    <div class="sectionHead81"><div><b>أو ابدأ من نوع العمل</b><small>اختصارات اختيارية إذا كنت تعرف ما تريد</small></div></div>
    <div class="quickGrid81">${shortcuts.map(([k,label,help])=>`<button class="quickCard81" data-entry="${k}"><span class="quickIcon81">${icon(k)}</span><span><b>${label}</b><small>${help}</small></span></button>`).join('')}</div>
  </section>

  <footer class="homeFoot81"><span>المحرك يقترح، وأنت تعتمد أو تعدّل</span></footer>
</section>`}

export function entryForm(intent){const e=ENTRY[intent]||ENTRY.smart;const smart=intent==='smart';return `<section class="card entry81"><button class="linkBtn" data-action="home">→ رجوع</button><div class="muted">${smart?'التوثيق الذكي':'بدء مباشر'}</div><h1>${smart?'صف ما حدث':esc(e.title)}</h1><p class="lead">${smart?'اكتب بطريقتك دون صياغة رسمية. سنفهم العمل ثم نطلب منك فقط ما ينقص.':esc(e.help)}</p><textarea id="raw" lang="ar" spellcheck="true" autocorrect="on" placeholder="${smart?'مثال: نفذت برنامجًا لتحسين القراءة لطلاب الصف الثاني المتوسط...':esc(e.placeholder)}"></textarea><div class="row"><button class="btn primary" data-action="analyze">افهم العمل وأكمل</button></div></section>`}
