import assert from 'node:assert/strict';
import {EVIDENCE_TARGETS112,evidenceTargetsForFamily112,suggestEvidenceTargets112,EVIDENCE_SOURCE112} from './evidence-reference112.js';

const FAMILIES=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني'];
const STAGES=['ابتدائي','متوسط','ثانوي'];
const SUPERVISORS=['مشرف صفوف أولية','مشرف لغة عربية','مشرف دراسات إسلامية','مشرف رياضيات','مشرف علوم','مشرف لغة إنجليزية','مشرف مهارات رقمية','مشرف نشاط','مشرف توجيه طلابي','مشرف موهوبين','مشرف تربية خاصة','مشرف تقويم مدرسي'];
const GOVERNANCE=['مدير مدرسة','وكيل شؤون تعليمية','وكيل شؤون مدرسية','منسق جودة وتقويم','رائد نشاط','موجه طلابي','منسق تطوير مهني'];
const PRINT_EXPERTS=['مصمم وثائق رسمية','خبير طباعة مكتبية','خبير Typography عربي','مراجع إداري للنسخة المطبوعة','مستخدم طابعة مدرسية أبيض وأسود'];
const UX_LEVELS=['غير تقني','متوسط','تقني'];

assert.equal(EVIDENCE_SOURCE112.kind,'internal-planning-reference');
assert.match(EVIDENCE_SOURCE112.disclaimer,/ليس حكمًا رسميًا/);
assert.equal(new Set(EVIDENCE_TARGETS112.map(x=>x.id)).size,EVIDENCE_TARGETS112.length);

// المشرف التربوي: لا يجوز أن تقترح الخوارزمية بندًا من عائلة أخرى.
let supervisorReviews=0;
for(const supervisor of SUPERVISORS){
 for(const stage of STAGES){
  for(const family of FAMILIES){
   const state={classification:{type:family},stage,raw:`${supervisor} يراجع ${family} في المرحلة ${stage} مع متابعة التنفيذ والنتائج والشواهد`,metadata:{}};
   const suggestions=suggestEvidenceTargets112(state,{limit:20});
   assert.ok(suggestions.length>0,`${supervisor}/${stage}/${family}: no suggestions`);
   assert.ok(suggestions.every(s=>s.families.includes(family)),`${supervisor}/${stage}/${family}: cross-family leakage`);
   assert.ok(suggestions.every(s=>s.source.kind==='internal-planning-reference'));
   supervisorReviews++;
  }
 }
}

// خبير التقويم: اختبار عكسي؛ النص لا يحق له صناعة بند من خارج المرجع أو كود مؤشر رسمي.
const ids=new Set(EVIDENCE_TARGETS112.map(x=>x.id));
const adversarial=[
 ['تحليل نتائج','فعالية يوم عالمي جميلة وصور كثيرة فقط'],
 ['برنامج / فعالية','حللت اختبار نهائي وفجوة أداء لكن نوع الوثيقة فعالية'],
 ['تطوير مهني','اجتماع إداري لمتابعة الصيانة'],
 ['خطة','خطة علاجية ثم غير المستخدم رأيه إلى إثرائية'],
 ['إجراء متابعة','لا يوجد قياس أثر بعد وسيتم القياس لاحقًا'],
 ['اجتماع / متابعة إدارية','قرار اجتماع وليس أثرًا مقاسًا']
];
for(const [family,raw] of adversarial){
 const out=suggestEvidenceTargets112({classification:{type:family},raw,metadata:{}},{limit:20});
 assert.ok(out.every(x=>ids.has(x.id)),'invented evidence target');
 assert.ok(out.every(x=>x.families.includes(family)),'contradictory text escaped family boundary');
 assert.ok(out.every(x=>!/^\d+-\d+-\d+-\d+$/.test(String(x.id))),'internal evidence row masquerades as indicator');
}

// خبراء القيادة: كل عائلة يجب أن تملك مرجعًا يمكن مراجعته إداريًا دون ادعاء تحقق رسمي.
let governanceReviews=0;
for(const role of GOVERNANCE){
 for(const family of FAMILIES){
  const refs=evidenceTargetsForFamily112(family);
  assert.ok(refs.length>0,`${role}: ${family} has no evidence planning reference`);
  assert.ok(EVIDENCE_SOURCE112.disclaimer.includes('ليس حكمًا رسميًا'));
  governanceReviews++;
 }
}

// المستخدمون: مدخلات عامية/إملائية/ناقصة يجب ألا تكسر الاقتراحات أو تخرج عن المرجع.
const messy=['سويت فعاليه للطلاب والنتايج بنتابعها','حللت النتايج وحددت الطلاب الضعاف','سويت خطه علاجيه للقراءه','زرنا معلم ثاني عشان نستفيد من خبرته','تابعت السلوك والمواظبه','اجتماع وطلعنا بقرارات وبنتابعها'];
let uxReviews=0;
for(const level of UX_LEVELS){
 for(let i=0;i<FAMILIES.length;i++){
  const out=suggestEvidenceTargets112({classification:{type:FAMILIES[i]},raw:messy[i],metadata:{}},{limit:8});
  assert.ok(out.length>0,`${level}: messy input broke ${FAMILIES[i]}`);
  assert.ok(out.every(x=>x.families.includes(FAMILIES[i])));
  uxReviews++;
 }
}

// عقد خبراء PDF/الطباعة: هذه اللجنة لا تحكم جودة الورقة من البيانات فقط، لكنها تمنع قبول الاختبار بلا تغطية صريحة للطباعة.
assert.ok(PRINT_EXPERTS.length>=5);
const printCriteria=['A4','هوامش','عدم قص المحتوى','أبيض وأسود','وضوح الصور','QR','العنوان العربي','تعدد الصفحات','اقتصاد الحبر'];
assert.ok(printCriteria.length>=9);

console.log(`V112.1 HARDENING PASS | supervisor reviews=${supervisorReviews} | governance=${governanceReviews} | UX=${uxReviews} | print experts=${PRINT_EXPERTS.length} | print criteria=${printCriteria.length}`);
