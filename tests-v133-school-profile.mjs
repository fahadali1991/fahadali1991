import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeSchoolProfile133,schoolProfileComplete133,mergeSchoolProfile133} from './v10/school-profile133.js';

const normalized=normalizeSchoolProfile133({
 schoolName:'  مدرسة   حطين المتوسطة ',
 educationOffice:' الإدارة العامة للتعليم بنجران ',
 academicYear:' 1448هـ ',
 principalName:'  مدير المدرسة  '
});
assert.deepEqual(normalized,{
 schoolName:'مدرسة حطين المتوسطة',
 educationOffice:'الإدارة العامة للتعليم بنجران',
 academicYear:'1448هـ',
 principalName:'مدير المدرسة'
});
assert.equal(schoolProfileComplete133(normalized),true);
assert.equal(schoolProfileComplete133({...normalized,academicYear:''}),false,'العام الدراسي جزء أساسي من ملف المدرسة');

const state={metadata:{schoolName:'مدرسة تقرير قديم',academicYear:''}};
mergeSchoolProfile133(state,normalized);
assert.equal(state.metadata.schoolName,'مدرسة تقرير قديم','لا يجوز أن يستبدل الملف الثابت قيمة تقرير موجودة');
assert.equal(state.metadata.educationOffice,'الإدارة العامة للتعليم بنجران');
assert.equal(state.metadata.academicYear,'1448هـ');
assert.equal(state.metadata.principalName,'مدير المدرسة');

const home=fs.readFileSync('home106.html','utf8');
assert.match(home,/school-profile133\.js\?v=133/,'الملف الثابت يجب أن يحمل مباشرة في الواجهة لتجنب اعتماد نجاحه على كاش سلسلة app القديمة');
const moduleSource=fs.readFileSync('v10/school-profile133.js','utf8');
assert.match(moduleSource,/school-engine-v106/);
assert.match(moduleSource,/META='meta'/,'ملف المدرسة يجب أن يستخدم مخزن meta في مستودع IndexedDB الحالي');
assert.doesNotMatch(moduleSource,/sessionStorage|localStorage/,'لا تخزن بيانات المدرسة في sessionStorage أو localStorage');
assert.match(moduleSource,/schoolName.*educationOffice.*academicYear.*principalName/s);

console.log('V133A school profile PASS: normalization, completeness, non-destructive merge, IndexedDB meta persistence, and direct cache-safe loading.');
