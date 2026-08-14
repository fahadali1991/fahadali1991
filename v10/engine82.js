import * as base from './engine.js?v=82';
export * from './engine.js?v=82';

const N=s=>base.norm(String(s||'')).replace(/[،,.؛;:!?؟]/g,' ').replace(/\s+/g,' ').trim();
const END='(?=\\s|$)';

function explicitType(raw){
  const n=N(raw);
  if(new RegExp(`^(?:تم )?(?:نفذت|نفذنا|نفذ|تنفيذ|اقمت|نظمت) (?:برنامجا?|برنامج|فعاليه|نشاط|مبادره|مسابقه|حمله)${END}`).test(n))return'برنامج / فعالية';
  if(new RegExp(`^(?:تم )?(?:عقدت|عقدنا|عقد|اجتمعت|اجتمعنا|تنفيذ) (?:اجتماع|لقاء اداري|محضر)${END}`).test(n))return'اجتماع / متابعة إدارية';
  if(new RegExp(`^(?:تم )?(?:حللت|حللنا|حلل|تحليل|راجعت|راجعنا) (?:نتائج|درجات|اداء|اختبار|اختبارات|بيانات تحصيليه)${END}`).test(n))return'تحليل نتائج';
  if(new RegExp(`^(?:تم )?(?:اعددت|اعددنا|اعداد|بنيت|بنينا|وضعت|وضعنا) (?:خطه|خطة)${END}`).test(n))return'خطة';
  if(new RegExp(`^(?:تم )?(?:تابعت|تابعنا|تابع|متابعه|متابعة|رصدت|رصدنا) (?:غياب|تاخر|تأخر|حضور|انضباط|مواظبه|حالات|تنفيذ|تكليفات)${END}`).test(n))return'إجراء متابعة';
  if(new RegExp(`^(?:تم )?(?:حضرت|حضرنا|قدمت|قدمنا|نفذت|نفذنا|نفذ) (?:برنامج تدريبي|دوره|دورة|ورشه|ورشة|مجتمع تعلم مهني|لقاء تبادل خبرات)${END}`).test(n))return'تطوير مهني';
  if(/(?:للمعلمين|للمعلمات|لمنسوبي المدرسه|للكادر|للهيئه التعليميه)(?=\s|$)/.test(n)&&/(?:تدريب|تطوير مهني|نمو مهني|ورشه|دوره|تبادل خبرات)/.test(n))return'تطوير مهني';
  return'';
}

function explicitSubtype(type,raw){
  const n=N(raw);
  if(type==='برنامج / فعالية')return /مسابقه/.test(n)?'مسابقة':/مبادره/.test(n)?'مبادرة':/حمله/.test(n)?'حملة':/فعاليه/.test(n)?'فعالية':/نشاط/.test(n)?'نشاط':'برنامج';
  if(type==='اجتماع / متابعة إدارية')return /نتائج|درجات/.test(n)?'اجتماع مراجعة نتائج':/حل مشكله|معالجه مشكله/.test(n)?'اجتماع حل مشكلة':/تخطيط|خطه قادمه/.test(n)?'اجتماع تخطيط':'اجتماع متابعة';
  if(type==='تحليل نتائج')return /علاجي|علاج|متعثر/.test(n)?'خطة علاجية':/اثرائي|إثرائي|متفوق/.test(n)?'خطة إثرائية':/متابعه تقدم|تقدم الطلاب/.test(n)?'متابعة تقدم':'تحليل نتائج';
  if(type==='خطة')return /علاجي|علاج/.test(n)?'خطة علاجية':/اثرائي|إثرائي|متفوق/.test(n)?'خطة إثرائية':/تطوير مهني|نمو مهني/.test(n)?'خطة تطوير مهني':/تحسين/.test(n)?'خطة تحسين':/متابعه/.test(n)?'خطة متابعة':'خطة تنفيذية';
  if(type==='إجراء متابعة')return /غياب/.test(n)?'متابعة غياب':/تاخر|تأخر/.test(n)?'متابعة تأخر':/انضباط|مواظبه/.test(n)?'متابعة انضباط':'متابعة حضور';
  if(type==='تطوير مهني')return /مجتمع تعلم مهني/.test(n)?'مجتمع تعلم مهني':/ورشه/.test(n)?'ورشة':/برنامج تدريبي|دوره|تدريب/.test(n)?'تدريب':'لقاء تبادل خبرات';
  return'';
}

export function analyze(raw,entryIntent='smart'){
  const s=base.analyze(raw,entryIntent),forced=explicitType(raw);
  if(forced){
    base.setType(s,forced);
    const sub=explicitSubtype(forced,raw);if(sub)base.setSubtype(s,sub);
    s.classification.detected=forced;
    s.classification.confidence=100;
    s.classification.conflict=false;
    s.classification.autoDecision='explicit';
    return s;
  }
  s.classification.type='';
  s.classification.subtype='';
  s.classification.domain='';
  s.classification.confidence=0;
  s.classification.conflict=false;
  s.classification.autoDecision='uncertain';
  s.titleSuggestions=[];
  s.metadata.workTitle='';
  return s;
}
