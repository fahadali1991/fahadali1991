import {finalDocument76 as base} from './final-ui76.js?v=76';
import {pdfPreview107,bindPdfPreview107} from './pdf-renderer107.js?v=120.1';
import {analysisPlansPanel125,bindAnalysisPlans125} from './analysis-plans125.js?v=125';
import {analysisDecisionPanel127} from './analysis-decision127.js?v=127';
let bound=false;
export function finalDocument76(s){if(!bound){bindPdfPreview107(s);bound=true}else bindPdfPreview107(s);bindAnalysisPlans125(s);const decision=analysisDecisionPanel127(s),plans=analysisPlansPanel125(s);return base(s)+decision+plans+`<section class="card"><div class="muted">الإخراج الطباعي</div><h2>معاينة الوثيقة قبل الطباعة</h2><p class="questionHelp">التصميم يتكيف مع عائلة الوثيقة ويقرأ البيانات من الحالة المركزية نفسها.</p><div data-pdf-preview-host107>${pdfPreview107(s,{mode:'color'})}</div></section><div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تقرير جديد</button></div>`}
