import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisStudentLevels126,analysisStudentLevelsPanel126} from './v10/analysis-levels126.js';

function state({scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله'],mastery='80'}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:mastery,scores,names},familyDetails:{subject94:'اللغة العربية'}}};
}

const model=analysisStudentLevels126(state());
assert.equal(model.ready,true);
assert.equal(model.total,10);
assert.equal(model.levelMap.enrichment.count,4,'90٪ فأعلى مع حد إتقان 80٪ = إثراء وتميز');
assert.deepEqual(model.levelMap.enrichment.students.map(x=>x.name),['محمد','علي','ناصر','عبدالله']);
assert.equal(model.levelMap.mastered.count,2,'من 80٪ إلى أقل من 90٪ = محقق للإتقان');
assert.deepEqual(model.levelMap.mastered.students.map(x=>x.name),['سعد','ماجد']);
assert.equal(model.levelMap.near.count,4,'من 50٪ إلى أقل من حد الإتقان = قريب من الإتقان');
assert.deepEqual(model.levelMap.near.students.map(x=>x.name),['أحمد','خالد','حسن','سلمان']);
assert.equal(model.levelMap.priority.count,0);
assert.equal(model.levels.reduce((n,x)=>n+x.count,0),10,'كل طالب يجب أن يظهر في مستوى واحد فقط');

const low=analysisStudentLevels126(state({scores:[8,12,16,19],names:['أ','ب','ج','د']}));
assert.equal(low.levelMap.priority.count,1,'أقل من 50٪ = أولوية للتدخل');
assert.equal(low.levelMap.near.count,1);
assert.equal(low.levelMap.mastered.count,1);
assert.equal(low.levelMap.enrichment.count,1);

const strict=analysisStudentLevels126(state({scores:[18.5,19.2],names:['سالم','علي'],mastery:'95'}));
assert.equal(strict.enrichmentThreshold,95);
assert.equal(strict.levelMap.near.count,1,'92.5٪ دون حد إتقان 95٪ تبقى دون الإتقان');
assert.equal(strict.levelMap.enrichment.count,1);
assert.equal(strict.levelMap.mastered.count,0);
assert.equal(strict.levels.reduce((n,x)=>n+x.count,0),2,'لا يجوز تداخل المستويات عند حد إتقان مرتفع');

const unnamed=state({scores:[8,18],names:['','']});
const html=analysisStudentLevelsPanel126(unnamed);
assert.match(html,/الطالب رقم 1/,'إذا غاب الاسم يستخدم ترتيب الإدخال بدل اختراع اسم');
assert.match(html,/الطالب رقم 2/);
assert.match(html,/تصنيف الطلاب حسب مستوياتهم/);
assert.match(html,/قريب من الإتقان/);
assert.match(html,/أولوية للتدخل/);
assert.match(html,/الخطة العلاجية تستهدف جميع من هم دون حد الإتقان/);

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisStudentLevelsPanel126/,'التصنيف يجب أن يظهر في النتيجة النهائية قبل الخطط');
assert.ok(final76.indexOf('levels+plans')>=0,'يجب أن يظهر التصنيف قبل الخطط المقترحة');

console.log('V126 analysis student levels PASS: four disjoint levels, names/order fallback, high-mastery safety, and final-screen integration.');
