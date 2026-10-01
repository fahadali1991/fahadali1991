import {finalDocument76 as base} from './final-ui76.js?v=76';
import {pdfPreview107,bindPdfPreview107} from './pdf-renderer107.js?v=133';
import {analysisOutputPanel134,bindAnalysisOutput134,analysisFinalPanel134} from './analysis-output134.js?v=134';
import {analysisFinalPanel147,analysisOutputPanel147} from './analysis-render147.js?v=147';
import {analysisJourneyPanel147,bindAnalysisJourney147} from './analysis-journey147.js?v=147';
import './analysis-polish134.js?v=134';
let bound=false;
export function finalDocument76(s){
 if(!bound){bindPdfPreview107(s);bound=true}else bindPdfPreview107(s);
 const isAnalysis=s?.classification?.type==='تحليل نتائج';
 if(isAnalysis){
  bindAnalysisOutput134(s);
  bindAnalysisJourney147(s);
  if(false)return analysisFinalPanel134(s)+analysisOutputPanel134(s);
  return analysisFinalPanel147(s)+analysisOutputPanel147(s)+analysisJourneyPanel147(s)+`<div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء عمل جديد</button></div>`;
 }
 return base(s)+`<section class="card"><div class="muted">الإخراج الطباعي</div><h2>معاينة الوثيقة قبل الطباعة</h2><p class="questionHelp">التصميم يتكيف مع عائلة الوثيقة ويقرأ البيانات من الحالة المركزية نفسها.</p><div data-pdf-preview-host107>${pdfPreview107(s,{mode:'color'})}</div></section><div class="row" style="position:static;margin:0 0 48px"><button class="btn primary" data-action="new-document">إنشاء تقرير جديد</button></div>`;
}