import {buildCanonicalContext106} from './canonical-context106.js?v=106';
const clean=v=>String(v??'').replace(/\s+/g,' ').replace(/\s+([،؛:.])/g,'$1').trim();
const uniq=a=>[...new Set(a.map(clean).filter(Boolean))];
function target(c){const g=(c.education.grades||[]).join(' و');if(g)return`طلاب ${g}`;const a=(c.education.audiences||[]).filter(x=>x!=='الطلاب');return a[0]||((c.education.audiences||[]).includes('الطلاب')?'الطلاب':'')}
function focus(c){return c.education.skill.value||c.education.topic.value||c.education.branch.value||c.education.subject.value||''}
function kind(c){return c.document.subtype.value||c.document.family.value||''}
function valid(x){x=clean(x);if(x.length<5||x.length>96)return false;if(/[؟?]/.test(x))return false;if(/^(هل|كيف|وش|ايش|لماذا|ليش)\b/.test(x))return false;if(/\b(نفذت|نفذنا|سويت|سوينا|عملت|عملنا)\b/.test(x))return false;if(/\b(لمدة|بهدف|داخل المدرسة|خارج المدرسة)\b/.test(x))return false;return true}
function program(c){const k=kind(c)||'برنامج',f=focus(c),t=target(c);if(!f)return[];const formal=t?`${k} لتنمية ${f} لدى ${t}`:`${k} لتنمية ${f}`;const direct=t?`${f} لدى ${t}`:f;let creative='';if(/مبادرة/.test(k))creative=`مبادرة «${f}»`;else if(/مسابقة/.test(k))creative=`مسابقة «تحدي ${f}»`;else if(/فعالية/.test(k))creative=`فعالية «${f}»`;else creative=`${k} «${f}»`;return[formal,direct,creative]}
function analysis(c){const f=focus(c)||'الأداء',t=target(c)||'الطلاب';return[`تحليل نتائج ${f} لدى ${t}`,`تحليل مستوى الأداء في ${f}`,`قراءة تحليلية لنتائج ${f}`]}
function plan(c){const k=kind(c)||'خطة',f=focus(c)||'التحسين',t=target(c);return[t?`${k} لتنمية ${f} لدى ${t}`:`${k} لتنمية ${f}`,`${k} في ${f}`,`خطة تحسين ${f}`]}
function meeting(c){const f=focus(c)||c.details.purpose.value||'العمل المدرسي',k=kind(c)||'اجتماع';return[`${k} بشأن ${f}`,`محضر اجتماع لمناقشة ${f}`,`متابعة ${f}`]}
function follow(c){const f=focus(c)||'الإجراء المستهدف',k=kind(c)||'متابعة';return[`${k} ${f}`,`سجل متابعة ${f}`,`متابعة تنفيذ ${f}`]}
function pd(c){const f=focus(c)||c.details.need.value||'الممارسات المهنية',k=kind(c)||'تطوير مهني';return[`${k} في ${f}`,`تطوير الممارسة المهنية في ${f}`,`برنامج مهني حول ${f}`]}
function partnership(c){const f=focus(c)||c.details.reason.value||'الشراكة المجتمعية';return[`شراكة مجتمعية لدعم ${f}`,`تفعيل الشراكة في ${f}`,`مبادرة مجتمعية في ${f}`]}
function maintenance(c){const f=focus(c)||c.details.reason.value||'المرافق والتجهيزات';return[`متابعة صيانة ${f}`,`تقرير صيانة وتجهيزات: ${f}`,`معالجة احتياج في ${f}`]}
export function titleCandidates108(state){const c=buildCanonicalContext106(state),family=c.document.family.value;let a=[];if(family==='برنامج / فعالية')a=program(c);else if(family==='تحليل نتائج')a=analysis(c);else if(family==='خطة')a=plan(c);else if(family==='اجتماع / متابعة إدارية')a=meeting(c);else if(family==='إجراء متابعة')a=follow(c);else if(family==='تطوير مهني')a=pd(c);else if(family==='شراكة مجتمعية')a=partnership(c);else if(family==='صيانة وتجهيزات')a=maintenance(c);else a=[`${kind(c)||'وثيقة'} ${focus(c)||'مدرسية'}`];return uniq(a).filter(valid).slice(0,3)}
export function bestTitle108(state){const manual=clean(state?.metadata?.workTitle);if(state?.metadata?.titleManual&&valid(manual))return manual;const selected=clean(state?.metadata?.selectedTitle);if(valid(selected))return selected;return titleCandidates108(state)[0]||kind(buildCanonicalContext106(state))||'وثيقة مدرسية'}
export function validateTitle108(v){return valid(v)}
export function titleContext108(state){const c=buildCanonicalContext106(state);return{family:c.document.family.value,subtype:c.document.subtype.value,subject:c.education.subject.value,branch:c.education.branch.value,topic:c.education.topic.value,skill:c.education.skill.value,target:target(c)}}
