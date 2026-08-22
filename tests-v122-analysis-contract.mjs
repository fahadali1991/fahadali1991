import assert from 'node:assert/strict';
import fs from 'node:fs';
import {preview101} from './v10/intelligence101.js';

const family=fs.readFileSync('v10/family-details106.js','utf8');
const app=fs.readFileSync('v10/app88.js','utf8');
const understanding=fs.readFileSync('v10/understanding85.js','utf8');
const pdf=fs.readFileSync('v10/pdf-analysis113.js','utf8');
const css=fs.readFileSync('v10/pdf-renderer107.css','utf8');

for(const text of ['تحليل نتائج دين أول متوسط','تحليل نتائج إسلامية ثاني ابتدائي','تحليل نتائج التربية الإسلامية ثالث متوسط']){
  const result=preview101(text);
  assert.equal(result.family?.type,'تحليل نتائج',text);
  assert.equal(result.subject?.name,'القرآن الكريم والدراسات الإسلامية',text);
}

assert.match(family,/data-adaptive-previous/);
assert.match(family,/questionHistory\.pop\(\)/);
assert.match(family,/مراجعة إجابة سابقة/);
assert.match(app,/automatic-analysis/);
assert.match(app,/mediumText80\(state\)/);
assert.match(understanding,/id="schoolName"/);
assert.match(understanding,/id="educationOffice"/);
assert.match(understanding,/id="academicYear"/);
assert.match(pdf,/قريب من الإتقان/);
assert.match(pdf,/repeat\(4,1fr\)/);
assert.match(css,/moe-logo-green\.png/);
assert.match(css,/height:292mm/);
assert.ok(fs.statSync('v10/assets/moe-logo-green.png').size>1000);

console.log('V122 analysis contract: PASS');
