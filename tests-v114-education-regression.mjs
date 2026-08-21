import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SUBJECTS94} from './v10/subject-registry94.js';
import {canonicalGrades114,educationScopeLabel114,resolveSubject114,normalizeEducationState114} from './v10/education-scope114.js';
import {buildCanonicalContext106} from './v10/canonical-context106.js';
import {titleCandidates108} from './v10/title108.js';
import {matrix106} from './v10/matrix106.js';
import {routeNextQuestion106} from './v10/question-router106.js';

let subjectCases=0;
for(const [stage,groups] of Object.entries(SUBJECTS94)){
  for(const [group,subjects] of Object.entries(groups)){
    for(const subject of subjects){
      const grade=stage==='ابتدائي'?`${group} الابتدائي`:stage==='متوسط'?`${group} المتوسط`:'الأول الثانوي';
      const s={raw:`عملت تحليل نتائج ${subject} ${grade}`,classification:{type:'تحليل نتائج',subtype:'اختبار تشخيصي'},stage,grades:[grade],audiences:[],metadata:{familyDetails:{},semantic101:{},subjectHint101:'',subjectConfidence101:0}};
      normalizeEducationState114(s);
      const r=resolveSubject114(s);
      assert.equal(r?.name,subject,`فشل اختيار المادة تلقائيًا: ${stage}/${group}/${subject} => ${r?.name}`);
      assert.deepEqual(s.audiences,['الطلاب'],`تحليل النتائج يجب أن يختار الطلاب تلقائيًا: ${subject}`);
      const ctx=buildCanonicalContext106(s);
      assert.equal(ctx.education.subject.value,subject,`السياق المركزي لم يعتمد المادة نفسها: ${subject}`);
      assert.equal(ctx.education.grades.length,1,`السياق المركزي كرر الصف: ${subject} => ${ctx.education.grades.join(' / ')}`);
      subjectCases++;
    }
  }
}

const shorthandState={raw:'سويت تحليل نتائج عربي اول متوسط',classification:{type:'تحليل نتائج',subtype:'اختبار تشخيصي'},stage:'متوسط',grades:['الأول المتوسط'],audiences:[],metadata:{familyDetails:{},semantic101:{}}};
normalizeEducationState114(shorthandState);
assert.equal(resolveSubject114(shorthandState)?.name,'اللغة العربية','اختصار «عربي» يجب أن يلتقط اللغة العربية تلقائيًا');

const gradeCases=[
 ['متوسط',['الأول','الأول المتوسط'],['الأول المتوسط']],
 ['ثانوي',['الأول','الأول الثانوي'],['الأول الثانوي']],
 ['ابتدائي',['الثاني','الثاني الابتدائي'],['الثاني الابتدائي']],
 ['متوسط',['الثالث'],['الثالث المتوسط']]
];
for(const [stage,input,expected] of gradeCases)assert.deepEqual(canonicalGrades114(stage,input),expected);
assert.equal(educationScopeLabel114('ثانوي',['الأول','الأول الثانوي']),'الأول الثانوي');
assert.equal(educationScopeLabel114('متوسط',['الأول','الأول المتوسط']),'الأول المتوسط');

const titleState={raw:'عملت تحليل نتائج التقنية الرقمية 1 اول ثانوي',classification:{type:'تحليل نتائج',subtype:'اختبار تشخيصي'},stage:'ثانوي',grades:['الأول','الأول الثانوي'],audiences:['الطلاب'],metadata:{familyDetails:{subject94:'التقنية الرقمية 1'},semantic101:{},subjectHint101:'التقنية الرقمية 1',subjectConfidence101:100}};
const titles=titleCandidates108(titleState);
assert.ok(titles.length>0,'يجب توليد عنوان');
for(const t of titles){
 assert.ok(!/الأول\s*و\s*الأول/u.test(t),`تكرار الصف عاد في العنوان: ${t}`);
 assert.ok(!/الثاني\s*و\s*الثاني/u.test(t),`تكرار الصف عاد في العنوان: ${t}`);
 assert.ok(!/الثالث\s*و\s*الثالث/u.test(t),`تكرار الصف عاد في العنوان: ${t}`);
}

