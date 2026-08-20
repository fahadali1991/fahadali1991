import assert from 'node:assert/strict';
import fs from 'node:fs';
import {descriptionVariants88} from './description-variants88.js';
import {pdfModel107} from './pdf-model107.js';
import {pdfPreview107} from './pdf-renderer107.js';
import {PRINT_TOKENS107} from './pdf-layout107.js';

const PANEL=[
 'محرر عربي تربوي','مشرف تربوي تخصصي','مشرف تقويم مدرسي','قائد مدرسة','مدقق نماذج رسمية','مصمم معلومات','خبير طباعة مدرسية','أخصائي وصول بصري','معلم غير تقني'
];
const FAMILIES=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني','شراكة مجتمعية','صيانة وتجهيزات'];
const SUBJECTS=['اللغة العربية','الرياضيات','العلوم','اللغة الإنجليزية','القرآن الكريم والدراسات الإسلامية','المهارات الرقمية'];
const banned=/undefined|UserChoice|MeasuredResult|Inference|__answered|استجابةً لـ|التخطيط للتحقق منها|تنمية القرآن الكريم/u;
const issues=[];
const scores=Object.fromEntries(PANEL.map(x=>[x,{checks:0,fail:0}]));
const check=(role,ok,msg,critical=false)=>{scores[role].checks++;if(!ok){scores[role].fail++;issues.push({role,msg,critical})}};
function details(f,i){
 if(f==='برنامج / فعالية')return{skillFocus:'الفهم القرائي',reason:'تنمية مهارة محددة',goal:'تنمية المعرفة والفهم',method:'عرض ومناقشة|||تطبيق عملي',participation:'تفاعل مرتفع من المستفيدين',measurement:i%2?'لم يتم القياس بعد':'مقارنة قبل وبعد'};
 if(f==='اجتماع / متابعة إدارية')return{purpose:'مناقشة نتائج التحصيل الدراسي',work:'تحليل النتائج وتحديد الأولويات',product:'اعتماد إجراء علاجي',owner:'وكيل المدرسة',follow:'مراجعة التنفيذ بعد أسبوعين'};
 if(f==='تحليل نتائج')return{skillFocus:'حل المسائل اللفظية',basis:'اختبار تشخيصي',finding:'انخفاض إتقان مهارة حل المسائل اللفظية',cause:'ضعف في فهم المعطيات',action:'إعداد خطة علاجية',follow:'إعادة قياس المهارة',measurement:i%2?'لم يتم القياس بعد':'مقارنة نتائج القياس القبلي والبعدي'};
 if(f==='خطة')return{basis:'نتائج التقويم التشخيصي',goal:'رفع إتقان المهارة المستهدفة',method:'تدريب متدرج|||تطبيقات قصيرة',owner:'معلم المادة',follow:'متابعة أسبوعية',measurement:i%2?'لم يتم القياس بعد':'اختبار قبلي وبعدي'};
 if(f==='إجراء متابعة')return{goal:'تحسين انتظام أداء المهارة',method:'سجل متابعة',action:'تقديم دعم إضافي',follow:'مراجعة التقدم أسبوعيًا'};
 if(f==='تطوير مهني')return{need:'احتياج ظهر من تحليل الأداء',method:'ورشة تطبيقية',application:i%2?'لم يبدأ التطبيق بعد':'تطبيق الاستراتيجية في الصف',follow:'زيارة تبادلية',measurement:i%2?'لم يتم القياس بعد':'ملاحظة صفية قبل وبعد'};
 if(f==='شراكة مجتمعية')return{reason:'دعم تعلم الطلاب',method:'لقاء توعوي|||مشاركة الجهة',participation:'مشاركة جيدة من المستفيدين'};
 return{reason:'تعطل جهاز العرض',method:'فحص الجهاز واستبدال الوصلة',status:'تمت المعالجة',follow:'متابعة دورية'};
}
function state(f,i){const subject=SUBJECTS[i%SUBJECTS.length],d=details(f,i);return{raw:'نفذت العمل وتمت متابعته',topic:d.skillFocus||d.reason||'تحسين الأداء',classification:{type:f,subtype:f==='خطة'?'خطة علاجية':f==='برنامج / فعالية'?'برنامج':''},metadata:{workTitle:`${f==='برنامج / فعالية'?'برنامج':'وثيقة'} ${d.skillFocus||d.goal||d.reason||'تحسين الأداء'}`,selectedTitle:`${f==='برنامج / فعالية'?'برنامج':'وثيقة'} ${d.skillFocus||d.goal||d.reason||'تحسين الأداء'}`,executorName:'أحمد محمد',schoolName:'مدرسة الاختبار',educationOffice:'مكتب التعليم',dateDisplay:'10/03/1448 هـ',duration:'أسبوعان',durationChoice:'أسبوعان',placeMode:'داخل المدرسة',place:'المدرسة',familyDetails:{subject94:subject,...d}},audiences:['الطلاب'],stage:'متوسط',grades:['الثاني المتوسط'],answers:{goals:[d.goal||'تحسين الأداء'],evidence:['صور التنفيذ']},attachments:[]}}

