import assert from 'node:assert/strict';
import {analysisCountConsistency116,analysisSummary113} from './v10/analysis-data113.js';
const make=(expected,scores)=>({classification:{type:'تحليل نتائج'},metadata:{familyMeta111:{expectedCount:expected},analysis:{maxScore:'10',scores,names:[],rawRows:'',entryMode:'paste'}}});
let s=make('',[8,7,6]);assert.equal(analysisCountConsistency116(s).status,'auto');assert.equal(analysisSummary113(s).count,3);
s=make('20',Array(20).fill(8));assert.equal(analysisCountConsistency116(s).status,'ok');assert.equal(analysisCountConsistency116(s).actual,20);
s=make('20',Array(18).fill(8));assert.equal(analysisCountConsistency116(s).status,'missing');assert.equal(analysisCountConsistency116(s).diff,2);
s=make('20',Array(22).fill(8));assert.equal(analysisCountConsistency116(s).status,'extra');assert.equal(analysisCountConsistency116(s).diff,2);
console.log('V116 analysis consistency passed: auto/ok/missing/extra.');