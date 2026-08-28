import {finalDocument76 as base} from './final-ui76.js?v=76';
import {pdfPreview107,bindPdfPreview107} from './pdf-renderer107.js?v=120.1';
import {analysisPlansPanel131,bindAnalysisPlans131} from './analysis-plans131.js?v=131';
import {analysisDecisionPanel131} from './analysis-decision131.js?v=131';
import {analysisOutputPanel132,bindAnalysisOutput132} from './analysis-output132.js?v=132';
let bound=false;
export function finalDocument76(s){if(!bound){bindPdfPreview107(s);bound=true}else bindPdfPreview107(s);bindAnalysisPlans131(s);bindAnalysisOutput132(s);const decision=analysisDecisionPanel131(s),plans=analysisPlansPanel131(s),isAnalysis=s?.classification?.type==='تحليل نتائج',print=isAnalysis?analysisOutputPanel132(s):`<section class="card"><div class="muted">الإخراج الطباعي</div><h2>معاينة الوثيقة قبل الطباعة</h2><p class="questionHelp">التصميم يتكيف مع عائلة الوثيقة ويقرأ البيانات من الحالة المركزية نفسها.</p><div data-pdf-preview-host107>${pdfPreview107(s,{mode:'color'})}</div></section>`;return base(s)+decision+plans+print+`<div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تقرير جديد</button></div>`}
