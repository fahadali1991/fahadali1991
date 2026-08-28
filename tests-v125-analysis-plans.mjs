import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisPlanTargets125,analysisPlanModels125,analysisPlansPanel125,analysisPlanSheet125} from './v10/analysis-plans125.js';

function state({scores=[15,16,18,19],names=['أحمد','خالد','محمد','فهد'],mastery='80',skill=''}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة',executorName:'معلم المادة',analysis:{maxScore:'20',masteryPercent:mastery,scores,names,rawRows:'',invalid:[]},familyMeta111:{assessmentType:'اختبار تشخيصي',period:'الفصل الدراسي الأول'},familyDetails:{subject94:'اللغة العربية',...(skill?{skillFocus:skill}:{})}}};
}

const s=state();
const targets=analysisPlanTargets125(s);
assert.equal(targets.remedial.count,1,'العلاج يجب أن يستهدف من هم دون حد الإتقان فقط');
assert.deepEqual(targets.remedial.names,['أحمد']);
assert.equal(targets.enrichment.count,2,'الإثراء يجب أن يستهدف المستوى المتقدم فقط');
assert.deepEqual(targets.enrichment.names,['محمد','فهد']);

const plans=analysisPlanModels125(s);
const remedial=plans.find(x=>x.id==='remedial');
const enrichment=plans.find(x=>x.id==='enrichment');
assert.equal(remedial.targetCount,1);
assert.equal(enrichment.targetCount,2);
assert.match(remedial.reason,/دون حد الإتقان المعتمد \(80٪\)/);
assert.match(enrichment.reason,/90٪/);
assert.match(remedial.objective,/المهارات التي يقيسها الاختبار/,'لا يجوز اختراع مهارة عند عدم إدخالها');
assert.doesNotMatch(JSON.stringify(plans),/الفهم القرائي|المذكر والمؤنث|الكسور/,'لا يحق للمحرك اختراع مهارة غير مدخلة');
assert.match(remedial.follow,/لا يسجل تحسن أو أثر إلا بعد ظهور نتيجة القياس اللاحق/);
assert.match(enrichment.follow,/تنفيذ النشاط وحده لا يعد دليلًا على أثر إثرائي/);

const skilled=state({skill:'المذكر والمؤنث'});
const skilledPlans=analysisPlanModels125(skilled);
assert.ok(skilledPlans.every(x=>`${x.objective} ${x.actions.join(' ')}`.includes('المذكر والمؤنث')),'المهارة المدخلة يجب أن تنتقل إلى الخطط');

const highMastery=state({scores:[18.5,19.2],names:['سالم','علي'],mastery:'95'});
const strictTargets=analysisPlanTargets125(highMastery);
assert.equal(strictTargets.remedial.count,1,'92.5٪ أقل من حد إتقان 95٪ ويجب أن تبقى علاجية');
assert.equal(strictTargets.enrichment.count,1,'الإثراء لا يتداخل مع العلاج عندما يكون حد الإتقان أعلى من 90٪');
assert.deepEqual(strictTargets.remedial.names,['سالم']);
assert.deepEqual(strictTargets.enrichment.names,['علي']);

const noNames=state({names:['','','','']});
const noNamesPlans=analysisPlanModels125(noNames);
assert.match(noNamesPlans[0].targetText,/طالب واحد/);
assert.doesNotMatch(noNamesPlans[0].targetText,/أحمد|خالد|محمد|فهد/);

const panel=analysisPlansPanel125(s);
assert.match(panel,/الخطط المقترحة بناءً على نتائج التحليل/);
assert.match(panel,/إنشاء الخطة العلاجية/);
assert.match(panel,/إنشاء الخطة الإثرائية/);
assert.match(panel,/طالب واحد/);
assert.match(panel,/طالبان/);

const sheet=analysisPlanSheet125(skilled,'remedial');
assert.match(sheet,/خطة علاجية مقترحة/);
assert.match(sheet,/أحمد/);
assert.doesNotMatch(sheet,/محمد|فهد/,'الخطة العلاجية لا تدرج أسماء الفئة الإثرائية');
assert.match(sheet,/المذكر والمؤنث/);
assert.match(sheet,/مقترحة ولم تُنفذ بعد/);

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisPlansPanel125/,'يجب أن تظهر الخطط في الشاشة النهائية لتحليل النتائج');
assert.match(final76,/bindAnalysisPlans125/,'يجب ربط زر إنشاء الخطة بحالة التحليل الحالية');

console.log('V125 analysis plans PASS: actual-score targeting, optional names, no invented skill, disjoint remedial/enrichment, and no false impact claim.');
