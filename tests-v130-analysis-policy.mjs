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
assert.equal(diagnostic.cohort.band,'differentiate','6 من 10 حققوا المحك => تعليم متمايز');
assert.equal(Math.round(diagnostic.cohort.rate),60);
assert.match(diagnostic.students.find(x=>x.name==='أحمد').decisionLabel130,/يحتاج دعمًا/);
assert.match(diagnostic.students.find(x=>x.name==='محمد').decisionLabel130,/مرشح للإثراء/);

const diagnosticHtml=analysisDecisionPanel130(state());
assert.match(diagnosticHtml,/القراءة التشخيصية/);
assert.match(diagnosticHtml,/خط أساس/);
assert.match(diagnosticHtml,/لا تُعرض كنجاح أو رسوب/);
assert.match(diagnosticHtml,/تعليم متمايز/);
assert.match(diagnosticHtml,/لا يطبّق على هذا الاختبار المنفرد/);
assert.doesNotMatch(diagnosticHtml,/ممتاز|جيد جدًا|مقبول|راسب/,'لا يجوز تسريب سلم تقدير المادة إلى الاختبار التشخيصي المنفرد');
assert.doesNotMatch(diagnosticHtml,/بصري|سمعي|حركي/,'لا يجوز استنتاج نمط تعلم من الدرجات');

const eighty=analysisDecisionModel130(state({scores:[16,16,16,16,16,16,16,16,12,12],names:Array.from({length:10},(_,i)=>`ط${i+1}`),assessmentType:'تقويم تكويني'}));
assert.equal(eighty.cohort.band,'continue_targeted_support','80٪ من الطلاب حققوا المحك => استمرار مع دعم مستهدف');

const forty=analysisDecisionModel130(state({scores:[16,16,16,16,12,12,12,12,12,12],names:Array.from({length:10},(_,i)=>`ط${i+1}`),assessmentType:'تقويم تكويني'}));
assert.equal(forty.cohort.band,'reteach','أقل من 50٪ => إعادة تدريس أوسع');

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisDecisionPanel131/,'V131 هو بوابة التكامل النهائية بعد V130');
const layer131=fs.readFileSync('v10/analysis-decision131.js','utf8');
assert.match(layer131,/analysisDecisionModel130/,'V130 يجب أن يبقى طبقة السياسة عند وجود محك صريح');
assert.doesNotMatch(final76,/analysisDecisionPanel127\(s\)/,'لا ينبغي أن تتجاوز الشاشة النهائية طبقات السياسة');

console.log('V130 analysis policy regression PASS beneath V131 explicit-criterion gate.');
