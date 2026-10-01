import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisDecisionModel130,analysisDecisionPanel130} from './v10/analysis-decision130.js';

function state({scores=[12,15,16,18,19,20,14,17,13,18],names=['أحمد','خالد','سعد','محمد','علي','ناصر','حسن','ماجد','سلمان','عبدالله'],mastery='80',assessmentType='اختبار تشخيصي',stage='متوسط',grade='الأول المتوسط',subject='اللغة العربية'}={}){
 return {classification:{type:'تحليل نتائج'},stage,grades:[grade],metadata:{analysis:{maxScore:'20',masteryPercent:mastery,scores,names},familyMeta111:{assessmentType},familyDetails:{subject94:subject}}};
}

const diagnostic=analysisDecisionModel130(state());
assert.equal(diagnostic.ready,true);
assert.equal(diagnostic.policy.purpose,'diagnostic');
assert.equal(diagnostic.systemGradeEnabled,false,'اختبار تشخيصي منفرد لا يأخذ تقدير المادة النظامي');
assert.equal(diagnostic.groupMap.support.count,4);
assert.equal(diagnostic.cohort.band,'differentiate','6 من 10 حققوا مستوى الإتقان المستهدف => تعليم متمايز');
assert.equal(Math.round(diagnostic.cohort.rate),60);
assert.match(diagnostic.students.find(x=>x.name==='أحمد').decisionLabel130,/يحتاج دعمًا/);
assert.match(diagnostic.students.find(x=>x.name==='محمد').decisionLabel130,/مرشح للإثراء/);

// V130 keeps its historical rendering regression; the current teacher-facing wording is V134.
const diagnosticHtml=analysisDecisionPanel130(state());
assert.match(diagnosticHtml,/القراءة التشخيصية/);
assert.match(diagnosticHtml,/لا تُعرض كنجاح أو رسوب/);
assert.match(diagnosticHtml,/تعليم متمايز/);
assert.match(diagnosticHtml,/لا يطبّق على هذا الاختبار المنفرد/);
assert.doesNotMatch(diagnosticHtml,/ممتاز|جيد جدًا|مقبول|راسب/,'لا يجوز تسريب سلم تقدير المادة إلى الاختبار التشخيصي المنفرد');
assert.doesNotMatch(diagnosticHtml,/بصري|سمعي|حركي/,'لا يجوز استنتاج نمط تعلم من الدرجات');

const eighty=analysisDecisionModel130(state({scores:[16,16,16,16,16,16,16,16,12,12],names:Array.from({length:10},(_,i)=>`ط${i+1}`),assessmentType:'تقويم تكويني'}));
assert.equal(eighty.cohort.band,'continue_targeted_support','80٪ من الطلاب حققوا المستوى المستهدف => استمرار مع دعم مستهدف');
const forty=analysisDecisionModel130(state({scores:[16,16,16,16,12,12,12,12,12,12],names:Array.from({length:10},(_,i)=>`ط${i+1}`),assessmentType:'تقويم تكويني'}));
assert.equal(forty.cohort.band,'reteach','أقل من 50٪ => إعادة تدريس أوسع');

const layer131=fs.readFileSync('v10/analysis-decision131.js','utf8');
assert.match(layer131,/analysisDecisionModel130/,'V130 يجب أن يبقى طبقة السياسة عند وجود مستوى مستهدف صريح');
const final133=fs.readFileSync('v10/analysis-final133.js','utf8');
const output133=fs.readFileSync('v10/analysis-output133.js','utf8');
assert.match(final133,/analysisDecisionModel131/,'V133 التاريخية تبقى طبقة استرجاع تمر عبر V131 ثم V130');
assert.match(output133,/analysisDecisionModel131/,'V133 التاريخية تبقى قابلة للاختبار كمرجع استرجاع');
const output134=fs.readFileSync('v10/analysis-output134.js','utf8');
assert.match(output134,/analysisDecisionModel131/,'V134 الحالية يجب أن تستخدم نموذج V131 الآمن فوق سياسة V130');
const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisFinalPanel134/,'V134 هي واجهة Analysis النهائية الحالية');
assert.match(final76,/analysisOutputPanel134/,'V134 هي حزمة الطباعة الحالية');
assert.doesNotMatch(final76,/analysisDecisionPanel127\(s\)/,'لا ينبغي أن تتجاوز الشاشة النهائية طبقات السياسة');

console.log('V130 analysis policy regression PASS beneath V131 safety model and V134 final/output integration.');
