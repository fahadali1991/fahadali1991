import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisOutputModel133,analysisOutputPanel133,analysisOutputPreview133} from './v10/analysis-output133.js';
import {analysisFinalPanel133} from './v10/analysis-final133.js';

function state({criterion='80',assessmentType='اختبار تشخيصي',scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله']}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة',executorName:'معلم اللغة العربية',analysis:{maxScore:'20',masteryPercent:criterion,scores,names,rawRows:'',entryMode:'paste'},familyMeta111:{assessmentType,period:'الفصل الدراسي الأول',section:'ب'},familyDetails:{subject94:'اللغة العربية',skillFocus:'المذكر والمؤنث'}}};
}

// V133 stays as a tested restore point even though V134 is now the current UI candidate.
const s=state();
let m=analysisOutputModel133(s);
assert.equal(m.ready,true);
assert.equal(m.selection.classification,false);
assert.equal(m.totalPages,1);
assert.deepEqual(m.pages.map(x=>x.id),['analysis']);
assert.equal(m.available.remedial.targetCount,4);
assert.equal(m.available.enrichment.targetCount,4);
let preview=analysisOutputPreview133(s);
assert.match(preview,/تحليل نتائج الطلاب/);
assert.match(preview,/متوسط الشعبة/);
assert.match(preview,/الوسيط/);
assert.match(preview,/القراءة المهنية/);
assert.match(preview,/أولوية التحسين/);
assert.match(preview,/المتابعة وإعادة القياس/);
assert.match(preview,/2-2-1-3/);
assert.match(preview,/لا يستنتج النظام من الدرجة الكلية وحدها سبب الضعف/);
assert.doesNotMatch(preview,/تصنيف الطلاب[\s\S]*الطالب[\s\S]*أحمد/);

s.metadata.analysisOutput133={classification:true,remedial:true,enrichment:true};
m=analysisOutputModel133(s);
assert.equal(m.totalPages,4);
assert.deepEqual(m.pages.map(x=>x.id),['analysis','classification-1','remedial','enrichment']);
preview=analysisOutputPreview133(s);
assert.match(preview,/أحمد/);
assert.match(preview,/خطة علاجية/);
assert.match(preview,/خطة إثرائية/);
assert.match(preview,/المذكر والمؤنث/);

const noCriterion=state({criterion:''});
let neutral=analysisOutputModel133(noCriterion);
assert.equal(neutral.totalPages,1);
assert.equal(neutral.available.remedial,null);
assert.equal(neutral.available.enrichment,null);
const neutralPanel=analysisOutputPanel133(noCriterion);
assert.match(neutralPanel,/تحتاج محك أداء صريحًا/,'V133 historical wording is retained only in this restore-point model');
const neutralPreview=analysisOutputPreview133(noCriterion);
assert.match(neutralPreview,/غير محدد/);
assert.doesNotMatch(neutralPreview,/محقق للمحك|يحتاج دعمًا من خط الأساس/);
assert.doesNotMatch(neutralPreview,/analysisPlanPrint133|خطة علاجية مقترحة|خطة إثرائية مقترحة/);

const diagnostic=analysisFinalPanel133(state());
assert.doesNotMatch(diagnostic,/ناجح|راسب/);
assert.match(diagnostic,/إضافة تفسير مدعوم من المعلم/);
assert.match(diagnostic,/2-2-1-3/);
const supported=state();supported.metadata.familyDetails.cause='تكررت الأخطاء في تطبيق القاعدة داخل الجمل';supported.metadata.familyDetails.causeEvidence133='تحليل أخطاء إجابات الطلاب';
const supportedPrint=analysisOutputPreview133(supported);
assert.match(supportedPrint,/تفسير مدعوم من المعلم/);
assert.match(supportedPrint,/تكررت الأخطاء/);
assert.match(supportedPrint,/تحليل أخطاء إجابات الطلاب/);
const unsupported=state();unsupported.metadata.familyDetails.cause='سبب غير موثق';
assert.doesNotMatch(analysisOutputPreview133(unsupported),/سبب غير موثق/);

const manyScores=Array.from({length:40},(_,i)=>10+(i%11));
const manyNames=Array.from({length:40},(_,i)=>`طالب ${i+1}`);
const many=state({scores:manyScores,names:manyNames});many.metadata.analysisOutput133={classification:true,remedial:false,enrichment:false};
const manyModel=analysisOutputModel133(many);
assert.equal(manyModel.totalPages,3);
assert.deepEqual(manyModel.pages.map(x=>x.id),['analysis','classification-1','classification-2']);

const router=fs.readFileSync('v10/question-router106.js','utf8');
assert.match(router,/'تحليل نتائج':\['basis','finding'\]/,'لا تسأل Analysis عن السبب/الإجراء قبل إظهار النتيجة');
assert.doesNotMatch(router,/'تحليل نتائج':\[[^\]]*cause/);
const details=fs.readFileSync('v10/family-details106.js','utf8');
assert.match(details,/data-action="finalize">عرض تحليل النتائج/);
assert.match(details,/لن يطلب النظام أهدافًا أو عنوانًا أو تفسيرًا قبل أن يعرض لك النتيجة/);
const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysis-output134\.js\?v=134/,'V134 supersedes V133 in the teacher-facing final screen');
assert.match(final76,/analysisFinalPanel134\(s\)\+analysisOutputPanel134\(s\)/);
const outputSource=fs.readFileSync('v10/analysis-output133.js','utf8');
assert.match(outputSource,/padding:15mm 15mm 11mm/,'V133 restore point keeps formal 15mm print margins');
assert.match(outputSource,/classification=false/);
assert.doesNotMatch(outputSource,/sessionStorage|localStorage/);
const output134=fs.readFileSync('v10/analysis-output134.js','utf8');
assert.match(output134,/padding:15mm 15mm 11mm/,'V134 current output also keeps formal 15mm margins');

console.log('V133 historical Analysis flow PASS beneath V134 current UI: safety, fast route, supported interpretation and restore-point print remain protected.');
