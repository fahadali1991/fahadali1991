import assert from 'node:assert/strict';
import fs from 'node:fs';

const home=fs.readFileSync('home106.html','utf8');
const index=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('v10/analysis-v149-visual.css','utf8');
const js=fs.readFileSync('v10/analysis-v149-visual.js','utf8');

assert.match(home,/analysis-closure147\.css\?v=147[\s\S]*analysis-v149-visual\.css\?v=149/,'V149 CSS must load after V147');
assert.match(home,/analysis-v149-visual\.js\?v=149/,'V149 visual enhancer must load');
assert.match(index,/home106\.html\?v=149/,'root must cache-bust to V149');
assert.match(css,/grid-template-areas:"doc logo school"/,'three-zone header must be explicit');
assert.match(css,/direction:rtl!important/,'A4 sheet must be true RTL');
assert.match(css,/support span::before\{content:"●"/,'support must have a non-colour symbol');
assert.match(css,/mastered span::before\{content:"■"/,'mastered must have a non-colour symbol');
assert.match(css,/advanced span::before\{content:"◆"/,'advanced must have a non-colour symbol');
assert.match(css,/@media print[\s\S]*filter:none!important[\s\S]*background-color:var\(--a149-support\)/,'print must retain colour instead of forcing grayscale');
assert.match(js,/analysisRatio149/,'V149 must split the ratio visual from the decision cards');
assert.match(js,/analysisDecision149/,'V149 must create a dedicated decision panel');
assert.match(js,/analysisDocMeta149/,'V149 must create the third header zone');
assert.doesNotMatch(js,/analysisDecisionModel|explicitCriterion|masteryPercent\s*=/,'visual layer must not recalculate or rewrite assessment logic');
console.log('V149 visual contract PASS: existing logic preserved, three-zone RTL header, three-panel analysis, and colour+shape print language are wired.');