import assert from 'node:assert/strict';
import {SUBJECTS94} from './v10/subject-registry94.js';
import {canonicalGrades114,educationScopeLabel114,resolveSubject114,normalizeEducationState114} from './v10/education-scope114.js';
import {titleCandidates108} from './v10/title108.js';

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
      subjectCases++;
    }
  }
}

const gradeCases=[
 ['متوسط',['الأول','الأول المتوسط'],['الأول المتوسط']],
 ['ثانوي',['الأول','الأول الثانوي'],['الأول الثانوي']],
 ['ابتدائي',['الثاني','الثاني الابتدائي'],['الثاني الابتدائي']],
 ['متوسط',['الثالث'],['الثالث المتوسط']]
];
for(const [stage,input,expected] of gradeCases)assert.deepEqual(canonicalGrades114(stage,input),expected);
assert.equal(educationScopeLabel114('ثانوي',['الأول','الأول الثانوي']),'الأول الثانوي');

const titleState={raw:'عملت تحليل نتائج التقنية الرقمية 1 اول ثانوي',classification:{type:'تحليل نتائج',subtype:'اختبار تشخيصي'},stage:'ثانوي',grades:['الأول','الأول الثانوي'],audiences:['الطلاب'],metadata:{familyDetails:{subject94:'التقنية الرقمية 1'},semantic101:{},subjectHint101:'التقنية الرقمية 1',subjectConfidence101:100}};
const titles=titleCandidates108(titleState);
assert.ok(titles.length>0,'يجب توليد عنوان');
for(const t of titles){
 assert.ok(!/الأول\s*و\s*الأول/u.test(t),`تكرار الصف عاد في العنوان: ${t}`);
 assert.ok(!/الثاني\s*و\s*الثاني/u.test(t),`تكرار الصف عاد في العنوان: ${t}`);
 assert.ok(!/الثالث\s*و\s*الثالث/u.test(t),`تكرار الصف عاد في العنوان: ${t}`);
}
console.log(`V114 education regression passed: ${subjectCases} curriculum subject cases + ${gradeCases.length} grade normalization cases + title dedupe.`);
