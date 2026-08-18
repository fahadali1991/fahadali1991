import assert from 'node:assert/strict';
import {VISIBLE_FAMILIES111,allOutputContracts111,NARRATIVE_TRACE111} from './output-contract111.js';
import {SOURCE_CONTRACT109} from './source-contract109.js';

assert.equal(VISIBLE_FAMILIES111.length,6,'V111 must cover all six user-visible families');
assert.equal(new Set(VISIBLE_FAMILIES111).size,VISIBLE_FAMILIES111.length,'duplicate visible family');

for(const c of allOutputContracts111()){
 assert.ok(c,'missing family output contract');
 assert.ok(c.metadata.length>=4,`${c.family}: weak metadata contract`);
 const ids=c.metadata.map(x=>x.id);
 assert.equal(new Set(ids).size,ids.length,`${c.family}: duplicate metadata field`);
 for(const f of c.metadata){
  assert.ok(f.label&&f.source&&f.destination,`${c.family}/${f.id}: incomplete metadata mapping`);
  assert.ok(['title','meta'].includes(f.destination),`${c.family}/${f.id}: unknown destination`);
 }
 const source=SOURCE_CONTRACT109[c.family];
 assert.ok(source,`${c.family}: missing source contract`);
 const trace=NARRATIVE_TRACE111[c.family];
 assert.ok(trace,`${c.family}: missing narrative trace`);
 const traced=new Set([...(trace.goal||[]),...(trace.summary||[])]);
 for(const q of source.required){
  assert.ok(traced.has(q),`${c.family}: collected question '${q}' has no declared final-output destination`);
 }
}

// Exact family metadata required by the existing reverse-engineering specification.
const expected={
 'برنامج / فعالية':['المكان','المدة','المستفيدون','العدد','الصفوف'],
 'اجتماع / متابعة إدارية':['رئيس الاجتماع','معد المحضر','المكان','وقت البداية','وقت النهاية','الحضور'],
 'تحليل نتائج':['المادة','الصف','نوع الاختبار','الفترة','عدد الطلاب/المختبرين'],
 'خطة':['المعد/المسؤول','البداية','النهاية','الفريق','الفئة'],
 'إجراء متابعة':['المسؤول','الفترة','الحالات/العدد','وسيلة المتابعة'],
 'تطوير مهني':['الجهة','الساعات','نمط التنفيذ','الشهادة أو مقدم النشاط']
};
for(const c of allOutputContracts111()){
 const labels=new Set(c.metadata.map(x=>x.label));
 for(const label of expected[c.family])assert.ok(labels.has(label),`${c.family}: reverse-engineering metadata missing '${label}'`);
}
console.log('V111 output contract foundation PASS: six visible families, all required questions traced, family metadata specification encoded.');
