import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisOutputModel132,analysisOutputPanel132,analysisOutputPreview132} from './v10/analysis-output132.js';

function state({criterion='80',scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله']}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة',executorName:'معلم اللغة العربية',analysis:{maxScore:'20',masteryPercent:criterion,scores,names,rawRows:'',entryMode:'paste'},familyMeta111:{assessmentType:'اختبار تشخيصي',period:'الفصل الدراسي الأول',section:'ب'},familyDetails:{subject94:'اللغة العربية',skillFocus:'المذكر والمؤنث'}}};
}

const s=state();
let m=analysisOutputModel132(s);
assert.equal(m.ready,true);
assert.equal(m.available.criterion.defined,true);
assert.equal(m.available.remedial.targetCount,4);
assert.equal(m.available.enrichment.targetCount,4);
assert.equal(m.selection.classification,true);
assert.equal(m.selection.remedial,false);
assert.equal(m.selection.enrichment,false);
assert.equal(m.totalPages,2,'الافتراضي: صفحة تحليل + صفحة تصنيف واحدة');
assert.deepEqual(m.pages.map(x=>x.id),['analysis','classification-1']);

s.metadata.analysisOutput132.remedial=true;
s.metadata.analysisOutput132.enrichment=true;
m=analysisOutputModel132(s);
assert.equal(m.totalPages,4,'عند اختيار الخطتين تصبح الحزمة أربع صفحات في السيناريو القياسي');
assert.deepEqual(m.pages.map(x=>x.id),['analysis','classification-1','remedial','enrichment']);
const preview=analysisOutputPreview132(s);
assert.match(preview,/ملخص التحليل والقرار التربوي/);
assert.match(preview,/تصنيف الطلاب والقرار التربوي/);
assert.match(preview,/خطة علاجية مقترحة/);
assert.match(preview,/خطة إثرائية مقترحة/);
assert.match(preview,/أحمد/);
assert.match(preview,/محمد/);
assert.match(preview,/المذكر والمؤنث/);
assert.match(preview,/لا يسجل تحسن أو أثر إلا بعد ظهور نتيجة القياس اللاحق/);

const noCriterion=state({criterion:''});
noCriterion.metadata.analysisOutput132={classification:true,remedial:true,enrichment:true};
const neutral=analysisOutputModel132(noCriterion);
assert.equal(neutral.available.criterion.defined,false);
assert.equal(neutral.available.remedial,null);
assert.equal(neutral.available.enrichment,null);
assert.equal(neutral.totalPages,2,'لا تضاف خطط حتى لو بقي اختيار قديم محفوظًا دون محك');
const neutralPanel=analysisOutputPanel132(noCriterion);
assert.match(neutralPanel,/تحتاج محك أداء صريحًا/);
const neutralPreview=analysisOutputPreview132(noCriterion);
assert.match(neutralPreview,/محك الأداء/);
assert.match(neutralPreview,/غير محدد/);
assert.doesNotMatch(neutralPreview,/محقق للمحك|يحتاج دعمًا من خط الأساس|خطة علاجية مقترحة|خطة إثرائية مقترحة/);
assert.doesNotMatch(neutralPreview,/محك الأداء[\s\S]{0,100}<b>70٪<\/b>/,'لا يجوز عودة 70٪ بوصفها محكًا افتراضيًا؛ ظهور 70٪ كنسبة طالب حقيقية مسموح');

const manyScores=Array.from({length:40},(_,i)=>10+(i%11));
const manyNames=Array.from({length:40},(_,i)=>`طالب ${i+1}`);
const many=state({scores:manyScores,names:manyNames});
const manyModel=analysisOutputModel132(many);
assert.equal(manyModel.totalPages,4,'40 طالبًا => تحليل + ثلاث صفحات تصنيف بحد أقصى 18 طالبًا في الصفحة');
assert.deepEqual(manyModel.pages.map(x=>x.id),['analysis','classification-1','classification-2','classification-3']);

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisOutputPanel132/,'الشاشة النهائية يجب أن تمر عبر حزمة V132 لتحليل النتائج');
assert.match(final76,/isAnalysis\?analysisOutputPanel132/,'حزمة V132 لا تستبدل طباعة بقية العائلات');
assert.match(final76,/bindAnalysisOutput132/);
const css132=fs.readFileSync('v10/analysis-output132.css','utf8');
assert.match(css132,/bundlePageNo132\{[^}]*direction:ltr/,'ترقيم الصفحات يجب أن يبقى LTR داخل المستند العربي');
const home=fs.readFileSync('home106.html','utf8');
assert.match(home,/analysis-output132\.css\?v=132/,'الواجهة الفعلية يجب أن تحمل إصلاح ترقيم صفحات V132');

console.log('V132 analysis output bundle PASS: selectable classification/plans, no fake criterion, paginated students, RTL-safe numbering, and analysis-only integration.');
