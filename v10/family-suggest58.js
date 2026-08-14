const norm=s=>String(s||'').toLowerCase().replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0600-\u06ff0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const has=(t,...ks)=>ks.some(k=>t.includes(norm(k)));
export function inferFamilyDetails(state){
 const t=norm(state.raw||state.topic||''),type=state.classification?.type||'',out={};
 const add=(id,v)=>{out[id]=[...(out[id]||[]),v]};
 if(type==='برنامج / فعالية'){
  if(has(t,'توعيه','وعي')) add('goal','رفع مستوى الوعي بالموضوع');
  if(has(t,'مهاره','تدريب')) add('reason','تنمية مهارة محددة');
  if(has(t,'وطني','يوم التأسيس','مناسبه')) add('reason','تفعيل مناسبة تربوية أو وطنية');
  if(has(t,'مسابقه','تحدي')) add('method','مسابقة أو تحدٍ');
  if(has(t,'ورشه')) add('method','ورشة مصغرة');
  if(has(t,'عرض','مناقشه')) add('method','عرض ومناقشة');
  if(has(t,'تطبيق عملي','تطبيق')) add('method','تطبيق عملي');
  if(has(t,'تقنيه','منصه','رقمي')) add('method','توظيف التقنية والمنصات الرقمية');
  if(has(t,'منتج','اعمال')) add('product','أعمال أو منتجات للمستفيدين');
  if(has(t,'توصيات')) add('product','توصيات قابلة للتنفيذ');
  if(has(t,'استبانه','رضا')) add('follow','قياس رضا المستفيدين');
 }
 if(type==='اجتماع / متابعة إدارية'){
  if(has(t,'متابعه')) add('purpose','متابعة تنفيذ أعمال سابقة');
  if(has(t,'نتائج','بيانات')){add('purpose','دراسة نتائج أو بيانات');add('work','استعراض البيانات والنتائج')}
  if(has(t,'مشكله','تحدي')) add('purpose','معالجة مشكلة قائمة');
  if(has(t,'تخطيط','قادم')) add('purpose','التخطيط لعمل قادم');
  if(has(t,'تكليف','مسؤول')) add('product','تكليف مسؤول أو فريق');
  if(has(t,'خطه')) add('product','إعداد خطة عمل');
  if(has(t,'موعد')) add('product','تحديد موعد للتنفيذ');
  if(has(t,'توصيه')) add('product','رفع توصية للجهة المختصة');
 }
 if(type==='تحليل نتائج'){
  if(has(t,'تشخيصي')) add('basis','اختبار تشخيصي');
  if(has(t,'اختبار فتره','الفتره')) add('basis','اختبار فترة');
  if(has(t,'نهائي')) add('basis','اختبار نهائي');
  if(has(t,'وطني','نافس')) add('basis','اختبار وطني عند انطباقه');
  if(has(t,'متعثر','متعثرين')) add('finding','وجود طلاب متعثرين');
  if(has(t,'تفاوت','مستويات')) add('finding','تفاوت واضح بين مستويات الطلاب');
  if(has(t,'ضعف','منخفض')) add('finding','ضعف في مهارة أو مجموعة مهارات');
  if(has(t,'تحسن')) add('finding','تحسن عن فترة سابقة');
  if(has(t,'متفوق','متفوقين')) add('finding','وجود فئة متفوقة تحتاج إثراء');
  if(has(t,'علاجي','علاجيه')) add('action','بناء خطة علاجية');
  if(has(t,'اثرائي','اثرائيه')) add('action','إعداد أنشطة إثرائية للمتفوقين');
  if(has(t,'اعاده تدريس')) add('action','إعادة تدريس المهارات المستهدفة');
 }
 if(type==='خطة'){
  if(has(t,'تقويم ذاتي')) add('basis','نتائج تقويم ذاتي');
  if(has(t,'اختبار','نتائج')) add('basis','نتائج تقويم أو اختبارات');
  if(has(t,'احتياج')) add('basis','احتياج محدد لدى الفئة');
  if(has(t,'مشكله','تحدي')) add('basis','تحدٍ أو مشكلة قائمة');
  if(has(t,'تحصيل')) add('goal','رفع مستوى التحصيل');
  if(has(t,'تطوير مهني')) add('goal','تطوير ممارسة مهنية');
  if(has(t,'متابعه')) add('goal','رفع جودة المتابعة');
 }
 if(type==='إجراء متابعة'){
  if(has(t,'غياب')) add('goal','رصد الغياب بدقة');
  if(has(t,'تاخر')) add('goal','رصد التأخر');
  if(has(t,'انضباط')) add('goal','رفع مستوى الانضباط');
  if(has(t,'يومي')) add('method','متابعة يومية');
  if(has(t,'اسبوعي')) add('method','متابعة أسبوعية');
  if(has(t,'اتصال','تواصل')) add('method','تواصل هاتفي');
 }
 return out;
}
