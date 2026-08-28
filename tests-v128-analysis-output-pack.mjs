import assert from 'node:assert/strict';
import {analysisOutputSelection128} from './v10/analysis-output-choice128.js';
import {analysisSupplementPages128,standaloneStudentPlanModel128,standaloneStudentPlanPdf128} from './v10/pdf-analysis-outputs128.js';
import {pdfPreview107} from './v10/pdf-renderer107.js';
import {matrix106} from './v10/matrix106.js';
import {routeNextQuestion106} from './v10/question-router106.js';
import {landing} from './v10/renderers81.js';
import {ENTRY,INTENT_TO_TYPE} from './v10/config.js';
import {studentPlanTargetPanel128} from './v10/student-plan-target128.js';

function analysisState(){return {classification:{type:'تحليل نتائج',subtype:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'تعليم نجران',academicYear:'1448هـ',executorName:'معلم المادة',familyMeta111:{assessmentType:'اختبار فترة',period:'الفصل الدراسي الأول',section:'ب'},analysis:{maxScore:'20',masteryPercent:'80',scores:[8,12,16,19],names:['أحمد','خالد','سعد','محمد'],rawRows:'أحمد 8\nخالد 12\nسعد 16\nمحمد 19'},familyDetails:{subject94:'اللغة العربية',cause:'تفاوت في إتقان المهارة'}},answers:{goals:[],evidence:[]},attachments:[]}}
const s=analysisState();
assert.deepEqual(analysisOutputSelection128(s),['classification','remedial','enrichment'],'المخرجات المتاحة تُشتق من إدخال الدرجات الواحد');
assert.equal(s.metadata.familyDetails.actionStatus,'مخطط للتنفيذ','اختيار إنشاء الخطط يحل محل سؤال حالة الإجراء القديم');
assert.match(s.metadata.familyDetails.action,/إعداد خطة علاجية/);
assert.match(s.metadata.familyDetails.action,/إعداد خطة إثرائية/);
assert.match(s.metadata.familyDetails.follow,/إعادة القياس/);

const supplements=analysisSupplementPages128(s);
assert.equal((supplements.match(/class="pdfSheet107/g)||[]).length,3,'العلاجية والإثرائية والتصنيف كل منها صفحة مستقلة');
assert.ok(supplements.indexOf('الخطة العلاجية')<supplements.indexOf('الخطة الإثرائية'),'ترتيب الصفحات يضع العلاجية قبل الإثرائية');
assert.ok(supplements.indexOf('الخطة الإثرائية')<supplements.indexOf('تصنيف الطلاب حسب مستوياتهم'),'التصنيف صفحة مستقلة بعد الخطط وفق طلب المستخدم');
assert.match(supplements,/أحمد/);
assert.match(supplements,/يحتاج دعمًا/);
assert.match(supplements,/محمد/);
assert.match(supplements,/متقدم للإثراء/);

const preview=pdfPreview107(s,{mode:'color'});
assert.equal((preview.match(/class="pdfSheet107/g)||[]).length,4,'حزمة التحليل = صفحة تحليل + علاجية + إثرائية + تصنيف');
assert.ok(preview.indexOf('تحليل نتائج')<preview.indexOf('الخطة العلاجية'));

const direct=analysisState();direct.metadata.directEntry128='classification';delete direct.metadata.analysisOutputs128;delete direct.metadata.analysisOutputsInitialized128;delete direct.metadata.familyDetails.cause;
assert.deepEqual(analysisOutputSelection128(direct),['classification']);
assert.equal(routeNextQuestion106(direct,matrix106(direct)).done,true,'التصنيف المباشر لا يعيد المستخدم إلى أسئلة التحليل التفسيرية');
const directPreview=pdfPreview107(direct);
assert.equal((directPreview.match(/class="pdfSheet107/g)||[]).length,1,'التصنيف المباشر يخرج وثيقة تصنيف واحدة فقط');
assert.match(directPreview,/تصنيف الطلاب حسب مستوياتهم/);
assert.doesNotMatch(directPreview,/الخطة العلاجية/);

const remedial={classification:{type:'خطة',subtype:'خطة علاجية'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{directEntry128:'remedial',schoolName:'مدرسة حطين المتوسطة',educationOffice:'تعليم نجران',academicYear:'1448هـ',familyMeta111:{section:'ب',startDate:'1448/02/01',endDate:'1448/02/15'},familyDetails:{subject94:'اللغة العربية',targetStudents128:'أحمد، خالد',basis:'نتائج اختبار تشخيصي',goal:'رفع مستوى الإتقان',method:'إعادة تدريس المهارة|||تدريب وتطبيق متدرج',follow:'إعادة قياس المهارة',owner:'معلم أو مجموعة معلمين'}},answers:{goals:[],evidence:[]},attachments:[]};
const p=standaloneStudentPlanModel128(remedial);
assert.equal(p.id,'remedial');assert.equal(p.target,'أحمد، خالد');
assert.match(standaloneStudentPlanPdf128(remedial),/خطة مستقلة/);
assert.match(standaloneStudentPlanPdf128(remedial),/أحمد، خالد/);
assert.doesNotMatch(standaloneStudentPlanPdf128(remedial),/تحسن.*حقق/,'الخطة المستقلة لا تدعي أثرًا محققًا');
assert.match(studentPlanTargetPanel128(remedial),/data-family-field="targetStudents128"/);

const home=landing();for(const id of ['classification','remedial','enrichment'])assert.match(home,new RegExp(`data-entry="${id}"`),`الرئيسية يجب أن تعرض ${id}`);
assert.ok(ENTRY.classification&&ENTRY.remedial&&ENTRY.enrichment);
assert.equal(INTENT_TO_TYPE.classification,'تحليل نتائج');assert.equal(INTENT_TO_TYPE.remedial,'خطة');assert.equal(INTENT_TO_TYPE.enrichment,'خطة');

console.log('V128 analysis output pack PASS: one input -> selected outputs, four-page analysis pack, direct classification, and standalone student plans.');