let samples=0;
for(let i=0;i<32;i++){
 const family=FAMILIES[i%FAMILIES.length],s=state(family,i),vars=descriptionVariants88(s);samples++;
 for(const v of vars){const t=Array.isArray(v.items)?v.items.join(' '):String(v.text||'');
  check('محرر عربي تربوي',t.length>18,`${family}/${v.id}: نص قصير أو فارغ`,true);
  check('محرر عربي تربوي',!banned.test(t),`${family}/${v.id}: تسرب لفظ تقني أو صياغة مرفوضة`,true);
  check('محرر عربي تربوي',!/(\.\s*){2,}/.test(t),`${family}/${v.id}: علامات ترقيم مكررة`);
  check('محرر عربي تربوي',!/(وهدف|ونُفذ|وتابع|واستند)[^.!؟]{0,120}\1/u.test(t),`${family}/${v.id}: تكرار تركيبي ظاهر`);
  if(s.metadata.familyDetails.measurement==='لم يتم القياس بعد')check('مشرف تقويم مدرسي',!/تم التحقق|تحقق الأثر|أثبتت النتائج/u.test(t),`${family}/${v.id}: ادعاء أثر مع عدم وجود قياس`,true);
  check('مشرف تربوي تخصصي',t.includes(s.metadata.workTitle),`${family}/${v.id}: العنوان لم يحمل إلى النص`);
  check('معلم غير تقني',!/الفئة المستفيدة|عنوان الوثيقة|لا توجد بيانات إضافية/u.test(t),`${family}/${v.id}: عبارة افتراضية ظاهرة للمستخدم`);
 }
 const model=pdfModel107(s,{mode:'grayscale'});
 check('مدقق نماذج رسمية',model.sections.some(x=>x.def.id==='title'),`${family}: لا يوجد عنوان في نموذج PDF`,true);
 check('مدقق نماذج رسمية',model.sections.some(x=>x.def.id==='meta'),`${family}: لا توجد بيانات تنفيذ`,true);
 check('قائد مدرسة',model.sections.length>=6,`${family}: الوثيقة النهائية فقيرة في الأقسام`);
 const html=pdfPreview107(s,{mode:'grayscale'});
 check('مصمم معلومات',html.includes('pdfSheet107'),`${family}: لا توجد ورقة PDF مرئية`,true);
 check('مصمم معلومات',!html.includes('المعاينة الجديدة جاهزة حاليًا للبرامج والفعاليات'),`${family}: التصميم الجديد غير مطبق على هذه العائلة`,true);
}

const css=fs.readFileSync(new URL('./pdf-renderer107.css',import.meta.url),'utf8');
const bodyPt=Number(css.match(/\.pdfBullets107\{[^}]*font-size:([0-9.]+)pt/)?.[1]||0);
const captionPt=Number(css.match(/\.pdfPhoto107 figcaption\{[^}]*font-size:([0-9.]+)pt/)?.[1]||0);
check('خبير طباعة مدرسية',/@page\{size:A4/.test(css),'لا يوجد عقد A4 صريح',true);
check('خبير طباعة مدرسية',/data-print-mode="grayscale"/.test(css),'لا توجد معالجة واضحة للأبيض والأسود',true);
check('خبير طباعة مدرسية',bodyPt>=PRINT_TOKENS107.rules.minimumBodyPt,`حجم النص الأساسي ${bodyPt}pt أقل من العقد ${PRINT_TOKENS107.rules.minimumBodyPt}pt`,true);
check('أخصائي وصول بصري',captionPt>=PRINT_TOKENS107.rules.minimumCaptionPt,`تعليق الصورة ${captionPt}pt أقل من العقد ${PRINT_TOKENS107.rules.minimumCaptionPt}pt`,true);
check('أخصائي وصول بصري',/line-height:1\.7[05]/.test(css),'تباعد الأسطر غير كافٍ للنص العربي');
check('مصمم معلومات',/\.pdfHero107 h1\{[^}]*font-size:(1[7-9]|20)pt/.test(css),'العنوان الرئيسي خارج النطاق البصري المقترح');
check('خبير طباعة مدرسية',/\.pdfFooter107\{[^}]*background:transparent/.test(css),'التذييل يستهلك حبرًا داكنًا دون حاجة');

console.log('\nV112.2 QUALITY PANEL');
console.log(`Samples: ${samples} | Families: ${FAMILIES.length} | Panel roles: ${PANEL.length}`);
for(const [role,x] of Object.entries(scores)){const pass=x.checks-x.fail,rate=x.checks?Math.round(pass/x.checks*100):100;console.log(`${role}: ${pass}/${x.checks} (${rate}%)${x.fail?'  FAIL':''}`)}
if(issues.length){console.log('\nISSUES');for(const x of issues)console.log(`${x.critical?'CRITICAL':'MAJOR'} | ${x.role} | ${x.msg}`)}
const critical=issues.filter(x=>x.critical);
console.log(`\nCritical: ${critical.length} | Major: ${issues.length-critical.length}`);
assert.equal(issues.length,0,`V112.2 human-quality acceptance blocked by ${critical.length} critical and ${issues.length-critical.length} major issue(s)`);
