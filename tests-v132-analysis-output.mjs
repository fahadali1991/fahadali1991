import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisOutputModel132,analysisOutputPanel132,analysisOutputPreview132} from './v10/analysis-output132-release.js';

function state({criterion='80',scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله'],expectedCount=''}={}){
 const familyMeta111={assessmentType:'اختبار تشخيصي',period:'الفصل الدراسي الأول',section:'ب'};if(expectedCount)familyMeta111.expectedCount=String(expectedCount);
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة',executorName:'معلم اللغة العربية',analysis:{maxScore:'20',masteryPercent:criterion,scores,names,rawRows:'',entryMode:'paste'},familyMeta111,familyDetails:{subject94:'اللغة العربية',skillFocus:'المذكر والمؤنث'}}};
}

const s=state();
let m=analysisOutputModel132(s);
assert.equal(m.ready,true);
assert.equal(m.decision.high,20,'الحزمة يجب أن تعرض أعلى درجة من الإدخال نفسه');
assert.equal(m.decision.low,12,'الحزمة يجب أن تعرض أدنى درجة من الإدخال نفسه');
assert.equal(m.available.criterion.defined,true);
assert.equal(m.available.remedial.targetCount,4);
assert.equal(m.available.enrichment.targetCount,4);
assert.equal(m.selection.classification,true);
assert.equal(m.selection.remedial,false);
assert.equal(m.selection.enrichment,false);
assert.equal(m.totalPages,2,'V132 التاريخية: صفحة تحليل + صفحة تصنيف واحدة');
assert.deepEqual(m.pages.map(x=>x.id),['analysis','classification-1']);

s.metadata.analysisOutput132.remedial=true;
s.metadata.analysisOutput132.enrichment=true;
m=analysisOutputModel132(s);
assert.equal(m.totalPages,4,'V132 التاريخية: عند اختيار الخطتين تصبح الحزمة أربع صفحات');
assert.deepEqual(m.pages.map(x=>x.id),['analysis','classification-1','remedial','enrichment']);
const preview=analysisOutputPreview132(s);
assert.match(preview,/ملخص التحليل والقرار التربوي/);
assert.match(preview,/تصنيف الطلاب والقرار التربوي/);
assert.match(preview,/خطة علاجية مقترحة/);
assert.match(preview,/خطة إثرائية مقترحة/);
assert.match(preview,/أحمد/);
assert.match(preview,/محمد/);
assert.match(preview,/المذكر والمؤنث/);
assert.match(preview,/أعلى درجة[\s\S]{0,80}<b>20<\/b>/);
assert.match(preview,/أدنى درجة[\s\S]{0,80}<b>12<\/b>/);
assert.match(preview,/اعتماد مدير المدرسة[\s\S]{0,100}مدير المدرسة/);
assert.match(preview,/إعداد \/ تنفيذ[\s\S]{0,100}معلم اللغة العربية/);
assert.match(preview,/لا يسجل تحسن أو أثر إلا بعد ظهور نتيجة القياس اللاحق/);

const mismatch=state({expectedCount:'12'});
const mismatchPreview=analysisOutputPreview132(mismatch);
assert.match(mismatchPreview,/تحقق من اكتمال الدرجات/);
assert.match(mismatchPreview,/12|10|ناقص|درجة/);

const noCriterion=state({criterion:''});
noCriterion.metadata.analysisOutput132={classification:true,remedial:true,enrichment:true};
const neutral=analysisOutputModel132(noCriterion);
assert.equal(neutral.available.criterion.defined,false);
assert.equal(neutral.available.remedial,null);
assert.equal(neutral.available.enrichment,null);
assert.equal(neutral.totalPages,2,'V132 لا تضيف خططًا حتى لو بقي اختيار قديم دون محك');
const neutralPanel=analysisOutputPanel132(noCriterion);
assert.match(neutralPanel,/تحتاج محك أداء صريحًا/);
const neutralPreview=analysisOutputPreview132(noCriterion);
assert.match(neutralPreview,/محك الأداء/);
assert.match(neutralPreview,/غير محدد/);
assert.doesNotMatch(neutralPreview,/محقق للمحك|يحتاج دعمًا من خط الأساس|خطة علاجية مقترحة|خطة إثرائية مقترحة/);
assert.doesNotMatch(neutralPreview,/محك الأداء[\s\S]{0,100}<b>70٪<\/b>/);

const manyScores=Array.from({length:40},(_,i)=>10+(i%11));
const manyNames=Array.from({length:40},(_,i)=>`طالب ${i+1}`);
const many=state({scores:manyScores,names:manyNames});
const manyModel=analysisOutputModel132(many);
assert.equal(manyModel.totalPages,4);
assert.deepEqual(manyModel.pages.map(x=>x.id),['analysis','classification-1','classification-2','classification-3']);

// V133 intentionally supersedes V132 in the user-facing final screen, while this test keeps
// V132's historical model/safety regression intact as a restore point.
const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysis-output133\.js\?v=133/,'V133 should supersede V132 in the current Analysis final screen');
assert.doesNotMatch(final76,/analysisOutputPanel132/,'do not stack the old V132 panel under V133');
const source132=fs.readFileSync('v10/analysis-output132.js','utf8');
assert.match(source132,/export function analysisOutputModel132/,'V132 model remains available as a tested restore point');
const css132=fs.readFileSync('v10/analysis-output132.css','utf8');
assert.match(css132,/bundlePageNo132\{[^}]*direction:ltr/,'V132 RTL-safe page numbering regression remains protected');

console.log('V132 historical analysis output regression PASS: model safety and restore-point behavior remain intact while V133 supersedes the final screen.');
