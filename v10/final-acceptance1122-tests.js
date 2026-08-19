import assert from 'node:assert/strict';
import fs from 'node:fs';
import {descriptionVariants88} from './description-variants88.js';
import {pdfModel107} from './pdf-model107.js';
import {pdfPreview107} from './pdf-renderer107.js';

const OUTPUT=new URL('../v1122-acceptance-samples.html',import.meta.url);
const FAMILIES=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني','شراكة مجتمعية','صيانة وتجهيزات'];
const forbidden=/undefined|null|\[object Object\]|UserChoice|MeasuredResult|Inference|عنوان الوثيقة|الفئة المستفيدة/u;
const claims=/تحقق الأثر|أثبتت النتائج|أظهرت النتائج تحسنًا|تم التحقق من النتيجة/u;
const svg=(label,color)=>`data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560"><rect width="100%" height="100%" fill="${color}"/><rect x="35" y="35" width="830" height="490" rx="24" fill="white" opacity=".9"/><text x="450" y="285" text-anchor="middle" font-family="Arial" font-size="42" fill="#173b38">${label}</text></svg>`)}`;

const definitions=[
 {family:'برنامج / فعالية',subtype:'برنامج',title:'برنامج قارئ اليوم قائد الغد',subject:'اللغة العربية',goal:'رفع دقة الفهم القرائي لدى طلاب الصف الثاني المتوسط',details:{skillFocus:'استنتاج الفكرة الرئيسة',reason:'انخفاض إتقان مهارة استنتاج الفكرة الرئيسة في القياس التشخيصي',goal:'رفع دقة الفهم القرائي لدى طلاب الصف الثاني المتوسط',method:'قراءة موجهة|||مناقشة الأدلة النصية|||تطبيق فردي قصير',participation:'شارك 24 طالبًا وأكمل 21 منهم التطبيق',measurement:'لم يتم القياس بعد',follow:'إعادة تطبيق مهمة مماثلة بعد أسبوعين'},images:3},
 {family:'اجتماع / متابعة إدارية',subtype:'اجتماع',title:'اجتماع متابعة الخطط العلاجية',subject:'الرياضيات',goal:'توحيد إجراءات متابعة الخطط العلاجية',details:{purpose:'مراجعة تقدم تنفيذ الخطط العلاجية',work:'نسب الإنجاز|||العوائق|||موعد إعادة القياس',product:'اعتماد نموذج متابعة أسبوعي|||تحديد موعد إعادة القياس',owner:'وكيل الشؤون التعليمية|||معلمو المواد',follow:'مراجعة سجل المتابعة يوم 25/03/1448 هـ'}},
 {family:'تحليل نتائج',subtype:'تحليل نتائج',title:'تحليل نتائج الاختبار التشخيصي في الرياضيات',subject:'الرياضيات',goal:'تحديد فجوات التعلم ذات الأولوية',details:{skillFocus:'حل المسائل اللفظية',basis:'نتائج الاختبار التشخيصي للصف الثاني المتوسط',finding:'أتقن 11 طالبًا من أصل 28 مهارة تحديد العملية المناسبة',cause:'تظهر الإجابات الخاطئة صعوبة في تحويل المعطيات اللفظية إلى علاقة رياضية',action:'تدريب متدرج على تحليل المعطيات|||نمذجة أمثلة محلولة',follow:'إعادة قياس المهارة بعد ثلاثة أسابيع',measurement:'لم يتم القياس بعد'}},
 {family:'خطة',subtype:'خطة علاجية',title:'الخطة العلاجية لمهارة حل المسائل اللفظية',subject:'الرياضيات',goal:'رفع عدد الطلاب المتقنين للمهارة',details:{skillFocus:'حل المسائل اللفظية',basis:'نتائج الاختبار التشخيصي',goal:'رفع عدد الطلاب المتقنين من 11 إلى 20 طالبًا',method:'تدريب متدرج|||بطاقات مسائل قصيرة|||تغذية راجعة فورية',owner:'معلم الرياضيات',follow:'متابعة أسبوعية وإعادة القياس في نهاية الأسبوع الثالث',measurement:'اختبار قبلي وبعدي'}},
 {family:'إجراء متابعة',subtype:'متابعة',title:'متابعة انتظام الواجبات المنزلية',subject:'العلوم',goal:'رفع انتظام تسليم الواجبات',details:{skillFocus:'الالتزام بالواجبات',goal:'رفع انتظام تسليم الواجبات',method:'سجل أسبوعي للتسليم',basis:'بلغت نسبة التسليم السابقة 61٪',status:'ارتفعت نسبة التسليم الحالية إلى 79٪',action:'التواصل مع الطلاب المتأخرين وتجزئة المهام',follow:'مراجعة النسبة نهاية كل أسبوع'}},
 {family:'تطوير مهني',subtype:'ورشة عمل',title:'ورشة بناء أسئلة الفهم العميق',subject:'اللغة العربية',goal:'تحسين جودة الأسئلة الصفية',details:{skillFocus:'صياغة أسئلة الفهم العميق',need:'أظهرت مراجعة التحضير غلبة الأسئلة المباشرة',method:'تحليل نماذج|||صياغة أسئلة|||مراجعة الأقران',application:'لم يبدأ التطبيق بعد',follow:'زيارة تبادلية بعد أسبوع من التطبيق',measurement:'لم يتم القياس بعد'}},
 {family:'شراكة مجتمعية',subtype:'شراكة',title:'شراكة الأسرة لدعم القراءة المنزلية',subject:'اللغة العربية',goal:'تعزيز القراءة المنزلية المنتظمة',details:{reason:'تعزيز القراءة المنزلية المنتظمة',method:'لقاء تعريفي للأسر|||سجل قراءة أسبوعي|||رسائل إرشادية',participation:'شارك 32 ولي أمر في اللقاء',measurement:'استبانة رضا أولياء الأمور'},partnerName:'مركز الحي',partnerRole:'استضافة اللقاء والمساهمة في نشر المواد',images:1},
 {family:'صيانة وتجهيزات',subtype:'صيانة',title:'معالجة تعطل جهاز العرض في معمل العلوم',subject:'العلوم',goal:'استعادة جاهزية معمل العلوم',details:{reason:'توقف جهاز العرض عن إظهار الصورة',method:'فحص التوصيلات|||استبدال وصلة العرض|||اختبار التشغيل',status:'تمت المعالجة وعاد الجهاز للعمل',follow:'فحص الجاهزية في بداية الأسبوع المقبل'},images:2}
];

function sample(def,index){
 const state={raw:`توثيق حقيقي للعينة ${index+1}`,topic:def.details.skillFocus||def.goal,classification:{type:def.family,subtype:def.subtype},metadata:{workTitle:def.title,selectedTitle:def.title,executorName:index===1?'وكيل الشؤون التعليمية':'فهد علي مدخلي',approverName:'مدير المدرسة',schoolName:'متوسطة حطين',educationOffice:'مكتب تعليم نجران',schoolYear:'1448 هـ',dateDisplay:`${12+index}/03/1448 هـ`,durationChoice:index%2?'أسبوعان':'حصة واحدة',duration:index%2?'أسبوعان':'حصة واحدة',placeMode:'داخل المدرسة',place:index===7?'معمل العلوم':'قاعة التعلم',count:String(24+index),partnerName:def.partnerName||'',partnerRole:def.partnerRole||'',familyDetails:{subject94:def.subject,...def.details},evidenceLink:`https://example.edu.sa/evidence/${index+1}`,guideLinks76:[{code:`D${index+1}`,text:'ارتباط مقترح يحتاج اعتماد مالك الصلاحية'}]},audiences:index===1?['المعلمون']:['الطلاب'],stage:'متوسط',grades:index===1?[]:['الثاني المتوسط'],answers:{goals:[def.goal],evidence:['صور التنفيذ','كشف الحضور','نموذج المتابعة']},attachments:Array.from({length:def.images||0},(_,i)=>({name:`شاهد ${i+1}`,caption:`شاهد ${i+1} — ${def.title}`,type:'image/svg+xml',previewUrl:svg(`شاهد ${i+1}`,['#dcefeb','#e9e3d5','#dfe5f2'][i%3])}))};
 const variants=descriptionVariants88(state);state.metadata.generatedDescription=variants.find(x=>x.id==='medium').text;return{state,variants};
}

