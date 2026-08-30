import assert from 'node:assert/strict';
import fs from 'node:fs';

const docs=fs.readFileSync('v10/analysis-documents147.js','utf8');
const render=fs.readFileSync('v10/analysis-render147.js','utf8');
const journey=fs.readFileSync('v10/analysis-journey147.js','utf8');
const css=fs.readFileSync('v10/analysis-closure147.css','utf8');
const final=fs.readFileSync('v10/final76.js','utf8');
const home=fs.readFileSync('home106.html','utf8');

for(const id of ['analysis','classification','remedial','enrichment'])assert.match(docs,new RegExp(`${id}:\\{id:'${id}'`),`registry missing ${id}`);
for(const label of ['يحتاج دعمًا','محقق للإتقان','مرشح للإثراء'])assert.match(docs,new RegExp(label),`semantic label missing: ${label}`);
assert.match(docs,/availableAnalysisDocuments147/);
assert.match(journey,/ماذا تريد أن تنشئ بعد ذلك/);
assert.match(journey,/لن نطلب منك إعادة إدخال البيانات الموجودة/);
assert.match(journey,/directEntry134=id/,'next document must inherit current state rather than restart');
assert.match(render,/نسبة الطلاب في كل مستوى/);
assert.match(render,/pattern id="p-support147"/);
assert.match(render,/pattern id="p-mastered147"/);
assert.match(render,/pattern id="p-advanced147"/);
assert.doesNotMatch(render,/90٪ فأعلى|80٪ إلى أقل من 90٪|70٪ إلى أقل من 80٪|50٪ إلى أقل من 70٪/,'V147 must not reintroduce five visible score bands');
assert.match(css,/repeating-linear-gradient/);
assert.match(css,/radial-gradient/);
assert.match(css,/@media print/);
assert.match(final,/analysisFinalPanel147\(s\)\+analysisOutputPanel147\(s\)\+analysisJourneyPanel147\(s\)/);
assert.match(final,/analysisFinalPanel134\(s\)\+analysisOutputPanel134\(s\)/,'legacy regression contract must remain guarded');
assert.match(home,/analysis-closure147\.css\?v=147/);
console.log('V147 analysis closure PASS: four-document registry, inherited next-document journey, three semantic levels, and one color+pattern print model.');