const analysisState={raw:'تحليل نتائج عربي اول متوسط',classification:{type:'تحليل نتائج',subtype:'اختبار تشخيصي'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{familyDetails:{basis:'اختبار تشخيصي — الفصل الدراسي الأول',finding:'مهارات منخفضة الإتقان'}}};
const matrix=matrix106(analysisState);
for(const id of ['basis','finding','cause','action','follow']){
 const q=matrix.questions.find(x=>x.id===id);if(q)assert.equal(Number(q.max||0),0,`سؤال ${id} في تحليل النتائج يجب ألا يفرض حدًا عدديًا على الاختيارات`);
}
const routed=routeNextQuestion106(analysisState,matrix);
assert.notEqual(routed.gap,'basis','إذا سبق بناء أساس التحليل من نوع الاختبار والفصل فلا يجوز سؤاله مرة أخرى');

const familyMetaSource=fs.readFileSync('./v10/family-meta111.js','utf8');
assert.doesNotMatch(familyMetaSource,/الفصل الدراسي الثالث/,'يجب حذف الفصل الدراسي الثالث من نموذج تحليل النتائج');
assert.match(familyMetaSource,/اختبار الفترة الأولى/,'الفترة الأولى يجب أن تكون نوع اختبار داخل الفصل الدراسي');
assert.match(familyMetaSource,/اختبار قبلي/,'القبلي يجب أن يكون نوع اختبار داخل الفصل الدراسي');
const detailsSource=fs.readFileSync('./v10/family-details106.js','utf8');
assert.match(detailsSource,/family-meta-change111/,'يجب إعادة حساب السؤال التكيفي بعد إجابات بيانات التحليل السابقة');
const routerSource=fs.readFileSync('./v10/question-router106.js','utf8');
assert.match(routerSource,/measurementQuestion\(\).*max:0/s,'سؤال التحقق من النتيجة يجب ألا يفرض حد اختيار اعتباطيًا');
const pdfSource=fs.readFileSync('./v10/pdf-analysis113.js','utf8');
assert.match(pdfSource,/educationScopeLabel114/,'PDF تحليل النتائج يجب أن يقرأ المرحلة/الصف من Resolver المركزي');
assert.doesNotMatch(pdfSource,/c\.education\.stage\.value\s*,\s*c\.education\.grades\.join/,'ممنوع إعادة تركيب المرحلة والصف يدويًا داخل PDF');
const printFix=fs.readFileSync('./v10/styles115.css','utf8');
assert.match(printFix,/html,body[^}]*height:297mm!important[^}]*max-height:297mm!important[^}]*overflow:hidden!important/s,'يجب تثبيت جذر الطباعة على أبعاد ورقة A4 واحدة ومنع امتداد صفحة ثانية');
assert.match(printFix,/\.pdfPages107[^}]*height:292mm!important[^}]*max-height:292mm!important[^}]*overflow:hidden!important/s,'يجب إبقاء حاوية تحليل النتائج داخل المساحة الآمنة لصفحة A4 واحدة');
const shareSource=fs.readFileSync('./v10/analysis-feedback115.js','utf8');
assert.doesNotMatch(shareSource,/data-pdf-whatsapp115/,'معاينة الوثيقة يجب ألا تتضمن زر واتساب خاصًا');
assert.match(shareSource,/data-pdf-share115/,'معاينة الوثيقة يجب أن تتضمن زر المشاركة النظامية');
assert.match(shareSource,/navigator\.share/,'معاينة الوثيقة يجب أن تتضمن مشاركة نظامية عامة');

console.log(`V115 analysis feedback regression passed: ${subjectCases} curriculum subjects + shorthand + term model + adaptive carry-forward + unlimited evidence choices + print/share.`);
