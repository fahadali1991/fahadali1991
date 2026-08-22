import assert from 'node:assert/strict';
import {preview101} from './v10/intelligence101.js';
import {parseAnalysisRows113,analysisSummary113,analysisCountConsistency116} from './v10/analysis-data113.js';
import {resolveSubject114} from './v10/education-scope114.js';

const novice=preview101('سويت تحليل نتايج انقليزي سادس ابتدائي ج الفصل الثاني ٢٤ طالبه');
assert.equal(novice.family?.type,'تحليل نتائج');
assert.equal(novice.stage,'ابتدائي');
assert.deepEqual(novice.grades,['السادس']);
assert.equal(novice.period,'الفصل الدراسي الثاني');
assert.equal(novice.count,24);

const technical=preview101('تحليل نتائج اختبار نهائي كيمياء ٣ ثالث ثانوي مسارات شعبة 2 الفصل الأول 30 طالب الدرجة من 50');
assert.deepEqual(technical.grades,['الثالث']);
assert.equal(technical.period,'الفصل الدراسي الأول');
assert.equal(technical.assessmentType,'اختبار نهائي');
assert.equal(technical.count,30);
assert.equal(technical.maxScore,50);

const natural=preview101('حللت درجات الرياضيات للرابع الابتدائي شعبة ب وعددهم 25');
assert.deepEqual(natural.grades,['الرابع']);
assert.equal(natural.count,25);

for(const row of ['أحمد 18,5','أحمد،١٨٫٥','أحمد;18.5','أحمد؛١٨٫٥']){
 const parsed=parseAnalysisRows113(row,20);
 assert.deepEqual(parsed.scores,[18.5],row);
 assert.deepEqual(parsed.names,['أحمد'],row);
}

const state=(raw,stage,grade)=>({raw,stage,grades:[grade],metadata:{},classification:{type:'تحليل نتائج'}});
assert.equal(resolveSubject114(state('المهارات الرقمية أول ابتدائي','ابتدائي','الأول الابتدائي')),null);
assert.equal(resolveSubject114(state('التفكير الناقد أول متوسط','متوسط','الأول المتوسط')),null);
assert.equal(resolveSubject114(state('هندسة برمجيات ثاني ثانوي','ثانوي','الثاني الثانوي'))?.name,'هندسة البرمجيات');
assert.equal(resolveSubject114(state('مواطنة رقمية ثاني ثانوي','ثانوي','الثاني الثانوي'))?.name,'المواطنة الرقمية');
assert.equal(resolveSubject114(state('ادارة مالية ثاني ثانوي','ثانوي','الثاني الثانوي'))?.name,'الإدارة المالية');
assert.equal(resolveSubject114(state('عربي ثاني ثانوي','ثانوي','الثاني الثانوي'))?.name,'الكفايات اللغوية');

const analysis={classification:{type:'تحليل نتائج'},metadata:{familyMeta111:{expectedCount:'٢.٥'},analysis:{maxScore:'٢٠',masteryPercent:'٨٠',scores:[18,14,12]}}};
const summary=analysisSummary113(analysis);
assert.equal(summary.masteryPercent,80);
assert.equal(summary.weak,2);
assert.equal(analysisCountConsistency116(analysis).status,'invalid');

console.log('V120 committee fixes PASS: locale numbers, natural context, grade/term separation, curricular subject safety and mastery threshold.');
