import assert from 'node:assert/strict';
import fs from 'node:fs';
import {preview101} from './intelligence101.js';
import {buildCanonicalContext106} from './canonical-context106.js';
import {knownSubject109,shouldAskSubject109} from './subject-selector109.js';
import {understanding84} from './understanding84.js';
import {parseAnalysisRows113,analysisSummary113} from './analysis-data113.js';
import {pdfPreview107} from './pdf-renderer107.js';

const semantic=preview101('حللت نتائج اختبار الرياضيات لعدد 20 طالب في الثاني المتوسط');
assert.equal(semantic.subject?.name,'الرياضيات','subject must be inferred once from raw text');
assert.equal(semantic.count,20,'student count in raw text must be inferred');
const state={raw:'حللت نتائج اختبار الرياضيات لعدد 20 طالب في الثاني المتوسط',classification:{type:'تحليل نتائج',subtype:''},metadata:{semantic101:semantic,subjectHint101:semantic.subject.name,subjectConfidence101:semantic.subject.confidence,count:String(semantic.count),countSource101:'inference',expectedCount111:String(semantic.count),familyDetails:{},analysis:{maxScore:40,scores:[35,28,40,10],names:[],rawRows:'35\n28\n40\n10'},familyMeta111:{assessmentType:'اختبار تشخيصي',period:'الفصل الدراسي الأول',expectedCount:String(semantic.count)},dateISO:'2026-08-20',dateDisplay:'20/08/2026'},audiences:['الطلاب'],stage:'متوسط',grades:['الثاني المتوسط'],answers:{goals:[],evidence:[]},attachments:[]};
const ctx=buildCanonicalContext106(state);
assert.equal(ctx.education.subject.value,'الرياضيات');
assert.equal(ctx.execution.count.value,'20');
assert.equal(knownSubject109(state)?.name,'الرياضيات');
assert.equal(shouldAskSubject109(state),false,'known inferred subject must not be asked again');

const derived={classification:{type:'تحليل نتائج'},metadata:{familyDetails:{},semantic101:{},analysis:{maxScore:40,scores:[30,20,10],names:[]}},audiences:[]};
assert.equal(buildCanonicalContext106(derived).execution.count.value,'3','analysis count must derive from scores');
assert.equal(buildCanonicalContext106(derived).execution.count.source,'derived');
assert.equal(analysisSummary113(derived).count,3);
const parsed=parseAnalysisRows113('أحمد ٣٥\n٢٨\nسالم 40',40);
assert.deepEqual(parsed.scores,[35,28,40]);
assert.equal(parsed.count,3);

const html=understanding84(state);
assert.equal(html.includes('id="count"'),false,'analysis first step must not ask count');
assert.ok(html.includes('سيُحسب تلقائيًا من الدرجات'),'analysis must explain derived count');
assert.ok(html.includes('value="2026-08-20"'),'date must be retained in the document state');

const app=fs.readFileSync(new URL('./app88.js',import.meta.url),'utf8');
assert.match(app,/function todayISO\(\)/,'app must default the date from the user device');
assert.match(app,/dateISO:state\.metadata\?\.dateISO\|\|today/,'today must populate date when no prior date exists');
const meta=fs.readFileSync(new URL('./family-meta111.js',import.meta.url),'utf8');
assert.equal(meta.includes('testedCount'),false,'analysis must never ask a second manual student count');
assert.ok(meta.indexOf("id:'period'")<meta.indexOf("id:'assessmentType'"),'semester must precede assessment type');
assert.equal(meta.includes("id:'section'"),false,'section belongs beside grade, not in the adaptive question queue');
assert.equal(meta.includes("id:'expectedCount'"),false,'expected count belongs beside max score, not in the adaptive question queue');
assert.ok(html.includes('id="analysisSection111"'),'analysis section must appear beside grade scope');
const bank=fs.readFileSync(new URL('./BANK101_SPEC.md',import.meta.url),'utf8');
assert.ok(bank.includes('سأل عن معلومة مؤكدة سبق للمستخدم ذكرها'),'bank no-repeat rule must remain explicit');

const pdf=pdfPreview107(state,{mode:'color'});
assert.ok(pdf.includes('analysisSheet113'),'analysis must have a real printable renderer');
assert.ok(pdf.includes('طباعة / حفظ PDF'),'analysis print action must be visible');
assert.ok(pdf.includes('20'),'declared student count must reach the PDF consistency output');
console.log('V113/V117 canonical UX recovery: PASS');
