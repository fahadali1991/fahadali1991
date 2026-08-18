import assert from 'node:assert/strict';
import {evidencePage} from './evidence85.js';
import {suggestEvidenceTargets112} from './evidence-reference112.js';

function state(family,raw='',extra={}){return{raw,topic:'',classification:{type:family,subtype:''},metadata:{contextEvidence85:[],generatedDescription:'',selectedTitle:'',workTitle:'',familyDetails:{},...extra.metadata},answers:{goals:[],evidence:extra.evidence||[]},attachments:extra.attachments||[],audiences:['الطلاب'],stage:'متوسط',grades:['الثاني المتوسط']}}

const analysis=state('تحليل نتائج','حللت نتائج الاختبار التشخيصي وحددت فجوة الأداء وأسبابها');
const aTargets=suggestEvidenceTargets112(analysis,{limit:4});
assert.ok(aTargets.some(x=>x.id===91),'analysis should suggest result analysis evidence target');
assert.ok(aTargets.some(x=>x.id===93),'analysis should suggest performance-gap evidence target');
const aHtml=evidencePage(analysis);
for(const text of ['الشواهد الموجودة الآن','الشواهد المناسبة لهذا العمل','ما الذي يقوّي ملف التوثيق؟','مرجع: جدول حصر الشواهد'])assert.ok(aHtml.includes(text),`evidence screen missing ${text}`);
assert.ok(aHtml.includes('ليست حكمًا رسميًا بتحقق مؤشر'),'official-indicator disclaimer missing');
assert.ok(!aHtml.includes('تحقق المؤشر رسميًا'),'screen must not claim official indicator fulfillment');

const pd=state('تطوير مهني','نفذت زيارة تبادلية لنقل الخبرات بين المعلمين',{evidence:['شهادة أو محضر النشاط بحسب الحالة']});
const pdHtml=evidencePage(pd);
assert.ok(pdHtml.includes('شواهد تفعيل الزيارات التبادلية لنقل الخبرات بين المعلمين'),'PD source-grounded target missing');
assert.ok(pdHtml.includes('✓ شهادة أو محضر النشاط بحسب الحالة'),'existing selected evidence should appear in current-evidence summary');

const plan=state('خطة','أعددت خطة علاجية وفق تصنيف الطلاب ونتائجهم');
assert.equal(suggestEvidenceTargets112(plan,{limit:1})[0]?.id,94,'remedial plan should rank remedial-plan target first');
const planHtml=evidencePage(plan);
assert.ok(planHtml.includes('عينة من الخطط العلاجية وفق تصنيفات المتعلمين'),'remedial evidence strengthening card missing');

const withFiles=state('برنامج / فعالية','نفذت برنامج سلوك إيجابي',{evidence:['صور التنفيذ'],attachments:[{name:'photo.jpg',type:'image/jpeg',size:1000}],metadata:{evidenceLink:'https://example.com'}});
const fHtml=evidencePage(withFiles);
assert.ok(fHtml.includes('✓ صور التنفيذ'),'selected evidence current summary missing');
assert.ok(fHtml.includes('1 مرفق'),'attachment current summary missing');
assert.ok(fHtml.includes('✓ رابط شاهد'),'link current summary missing');

console.log('V112 evidence screen PASS: current evidence, family suggestions, source-grounded strengthening and official-status disclaimer verified.');
