import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisOutputModel134,analysisOutputPanel134,analysisOutputPreview134,analysisFinalPanel134} from './v10/analysis-output134.js';
import {regulatorySuccessNote134} from './v10/evaluation-regulations134.js';
import {targetLevelDisplay134} from './v10/analysis-target-level134.js';
import {understand84} from './v10/engine84.js';
import {analyze101} from './v10/intelligence101-runtime.js';

function state({criterion='80',criterionMode='percent',criterionScore='',scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله'],assessmentType='اختبار تشخيصي',stage='متوسط',grade='الأول',subject='اللغة العربية',scope='single_assessment',direct='analysis',maxScore='20'}={}){
 return {classification:{type:'تحليل نتائج'},stage,grades:[grade],metadata:{directEntry134:direct,schoolName:'مدرسة حطين المتوسطة',educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة',executorName:'معلم اللغة العربية',analysis:{maxScore,masteryPercent:criterion,criterionMode134:criterionMode,criterionScore134:criterionScore,resultScope134:scope,scores,names,rawRows:'',entryMode:'paste'},familyMeta111:{assessmentType,period:'الفصل الدراسي الأول',section:'ب'},familyDetails:{subject94:subject,skillFocus:'المذكر والمؤنث'}}};
}

const s=state();
let model=analysisOutputModel134(s);
assert.equal(model.ready,true);
assert.equal(model.mode,'analysis');
assert.equal(model.totalPages,1,'analysis starts with one core page only');
let html=analysisOutputPreview134(s)+analysisFinalPanel134(s)+analysisOutputPanel134(s);
assert.match(html,/مستوى الإتقان المستهدف/);
assert.match(html,/المستوى الحالي|مستوى الأداء|النتائج/);
assert.doesNotMatch(html,/(^|[>\s])المحك([<\s]|$)|خط الأساس/,'teacher-facing V134 output must not use legacy technical wording');
assert.match(html,/قراءة مهنية للنتائج/);
assert.match(html,/أولوية التحسين/);
assert.match(html,/الإجراء المقترح/);
assert.match(html,/المتابعة وإعادة القياس/);
assert.match(html,/توزيع مستويات الأداء/);

s.metadata.analysisOutput134={classification:true,remedial:true,enrichment:true};
model=analysisOutputModel134(s);
assert.deepEqual(model.pages.map(x=>x.id),['analysis','classification-1','remedial','enrichment']);
assert.equal(model.totalPages,4);
html=analysisOutputPreview134(s);
assert.match(html,/تصنيف الطلاب حسب مستوياتهم/);
assert.match(html,/الخطة العلاجية/);
assert.match(html,/الخطة الإثرائية/);
assert.match(html,/معدة للتنفيذ - لم تُنفذ بعد/);
assert.match(html,/المذكر والمؤنث/);
assert.doesNotMatch(html,/أثبتت النتائج تحسن|تحسن الطلاب بعد تنفيذ|حقق التدخل أثرًا|أثبتت الخطة أثرًا/,'V134 must not make a positive impact claim before remeasurement');
assert.match(html,/لا (?:يسجل|يثبت)[^.<]{0,80}(?:تحسن|أثر)/,'V134 should explicitly protect against premature impact claims');

const scoreTarget=state({criterion:'80',criterionMode:'score',criterionScore:'16'});
assert.equal(targetLevelDisplay134(scoreTarget),'16 من 20 (80٪)');
assert.match(analysisOutputPreview134(scoreTarget),/16 من 20 \(80٪\)/);

const neutral=state({criterion:'',criterionMode:'none'});
neutral.metadata.analysisOutput134={classification:true,remedial:true,enrichment:true};
model=analysisOutputModel134(neutral);
assert.equal(model.criterion.defined,false);
assert.deepEqual(model.pages.map(x=>x.id),['analysis','classification-1']);
html=analysisOutputPreview134(neutral);
assert.match(html,/غير محدد/);
assert.doesNotMatch(html,/الخطة العلاجية|الخطة الإثرائية/);
assert.doesNotMatch(html,/(^|[>\s])المحك([<\s]|$)|خط الأساس/);

const systemResult=state({criterion:'',criterionMode:'none',scope:'subject_period',assessmentType:'اختبار نهائي',maxScore:'100',scores:[60,70,80,90],names:['أ','ب','ج','د']});
const reg=regulatorySuccessNote134(systemResult);
assert.equal(reg.applies,true);
assert.match(reg.summary,/الأول متوسط/);
assert.match(reg.summary,/اللغة العربية/);
assert.match(reg.summary,/50 درجة من 100/);
assert.ok(reg.requirements.some(x=>/8 درجات من 40/.test(x)));
assert.match(reg.source.title,/الإجراءات التنفيذية/);
assert.equal(regulatorySuccessNote134(state()).applies,false,'single assessment must not receive system pass/fail rule');

for(const direct of ['classification','remedial','enrichment']){
 const x=state({direct});
 const mm=analysisOutputModel134(x);
 assert.equal(mm.ready,true);
 assert.equal(mm.pages.length,1,`${direct} direct route should print one standalone document`);
 assert.equal(mm.pages[0].id,direct==='classification'?'classification-1':direct);
 const out=analysisOutputPanel134(x);
 assert.match(out,/إخراج مستقل/);
 assert.doesNotMatch(out,/صفحة التحليل الأساسية ثابتة/);
}

for(const phrase of ['حللت اختبار الفترة','سويت تحليل نتيجة الاختبار','حللت نتايج الطلاب','راجعت النتائج']){
 const u=understand84(phrase);
 assert.equal(u.primary,'تحليل نتائج',`must understand: ${phrase}`);
}
const directClassification=analyze101('أبي أصنف طلاب أول متوسط','classification');
assert.equal(directClassification.classification.type,'تحليل نتائج');
assert.equal(directClassification.metadata.directEntry134,'classification');
const directRemedial=analyze101('أبي خطة علاجية للطلاب','remedial');
assert.equal(directRemedial.classification.type,'تحليل نتائج');
assert.equal(directRemedial.metadata.directEntry134,'remedial');
const directEnrichment=analyze101('خطة إثرائية','enrichment');
assert.equal(directEnrichment.classification.type,'تحليل نتائج');
assert.equal(directEnrichment.metadata.directEntry134,'enrichment');

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysis-output134\.js\?v=134/);
assert.match(final76,/analysisFinalPanel134/);
assert.match(final76,/analysisOutputPanel134/);
assert.doesNotMatch(final76,/analysisFinalPanel133|analysisOutputPanel133/);
const family109=fs.readFileSync('v10/family-details109.js','utf8');
assert.match(family109,/analysis-context134\.js\?v=134/);
assert.match(family109,/analysis-target-level134\.js\?v=134/);

console.log('V134 field-language analysis PASS: terminology, natural-language routing, target score/percent, regulations, full bundle and standalone outputs.');
