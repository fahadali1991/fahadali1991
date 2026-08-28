import {finalDocument76 as base} from './final-ui76.js?v=76';
import {pdfPreview107,bindPdfPreview107} from './pdf-renderer107.js?v=120.1';
import {analysisOutputPanel133,bindAnalysisOutput133} from './analysis-output133.js?v=133';
import {analysisFinalPanel133} from './analysis-final133.js?v=133';
let bound=false;
export function finalDocument76(s){
 if(!bound){bindPdfPreview107(s);bound=true}else bindPdfPreview107(s);
 const isAnalysis=s?.classification?.type==='تحليل نتائج';
 if(isAnalysis){
  bindAnalysisOutput133(s);
  return analysisFinalPanel133(s)+analysisOutputPanel133(s)+`<div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تحليل جديد</button></div>`;
 }
 return base(s)+`<section class="card"><div class="muted">الإخراج الطباعي</div><h2>معاينة الوثيقة قبل الطباعة</h2><p class="questionHelp">التصميم يتكيف مع عائلة الوثيقة ويقرأ البيانات من الحالة المركزية نفسها.</p><div data-pdf-preview-host107>${pdfPreview107(s,{mode:'color'})}</div></section><div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تقرير جديد</button></div>`;
}
