import {esc} from './engine.js';
import {goalGroups65} from './goals65.js?v=74';
import {guideLinks74,strongGuideLinks74} from './guide-link74.js?v=74';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const uniq=a=>[...new Set((a||[]).map(clean).filter(Boolean))];
function indicatorGoals(i){const c=i.code;const M={
'2-1-1-4':['توظيف التقنية الرقمية في دعم تعلم الطلاب وتلبية احتياجاتهم','تنويع خبرات التعلم من خلال أدوات رقمية مناسبة'],
'2-1-1-6':['تنمية المهارات القرائية والعددية الأساسية لدى الطلاب المستهدفين','رفع مستوى الإتقان في المهارات الأساسية المستهدفة'],
'2-1-1-3':['تنويع استراتيجيات التعليم والتعلم بما يلبي احتياجات الطلاب','رفع مستوى التفاعل والمشاركة من خلال ممارسات تعليمية متنوعة'],
'2-1-1-5':['ربط التعلم بالتطبيق العملي بما يعزز فهم الطلاب','تنمية قدرة الطلاب على توظيف ما تعلموه في مواقف تطبيقية'],
'2-1-1-7':['تنمية مهارات التفكير والبحث والابتكار لدى الطلاب','توفير فرص تعلم تدعم المبادرة وحل المشكلات'],
'2-1-1-8':['تنمية المهارات العاطفية والاجتماعية لدى الطلاب','تعزيز التفاعل الإيجابي والتواصل الاجتماعي بين الطلاب'],
'2-1-1-9':['رفع دافعية الطلاب للتعلم والاستمتاع به','تعزيز المشاركة الإيجابية في خبرات التعلم'],
'1-2-1-1':['تعزيز القيم الإسلامية والهوية الوطنية لدى المستفيدين','تحويل القيم المستهدفة إلى ممارسات سلوكية إيجابية'],
'1-2-1-3':['دعم الانضباط المدرسي وتعزيز الالتزام بالإجراءات المنظمة','رفع وعي المستفيدين بمسؤولياتهم تجاه الانضباط والمواظبة'],
'1-2-1-4':['تعزيز السلوك الإيجابي لدى الطلاب من خلال ممارسات تربوية مناسبة','تنمية المسؤولية الذاتية والسلوك الإيجابي لدى المستفيدين'],
'1-2-1-5':['تطوير مواهب الطلاب وإثراء خبراتهم بما يهيئهم للمستقبل','توفير فرص إثرائية تستجيب لقدرات الطلاب واهتماماتهم'],
'1-3-1-2':['تعزيز مشاركة الأسرة في دعم تعلم الأبناء','رفع فاعلية التواصل بين المدرسة والأسرة حول تعلم الطلاب'],
'1-3-1-3':['تعزيز الشراكة المجتمعية بما يدعم التعلم والأثر الإيجابي','تفعيل مساهمة الجهات المجتمعية في دعم أهداف العمل'],
'1-4-1-5':['ربط التطوير المهني بالاحتياجات الفعلية ونتائج التقويم','تطوير الممارسات المهنية بما ينعكس على جودة الأداء'],
'1-4-1-6':['دعم تطبيق التقويم الذاتي بصورة منظمة ومستمرة','تعزيز استخدام نتائج التقويم الذاتي في تحديد أولويات التحسين'],
'1-4-1-7':['تحويل نتائج التقويم إلى إجراءات تحسين قابلة للتنفيذ والمتابعة','رفع جودة متابعة تنفيذ إجراءات خطة التحسين'],
'2-2-1-3':['توظيف نتائج التقويم في تحسين عمليات التعليم والتعلم','تحديد جوانب القوة والاحتياج وبناء إجراءات تعليمية مناسبة'],
'2-2-1-4':['تعزيز التغذية الراجعة المستمرة للطلاب وأولياء أمورهم','متابعة تقدم الطلاب بصورة منتظمة والاستجابة لاحتياجاتهم'],
'3-2-1-4':['تعزيز مشاركة الطلاب في الأعمال المجتمعية والتطوعية','تنمية المسؤولية الاجتماعية والمبادرة لدى الطلاب'],
'3-2-1-6':['تعزيز استقلالية الطلاب وقدرتهم على التعلم الذاتي','تنمية مهارات إدارة التعلم وتحمل المسؤولية'],
'4-2-1-1':['رفع الوعي بمتطلبات الأمن والسلامة في البيئة المدرسية','تعزيز الالتزام بالممارسات الوقائية وإجراءات السلامة']};return M[c]||[]}
export function goalGroups74(s){const base=goalGroups65(s),strong=strongGuideLinks74(s),smart=uniq(strong.flatMap(indicatorGoals));const all=uniq([...smart,...base.primary,...base.additional]);return{primary:all.slice(0,4),additional:all.slice(4,8)}}
function linkSummary(s){const all=guideLinks74(s),strong=all.filter(x=>x.strength==='قوي'),p=strong[0]||all[0];if(!p)return'<div class="helperBox" style="margin-bottom:16px"><b>الارتباط بالدليل</b><p class="questionHelp">لم يجد المحرك ارتباطًا موثوقًا بما يكفي لإقحام مؤشر في هذا العمل، ولن يضيف مؤشرًا لمجرد تشابه كلمات.</p></div>';const note=p.strength==='قوي'?`ارتباط قوي بالمؤشر (${p.code})`:`ارتباط محتمل بالمؤشر (${p.code}) يحتاج إلى شاهد إضافي`;return `<div class="helperBox" style="margin-bottom:16px"><b>الارتباط الذي فهمه المحرك</b><p><strong>${esc(p.domainName)}</strong> — ${esc(note)}</p><p class="questionHelp">${esc(p.reason)}</p>${strong.length>1?`<p class="questionHelp">كما وجد ارتباطًا قويًا إضافيًا بالمؤشر (${esc(strong[1].code)}).</p>`:''}</div>`}
export function goalsPage74(s){const {primary,additional}=goalGroups74(s),selected=s.answers?.goals||[],other=Boolean(s.metadata?.otherGoalEnabled);const button=x=>`<button type="button" class="chip ${selected.includes(x)?'on':''}" data-goal="${esc(x)}">${esc(x)}</button>`;return `<section class="card"><button class="linkBtn" data-action="back-family-details">→ رجوع</button><div class="muted">الخطوة الثالثة</div><h1>الأهداف</h1><p class="lead">الأهداف مبنية أولًا على موضوع العمل والفئة، ولا يؤثر المؤشر فيها إلا إذا كان ارتباطه قويًا وواضحًا.</p>${linkSummary(s)}<div class="chips choiceGrid">${primary.map(button).join('')}</div>${additional.length?`<details style="margin-top:14px"><summary class="btn" style="cursor:pointer">عرض أهداف إضافية</summary><div class="chips choiceGrid" style="margin-top:12px">${additional.map(button).join('')}</div></details>`:''}<div class="chips choiceGrid" style="margin-top:12px"><button type="button" class="chip ${other?'on':''}" data-action="toggle-other-goal">أخرى</button></div>${other?`<label class="fullField"><span>اكتب الهدف</span><input id="otherGoal" value="${esc(s.metadata.otherGoal||'')}"></label>`:''}<div class="row"><button class="btn primary" data-action="go-description">التالي: العنوان</button></div></section>`}
