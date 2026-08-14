import {joinAr,norm} from './engine.js';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
const has=(n,...xs)=>xs.some(x=>n.includes(norm(x)));
const PERSONAL=/\b(استخدمت|استخدمنا|نفذت|نفذنا|عملت|عملنا|قمنا|سويت|سوينا|حللت|حللنا|اجتمعت|اجتمعنا|تابعت|تابعنا)\b/;
const QUESTION=/^(هل|وش|ايش|كيف|متى|وين|أين|كم|لماذا|ليش)\b/;
const REDUNDANT=/\b(برنامج برنامج|تحليل تحليل|تحليل نتائج تحليل نتائج|خطة خطة|اجتماع اجتماع|متابعة متابعة)\b/;
function n(s){return norm(String(s||''))}
function gradeOrder(g){const x=n(g);if(x.includes('الاول'))return'الأول';if(x.includes('الثاني'))return'الثاني';if(x.includes('الثالث'))return'الثالث';if(x.includes('الرابع'))return'الرابع';if(x.includes('الخامس'))return'الخامس';if(x.includes('السادس'))return'السادس';return''}
function stageName(s){const x=n(s.stage||'');if(x.includes('ابتدائي'))return'الابتدائية';if(x.includes('متوسط'))return'المتوسطة';if(x.includes('ثانوي'))return'الثانوية';const g=n((s.grades||[]).join(' '));if(g.includes('ابتدائي'))return'الابتدائية';if(g.includes('متوسط'))return'المتوسطة';if(g.includes('ثانوي'))return'الثانوية';return''}
function gradePhrase(s){const gs=uniq((s.grades||[]).map(gradeOrder).filter(Boolean));const st=stageName(s);if(!gs.length)return'';if(gs.length===1)return`طلاب الصف ${gs[0]} ${st}`;if(gs.length===2)return`طلاب الصفين ${gs[0]} و${gs[1]} ${st}`;return`طلاب الصفوف ${joinAr(gs)} ${st}`}
function audiencePhrase(s){if((s.audiences||[]).includes('الطلاب'))return gradePhrase(s)||'الطلاب';if((s.audiences||[]).includes('المعلمون'))return'المعلمين';if((s.audiences||[]).includes('أولياء الأمور'))return'أولياء الأمور';if((s.audiences||[]).includes('الإداريون'))return'الإداريين';return''}
function assessmentSource(raw){const x=n(raw);if(has(x,'تشخيصي','اختبار تشخيصي'))return'الاختبار التشخيصي';if(has(x,'اختبار الفترة','فترة اولى','فترة أولى','فترة ثانية'))return'اختبار الفترة';if(has(x,'اختبار نهائي','النهائي'))return'الاختبار النهائي';if(has(x,'اختبار قصير'))return'الاختبار القصير';if(has(x,'تقويم تكويني'))return'التقويم التكويني';if(has(x,'نافس','اختبار وطني'))return'الاختبار الوطني';return''}
function topicConcept(s){const x=n(`${s.metadata?.titleClarification||''} ${s.raw||''} ${s.topic||''}`);
 if(has(x,'تقنيه','تقنية','رقمي','منصات','تطبيقات','الذكاء الاصطناعي','ذكاء اصطناعي')){
   if(has(x,'تدريس','تعليم','حصة','درس','صف'))return'توظيف التقنية في التدريس';
   return'توظيف التقنية في التعليم';
 }
 if(has(x,'قراءه','قراءة','فهم قرائي','قرائي'))return'تنمية مهارات القراءة والفهم القرائي';
 if(has(x,'خط','الخط'))return'تحسين الخط والمهارات الكتابية';
 if(has(x,'امن','سلامه','سلامة','اخلاء','إخلاء'))return'تعزيز الأمن والسلامة';
 if(has(x,'سلوك','انضباط','مواظبه','مواظبة'))return'تعزيز السلوك والانضباط';
 if(has(x,'قيم','وطني','هوية','وطن'))return'تعزيز القيم والهوية الوطنية';
 if(has(x,'تحصيل','نتائج','اختبار','درجات'))return'تحسين التحصيل الدراسي';
 if(has(x,'مهنيه','مهنية','تطوير مهني','استراتيجيات تدريس'))return'تطوير الممارسات المهنية';
 if(has(x,'غياب'))return'متابعة الغياب';
 if(has(x,'تأخر','تاخر'))return'متابعة التأخر';
 return''
}
export function extractTitleFacts62(s){return{
 family:s.classification?.type||'',subtype:s.classification?.subtype||'',topicConcept:topicConcept(s),target:audiencePhrase(s),stage:stageName(s),grades:uniq((s.grades||[]).map(gradeOrder).filter(Boolean)),assessmentSource:assessmentSource(s.raw||'')
}}
function validate62(title){const x=clean(title);if(!x||x.length<8||x.length>88)return false;if(QUESTION.test(n(x))||PERSONAL.test(n(x))||REDUNDANT.test(n(x)))return false;if(/[؟?]/.test(x))return false;if(/\b(بهدف|لمدة|داخل المدرسة|خارج المدرسة|عن بعد|عن بُعد)\b/.test(n(x)))return false;return true}
function programTitles(f){if(!f.topicConcept)return[];const kind=f.subtype||'برنامج';const short=`${kind} ${f.topicConcept}`;const detailed=f.target?`${short} لدى ${f.target}`:'';const formal=f.target?`${kind} ${f.topicConcept} لـ${f.target}`:short;return[formal,short,detailed]}
function analysisTitles(f){const target=f.target||'الطلاب';const src=f.assessmentSource;const main=src?`تحليل نتائج ${src} لدى ${target}`:`تحليل نتائج ${target}`;const short=src?`تحليل نتائج ${src}`:'تحليل نتائج الطلاب';const detailed=src?`تحليل أداء ${target} في ${src}`:`تحليل مستويات أداء ${target}`;return[main,short,detailed]}
function planTitles(f){const topic=f.topicConcept||'';if(!topic)return[];const kind=f.subtype||'خطة تنفيذية';return[`${kind} لـ${topic}`,`${kind} ${topic}`,`خطة تنفيذية في ${topic}`]}
function meetingTitles(f){const topic=f.topicConcept||'';if(!topic)return[];const kind=f.subtype||'اجتماع';return[`${kind} بشأن ${topic}`,`محضر اجتماع حول ${topic}`,`اجتماع لمتابعة ${topic}`]}
function followTitles(f){const topic=f.topicConcept||'';if(!topic)return[];const kind=f.subtype||'متابعة';return[`${kind} ${topic}`,`سجل متابعة ${topic}`,`متابعة ${topic}`]}
function pdTitles(f){const topic=f.topicConcept||'تطوير الممارسات المهنية';const kind=f.subtype||'تطوير مهني';return[`${kind} في ${topic}`,`برنامج تطوير مهني حول ${topic}`,`تنمية ${topic}`]}
export function titleCandidates62(s){const f=extractTitleFacts62(s);let a=[];if(f.family==='برنامج / فعالية')a=programTitles(f);else if(f.family==='تحليل نتائج')a=analysisTitles(f);else if(f.family==='خطة')a=planTitles(f);else if(f.family==='اجتماع / متابعة إدارية')a=meetingTitles(f);else if(f.family==='إجراء متابعة')a=followTitles(f);else if(f.family==='تطوير مهني')a=pdTitles(f);return uniq(a).filter(validate62).slice(0,3)}
export function needsTitleClarification62(s){const f=extractTitleFacts62(s);if(s.metadata?.titleManual&&s.metadata?.workTitle)return false;if(f.family==='تحليل نتائج')return false;if(f.family==='تطوير مهني')return false;return !f.topicConcept}
export function clarificationOptions62(s){const f=s.classification?.type||'';if(f==='برنامج / فعالية')return['توظيف التقنية في التدريس','تنمية مهارات القراءة والفهم القرائي','تعزيز القيم والسلوك الإيجابي'];if(f==='خطة')return['تحسين التحصيل الدراسي','تطوير الممارسات المهنية','تعزيز السلوك والانضباط'];if(f==='اجتماع / متابعة إدارية')return['متابعة تنفيذ الأعمال','مراجعة النتائج والأداء','معالجة تحدٍ قائم'];if(f==='إجراء متابعة')return['متابعة الغياب','متابعة التأخر','متابعة السلوك والانضباط'];return[]}
export function bestTitle62(s){if(s.metadata?.titleManual&&s.metadata?.workTitle)return clean(s.metadata.workTitle);if(s.metadata?.selectedTitle&&validate62(s.metadata.selectedTitle))return clean(s.metadata.selectedTitle);return titleCandidates62(s)[0]||s.classification?.subtype||s.classification?.type||'وثيقة مدرسية'}
export function validateTitle62(title){return validate62(title)}
