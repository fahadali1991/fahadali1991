import assert from 'node:assert/strict';
import {EVIDENCE_SOURCE112,EVIDENCE_TARGETS112,evidenceTargetsForFamily112,suggestEvidenceTargets112,evidenceReferenceSummary112} from './evidence-reference112.js';

assert.equal(EVIDENCE_SOURCE112.kind,'internal-planning-reference');
assert.match(EVIDENCE_SOURCE112.disclaimer,/ليس حكمًا رسميًا/);
assert.ok(EVIDENCE_TARGETS112.length>=30,'evidence reference slice is too small');
assert.equal(new Set(EVIDENCE_TARGETS112.map(x=>x.id)).size,EVIDENCE_TARGETS112.length,'duplicate source row ids');
for(const t of EVIDENCE_TARGETS112){
 assert.ok(Number.isInteger(t.id)&&t.id>0,`invalid id ${t.id}`);
 assert.ok(t.domain&&t.text&&t.families?.length&&t.tags?.length,`incomplete target ${t.id}`);
 assert.ok(!/^\d+-\d+-\d+-\d+$/.test(String(t.id)),`internal row ${t.id} must not masquerade as official indicator code`);
}

for(const family of ['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني']){
 assert.ok(evidenceTargetsForFamily112(family).length>0,`${family}: no source-aware evidence targets`);
}

const analysis={classification:{type:'تحليل نتائج'},raw:'حللت نتائج الاختبار النهائي وصنفت الطلاب وحددت فجوة الأداء وأسبابها',metadata:{}};
const a=suggestEvidenceTargets112(analysis,{limit:6});
assert.ok(a.some(x=>x.id===91),'analysis must surface source row 91');
assert.ok(a.some(x=>x.id===92),'analysis must surface source row 92');
assert.ok(a.some(x=>x.id===93),'analysis must surface source row 93');
assert.ok(a.every(x=>x.source.kind==='internal-planning-reference'));

const pd={classification:{type:'تطوير مهني'},raw:'نفذت زيارة تبادلية بين المعلمين لنقل الخبرات في استراتيجيات التدريس',metadata:{}};
const p=suggestEvidenceTargets112(pd,{limit:6});
assert.equal(p[0].id,62,'exchange visit should prioritize source row 62');

const plan={classification:{type:'خطة'},raw:'أعددت خطة علاجية للطلاب حسب نتائجهم وتصنيفهم',metadata:{}};
assert.ok(suggestEvidenceTargets112(plan,{limit:6}).some(x=>x.id===94),'remedial plan must surface source row 94');

const summary=evidenceReferenceSummary112({classification:{type:'برنامج / فعالية'},raw:'برنامج تعزيز السلوك الإيجابي',metadata:{}});
assert.equal(summary.hasSuggestions,true);
assert.ok(summary.suggestions.some(x=>x.id===25),'positive behavior program should surface source row 25');

console.log(`V112 evidence reference PASS: ${EVIDENCE_TARGETS112.length} source-grounded planning targets routed without conflating them with official indicator codes.`);
