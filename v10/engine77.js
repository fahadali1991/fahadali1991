import * as base from './engine.js';
export * from './engine.js';

const norm=base.norm;
const explicitProgram=/^\s*(?:تم\s+)?(?:نفذت|نفذنا|نُفذ|تنفيذ)\s+(?:برنامج(?:اً|ا)?|فعالية|نشاط|مبادرة|مسابقة|حملة)\b/u;
const explicitPD=/^\s*(?:تم\s+)?(?:حضرت|حضرنا|نفذت|نفذنا|قدمت|قدمنا|تنفيذ)\s+(?:برنامج\s+تدريبي|دورة|ورشة|تدريب\s+(?:للمعلمين|للمعلمات|لمنسوبي|للكادر)|مجتمع\s+تعلم\s+مهني)\b/u;

function explicitProgramSubtype(raw){const s=String(raw||'');if(/مسابقة/u.test(s))return'مسابقة';if(/مبادرة/u.test(s))return'مبادرة';if(/حملة/u.test(s))return'حملة';if(/فعالية/u.test(s))return'فعالية';if(/نشاط/u.test(s))return'نشاط';return'برنامج'}

export function analyze(raw,entryIntent='smart'){
  const s=base.analyze(raw,entryIntent),n=norm(raw),studentContext=/(?:طلاب|الطلاب|الطالبات|طالب)/u.test(String(raw||''));
  // العبارة الصريحة في بداية الوصف أعلى أولوية من كلمات فرعية مثل "تدريب عملي".
  if(explicitProgram.test(String(raw||'')) || (studentContext && /^\s*(?:نفذت|نفذنا|نُفذ)\s+برنامج/u.test(String(raw||'')))){
    base.setType(s,'برنامج / فعالية');
    base.setSubtype(s,explicitProgramSubtype(raw));
    s.classification.detected='برنامج / فعالية';
    s.classification.confidence=99;
    s.classification.conflict=false;
    return s;
  }
  // تطوير مهني لا يُعتمد بسبب كلمة "تدريب" وحدها؛ يحتاج سياقًا مهنيًا صريحًا.
  if(s.classification?.type==='تطوير مهني' && !explicitPD.test(String(raw||'')) && !/(?:المعلمين|المعلمات|منسوبي|الكادر|تطوير\s+مهني|نمو\s+مهني|احتياج\s+تدريبي|مجتمع\s+تعلم\s+مهني)/u.test(String(raw||''))){
    if(/(?:برنامج|فعالية|نشاط|مبادرة|مسابقة|حملة)/u.test(String(raw||''))){base.setType(s,'برنامج / فعالية');base.setSubtype(s,explicitProgramSubtype(raw));s.classification.detected='برنامج / فعالية';s.classification.confidence=90;s.classification.conflict=false;}
  }
  return s;
}
