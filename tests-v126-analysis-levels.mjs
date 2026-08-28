import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisStudentLevels126,analysisStudentLevelsPanel126} from './v10/analysis-levels126.js';

function state({scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله'],mastery='80'}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:mastery,scores,names},familyDetails:{subject94:'اللغة العربية'}}};
}

const model=analysisStudentLevels126(state());
assert.equal(model.ready,true);
assert.equal(model.total,10);

assert.equal(model.performanceMap.excellent.count,4,'90٪ فأعلى = ممتاز');
assert.equal(model.performanceMap.verygood.count,2,'80٪ إلى أقل من 90٪ = جيد جدًا');
assert.equal(model.performanceMap.good.count,2,'70٪ إلى أقل من 80٪ = جيد');
assert.equal(model.performanceMap.pass.count,2,'50٪ إلى أقل من 70٪ = مقبول');
assert.equal(model.performanceMap.weak.count,0,'أقل من 50٪ = ضعيف');
assert.equal(model.performanceLevels.reduce((n,x)=>n+x.count,0),10,'كل طالب يجب أن يظهر في مستوى أداء وصفي واحد فقط');

assert.equal(model.decisionMap.enrichment.count,4,'90٪ فأعلى مع حد إتقان 80٪ = إثراء وتميز');
assert.deepEqual(model.decisionMap.enrichment.students.map(x=>x.name),['محمد','علي','ناصر','عبدالله']);
assert.equal(model.decisionMap.mastered.count,2,'من حد الإتقان إلى أقل من حد الإثراء = محقق للإتقان');
assert.deepEqual(model.decisionMap.mastered.students.map(x=>x.name),['سعد','ماجد']);
assert.equal(model.decisionMap.near.count,4,'من 50٪ إلى أقل من حد الإتقان = قريب من الإتقان');
assert.deepEqual(model.decisionMap.near.students.map(x=>x.name),['أحمد','خالد','حسن','سلمان']);
assert.equal(model.decisionMap.priority.count,0);
assert.equal(model.decisionLevels.reduce((n,x)=>n+x.count,0),10,'كل طالب يجب أن يظهر في فئة قرار واحدة فقط');

const ahmed=model.students.find(x=>x.name==='أحمد');
assert.equal(ahmed.performanceLabel,'مقبول');
assert.equal(ahmed.decisionLabel,'قريب من الإتقان','مستوى الأداء وفئة القرار مفهومان مختلفان ولا يجوز خلطهما');

const low=analysisStudentLevels126(state({scores:[8,12,16,19],names:['أ','ب','ج','د']}));
assert.equal(low.performanceMap.weak.count,1);
assert.equal(low.decisionMap.priority.count,1,'أقل من 50٪ = أولوية للتدخل عند حد إتقان 80٪');
assert.equal(low.decisionMap.near.count,1);
assert.equal(low.decisionMap.mastered.count,1);
assert.equal(low.decisionMap.enrichment.count,1);

const strict=analysisStudentLevels126(state({scores:[18.5,19.2],names:['سالم','علي'],mastery:'95'}));
assert.equal(strict.enrichmentThreshold,95);
assert.equal(strict.performanceMap.excellent.count,2,'الوصف التقليدي يبقى ممتازًا لكلا الدرجتين');
assert.equal(strict.decisionMap.near.count,1,'92.5٪ ممتاز وصفيًا لكنه دون حد إتقان 95٪ ويبقى في فئة تدخل');
assert.equal(strict.decisionMap.enrichment.count,1);
assert.equal(strict.decisionMap.mastered.count,0);
assert.equal(strict.decisionLevels.reduce((n,x)=>n+x.count,0),2,'لا يجوز تداخل فئات القرار عند حد إتقان مرتفع');

const unnamed=state({scores:[8,18],names:['','']});
const html=analysisStudentLevelsPanel126(unnamed);
assert.match(html,/الطالب رقم 1/,'إذا غاب الاسم يستخدم ترتيب الإدخال بدل اختراع اسم');
assert.match(html,/الطالب رقم 2/);
assert.match(html,/تصنيف الطلاب حسب مستوياتهم/);
assert.match(html,/مستويات الأداء/);
assert.match(html,/ممتاز/);
assert.match(html,/جيد جدًا/);
assert.match(html,/جيد/);
assert.match(html,/مقبول/);
assert.match(html,/ضعيف/);
assert.match(html,/فئات القرار التربوي/);
assert.match(html,/قريب من الإتقان/);
assert.match(html,/أولوية للتدخل/);
assert.match(html,/مستوى الأداء الوصفي فلا يُستخدم وحده لاتخاذ قرار علاجي أو إثرائي/);

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisStudentLevelsPanel126/,'التصنيف يجب أن يظهر في النتيجة النهائية قبل الخطط');
assert.ok(final76.indexOf('levels+plans')>=0,'يجب أن يظهر التصنيف قبل الخطط المقترحة');

console.log('V126 analysis student classification PASS: five performance levels + four disjoint decision bands, per-student rows, high-mastery safety, and final-screen integration.');
