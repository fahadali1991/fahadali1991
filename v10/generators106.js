import {buildCanonicalContext106} from './canonical-context106.js?v=106';
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const join=a=>[...new Set((a||[]).map(clean).filter(Boolean))].join('، ');
function C(s){return buildCanonicalContext106(s)}
function focus(c){return c.education.skill.value||c.education.topic.value||c.education.branch.value||c.education.subject.value||'موضوع العمل'}
function target(c){const grades=join(c.education.grades);const aud=join(c.education.audiences);return grades?`طلاب ${grades}`:aud}
function phrase(x){x=clean(x);if(/خط|كتابة/.test(x))return'تحسين الخط العربي والمهارات الكتابية';if(/فهم قرائي|قراءة/.test(x))return'تنمية مهارات القراءة والفهم القرائي';if(/تلاوة/.test(x))return'تنمية مهارات تلاوة القرآن الكريم';if(/تجويد/.test(x))return'تنمية مهارات التجويد';if(/حفظ/.test(x)&&/قرآن/.test(x))return'رفع مستوى إتقان الحفظ والمراجعة القرآنية';if(/القرآن الكريم/.test(x))return'تعزيز التعلم المرتبط بالقرآن الكريم';if(/توحيد المقامات/.test(x))return'تنمية مهارة توحيد المقامات';if(/كسور/.test(x))return'رفع مستوى إتقان مهارات الكسور';if(/تجرب|استقصاء/.test(x))return'تنمية مهارات الاستقصاء والتجريب العلمي';if(/برمج/.test(x))return'تنمية مهارات البرمجة';return`تنمية المهارة المرتبطة ب${x}`}
const withT=(v,t)=>t?`${v} لدى ${t}`:v;
export function titleCandidates106(state){const c=C(state),f=c.document.family.value,sub=c.document.subtype.value||'',x=focus(c),t=target(c),p=phrase(x);let a=[];
 if(f==='برنامج / فعالية'){const k=sub||'برنامج';a=[withT(`${k} ${p}`,t),withT(`${k}: ${x}`,t),withT(x,t)];}
 else if(f==='تحليل نتائج')a=[withT(`تحليل نتائج ${x}`,t),withT(`تحليل مستوى الأداء في ${x}`,t)];
 else if(f==='خطة')a=[withT(`${sub||'خطة'} ${p}`,t),withT(`${sub||'خطة'}: ${x}`,t)];
 else if(f==='اجتماع / متابعة إدارية')a=[`${sub||'اجتماع'} بشأن ${x}`,`مراجعة ${x}`];
 else if(f==='تطوير مهني')a=[`${sub||'تطوير مهني'} في ${x}`,`تطوير الممارسة المهنية في ${x}`];
 else a=[`${sub||f||'وثيقة'} ${x}`];
 return [...new Set(a.map(clean).filter(Boolean))].slice(0,3);
}
export function goalCandidates106(state){const c=C(state),f=c.document.family.value,x=focus(c),t=target(c),p=phrase(x);let a=[];
 if(f==='برنامج / فعالية')a=[withT(p,t),withT('رفع مستوى المشاركة والتفاعل في العمل',t),`ربط ${x} بتطبيق أو منتج يمكن توثيقه`];
 else if(f==='تحليل نتائج')a=[withT(`تحديد مستوى الأداء في ${x}`,t),`تحديد جوانب القوة والاحتياج في ${x}`,`بناء إجراء تحسيني استنادًا إلى نتائج ${x}`];
 else if(f==='خطة')a=[withT(p,t),'تنفيذ إجراءات واضحة قابلة للمتابعة','متابعة التنفيذ وقياس التقدم'];
 else if(f==='تطوير مهني')a=[`تطوير الممارسة المهنية في ${x}`,'نقل التعلم المهني إلى التطبيق','متابعة أثر التطبيق في الممارسة'];
 else a=[`تحسين جودة الأداء المرتبط ب${x}`,'تنظيم الإجراءات ومتابعة تنفيذها'];
 return [...new Set(a.map(clean).filter(Boolean))].slice(0,6);
}
function intro(c,f,x){const sub=c.document.subtype.value||'';if(f==='برنامج / فعالية')return`نُفذ ${sub||'العمل'} في مجال ${x}.`;if(f==='تحليل نتائج')return`أُجري تحليل للنتائج المرتبطة ب${x}.`;if(f==='خطة')return`أُعدت ${sub||'الخطة'} لمعالجة الاحتياج المرتبط ب${x}.`;if(f==='اجتماع / متابعة إدارية')return`عُقد ${sub||'اجتماع'} لمناقشة ${x}.`;if(f==='إجراء متابعة')return`نُفذت متابعة للإجراء المرتبط ب${x}.`;if(f==='تطوير مهني')return`نُفذ ${sub||'نشاط تطوير مهني'} في مجال ${x}.`;if(f==='شراكة مجتمعية')return`نُفذت شراكة مجتمعية لدعم ${x}.`;if(f==='صيانة وتجهيزات')return`تمت متابعة احتياج الصيانة أو التجهيز المرتبط ب${x}.`;return`تم توثيق ${sub||f||'العمل'} المرتبط ب${x}.`}
function reasonSentence(v){v=clean(v);if(!v)return'';if(/^معالجة /.test(v))return`وجاء التنفيذ لمعالجة ${v.replace(/^معالجة /,'')}.`;if(/^تنمية /.test(v))return`وجاء التنفيذ بهدف ${v}.`;if(/^دعم /.test(v))return`وجاء التنفيذ لدعم ${v.replace(/^دعم /,'')}.`;if(/^تعزيز /.test(v))return`وجاء التنفيذ بهدف ${v}.`;if(/^رفع /.test(v))return`وجاء التنفيذ بهدف ${v}.`;if(/^إثراء /.test(v))return`وجاء التنفيذ بهدف ${v}.`;if(/^تفعيل /.test(v))return`وجاء التنفيذ لتفعيل ${v.replace(/^تفعيل /,'')}.`;return`وجاء العمل استجابةً ل${v}.`}
export function narrative106(state){const c=C(state),f=c.document.family.value,x=focus(c),d=c.details,parts=[intro(c,f,x)];
 const rs=reasonSentence(d.reason.value);if(rs)parts.push(rs);if(d.basis.value)parts.push(`واستند العمل إلى ${d.basis.value}.`);if(d.goal.value)parts.push(`واستهدف ${d.goal.value}.`);if(d.method.value)parts.push(`وتضمن التنفيذ ${d.method.value}.`);if(d.finding.value)parts.push(`وأظهرت البيانات ${d.finding.value}.`);if(d.cause.value)parts.push(`ويُفسَّر ذلك - وفق ما تم اختياره - ب${d.cause.value}.`);if(d.action.value)parts.push(`واتُّخذ إجراء شمل ${d.action.value}.`);if(d.observation.value)parts.push(`ولوحظ أثناء التنفيذ ${d.observation.value}.`);if(d.follow.value)parts.push(`وستتم المتابعة من خلال ${d.follow.value}.`);if(d.application.value)parts.push(`ويتمثل التطبيق في ${d.application.value}.`);if(d.measurement.value){parts.push(d.measurement.value.includes('لم يتم القياس بعد')?'ولم يتم قياس الأثر بعد.':`وتم التحقق من النتيجة من خلال ${d.measurement.value}.`)}return clean(parts.join(' ')).replace(/ب\s+/g,'ب').replace(/ل\s+/g,'ل');
}
