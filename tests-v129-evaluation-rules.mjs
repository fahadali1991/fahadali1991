import assert from 'node:assert/strict';
import {
 evaluationPolicy129,
 gradeLabelForSystemResult129,
 cohortTeachingDecision129,
 studentDecision129,
 diagnosticDisplay129,
 normalizeSubject129,
 number129
} from './v10/evaluation-rules129.js';

assert.equal(number129('٨٠٫٥'),80.5,'يجب دعم الأرقام العربية والكسور');
assert.equal(normalizeSubject129('لغتي'),'اللغة العربية');
assert.equal(normalizeSubject129('عربي'),'اللغة العربية');
assert.equal(normalizeSubject129('دين'),'القرآن الكريم والدراسات الإسلامية');

const diagnostic=evaluationPolicy129({stage:'متوسط',grade:'الأول المتوسط',subject:'لغتي',purpose:'اختبار تشخيصي',resultScope:'single_assessment'});
assert.equal(diagnostic.purpose,'diagnostic');
assert.equal(diagnostic.gradeScale.enabled,false,'لا يجوز تحويل درجة اختبار تشخيصي إلى تقدير مادة نظامي');
assert.equal(diagnostic.individualMastery.officialFixed80,false,'80٪ ليست حد إتقان فرديًا وزاريًا ثابتًا');
assert.equal(diagnostic.canInferLearningStyleFromScores,false);
assert.equal(diagnostic.canInferWeaknessCauseFromScores,false);
assert.equal(diagnostic.canClaimImpactBeforeRemeasurement,false);

const diagDisplay=diagnosticDisplay129({score:8,maxScore:20});
assert.equal(diagDisplay.systemPassFail,null,'التشخيص لا يصدر حكم نجاح/رسوب نهائي من درجة منفردة');
assert.match(diagDisplay.baselineLabel,/40٪/);

const noCriterion=studentDecision129({score:18,maxScore:20,purpose:'تكويني'});
assert.equal(noCriterion.decision,'insufficient_for_mastery','لا يجوز اختراع حد إتقان عند غيابه');
assert.equal(noCriterion.enrichment,'not_determined');

const below=studentDecision129({score:12,maxScore:20,criterionPct:80,purpose:'تكويني'});
assert.equal(below.decision,'support');
assert.equal(below.remedial,true);
assert.equal(below.enrichment,false);

const highTotalOnly=studentDecision129({score:19,maxScore:20,criterionPct:80,evidenceType:'total_score',purpose:'تكويني'});
assert.equal(highTotalOnly.decision,'mastered');
assert.equal(highTotalOnly.enrichment,'candidate','الدرجة الكلية فقط تعطي ترشيحًا للإثراء لا إثبات إتقان كل ناتج');

const skillsMastered=studentDecision129({score:19,maxScore:20,criterionPct:80,evidenceType:'skill_scores',purpose:'تكويني'});
assert.equal(skillsMastered.enrichment,'eligible','بيانات المهارات أقوى من الدرجة الكلية في قرار الإثراء');
assert.equal(skillsMastered.impactAllowed,null,'لا أثر قبل إعادة القياس');

const measured=studentDecision129({score:19,maxScore:20,criterionPct:80,evidenceType:'skill_scores',purpose:'تكويني',remeasurement:{before:70,after:90}});
assert.equal(measured.impactAllowed,true,'يسمح بحساب الأثر فقط بعد وجود قياسين قابلين للمقارنة');

assert.equal(cohortTeachingDecision129({achievedCount:17,totalCount:20}).band,'continue_targeted_support','85٪ من الطلاب المحققين للمحك = استمرار مع دعم مستهدف');
assert.equal(cohortTeachingDecision129({achievedCount:13,totalCount:20}).band,'differentiate','65٪ = تعليم متمايز');
assert.equal(cohortTeachingDecision129({achievedCount:8,totalCount:20}).band,'reteach','40٪ = إعادة تدريس أوسع');

const p1science=evaluationPolicy129({stage:'ابتدائي',grade:'الأول الابتدائي',subject:'العلوم',purpose:'تكويني',resultScope:'subject_period'});
assert.equal(p1science.evaluationMode,'standards_based');
assert.equal(p1science.requiresStandardsEvidence,true,'السياق القائم على المعايير لا يحكم من درجة كلية فقط');
assert.equal(p1science.gradeScale.enabled,false);

const p1arabic=evaluationPolicy129({stage:'ابتدائي',grade:'الأول الابتدائي',subject:'لغتي',purpose:'تكويني',resultScope:'subject_period'});
assert.equal(p1arabic.earlyPrimaryArabicMathException,true,'اللغة العربية في الأول/الثاني لا تمر على منطق المواد القائمة على المعايير نفسه');
assert.equal(p1arabic.evaluationMode,'score_or_evidence_based');

const middleSubject=evaluationPolicy129({stage:'متوسط',grade:'الثاني المتوسط',subject:'الرياضيات',purpose:'ختامي',resultScope:'subject_period'});
assert.equal(middleSubject.gradeScale.enabled,true);
assert.equal(gradeLabelForSystemResult129({pct:92,policy:middleSubject}),'ممتاز');
assert.equal(gradeLabelForSystemResult129({pct:83,policy:middleSubject}),'جيد جدًا');
assert.equal(gradeLabelForSystemResult129({pct:72,policy:middleSubject}),'جيد');
assert.equal(gradeLabelForSystemResult129({pct:60,policy:middleSubject}),'مقبول');
assert.equal(gradeLabelForSystemResult129({pct:45,policy:middleSubject}),'راسب');

const secondary=evaluationPolicy129({stage:'ثانوي',grade:'الثاني الثانوي',subject:'الرياضيات',purpose:'ختامي',resultScope:'subject_period'});
assert.equal(secondary.gradeScale.enabled,false,'لا نرميز سلم الثانوية قبل جدول مستقل موثق ومختبر');

assert.ok(diagnostic.forbiddenFromTotalScore.includes('precise_skill_gap'));
assert.ok(diagnostic.forbiddenFromTotalScore.includes('weakness_cause'));
assert.ok(diagnostic.forbiddenFromTotalScore.includes('learning_style'));
assert.ok(diagnostic.forbiddenFromTotalScore.includes('measured_impact'));

console.log('V129 evaluation rules PASS: context-aware purpose, no fake fixed mastery, cohort teaching bands, standards-mode protection, limited enrichment inference, and no false impact.');
