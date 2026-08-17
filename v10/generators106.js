import {buildCanonicalContext106} from './canonical-context106.js?v=106';
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const join=a=>[...new Set((a||[]).map(clean).filter(Boolean))].join('، ');
function C(s){return buildCanonicalContext106(s)}
function focus(c){return c.education.skill.value||c.education.topic.value||c.education.branch.value||c.education.subject.value||'موضوع العمل'}
function target(c){const grades=join(c.education.grades);const aud=join(c.education.audiences);return grades?`طلاب ${grades}`:aud}
export function titleCandidates106(state){const c=C(state),f=c.document.family.value,sub=c.document.subtype.value||'',x=focus(c),t=target(c),withT=v=>t?`${v} لدى ${t}`:v;let a=[];
 if(f==='برنامج / فعالية'){const k=sub||'برنامج';a=[withT(`${k} لتنمية ${x}`),withT(`${k} ${x}`),withT(x)];}
 else if(f==='تحليل نتائج')a=[withT(`تحليل نتائج ${x}`),withT(`تحليل مستوى الأداء في ${x}`)];
 else if(f==='خطة')a=[withT(`${sub||'خطة'} لمعالجة ${x}`),withT(`${sub||'خطة'} ${x}`)];
 else if(f==='اجتماع / متابعة إدارية')a=[`${sub||'اجتماع'} بشأن ${x}`,`مراجعة ${x}`];
 else if(f==='تطوير مهني')a=[`${sub||'تطوير مهني'} في ${x}`,`تطوير الممارسة المهنية في ${x}`];
 else a=[`${sub||f||'وثيقة'} ${x}`];
 return [...new Set(a.map(clean).filter(Boolean))].slice(0,3);
}
export function goalCandidates106(state){const c=C(state),f=c.document.family.value,x=focus(c);let a=[];
 if(f==='برنامج / فعالية')a=[`تنمية ${x} لدى المستفيدين`,`رفع مستوى التطبيق في ${x}`,`تعزيز المشاركة الفاعلة في الأنشطة المرتبطة بـ${x}`];
 else if(f==='تحليل نتائج')a=[`تحديد مستوى الأداء في ${x}`,`تحديد جوانب القوة والاحتياج في ${x}`,`بناء إجراء تحسيني استنادًا إلى نتائج ${x}`];
 else if(f==='خطة')a=[`معالجة الاحتياج المرتبط بـ${x}`,`رفع مستوى الأداء في ${x}`,`متابعة تنفيذ الإجراءات وقياس التقدم`];
 else if(f==='تطوير مهني')a=[`تطوير الممارسة المهنية في ${x}`,`نقل التعلم المهني إلى التطبيق`,`متابعة أثر التطبيق في الممارسة`];
 else a=[`تحسين جودة الأداء المرتبط بـ${x}`,`تنظيم الإجراءات ومتابعة تنفيذها`];
 return [...new Set(a.map(clean).filter(Boolean))].slice(0,6);
}
export function narrative106(state){const c=C(state),f=c.document.family.value,x=focus(c),d=c.details,parts=[];
 if(f==='برنامج / فعالية')parts.push(`نُفذ ${c.document.subtype.value||'العمل'} في مجال ${x}.`);
 else if(f==='تحليل نتائج')parts.push(`أُجري تحليل للنتائج المرتبطة بـ${x}.`);
 else if(f==='خطة')parts.push(`أُعدت ${c.document.subtype.value||'الخطة'} لمعالجة الاحتياج المرتبط بـ${x}.`);
 else parts.push(`تم توثيق ${c.document.subtype.value||f||'العمل'} المرتبط بـ${x}.`);
 if(d.reason.value)parts.push(`وجاء العمل استجابةً لـ${d.reason.value}.`);if(d.basis.value)parts.push(`واستند إلى ${d.basis.value}.`);if(d.method.value)parts.push(`وتضمن التنفيذ ${d.method.value}.`);if(d.finding.value)parts.push(`وأظهرت البيانات ${d.finding.value}.`);if(d.action.value)parts.push(`واتُّخذ إجراء شمل ${d.action.value}.`);if(d.observation.value)parts.push(`ولوحظ أثناء التنفيذ ${d.observation.value}.`);if(d.measurement.value){parts.push(d.measurement.value.includes('لم يتم القياس بعد')?'ولم يتم قياس الأثر بعد.':`وتم التحقق من النتيجة من خلال ${d.measurement.value}.`)}return clean(parts.join(' '));
}
