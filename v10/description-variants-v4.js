import {joinAr} from './engine.js';
import {displayAudiences,selectedGoals,smartTitle,executionDescription} from './output-quality.js';

const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const firstSentences=(text,n)=>{const parts=String(text||'').match(/[^.!؟]+[.!؟]?/g)||[text];return clean(parts.slice(0,n).join(' '));};

function familyTail(s){
  const t=s.classification.type;
  if(t==='برنامج / فعالية')return 'وروعي أثناء التنفيذ تنوع المشاركة وربط الأنشطة بطبيعة الفئة المستفيدة، مع إبراز المخرجات المباشرة التي نتجت عن العمل دون افتراض أثر لم يتم قياسه.';
  if(t==='اجتماع / متابعة إدارية')return 'كما نُظمت المحاور بما يساعد على وضوح القرارات والمسؤوليات، وتوثيق ما انتهى إليه الاجتماع بصورة قابلة للرجوع والمتابعة الإدارية.';
  if(t==='تحليل نتائج')return 'وركزت المعالجة على قراءة البيانات بصورة منظمة وربط النتائج بالاحتياجات التعليمية، بما يساعد على تحديد الأولويات وبناء إجراءات أكثر دقة.';
  if(t==='خطة')return 'وروعي في بناء الخطة وضوح الأدوار وترتيب الإجراءات وربطها بالهدف العام، بحيث تكون قابلة للتنفيذ والتوثيق والمتابعة وفق طبيعة العمل.';
  if(t==='إجراء متابعة')return 'وتم تنظيم بيانات المتابعة بصورة تسهّل الرجوع إليها وتحديد الحالات التي تحتاج إلى تدخل أو استكمال إجراء، مع توثيق ما تم اتخاذه.';
  if(t==='تطوير مهني')return 'وركز التنفيذ على تحويل المحتوى المهني إلى استفادة عملية قابلة للتطبيق، وربط ما تم تعلمه بالممارسة الفعلية في بيئة العمل.';
  return 'وتم تنظيم التنفيذ بصورة عملية تراعي طبيعة الفئة المستفيدة وتوثق ما تحقق أثناء العمل بصورة واضحة.';
}

function bulletItems(s){
  const a=displayAudiences(s),g=selectedGoals(s),items=[];
  items.push(`تنفيذ ${smartTitle(s)} لصالح ${joinAr(a)||'الفئة المستفيدة'}.`);
  if(s.metadata.place)items.push(`تم التنفيذ في ${s.metadata.place}.`);
  if(s.metadata.duration)items.push(`استغرق التنفيذ ${s.metadata.duration}.`);
  g.slice(0,3).forEach(x=>items.push(`توجيه التنفيذ نحو ${x}.`));
  if(items.length<5)items.push('تنظيم العمل بما يراعي مشاركة المستفيدين وطبيعة المهمة المنفذة.');
  if(items.length<6)items.push('توثيق المخرجات المباشرة الناتجة عن التنفيذ وفق ما تم إنجازه فعليًا.');
  return items.slice(0,Math.min(7,Math.max(3,items.length)));
}

export function descriptionVariants(s){
  const base=executionDescription(s);
  const medium=base;
  const short=firstSentences(base,2);
  const long=clean(`${base} ${familyTail(s)} ${selectedGoals(s).length?'وقد أسهم اعتماد الأهداف المختارة في توجيه صياغة التنفيذ وترتيب مخرجاته دون تكرارها حرفيًا داخل التقرير.':''}`);
  const bullets=bulletItems(s);
  return [
    {id:'short',label:'مختصر',help:'صياغة مباشرة ومناسبة للتوثيق السريع',mode:'text',text:short},
    {id:'medium',label:'متوسط',help:'تفاصيل متوازنة للاستخدام اليومي',mode:'text',text:medium},
    {id:'long',label:'مفصل',help:'نص أطول للوثائق التي تحتاج شرحًا أوسع',mode:'text',text:long},
    {id:'bullets',label:'على شكل نقاط',help:`${bullets.length} نقاط مرتبة حسب المدخلات`,mode:'bullets',items:bullets,text:bullets.map(x=>`• ${x}`).join('\n')}
  ];
}
