import assert from 'node:assert/strict';
import fs from 'node:fs';
import {explicitCriterion131,analysisSummary131} from './v10/analysis-data131.js';
import {analysisDecisionModel131,analysisDecisionPanel131} from './v10/analysis-decision131.js';
import {analysisPlansPanel131} from './v10/analysis-plans131.js';

function state({criterion='',scores=[12,16,18,19],names=['أحمد','سعد','محمد','فهد']}={}){
 return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:criterion,scores,names,rawRows:names.map((n,i)=>`${n} ${scores[i]}`).join('\n'),entryMode:'paste'},familyMeta111:{assessmentType:'اختبار تشخيصي'},familyDetails:{subject94:'اللغة العربية'}}};
}

const noCriterion=state();
assert.equal(explicitCriterion131(noCriterion).defined,false);
const sum=analysisSummary131(noCriterion);
assert.equal(sum.ready,true);
assert.equal(sum.criterionDefined,false);
assert.equal(sum.masteryPercent,null);
assert.equal(sum.weak,null,'لا يجوز تكوين فئة دون الإتقان بلا محك');

const decision=analysisDecisionModel131(noCriterion);
assert.equal(decision.ready,true);
assert.equal(decision.criterionDefined,false);
assert.equal(decision.groups.length,0);
assert.equal(decision.cohort,null,'لا يجوز إصدار قرار تدريس الشعبة بلا محك');
const decisionHtml=analysisDecisionPanel131(noCriterion);
assert.match(decisionHtml,/لم يحدد محك أداء/);
assert.match(decisionHtml,/المؤشرات الكمية/);
assert.doesNotMatch(decisionHtml,/محقق للإتقان|متقدم للإثراء|دون حد الإتقان/);

const plansHtml=analysisPlansPanel131(noCriterion);
assert.match(plansHtml,/لا توجد خطة آلية دون محك أداء/);
assert.doesNotMatch(plansHtml,/إنشاء الخطة العلاجية|إنشاء الخطة الإثرائية/,'لا تعرض أزرار خطة آلية بلا أساس');

const withCriterion=state({criterion:'٨٠'});
assert.equal(explicitCriterion131(withCriterion).defined,true);
assert.equal(explicitCriterion131(withCriterion).value,80);
const cDecision=analysisDecisionModel131(withCriterion);
assert.equal(cDecision.criterionDefined,true);
assert.equal(cDecision.groupMap.support.count,1);
assert.equal(cDecision.cohort.band,'differentiate','3 من 4 = 75٪، لذلك القرار على مستوى الشعبة تعليم متمايز');
assert.match(analysisPlansPanel131(withCriterion),/الخطط المقترحة بناءً على نتائج التحليل/,'عند وجود محك صريح تعود الخطط المعتمدة');

const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisDecisionPanel131/);
assert.match(final76,/analysisPlansPanel131/);
const details109=fs.readFileSync('v10/family-details109.js','utf8');
assert.match(details109,/bindAnalysisData131/);
assert.doesNotMatch(details109,/bindAnalysisData113\(state\)/,'واجهة الدرجات يجب أن تمر عبر V131');

console.log('V131 explicit criterion PASS: blank criterion stays neutral; explicit criterion enables decisions and plans.');
