import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisDecisionModel127,analysisDecisionPanel127} from './v10/analysis-decision127.js';
import {analysisPlanTargets125} from './v10/analysis-plans125.js';

function state({scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله'],mastery='80'}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:mastery,scores,names},familyDetails:{subject94:'اللغة العربية'}}};
}

const s=state();
const m=analysisDecisionModel127(s);
assert.equal(m.ready,true);
assert.equal(m.total,10);
assert.equal(m.groupMap.support.count,4,'كل من هو دون حد الإتقان يدخل يحتاج دعمًا');
assert.deepEqual(m.groupMap.support.students.map(x=>x.name),['أحمد','خالد','حسن','سلمان']);
assert.equal(m.groupMap.mastered.count,2,'من حد الإتقان إلى أقل من حد الإثراء محقق للإتقان');
assert.deepEqual(m.groupMap.mastered.students.map(x=>x.name),['سعد','ماجد']);
assert.equal(m.groupMap.advanced.count,4,'90٪ فأعلى عند حد إتقان 80٪ متقدم للإثراء');
assert.deepEqual(m.groupMap.advanced.students.map(x=>x.name),['محمد','علي','ناصر','عبدالله']);
assert.equal(m.groups.reduce((n,g)=>n+g.count,0),10,'لا يتداخل أي طالب بين الفئات الثلاث');

const plans=analysisPlanTargets125(s);
assert.equal(plans.remedial.count,m.groupMap.support.count,'الخطة العلاجية يجب أن تطابق فئة يحتاج دعمًا');
assert.equal(plans.enrichment.count,m.groupMap.advanced.count,'الخطة الإثرائية يجب أن تطابق فئة متقدم للإثراء');

const strict=analysisDecisionModel127(state({scores:[18.5,19.2],names:['سالم','علي'],mastery:'95'}));
assert.equal(strict.enrichmentThreshold,95);
assert.equal(strict.groupMap.support.count,1,'92.5٪ تبقى يحتاج دعمًا عندما حد الإتقان 95٪');
assert.equal(strict.groupMap.advanced.count,1);
assert.equal(strict.groupMap.mastered.count,0);
assert.equal(strict.groups.reduce((n,g)=>n+g.count,0),2);

const relative=analysisDecisionModel127(state({scores:[10,15,20],names:['أ','ب','ج'],mastery:'70'}));
assert.equal(relative.students[0].relativeLabel,'أقل من متوسط الشعبة');
assert.equal(relative.students[1].relativeLabel,'عند متوسط الشعبة');
assert.equal(relative.students[2].relativeLabel,'أعلى من متوسط الشعبة');
assert.equal(relative.students[0].gradeLabel,'مقبول');
assert.equal(relative.students[2].gradeLabel,'ممتاز');

const unnamed=analysisDecisionPanel127(state({scores:[12,18],names:['','']}));
assert.match(unnamed,/الطالب رقم 1/);
assert.match(unnamed,/الطالب رقم 2/);
assert.match(unnamed,/يحتاج دعمًا/);
assert.match(unnamed,/محقق للإتقان/);
assert.match(unnamed,/متقدم للإثراء/);
assert.match(unnamed,/تفاصيل التصنيف/);
assert.match(unnamed,/متوسط الشعبة/);
assert.doesNotMatch(unnamed,/بصري|سمعي|حركي/,'لا يجوز استنتاج نمط تعلم من الدرجات');

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisDecisionPanel130/,'واجهة القرار النهائية يجب أن تمر عبر طبقة السياسة V130');
assert.ok(final76.indexOf('decision+plans')>=0,'التصنيف يجب أن يظل قبل الخطط');
assert.doesNotMatch(final76,/analysisStudentLevelsPanel126/,'واجهة V126 المزدحمة لا ينبغي أن تعود إلى الشاشة النهائية');

console.log('V127 analysis decision regression PASS: legacy score grouping remains stable beneath the V130 policy-aware UI.');
