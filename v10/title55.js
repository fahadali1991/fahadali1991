import {joinAr} from './engine.js';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
const badQuestion=/^(متى|متى يجي|متى يكون|هل|وش|ايش|كيف|وين|أين|كم|لماذا|ليش)\b/i;
const chatter=/\b(سويت|سوينا|عملت|عملنا|ابغى|أبغى|ابي|أبي|عندنا|اليوم|بعدين|كذا|هذا الشي|متى يجي)\b/gi;
function audiences(s){return (s.audiences||[]).map(x=>x==='مستفيدون آخرون'?(s.metadata?.otherAudience||'مستفيدون آخرون'):x).filter(Boolean)}
function target(s){if(s.grades?.length)return joinAr(s.grades);const a=audiences(s);return a.length===1?a[0]:''}
function gradePhrase(s){const g=s.grades||[];if(!g.length)return'';if(g.length===1)return `الصف ${g[0]}`;return `الصفوف ${joinAr(g)}`}
function sourceText(s){return clean(s.metadata?.titleClarification||s.raw||'')}
function normalized(s){let x=sourceText(s).split(/[.،\n]/)[0];x=x.replace(chatter,' ').replace(/\s+/g,' ').trim();return x}
function stripAction(x){return clean(x.replace(/^(نفذت|نفذنا|تم تنفيذ|أجريت|اجريت|حللت|حللنا|أعددت|اعددت|أعددنا|أعدد|إعداد|عقدنا|اجتمعنا|تابعت|تابعنا)\s+/i,''))}
function analysisSource(raw){if(/تشخيص/.test(raw))return'الاختبار التشخيصي';if(/اختبار\s*(الفترة|فترة)/.test(raw))return'اختبار الفترة';if(/اختبار\s*(النهائي|نهائي)/.test(raw))return'الاختبار النهائي';if(/اختبار\s*(القصير|قصير)/.test(raw))return'الاختبار القصير';if(/تقويم\s*(تكويني|تكوين)/.test(raw))return'التقويم التكويني';if(/اختبار\s*(وطني|نافس)/.test(raw))return'الاختبار الوطني';return''}
function facts(s){const raw=normalized(s),t=s.classification.type,sub=s.classification.subtype||'';if(!raw)return{subject:'',sub};let x=stripAction(raw);x=x.replace(/^(برنامج|فعالية|نشاط|مبادرة|حملة|مسابقة|خطة|ورشة|تدريب|اجتماع|محضر|متابعة)\s+/i,'');if(t==='تحليل نتائج')x=x.replace(/^(تحليل نتائج|تحليل|نتائج)\s*/i,'');x=x.replace(/\s+(لمدة|خلال|في المدرسة|في الفصل|بهدف|لخدمة)\b.*$/i,'').trim();return{subject:clean(x),sub}}
export function needsTitleClarification(s){const raw=sourceText(s);if(!raw)return true;if(s.metadata?.titleClarification)return false;if(badQuestion.test(raw))return true;if(raw.split(/\s+/).length<2)return true;return false}
export function clarificationOptions(s){const t=s.classification.type;if(t==='تحليل نتائج')return['تحليل نتائج اختبار تجريبي','تحليل نتائج الطلاب حسب مستوياتهم'];if(t==='برنامج / فعالية')return['تنفيذ برنامج أو نشاط','تنفيذ مبادرة أو فعالية'];if(t==='خطة')return['إعداد خطة','تنفيذ خطة'];if(t==='اجتماع / متابعة إدارية')return['عقد اجتماع','توثيق محضر اجتماع'];if(t==='إجراء متابعة')return['متابعة حالة أو إجراء','متابعة حضور أو انضباط'];if(t==='تطوير مهني')return['الحصول على برنامج تطوير مهني','تنفيذ نشاط تطوير مهني'];return[]}
function dedupePhrases(x){return clean(x).replace(/\b(تحليل نتائج)\s+\1\b/g,'$1').replace(/\b(تحليل)\s+\1\b/g,'$1').replace(/\b(نتائج)\s+\1\b/g,'$1').replace(/\b(برنامج)\s+\1\b/g,'$1').replace(/\b(خطة)\s+\1\b/g,'$1').replace(/\b(اجتماع)\s+\1\b/g,'$1')}
function validate(title){const x=dedupePhrases(title);if(!x||x.length<8||x.length>90)return false;if(badQuestion.test(x)||/\b(سويت|سوينا|أبغى|ابي|متى يجي)\b/i.test(x))return false;if(/[؟?]/.test(x))return false;if(/تحليل\s+نتائج\s+تحليل\s+نتائج|تحليل\s+تحليل|برنامج\s+برنامج|خطة\s+خطة|اجتماع\s+اجتماع/.test(x))return false;return true}
export function titleCandidates55(s){if(needsTitleClarification(s))return[];const {subject,sub}=facts(s),t=s.classification.type,tg=target(s),gp=gradePhrase(s),a=[];if(t==='تحليل نتائج'){
 const src=analysisSource(normalized(s));
 const base=src?`تحليل نتائج ${src}`:'تحليل نتائج الطلاب';
 a.push(gp?`${base} لـ${gp}`:base);
 if(gp)a.push(src?`تحليل أداء ${gp} في ${src}`:`تحليل أداء طلاب ${gp}`);
 else if(subject&&!/^الصف\b/.test(subject))a.push(`تحليل نتائج ${subject}`);
 a.push(gp?`تحليل مستويات أداء طلاب ${gp}`:'تحليل مستويات أداء الطلاب');
}else if(t==='برنامج / فعالية'){const l=sub||'برنامج',q=subject||'العمل المدرسي';a.push(`${l} ${q}`,tg?`${l} ${q} لدى ${tg}`:'',`${l} حول ${q}`)}else if(t==='خطة'){const l=sub||'خطة',q=subject||'التحسين';a.push(`${l} ${q}`,`${l} لتحسين ${q}`,`خطة تنفيذية في ${q}`)}else if(t==='اجتماع / متابعة إدارية'){const q=subject||'موضوع العمل';a.push(`${sub||'اجتماع'} بشأن ${q}`,`محضر اجتماع لمناقشة ${q}`,`اجتماع متابعة ${q}`)}else if(t==='إجراء متابعة'){const q=subject||'الحالة المستهدفة';a.push(`${sub||'متابعة'} ${q}`,`متابعة ${q} ورصد الحالة`,`سجل متابعة ${q}`)}else if(t==='تطوير مهني'){const q=subject||'الممارسة المهنية';a.push(`${sub||'تطوير مهني'} في ${q}`,`برنامج تطوير مهني حول ${q}`,`تنمية الممارسة المهنية في ${q}`)}return uniq(a.map(dedupePhrases)).filter(validate).slice(0,3)}
export function bestTitle55(s){if(s.metadata?.titleManual&&s.metadata?.workTitle)return clean(s.metadata.workTitle);if(s.metadata?.selectedTitle)return dedupePhrases(s.metadata.selectedTitle);return titleCandidates55(s)[0]||s.classification.subtype||s.classification.type}
