import assert from 'node:assert/strict';
import {buildCanonicalContext106} from './canonical-context106.js';
import {routeNextQuestion106,routeSequence106} from './question-router106.js';
import {titleCandidates106,goalCandidates106,narrative106} from './generators106.js';
import {resolveSkill106} from './skill-resolver106.js';

const matrix=questions=>({questions});
const q=id=>({id,q:id,opts:[`${id}-1`,`${id}-2`],max:1,kind:'UserChoice'});
const baseState=(family,raw='')=>({raw,classification:{type:family,subtype:''},metadata:{familyDetails:{},semantic101:{}},audiences:['الطلاب'],grades:[]});
const tests=[];const test=(name,fn)=>tests.push([name,fn]);

test('user subject overrides inferred subject',()=>{const s=baseState('برنامج / فعالية');s.metadata.subjectHint101='اللغة العربية';s.metadata.familyDetails.subject94='الرياضيات';assert.equal(buildCanonicalContext106(s).education.subject.value,'الرياضيات');assert.equal(buildCanonicalContext106(s).education.subject.source,'user')});
test('user skill becomes canonical skill',()=>{const s=baseState('خطة');s.metadata.familyDetails.skillFocus='توحيد المقامات';assert.equal(buildCanonicalContext106(s).education.skill.value,'توحيد المقامات')});
test('duration keeps provenance',()=>{const s=baseState('برنامج / فعالية');s.metadata.semantic101.duration='أسبوع';assert.equal(buildCanonicalContext106(s).execution.duration.source,'inference');s.metadata.durationChoice='أسبوعان';assert.equal(buildCanonicalContext106(s).execution.duration.source,'user')});
test('unknown result stays unknown',()=>{const s=baseState('برنامج / فعالية');assert.equal(buildCanonicalContext106(s).details.measurement.value,'')});

test('skill question is first when unresolved',()=>{const s=baseState('خطة');const m=matrix([q('skillFocus'),q('basis'),q('goal'),q('method'),q('follow')]);assert.equal(routeNextQuestion106(s,m).question.id,'skillFocus')});
test('resolved skill advances to basis',()=>{const s=baseState('خطة');s.metadata.familyDetails.skillFocus='توحيد المقامات';const m=matrix([q('skillFocus'),q('basis'),q('goal')]);assert.equal(routeNextQuestion106(s,m).question.id,'basis')});
test('program asks reason then goal then method',()=>{const s=baseState('برنامج / فعالية');const m=matrix([q('reason'),q('goal'),q('method'),q('participation')]);assert.deepEqual(routeSequence106(s,m).slice(0,4),['reason','goal','method','participation'])});
test('analysis asks basis finding cause action follow',()=>{const s=baseState('تحليل نتائج');const m=matrix([q('basis'),q('finding'),q('cause'),q('action'),q('follow')]);assert.deepEqual(routeSequence106(s,m).slice(0,5),['basis','finding','cause','action','follow'])});
test('meeting output creates owner gap',()=>{const s=baseState('اجتماع / متابعة إدارية');Object.assign(s.metadata.familyDetails,{purpose:'مناقشة نتائج',work:'مراجعة بيانات',product:'تكليف فريق'});const m=matrix([q('purpose'),q('work'),q('product'),q('follow')]);assert.equal(routeNextQuestion106(s,m).question.id,'owner')});
test('maintenance requires status',()=>{const s=baseState('صيانة وتجهيزات');Object.assign(s.metadata.familyDetails,{reason:'عطل',method:'إصلاح'});const m=matrix([q('reason'),q('method')]);assert.equal(routeNextQuestion106(s,m).question.id,'status')});
test('measurement appears only after outcome claim',()=>{const s=baseState('برنامج / فعالية');Object.assign(s.metadata.familyDetails,{reason:'تنمية مهارة',goal:'رفع الأداء',method:'تدريب',participation:'تحسن في دقة الحل'});const m=matrix([q('reason'),q('goal'),q('method'),q('participation')]);assert.equal(routeNextQuestion106(s,m).question.id,'measurement')});
test('neutral observation does not force measurement',()=>{const s=baseState('برنامج / فعالية');Object.assign(s.metadata.familyDetails,{reason:'تنمية مهارة',goal:'رفع الأداء',method:'تدريب',participation:'مشاركة واسعة'});const m=matrix([q('reason'),q('goal'),q('method'),q('participation')]);assert.equal(routeNextQuestion106(s,m).done,true)});

test('fraction topic does not equal precise skill',()=>{const s=baseState('خطة','خطة علاجية في الكسور');s.metadata.subjectHint101='الرياضيات';s.topic='الكسور';const r=resolveSkill106(s);assert.equal(r.branch,'الكسور والنسب');assert.equal(r.skillKnown,false);assert.equal(r.needsSkillQuestion,true)});
test('explicit denominator skill resolves precisely',()=>{const s=baseState('خطة','ضعف في توحيد المقامات عند جمع الكسور');s.metadata.subjectHint101='الرياضيات';s.topic='الكسور';assert.equal(resolveSkill106(s).skill,'توحيد المقامات')});
test('arabic reading remains ambiguous without precise skill',()=>{const s=baseState('برنامج / فعالية','برنامج لتحسين القراءة');s.metadata.subjectHint101='اللغة العربية';s.topic='القراءة';const r=resolveSkill106(s);assert.equal(r.branch,'القراءة');assert.equal(r.skillKnown,false)});

test('title uses canonical precise skill',()=>{const s=baseState('خطة');s.classification.subtype='خطة علاجية';s.metadata.subjectHint101='الرياضيات';s.topic='الكسور';s.metadata.familyDetails.skillFocus='توحيد المقامات';assert.ok(titleCandidates106(s)[0].includes('توحيد المقامات'))});
test('goals use same canonical skill',()=>{const s=baseState('برنامج / فعالية');s.metadata.familyDetails.skillFocus='الفهم القرائي';assert.ok(goalCandidates106(s)[0].includes('الفهم القرائي'))});
test('narrative does not invent measurement',()=>{const s=baseState('برنامج / فعالية');s.metadata.familyDetails.method='تطبيق عملي';const n=narrative106(s);assert.ok(!/تحقق|قياس الأثر/.test(n))});
test('narrative states not measured when user says so',()=>{const s=baseState('برنامج / فعالية');s.metadata.familyDetails.measurement='لم يتم القياس بعد';assert.ok(narrative106(s).includes('لم يتم قياس الأثر بعد'))});

let passed=0;for(const [name,fn] of tests){try{fn();passed++;console.log(`✓ ${name}`)}catch(e){console.error(`✗ ${name}`);throw e}}console.log(`\nV106 engineering tests: ${passed}/${tests.length} passed`);
