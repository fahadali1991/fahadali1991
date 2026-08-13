import {joinAr} from './engine.js';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
const badQuestion=/^(متى|متى يجي|متى يكون|هل|وش|ايش|كيف|وين|أين|كم|لماذا|ليش)\b/i;
const chatter=/\b(سويت|سوينا|عملت|عملنا|ابغى|أبغى|ابي|أبي|عندنا|اليوم|بعدين|كذا|هذا الشي|متى يجي)\b/gi;
function audiences(s){return (s.audiences||[]).map(x=>x==='مستفيدون آخرون'?(s.metadata?.otherAudience||'مستفيدون آخرون'):x).filter(Boolean)}
function target(s){if(s.grades?.length)return joinAr(s.grades);const a=audiences(s);return a.length===1?a[0]:''}
function normalizeRaw(s){let x=clean(s.metadata?.titleClarification||s.raw||'');x=x.split(/[.،\n]/)[0];x=x.replace(chatter,' ').replace(/\s+/g,' ').trim();return x}
function subjectFacts(s){const raw=normalizeRaw(s),t=s.classification.type,sub=s.classification.subtype||'',goals=s.answers?.goals||[];if(!raw)return{raw:'',subject:'',intent:''};
 let x=raw.replace(/^(نفذت|نفذنا|تم تنفيذ|أجريت|اجريت|حللت|حللنا|أعددت|اعددت|أعددنا|عقدنا|اجتمعنا|تابعت|تابعنا)\s+/i,'');
 x=x.replace(/^(برنامج|فعالية|نشاط|مبادرة|حملة|مسابقة|خطة|ورشة|تدريب|اجتماع|محضر|متابعة)\s+/i,'');
 if(t==='تحليل نتائج')x=x.replace(/^(تحليل نتائج|تحليل|نتائج)\s*/i,'');
 x=x.replace(/\s+(لمدة|خلال|في المدرسة|في الفصل|بهدف|لخدمة)\b.*$/i,'').trim();
 let intent='';
 if(t==='تحليل نتائج'){
  const hasLevels=/مستو|تصنيف|فئات|متفوق|متعثر/.test(raw+goals.join(' '));
  const hasStrength=/قوة|احتياج|ضعف|منخفض|إتقان/.test(raw+goals.join(' '));
  intent=hasLevels?'تصنيف مستويات الأداء':hasStrength?'تحديد جوانب القوة والاحتياج':'تحليل الأداء';
  if(/طلاب/.test(raw)&&!/طلاب/.test(x))x='نتائج الطلاب';
  else if(!x)x='نتائج الطلاب';
 }
 return{raw,subject:clean(x),intent,sub};
}
export function needsTitleClarification(s){const raw=clean(s.metadata?.titleClarification||s.raw||'');if(!raw)return true;if(badQuestion.test(raw))return true;if(raw.split(/\s+/).length<2)return true;return false}
export function clarificationOptions(s){const t=s.classification.type;if(t==='تحليل نتائج')return['إعداد اختبار تجريبي','تنفيذ اختبار تجريبي','تحليل نتائج اختبار تجريبي'];if(t==='برنامج / فعالية')return['تنفيذ برنامج أو نشاط','تنفيذ مبادرة','تنفيذ فعالية'];if(t==='خطة')return['إعداد خطة','تنفيذ خطة','تحديث خطة'];if(t==='اجتماع / متابعة إدارية')return['عقد اجتماع','توثيق محضر اجتماع','متابعة قرارات اجتماع'];if(t==='إجراء متابعة')return['متابعة حالة','متابعة حضور أو انضباط','متابعة تنفيذ إجراء'];if(t==='تطوير مهني')return['الحصول على برنامج تطوير مهني','تنفيذ نشاط تطوير مهني','نقل أثر تطوير مهني'];return['توثيق عمل مدرسي']}
function validate(title){const x=clean(title);if(!x||x.length<8||x.length>90)return false;if(badQuestion.test(x)||/\b(سويت|سوينا|أبغى|ابي|متى يجي)\b/i.test(x))return false;const w=x.split(/\s+/);for(let i=1;i<w.length;i++)if(w[i]===w[i-1])return false;if(/تحليل\s+تحليل|برنامج\s+برنامج|خطة\s+خطة|اجتماع\s+اجتماع/.test(x))return false;return true}
export function titleCandidates55(s){if(needsTitleClarification(s))return[];const {subject,intent,sub}=subjectFacts(s),t=s.classification.type,tg=target(s),a=[];if(t==='تحليل نتائج'){
 const obj=/^نتائج/.test(subject)?subject:`نتائج ${subject||'الطلاب'}`;
 a.push(intent==='تصنيف مستويات الأداء'?`تحليل ${obj} وتصنيف مستويات الأداء`:`تحليل ${obj}`);
 a.push(`تحليل مستويات الأداء في ${obj}`);
 a.push(intent==='تحديد جوانب القوة والاحتياج'?`تحليل ${obj} وتحديد جوانب القوة والاحتياج`:`تحليل ${obj} وتحديد أولويات التحسين`);
}else if(t==='برنامج / فعالية'){
 const l=sub||'برنامج',q=subject||'العمل المدرسي';a.push(`${l} ${q}`,`${l} لتنمية ${q}`,tg?`${l} ${q} لدى ${tg}`:'');
}else if(t==='خطة'){
 const l=sub||'خطة',q=subject||'التحسين';a.push(`${l} ${q}`,`${l} لتحسين ${q}`,`خطة تنفيذية في ${q}`);
}else if(t==='اجتماع / متابعة إدارية'){
 const q=subject||'موضوع العمل';a.push(`${sub||'اجتماع'} بشأن ${q}`,`محضر اجتماع لمناقشة ${q}`,`اجتماع متابعة ${q}`);
}else if(t==='إجراء متابعة'){
 const q=subject||'الحالة المستهدفة';a.push(`${sub||'متابعة'} ${q}`,`متابعة ${q} ورصد الحالة`,`سجل متابعة ${q}`);
}else if(t==='تطوير مهني'){
 const q=subject||'الممارسة المهنية';a.push(`${sub||'تطوير مهني'} في ${q}`,`برنامج تطوير مهني حول ${q}`,`تنمية الممارسة المهنية في ${q}`);
}
 return uniq(a).filter(validate).slice(0,3)
}
export function bestTitle55(s){if(s.metadata?.titleManual&&s.metadata?.workTitle)return clean(s.metadata.workTitle);if(s.metadata?.selectedTitle)return clean(s.metadata.selectedTitle);return titleCandidates55(s)[0]||s.classification.subtype||s.classification.type}
