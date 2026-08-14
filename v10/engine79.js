import * as base from './engine.js?v=79';
export * from './engine.js?v=79';

const N=s=>base.norm(String(s||'')).replace(/[،,.؛;:!?؟]/g,' ').replace(/\s+/g,' ').trim();

function explicitType(raw){
  const n=N(raw);
  if(/^(?:تم )?(?:نفذت|نفذنا|نفذ|تنفيذ|اقمت|نظمت) (?:برنامجا?|برنامج|فعاليه|نشاط|مبادره|مسابقه|حمله)\b/.test(n)) return 'برنامج / فعالية';
  if(/^(?:تم )?(?:عقدت|عقدنا|عقد|تنفيذ) (?:اجتماع|لقاء اداري|محضر)\b/.test(n)) return 'اجتماع / متابعة إدارية';
  if(/^(?:تم )?(?:حللت|حللنا|تحليل) (?:نتائج|درجات|اداء|اختبار)\b/.test(n)) return 'تحليل نتائج';
  if(/^(?:تم )?(?:اعددت|اعددنا|اعداد|بنيت|بنينا) (?:خطه|خطة)\b/.test(n)) return 'خطة';
  if(/^(?:تم )?(?:تابعت|تابعنا|متابعه|متابعة) (?:غياب|تاخر|تأخر|حضور|انضباط|مواظبه)\b/.test(n)) return 'إجراء متابعة';
  if(/^(?:تم )?(?:حضرت|حضرنا|قدمت|قدمنا|نفذت|نفذنا) (?:برنامج تدريبي|دوره|دورة|ورشه|ورشة|مجتمع تعلم مهني)\b/.test(n)) return 'تطوير مهني';
  if(/(?:للمعلمين|للمعلمات|لمنسوبي المدرسه|للكادر)\b/.test(n) && /(?:تدريب|تطوير مهني|نمو مهني|ورشه|دوره)/.test(n)) return 'تطوير مهني';
  return '';
}

function explicitSubtype(type,raw){
  const n=N(raw);
  if(type==='برنامج / فعالية') return /مسابقه/.test(n)?'مسابقة':/مبادره/.test(n)?'مبادرة':/حمله/.test(n)?'حملة':/فعاليه/.test(n)?'فعالية':/نشاط/.test(n)?'نشاط':'برنامج';
  return '';
}

export function analyze(raw,entryIntent='smart'){
  const s=base.analyze(raw,entryIntent);
  const forced=explicitType(raw);
  if(forced){
    base.setType(s,forced);
    const sub=explicitSubtype(forced,raw); if(sub) base.setSubtype(s,sub);
    s.classification.detected=forced;
    s.classification.confidence=100;
    s.classification.conflict=false;
    s.classification.autoDecision='explicit';
    return s;
  }
  // لا نجزم بتصنيف آلي عندما لا توجد قرينة صريحة قوية.
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
