import {finalDocument76 as base} from './final-ui76.js?v=76';
import {pdfPreview107,bindPdfPreview107} from './pdf-renderer107.js?v=120.1';
import {bindAnalysisPlans125} from './analysis-plans125.js?v=125';
import {analysisDecisionPanel127} from './analysis-decision127.js?v=127';
import {hasAnalysisOutput128} from './analysis-output-choice128.js?v=128';
import {analysisSelectedPlansPanel128,standaloneStudentPlanPanel128} from './analysis-selected-plans128.js?v=128';
let bound=false;
export function finalDocument76(s){if(!bound){bindPdfPreview107(s);bound=true}else bindPdfPreview107(s);bindAnalysisPlans125(s);const isAnalysis=s?.classification?.type==='تحليل نتائج',directClassification=s?.metadata?.directEntry128==='classification',decision=isAnalysis&&hasAnalysisOutput128(s,'classification')?analysisDecisionPanel127(s):'',plans=isAnalysis?analysisSelectedPlansPanel128(s):'',standalone=standaloneStudentPlanPanel128(s),core=directClassification?'':base(s);return core+decision+plans+standalone+`<section class="card"><div class="muted">الإخراج الطباعي</div><h2>معاينة الوثيقة قبل الطباعة</h2><p class="questionHelp">كل مخرج مختار يظهر كوثيقة مستقلة في صفحة PDF منفصلة.</p><div data-pdf-preview-host107>${pdfPreview107(s,{mode:'color'})}</div></section><div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تقرير جديد</button></div>`}