const samples=definitions.map(sample),failures=[];let checks=0;
const check=(ok,msg)=>{checks++;if(!ok)failures.push(msg)};
for(const [index,{state,variants}] of samples.entries()){
 const def=definitions[index],model=pdfModel107(state,{mode:'grayscale'}),html=pdfPreview107(state,{mode:'grayscale'}),plain=html.replace(/<[^>]+>/g,' ');
 check(model.plan.family===def.family,`${def.family}: تغيرت عائلة الوثيقة`);
 check(model.plan.schemaId!==undefined,`${def.family}: لا يوجد مخطط PDF`);
 for(const required of [def.title,state.metadata.executorName,state.metadata.dateDisplay,state.metadata.schoolName])check(plain.includes(required),`${def.family}: فقدت الوثيقة المعلومة «${required}»`);
 const purpose=[def.goal,def.details.goal,def.details.reason,def.details.purpose,def.details.basis,def.details.need].filter(Boolean);
 check(purpose.some(value=>plain.includes(value)),`${def.family}: الغرض غير ظاهر في اختبار 30 ثانية`);
 check(/pdfDocType107/.test(html)&&/pdfMeta107/.test(html)&&/pdfBottom107/.test(html),`${def.family}: الهرم البصري لا يدعم اختبار 30 ثانية`);
 check(!forbidden.test(plain),`${def.family}: قيمة تقنية أو افتراضية ظاهرة`);
 check((html.match(/<article class="pdfSheet107/g)||[]).length<=2,`${def.family}: تجاوزت الوثيقة صفحتين دون مبرر`);
 for(const variant of variants){const text=variant.text||variant.items.join(' ');check(text.includes(def.title),`${def.family}/${variant.id}: العنوان مفقود`);check(!forbidden.test(text),`${def.family}/${variant.id}: تسرب تقني`);check(text.length<=900,`${def.family}/${variant.id}: النص متضخم`);if(def.details.measurement==='لم يتم القياس بعد')check(!claims.test(text),`${def.family}/${variant.id}: ادعاء نتيجة غير مقاسة`)}
 if(def.images)check((html.match(/<figure class="pdfPhoto107/g)||[]).length===def.images,`${def.family}: عدد الصور لا يطابق المدخلات`);
}
check(new Set(definitions.map(x=>x.family)).size===FAMILIES.length,'العائلات الثماني غير ممثلة مرة واحدة');

const sampleHtml=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>عينات اعتماد V112.2</title><link rel="stylesheet" href="v10/styles.css"><link rel="stylesheet" href="v10/pdf-renderer107.css"><style>body{background:#eef3f1}.acceptanceHead{max-width:1100px;margin:28px auto;padding:20px;background:#fff;border-radius:16px}.acceptanceHead h1{margin:0 0 8px}.sampleLabel{max-width:210mm;margin:28px auto 8px;font:700 18px Arial;color:#173b38}.pdfToolbar107{display:none}</style></head><body><header class="acceptanceHead"><h1>عينات القبول النهائي V112.2</h1><p>ثماني وثائق حقيقية التكوين، واحدة من كل عائلة. هذه الصفحة للمعاينة البشرية ولا تعني اعتماد النسخة تلقائيًا.</p></header>${samples.map(({state},i)=>`<h2 class="sampleLabel">${i+1}. ${definitions[i].family}</h2>${pdfPreview107(state,{mode:i%2?'grayscale':'color'})}`).join('')}</body></html>`;
if(process.argv.includes('--write'))fs.writeFileSync(OUTPUT,sampleHtml);
else check(fs.existsSync(OUTPUT)&&fs.readFileSync(OUTPUT,'utf8')===sampleHtml,'صفحة العينات ليست محدثة؛ شغّل الاختبار مع --write');

console.log(`V112.2 FINAL ACCEPTANCE | samples=${samples.length} families=${FAMILIES.length} checks=${checks} failures=${failures.length}`);
for(const failure of failures)console.log(`FAIL | ${failure}`);
assert.deepEqual(failures,[],'V112.2 final acceptance blocked');
