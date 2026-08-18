import assert from 'node:assert/strict';
import {familyMetaDefinitions111,nextFamilyMeta111} from './family-meta111.js';
import {pdfModel107} from './pdf-model107.js';

const expectedCounts={
 'برنامج / فعالية':0,
 'اجتماع / متابعة إدارية':5,
 'تحليل نتائج':3,
 'خطة':3,
 'إجراء متابعة':2,
 'تطوير مهني':4
};
for(const [family,count] of Object.entries(expectedCounts))assert.equal(familyMetaDefinitions111(family).length,count,`${family}: wrong adaptive metadata count`);

function base(family){return{classification:{type:family,subtype:''},metadata:{familyDetails:{},familyMeta111:{},familyMeta111Skipped:[],semantic101:{},executorName:'فهد',dateISO:'2026-08-18',dateDisplay:'',duration:'',durationChoice:'',place:'',placeMode:'',placeChoice:'',selectedTitle:'وثيقة اختبار'},audiences:['الطلاب'],stage:'متوسط',grades:['الثاني المتوسط'],answers:{goals:[],evidence:[]},attachments:[]}}

const meeting=base('اجتماع / متابعة إدارية');
assert.equal(nextFamilyMeta111(meeting)?.id,'meetingChair');
meeting.metadata.familyMeta111.meetingChair='قائد المدرسة';
assert.equal(nextFamilyMeta111(meeting)?.id,'minutesWriter');
meeting.metadata.familyMeta111Skipped=['minutesWriter'];
assert.equal(nextFamilyMeta111(meeting)?.id,'startTime');

const analysis=base('تحليل نتائج');analysis.metadata.familyDetails.subject94='الرياضيات';analysis.metadata.familyMeta111={assessmentType:'اختبار تشخيصي',period:'الفترة الأولى',testedCount:'28'};
const analysisModel=pdfModel107(analysis);const analysisMeta=Object.fromEntries(analysisModel.sections.find(x=>x.def.id==='meta').data);
assert.equal(analysisMeta['المادة'],'الرياضيات');assert.equal(analysisMeta['نوع الاختبار'],'اختبار تشخيصي');assert.equal(analysisMeta['الفترة'],'الفترة الأولى');assert.equal(analysisMeta['عدد الطلاب/المختبرين'],'28');

const pd=base('تطوير مهني');pd.metadata.familyMeta111={provider:'المعهد الوطني للتطوير المهني التعليمي',hours:'6',deliveryMode:'عن بُعد مباشر',certificateOrPresenter:'شهادة حضور'};
const pdMeta=Object.fromEntries(pdfModel107(pd).sections.find(x=>x.def.id==='meta').data);
assert.equal(pdMeta['الجهة'],'المعهد الوطني للتطوير المهني التعليمي');assert.equal(pdMeta['الساعات'],'6');assert.equal(pdMeta['نمط التنفيذ'],'عن بُعد مباشر');assert.equal(pdMeta['الشهادة أو مقدم النشاط'],'شهادة حضور');

const plan=base('خطة');plan.metadata.familyDetails.owner='معلم المادة';plan.metadata.familyMeta111={startDate:'2026-08-20',endDate:'2026-09-20',team:'معلم المادة|||الموجه الطلابي'};
const planMeta=Object.fromEntries(pdfModel107(plan).sections.find(x=>x.def.id==='meta').data);assert.equal(planMeta['المسؤول'],'معلم المادة');assert.equal(planMeta['بداية الخطة'],'2026-08-20');assert.equal(planMeta['نهاية الخطة'],'2026-09-20');assert.equal(planMeta['فريق التنفيذ'],'معلم المادة، الموجه الطلابي');

const follow=base('إجراء متابعة');follow.metadata.familyDetails.method='سجل متابعة أسبوعي';follow.metadata.familyMeta111={period:'أربعة أسابيع',casesCount:'12'};
const followMeta=Object.fromEntries(pdfModel107(follow).sections.find(x=>x.def.id==='meta').data);assert.equal(followMeta['المسؤول'],'فهد');assert.equal(followMeta['فترة المتابعة'],'أربعة أسابيع');assert.equal(followMeta['الحالات/العدد'],'12');assert.equal(followMeta['وسيلة المتابعة'],'سجل متابعة أسبوعي');

console.log('V111 family metadata PASS: adaptive one-at-a-time routing and PDF metadata delivery verified.');
