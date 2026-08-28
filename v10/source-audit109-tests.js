import assert from 'node:assert/strict';
import {matrix106} from './matrix106.js';
import {routeSequence106} from './question-router106.js';
import {SOURCE_CONTRACT109} from './source-contract109.js';
const base=(family,subtype='')=>({raw:'عمل مدرسي موثق',classification:{type:family,subtype},metadata:{familyDetails:{},semantic101:{}},audiences:['الطلاب'],stage:'متوسط',grades:['الصف الثاني المتوسط'],attachments:[],answers:{goals:[],evidence:[]}});
for(const [family,contract] of Object.entries(SOURCE_CONTRACT109)){
 const s=base(family,family==='خطة'?'خطة تحسين':'');const m=matrix106(s),seq=routeSequence106(s,m,14);
 for(const id of contract.required)assert.ok(seq.includes(id),`${family}: missing source-backed question ${id}; got ${seq.join(',')}`);
 for(const id of contract.derived||[])assert.ok(!seq.includes(id),`${family}: derived field ${id} must not be asked as a user question; got ${seq.join(',')}`);
 assert.equal(new Set(seq).size,seq.length,`${family}: duplicate questions ${seq.join(',')}`);
 assert.ok(seq.length<=8,`${family}: too many questions ${seq.length}`);
}
const program=matrix106(base('برنامج / فعالية')).questions;
const reason=program.find(x=>x.id==='reason'),goal=program.find(x=>x.id==='goal'),method=program.find(x=>x.id==='method'),obs=program.find(x=>x.id==='participation');
assert.ok(reason.opts.includes('تفعيل مناسبة تربوية أو وطنية'),'program occasion reason must be available');
assert.ok(goal.opts.includes('اكتشاف المواهب ودعمها'),'program gifted goal must be available');
assert.ok(method.opts.includes('ورشة مصغرة'),'program mini-workshop method must be available');
assert.ok(obs.opts.includes('حاجة بعض المستفيدين إلى دعم إضافي'),'program follow-up observation must be available');
const meeting=matrix106(base('اجتماع / متابعة إدارية')).questions.find(x=>x.id==='product');assert.notEqual(meeting.kind,'MeasuredResult','meeting decision is a fact/output, not a measured result');
const analysisState=base('تحليل نتائج');
const analysisMatrix=matrix106(analysisState);
const analysisFollow=analysisMatrix.questions.find(x=>x.id==='follow');
const analysisSeq=routeSequence106(analysisState,analysisMatrix,14);
assert.notEqual(analysisFollow.kind,'MeasuredResult','future remeasurement plan is not an achieved result');
assert.ok(!analysisSeq.includes('finding'),'analysis finding is derived from scores and must not be requested from the user');
assert.ok(analysisSeq.includes('actionStatus'),'analysis must distinguish planned action from implemented action');
const pd=matrix106(base('تطوير مهني')).questions.find(x=>x.id==='application');assert.ok(pd.opts.includes('لم يبدأ التطبيق بعد'),'professional development must not force a false application claim');
for(const subtype of ['خطة علاجية','خطة إثرائية','خطة تحسين','خطة تشغيلية']){const s=base('خطة',subtype),m=matrix106(s);assert.ok(m.questions.find(x=>x.id==='basis')?.opts?.length,`${subtype}: missing basis choices`);assert.ok(m.questions.find(x=>x.id==='follow')?.opts?.length,`${subtype}: missing follow-up choices`)}
console.log('V109/V121 source audit: source-backed questions passed; derived analysis findings are not re-asked.');
