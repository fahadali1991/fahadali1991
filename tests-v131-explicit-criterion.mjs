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
assert.equal(sum.weak,null,'لا يجوز تكوين فئة دون الإتقان بلا مستوى مستهدف صريح');
const decision=analysisDecisionModel131(noCriterion);
assert.equal(decision.ready,true);
assert.equal(decision.criterionDefined,false);
assert.equal(decision.groups.length,0);
assert.equal(decision.cohort,null,'لا يجوز إصدار قرار تدريس الشعبة بلا مستوى مستهدف صريح');
const decisionHtml=analysisDecisionPanel131(noCriterion);
assert.match(decisionHtml,/المؤشرات الكمية/);
assert.doesNotMatch(decisionHtml,/محقق للإتقان|متقدم للإثراء|دون حد الإتقان/);
const plansHtml=analysisPlansPanel131(noCriterion);
assert.doesNotMatch(plansHtml,/إنشاء الخطة العلاجية|إنشاء الخطة الإثرائية/,'لا تعرض أزرار خطة آلية بلا أساس');

const withCriterion=state({criterion:'٨٠'});
assert.equal(explicitCriterion131(withCriterion).defined,true);
assert.equal(explicitCriterion131(withCriterion).value,80);
const cDecision=analysisDecisionModel131(withCriterion);
assert.equal(cDecision.criterionDefined,true);
assert.equal(cDecision.groupMap.support.count,1);
assert.equal(cDecision.cohort.band,'differentiate','3 من 4 = 75٪، لذلك القرار على مستوى الشعبة تعليم متمايز');
assert.match(analysisPlansPanel131(withCriterion),/الخطط المقترحة بناءً على نتائج التحليل/,'عند وجود مستوى صريح تعود الخطط المعتمدة');

const details109=fs.readFileSync('v10/family-details109.js','utf8');
assert.match(details109,/analysis-data131\.js\?v=133/,'واجهة الدرجات يجب أن تستخدم نسخة واحدة من بوابة V131');
assert.match(details109,/bindAnalysisData131/);
assert.doesNotMatch(details109,/bindAnalysisData113\(state\)/,'واجهة الدرجات يجب أن تمر عبر V131');
const final133=fs.readFileSync('v10/analysis-final133.js','utf8');
const output133=fs.readFileSync('v10/analysis-output133.js','utf8');
assert.match(final133,/analysisDecisionModel131/,'V133 التاريخية تبقى استرجاعًا مختبرًا');
assert.match(output133,/analysisDecisionModel131/,'V133 التاريخية تبقى استرجاعًا مختبرًا');
const output134=fs.readFileSync('v10/analysis-output134.js','utf8');
assert.match(output134,/analysisDecisionModel131/,'V134 يجب أن تستهلك نموذج القرار نفسه');
assert.match(output134,/explicitCriterion131/,'V134 يجب ألا تتجاوز بوابة المستوى الصريح');
const final76=fs.readFileSync('v10/final76.js','utf8');
assert.match(final76,/analysisFinalPanel134/);
assert.match(final76,/analysisOutputPanel134/);
assert.doesNotMatch(final76,/analysisDecisionPanel131\(s\)\+.*analysisPlansPanel131/,'لا تعيد V134 تكديس واجهة V131 القديمة فوق النتيجة الجديدة');

console.log('V131 explicit criterion PASS: blank target stays neutral; explicit target enables decisions/plans; V134 consumes the same V131 model.');
