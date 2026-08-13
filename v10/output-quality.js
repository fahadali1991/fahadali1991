import {joinAr} from './engine.js';

const vals=(state,id)=>state.answers[id]||[];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const listText=(a,f='')=>joinAr(a)||f;

export function displayAudiences(state){
  const a=(state.audiences||[]).map(x=>x==='فئة أخرى'?(state.metadata.otherAudience||'فئة أخرى'):x);
  return a.filter(Boolean);
}

export function smartTitle(state){
  if(state.metadata.titleManual&&state.metadata.workTitle)return clean(state.metadata.workTitle);
  const type=state.classification.type,sub=state.classification.subtype||'',base=state.metadata.workTitle||sub||type;
  const grades=state.grades||[],A=displayAudiences(state),topic=state.topic||'';
  const goal=vals(state,'goal')[0]||vals(state,'purpose')[0]||vals(state,'action')[0]||'';
  let title=base;
  if(type==='برنامج / فعالية')title=topic?`${sub||'برنامج'} ${topic}`:goal?`${sub||'برنامج'} ${goal}`:base;
  if(type==='تطوير مهني')title=topic?`${sub||'نشاط تطوير مهني'} في ${topic}`:goal?`${sub||'نشاط تطوير مهني'} لـ${goal}`:base;
  if(type==='تحليل نتائج')title=topic?`${sub||'تحليل نتائج'} في ${topic}`:goal?`${sub||'تحليل نتائج'} بهدف ${goal}`:base;
  if(type==='خطة')title=topic?`${sub||'خطة'} لـ${topic}`:goal?`${sub||'خطة'} لـ${goal}`:base;
  if(type==='اجتماع / متابعة إدارية'&&goal)title=`${sub||'اجتماع'} بشأن ${goal}`;
  if(type==='إجراء متابعة'&&goal)title=`${sub||'إجراء متابعة'} لـ${goal}`;
  const target=grades.length?grades.join(' و'):A.length===1?A[0]:'';
  if(target&&!title.includes(target))title=`${title} لدى ${target}`;
  return clean(title);
}

export function goalsFor(state){
  const t=state.classification.type;
  if(t==='اجتماع / متابعة إدارية')return vals(state,'purpose');
  if(t==='تحليل نتائج')return vals(state,'action').length?vals(state,'action'):['تحليل النتائج وتحديد أولويات التحسين'];
  if(t==='إجراء متابعة')return vals(state,'goal');
  return vals(state,'goal').length?vals(state,'goal'):vals(state,'reason');
}

