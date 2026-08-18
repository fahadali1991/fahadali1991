import {finalDocument76 as base} from './final-ui76.js?v=76';
import {pdfPreview107,bindPdfPreview107} from './pdf-renderer107.js?v=111';
let bound=false;
export function finalDocument76(s){if(!bound){bindPdfPreview107(s);bound=true}else bindPdfPreview107(s);return base(s)+`<section class="card"><div class="muted">الإخراج الطباعي الجديد</div><h2>معاينة الوثيقة قبل الطباعة</h2><p class="questionHelp">التصميم يتكيف مع عائلة الوثيقة، ويستخدم توزيعًا أكبر للشواهد مع وضع أبيض وأسود اقتصادي.</p><div data-pdf-preview-host107>${pdfPreview107(s,{mode:'color'})}</div></section><div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تقرير جديد</button></div>`}
