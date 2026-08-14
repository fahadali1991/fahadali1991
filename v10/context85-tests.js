import {analyze} from './engine85.js?v=85';
const cases=[
 ['فعالية لغة عربية','سوينا فعالية عن اليوم العالمي للغة العربية لطلاب ثاني متوسط فيها مسابقة قراءة وركن خط وصورنا الطلاب',{type:'برنامج / فعالية',topic:'تعزيز اللغة العربية',stage:'متوسط',grade:'الثاني المتوسط',occasion:'اليوم العالمي للغة العربية',method:'مسابقة أو تحدٍ',evidence:'صور التنفيذ'}],
 ['أمن وسلامة','نفذت برنامج توعوي عن الامن والسلامه لطلاب الاول متوسط وشرحت الاخلاء وسوينا تدريب عملي داخل المدرسة',{type:'برنامج / فعالية',topic:'تعزيز الأمن والسلامة',stage:'متوسط',grade:'الأول المتوسط',method:'تطبيق عملي',place:'داخل المدرسة'}],
 ['قراءة','سويت برنامج للطلاب ثالث متوسط لأن عندهم ضعف في القراءة، أنشطة جماعية وفردية وصورت التنفيذ',{type:'برنامج / فعالية',topic:'تنمية مهارات القراءة والفهم القرائي',stage:'متوسط',grade:'الثالث المتوسط',reason:'تنمية مهارة محددة',method:'أنشطة جماعية',evidence:'صور التنفيذ'}],
 ['تقنية','نفذنا نشاط لطلاب ثاني متوسط باستخدام منصة مدرستي وتطبيقات رقمية',{type:'برنامج / فعالية',topic:'توظيف التقنية في التعليم',stage:'متوسط',grade:'الثاني المتوسط',method:'توظيف التقنية والمنصات الرقمية',place:'عن بُعد'}],
 ['تحليل تشخيصي','حللت نتائج الاختبار التشخيصي لطلاب ثاني متوسط وظهر ضعف وحددت الطلاب المتعثرين',{type:'تحليل نتائج',stage:'متوسط',grade:'الثاني المتوسط',basis:'اختبار تشخيصي',finding:'مهارات منخفضة الإتقان',action:'تحديد الطلاب المتعثرين'}],
 ['تحليل وخطة لاحقة','شفنا الدرجات وبعدها سوينا خطة علاجية للطلاب المحتاجين للدعم',{type:'تحليل نتائج',action:'بناء خطة علاجية'}],
 ['اجتماع','جلسنا مع المعلمين لمتابعة مستوى الانجاز وناقشنا التحديات ووزعنا المهام',{type:'اجتماع / متابعة إدارية',aud:'المعلمون',purpose:'مراجعة مستوى الإنجاز',work:'مناقشة التحديات والمعوقات',product:'تكليف مسؤول أو فريق'}],
 ['خطة علاجية','سويت خطة علاجية لطلاب ثاني متوسط بناء على نتائج الاختبار',{type:'خطة',stage:'متوسط',grade:'الثاني المتوسط',basis:'نتائج تقويم أو اختبارات',goal:'معالجة فجوة محددة'}],
 ['متابعة غياب','شيكت على غياب الطلاب وكلمت أولياء الامور للحالات المتكررة',{type:'إجراء متابعة',aud:'الطلاب'}],
 ['تطوير حضور','اخذت دورة عن استراتيجيات التدريس للمعلمين',{type:'تطوير مهني',pd:'received',aud:'المعلمون'}],
 ['تطوير تنفيذ','قدمت ورشة للمعلمين عن استراتيجيات التدريس',{type:'تطوير مهني',pd:'delivered',aud:'المعلمون'}],
 ['تأسيس','فعلنا يوم التأسيس للطلاب وسوينا اركان وصورنا الفعالية',{type:'برنامج / فعالية',occasion:'يوم التأسيس',method:'أركان ومحطات',evidence:'صور التنفيذ'}],
 ['إعاقة','سوينا فعالية يوم الاعاقة للطلاب فيها اركان توعوية',{type:'برنامج / فعالية',occasion:'اليوم الدولي للأشخاص ذوي الإعاقة',method:'أركان ومحطات'}],
 ['محضر','عقدنا اجتماع مع المعلمين لمراجعة النتائج وكتبنا محضر',{type:'اجتماع / متابعة إدارية',aud:'المعلمون',evidence:'محضر الاجتماع'}],
 ['شهادة','حضرت ورشة تطوير مهني وعندي شهادة',{type:'تطوير مهني',pd:'received',evidence:'الشهادة أو إثبات المشاركة'}]
];
function includes(a,v){return Array.isArray(a)&&a.includes(v)}
function check(s,e){const x=s.metadata?.context85||{},fd=x.familyDetails||{};return(!e.type||s.classification?.type===e.type)&&(!e.topic||x.topic===e.topic)&&(!e.stage||x.stage===e.stage)&&(!e.grade||includes(x.grades,e.grade))&&(!e.occasion||x.occasion===e.occasion)&&(!e.method||includes(x.methods,e.method))&&(!e.evidence||includes(x.evidence,e.evidence))&&(!e.place||x.placeMode===e.place)&&(!e.reason||x.reason===e.reason)&&(!e.aud||includes(x.audiences,e.aud))&&(!e.pd||x.pdRole===e.pd)&&(!e.basis||fd.basis===e.basis)&&(!e.finding||fd.finding===e.finding)&&(!e.action||fd.action===e.action)&&(!e.purpose||fd.purpose===e.purpose)&&(!e.work||fd.work===e.work)&&(!e.product||fd.product===e.product)&&(!e.goal||fd.goal===e.goal)}
export function runContext85Tests(){return cases.map(([name,raw,expected])=>{const state=analyze(raw,'smart');return{name,raw,expected,actual:{type:state.classification?.type,context:state.metadata?.context85},pass:check(state,expected)}})}
export const CONTEXT85_TEST_COUNT=cases.length;
