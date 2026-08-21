import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analysisCountConsistency116} from './v10/analysis-data113.js';

const state=(expected,scores)=>({metadata:{familyMeta111:{expectedCount:String(expected||'')},analysis:{scores,maxScore:'10'}}});
assert.equal(analysisCountConsistency116(state('',[1,2,3])).status,'auto');
assert.equal(analysisCountConsistency116(state(3,[1,2,3])).status,'match');
assert.equal(analysisCountConsistency116(state(5,[1,2,3])).missing,2);
assert.equal(analysisCountConsistency116(state(2,[1,2,3])).extra,1);

const pdf=fs.readFileSync('./v10/pdf-analysis113.js','utf8');
assert.match(pdf,/section111/,'PDF must render optional class section');
assert.match(pdf,/professionalReading116/,'PDF must use data-derived professional reading');
assert.match(pdf,/analysisFooter113\{position:absolute!important/,'analysis footer must stay inside physical A4');
assert.match(pdf,/v10\/assets\/moe-logo\.svg/,'PDF must reference local ministry logo asset');
const logo=fs.readFileSync('./v10/assets/moe-logo.svg','utf8');
assert.match(logo,/وزارة التعليم - Ministry of Education/);
assert.match(logo,/data:image\/png;base64,/,'official logo asset must be self-contained and offline-safe');
console.log('V116 analysis document contract passed.');