export function executionDescription(state){
  const t=state.classification.type,name=smartTitle(state),A=listText(displayAudiences(state),'الفئة المستفيدة');
  const parts=[];

  if(t==='برنامج / فعالية'){
    const reason=listText(vals(state,'reason'),'احتياج تربوي مرتبط بموضوع العمل');
    const method=listText(vals(state,'method'),'أساليب مناسبة لطبيعة النشاط');
    const participation=listText(vals(state,'participation'),'مشاركة المستفيدين أثناء التنفيذ');
    const product=listText(vals(state,'product'),'مخرجات مباشرة مرتبطة بالتنفيذ');
    parts.push(`نُفذ ${name} لخدمة ${A} استجابةً إلى ${reason}. وتم تنفيذ العمل من خلال ${method}، مع توجيه الأنشطة نحو مشاركة المستفيدين بصورة عملية.`);
    if(vals(state,'participation').length)parts.push(`وخلال التنفيذ لوحظ ${participation}.`);
    parts.push(`وأسفر التنفيذ عن ${product}، بما يوثق ما تحقق مباشرة أثناء العمل دون افتراض نتائج لم يتم قياسها.`);
  }
  else if(t==='اجتماع / متابعة إدارية'){
    parts.push(`عُقد ${name} لمناقشة ${listText(vals(state,'work'),'المحاور المرتبطة بموضوع الاجتماع')}، وتمت مراجعة ما يرتبط بالموضوع وترتيب الأولويات بين الأطراف ذات العلاقة.`);
    parts.push(`وانتهى الاجتماع إلى ${listText(vals(state,'product'),'قرارات ومخرجات تنظيمية محددة')}، بما يحول النقاش إلى إجراءات ومسؤوليات واضحة.`);
  }
  else if(t==='تحليل نتائج'){
    parts.push(`أُجري ${name} بالاعتماد على ${listText(vals(state,'basis'),'البيانات والنتائج المتاحة')} لدى ${A}، بهدف فهم مستوى الأداء وتحديد الجوانب التي تستدعي التدخل.`);
    parts.push(`وأظهر التحليل ${listText(vals(state,'finding'),'مؤشرات مرتبطة بمستوى الأداء')}. ${vals(state,'cause').length?`كما برزت أسباب محتملة من بينها ${listText(vals(state,'cause'))}. `:''}وبناءً على ذلك تم ${listText(vals(state,'action'),'تحديد إجراءات التحسين المناسبة')}.`);
  }
  else if(t==='خطة'){
    parts.push(`أُعدت ${name} استنادًا إلى ${listText(vals(state,'basis'),'احتياج أو بيانات محددة')} لدى ${A}، وتم تنظيمها لتترجم الأولويات إلى إجراءات قابلة للتنفيذ.`);
    parts.push(`وتشمل إجراءات التنفيذ ${listText(vals(state,'method'),'إجراءات محددة مرتبطة بالمسؤوليات والزمن')}، بما يدعم وضوح الأدوار وترتيب العمل بصورة منظمة.`);
  }
  else if(t==='إجراء متابعة'){
    parts.push(`نُفذ ${name} لخدمة ${A} من خلال ${listText(vals(state,'method'),'وسائل متابعة منظمة')}، بهدف توفير رصد واضح يمكن الرجوع إليه عند الحاجة.`);
    if(vals(state,'action').length)parts.push(`وبناءً على ما ظهر أثناء المتابعة تم اتخاذ إجراءات شملت ${listText(vals(state,'action'))}.`);
    if(vals(state,'outcome').length)parts.push(`وأظهر الرصد الحالي ${listText(vals(state,'outcome'))}.`);
  }
  else if(t==='تطوير مهني'){
    parts.push(`نُفذ ${name} لخدمة ${A} استجابةً إلى ${listText(vals(state,'reason'),'احتياج مهني مرتبط بالممارسة التعليمية')}. وتم التنفيذ من خلال ${listText(vals(state,'method'),'أساليب تدريب وتبادل خبرات مناسبة')}.`);
    parts.push(`وأسفر النشاط عن ${listText(vals(state,'product'),'مخرجات مهنية قابلة للتطبيق')}، بما يدعم الاستفادة العملية من محتوى النشاط.`);
  }

  return clean(parts.join(' '));
}

export function evidenceItems(state){
  switch(state.classification.type){
    case 'برنامج / فعالية':return ['صور التنفيذ','كشف أو سجل المستفيدين','نماذج من الأعمال أو المنتجات إن وجدت'];
    case 'اجتماع / متابعة إدارية':return ['محضر الاجتماع','كشف الحضور','القرارات أو التكليفات الناتجة'];
    case 'تحليل نتائج':return ['كشف أو تقرير النتائج','نموذج تحليل النتائج','الإجراء العلاجي أو الإثرائي إن وجد'];
    case 'خطة':return ['نسخة الخطة','جدول الإجراءات والمسؤوليات','الشواهد المرتبطة بالتنفيذ عند توفرها'];
    case 'إجراء متابعة':return ['سجل أو كشف المتابعة','أداة الرصد المستخدمة','ما يثبت الإجراء المتخذ عند وجوده'];
    case 'تطوير مهني':return ['شهادة أو محضر النشاط بحسب الحالة','كشف الحضور عند انطباقه','مادة أو منتج مهني مرتبط بالنشاط'];
    default:return ['مستند التنفيذ الأساسي','كشف المستفيدين أو الحضور','مرفقات داعمة للعمل'];
  }
}
